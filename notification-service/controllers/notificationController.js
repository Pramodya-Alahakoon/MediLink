import Notification from "../models/Notification.js";
import {
  processNotification,
  validateNotificationPayload,
} from "../services/notificationService.js";

// GET /notify/history?email=...&limit=20
export async function getNotificationHistory(req, res) {
  try {
    const { email, limit = 20 } = req.query;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "email query param is required." });
    }
    const records = await Notification.find({
      email: email.trim().toLowerCase(),
    })
      .sort({ timestamp: -1 })
      .limit(Math.min(Number(limit) || 20, 100))
      .lean();
    return res.status(200).json({ success: true, data: records });
  } catch (error) {
    console.error("History error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notification history.",
    });
  }
}

// Handles POST /api/notifications/notify request.
export async function sendNotification(req, res) {
  try {
    const { email, phone, name, type, patientName, appointmentDate } = req.body;

    const validationError = validateNotificationPayload({
      email,
      phone,
      name,
      type,
    });
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const result = await processNotification({
      email,
      phone,
      name,
      type,
      patientName,
      appointmentDate,
    });

    if (result.finalStatus === "FAILED") {
      return res.status(500).json({
        success: false,
        message: "Both email and SMS delivery failed.",
        data: {
          emailStatus: result.emailStatus,
          smsStatus: result.smsStatus,
          error: result.error,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message:
        result.finalStatus === "SUCCESS"
          ? "Notification sent via email and SMS."
          : "Notification partially sent. One channel failed.",
      data: {
        emailStatus: result.emailStatus,
        smsStatus: result.smsStatus,
        type: result.type,
      },
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
