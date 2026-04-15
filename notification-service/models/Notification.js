const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipientName: {
      type: String,
      trim: true,
    },
    recipientEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    recipientPhone: {
      type: String,
      trim: true,
    },
    recipientType: {
      type: String,
      enum: ["patient", "doctor", "unknown"],
      default: "unknown",
    },
    eventType: {
      type: String,
      enum: ["appointment_booked", "consultation_completed"],
      required: true,
    },
    channels: {
      email: {
        sent: { type: Boolean, default: false },
        error: { type: String, default: null },
      },
      sms: {
        sent: { type: Boolean, default: false },
        error: { type: String, default: null },
      },
    },
    metadata: {
      appointmentId: String,
      consultationId: String,
      doctorName: String,
      patientName: String,
      appointmentDate: String,
      appointmentTime: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
