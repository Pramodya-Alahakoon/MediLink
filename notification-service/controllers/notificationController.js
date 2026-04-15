const mongoose = require("mongoose");
const Notification = require("../models/Notification");
const { sendEmailNotification } = require("../services/emailService");
const { sendSmsNotification } = require("../services/smsService");

function buildAppointmentBookedMessage(payload) {
  const doctorName = payload.doctorName || "Doctor";
  const patientName = payload.patientName || "Patient";
  const date = payload.appointmentDate || "N/A";
  const time = payload.appointmentTime || "N/A";

  return {
    subject: "Appointment Confirmed - MediLink",
    text: `Hi ${patientName}, your appointment with Dr. ${doctorName} has been booked for ${date} at ${time}.`,
    html: `<p>Hi ${patientName},</p><p>Your appointment with <strong>Dr. ${doctorName}</strong> has been booked for <strong>${date}</strong> at <strong>${time}</strong>.</p><p>Thank you for using MediLink.</p>`,
    sms: `MediLink: Appointment confirmed with Dr. ${doctorName} on ${date} at ${time}.`,
  };
}

function buildConsultationCompletedMessage(payload) {
  const doctorName = payload.doctorName || "Doctor";
  const patientName = payload.patientName || "Patient";

  return {
    subject: "Consultation Completed - MediLink",
    text: `Hi ${patientName}, your consultation with Dr. ${doctorName} has been marked as completed.`,
    html: `<p>Hi ${patientName},</p><p>Your consultation with <strong>Dr. ${doctorName}</strong> has been marked as completed.</p><p>Please check your medical records and prescriptions in your MediLink portal.</p>`,
    sms: `MediLink: Consultation with Dr. ${doctorName} is completed. Please check your portal for updates.`,
  };
}

async function persistNotification(logData) {
  if (mongoose.connection.readyState !== 1) {
    return null;
  }

  const notification = new Notification(logData);
  return notification.save();
}

async function dispatchNotification({
  eventType,
  recipientType,
  recipientName,
  recipientEmail,
  recipientPhone,
  metadata,
  template,
}) {
  const result = {
    eventType,
    email: { sent: false, error: null },
    sms: { sent: false, error: null },
  };

  if (recipientEmail) {
    try {
      await sendEmailNotification({
        to: recipientEmail,
        subject: template.subject,
        text: template.text,
        html: template.html,
      });
      result.email.sent = true;
    } catch (error) {
      result.email.error = error.message;
    }
  }

  if (recipientPhone) {
    try {
      await sendSmsNotification({
        to: recipientPhone,
        message: template.sms,
      });
      result.sms.sent = true;
    } catch (error) {
      result.sms.error = error.message;
    }
  }

  await persistNotification({
    recipientName,
    recipientEmail,
    recipientPhone,
    recipientType,
    eventType,
    channels: {
      email: result.email,
      sms: result.sms,
    },
    metadata,
  });

  return result;
}

exports.sendAppointmentBookedNotification = async (req, res) => {
  try {
    const {
      recipientType = "patient",
      recipientName,
      recipientEmail,
      recipientPhone,
      appointmentId,
      doctorName,
      patientName,
      appointmentDate,
      appointmentTime,
    } = req.body;

    if (!recipientEmail && !recipientPhone) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one recipient channel: email or phone.",
      });
    }

    const metadata = {
      appointmentId,
      doctorName,
      patientName,
      appointmentDate,
      appointmentTime,
    };

    const template = buildAppointmentBookedMessage({
      doctorName,
      patientName,
      appointmentDate,
      appointmentTime,
    });

    const dispatchResult = await dispatchNotification({
      eventType: "appointment_booked",
      recipientType,
      recipientName,
      recipientEmail,
      recipientPhone,
      metadata,
      template,
    });

    return res.status(200).json({
      success: true,
      message: "Appointment notification processed.",
      data: dispatchResult,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to send appointment notification.",
    });
  }
};

exports.sendConsultationCompletedNotification = async (req, res) => {
  try {
    const {
      recipientType = "patient",
      recipientName,
      recipientEmail,
      recipientPhone,
      consultationId,
      doctorName,
      patientName,
    } = req.body;

    if (!recipientEmail && !recipientPhone) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one recipient channel: email or phone.",
      });
    }

    const metadata = {
      consultationId,
      doctorName,
      patientName,
    };

    const template = buildConsultationCompletedMessage({
      doctorName,
      patientName,
    });

    const dispatchResult = await dispatchNotification({
      eventType: "consultation_completed",
      recipientType,
      recipientName,
      recipientEmail,
      recipientPhone,
      metadata,
      template,
    });

    return res.status(200).json({
      success: true,
      message: "Consultation completion notification processed.",
      data: dispatchResult,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to send consultation notification.",
    });
  }
};
