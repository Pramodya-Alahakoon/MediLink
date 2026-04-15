import mongoose from 'mongoose';

/**
 * Consultation Model — doctor-service
 *
 * Stores video consultation session details.
 * Links an appointment to a Jitsi Meet room.
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
    platform: {
      type: String,
      enum: {
        values: ['JITSI', 'AGORA', 'ZOOM', 'OTHER'],
        message: 'Platform must be JITSI, AGORA, ZOOM, or OTHER',
      },
      default: 'JITSI',
    },
    status: {
      type: String,
      enum: {
        values: ['scheduled', 'active', 'completed', 'cancelled'],
        message: 'Status must be scheduled, active, completed, or cancelled',
      },
      default: 'scheduled',
    },
    startedAt: {
      type: Date,
      default: null,
    },
    endedAt: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast retrieval
ConsultationSchema.index({ appointmentId: 1 });
ConsultationSchema.index({ doctorId: 1, status: 1 });

export default mongoose.model('Consultation', ConsultationSchema);
