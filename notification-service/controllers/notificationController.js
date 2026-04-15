import mongoose from "mongoose";
import Notification from "../models/Notification.js";
import { sendEmailNotification } from "../services/emailService.js";
import { sendSmsNotification } from "../services/smsService.js";

const ALLOWED_TYPES = ["APPOINTMENT_BOOKED", "CONSULTATION_COMPLETED"];

// Builds dynamic message content based on notification event type.
function buildNotificationMessage(type, name) {
  if (type === "APPOINTMENT_BOOKED") {
    return {
      subject: "Appointment Successfully Booked",
      text: `Hello ${name}, your appointment has been successfully booked in MediLink.`,
    };
  }

  return {
    subject: "Consultation Completed",
    text: `Hello ${name}, your consultation has been marked as completed in MediLink.`,
  };
}

// Persists notification record if MongoDB is connected.
async function saveNotificationLog(payload) {
  if (mongoose.connection.readyState !== 1) return null;
  const log = new Notification(payload);
  return log.save();
}

// Validates required payload fields for notify endpoint.
function validateBody({ email, phone, name, type }) {
  if (!email || !phone || !name || !type) {
    return "email, phone, name, and type are required.";
  }
  if (!ALLOWED_TYPES.includes(type)) {
    return "type must be APPOINTMENT_BOOKED or CONSULTATION_COMPLETED.";
  }
  return null;
}

// Handles POST /api/notifications/notify request.
export async function sendNotification(req, res) {
  try {
    const { email, phone, name, type } = req.body;
    const validationError = validateBody({ email, phone, name, type });

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const { subject, text } = buildNotificationMessage(type, name);

    let emailStatus = "FAILED";
    let smsStatus = "FAILED";
    let errorMessage = null;

    try {
      await sendEmailNotification({ to: email, subject, text });
      emailStatus = "SUCCESS";
    } catch (error) {
      errorMessage = error.message;
    }

    try {
      await sendSmsNotification({ to: phone, message: text });
      smsStatus = "SUCCESS";
    } catch (error) {
      errorMessage = errorMessage
        ? `${errorMessage} | ${error.message}`
        : error.message;
    }

    const finalStatus =
      emailStatus === "SUCCESS" && smsStatus === "SUCCESS"
        ? "SUCCESS"
        : emailStatus === "SUCCESS" || smsStatus === "SUCCESS"
        ? "PARTIAL_SUCCESS"
        : "FAILED";

    await saveNotificationLog({
      name,
      email,
      phone,
      type,
      message: text,
      status: finalStatus,
      error: errorMessage,
    });

    if (finalStatus === "FAILED") {
      return res.status(500).json({
        success: false,
        message: "Both email and SMS delivery failed.",
        data: { emailStatus, smsStatus, error: errorMessage },
      });
    }

    return res.status(200).json({
      success: true,
      message:
        finalStatus === "SUCCESS"
          ? "Notification sent via email and SMS."
          : "Notification partially sent. One channel failed.",
      data: { emailStatus, smsStatus, type },
    });
  } catch (error) {
    console.error("Notification controller error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process notification request.",
      error: error.message,
    });
  }
}
