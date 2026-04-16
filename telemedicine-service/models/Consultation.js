import mongoose from 'mongoose';

/**
 * Consultation Model — telemedicine-service
 *
 * Stores Jitsi Meet video consultation session details.
 * Links an appointment to a Jitsi room URL.
 *
 * NOTE: Frontend should open meetingLink in browser for video call.
 */
const ConsultationSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: String,
      required: [true, 'Appointment ID is required'],
      unique: true,
      trim: true,
    },
    doctorId: {
      type: String,
      required: [true, 'Doctor ID is required'],
      trim: true,
      index: true,
    },
    patientId: {
      type: String,
      required: [true, 'Patient ID is required'],
      trim: true,
      index: true,
    },
    meetingLink: {
      type: String,
      required: [true, 'Meeting link is required'],
      trim: true,
    },
    /*
     * Platform — currently only Jitsi Meet (no API key required).
     * Extend this enum if you add Zoom/Agora later.
     */
    platform: {
      type: String,
      enum: { values: ['JITSI', 'AGORA', 'ZOOM', 'OTHER'] },
      default: 'JITSI',
    },
    status: {
      type: String,
      enum: { values: ['scheduled', 'active', 'completed', 'cancelled'] },
      default: 'scheduled',
    },
    startedAt: { type: Date, default: null },
    endedAt:   { type: Date, default: null },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
      default: null,
    },
  },
  { timestamps: true }
);

// Fast retrieval indexes
ConsultationSchema.index({ appointmentId: 1 });
ConsultationSchema.index({ doctorId: 1, status: 1 });
ConsultationSchema.index({ patientId: 1, status: 1 });

export default mongoose.model('Consultation', ConsultationSchema);
