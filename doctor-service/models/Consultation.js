import mongoose from 'mongoose';

/**
 * Consultation Model — doctor-service
 *
 * Stores video consultation session details.
 * This links an appointment to a Jitsi meet room.
 */
const ConsultationSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: String, // Reference to appointment ID from appointment-service
      required: [true, 'Appointment ID is required'],
      unique: true,
      trim: true,
    },
    doctorId: {
      type: String, // Reference to doctor ID
      required: [true, 'Doctor ID is required'],
      trim: true,
    },
    patientId: {
      type: String, // Reference to patient ID
      required: [true, 'Patient ID is required'],
      trim: true,
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
        values: ['scheduled', 'completed', 'active'],
        message: 'Status must be scheduled, completed, or active',
      },
      default: 'scheduled',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Add index for fast retrieval by appointmentId
ConsultationSchema.index({ appointmentId: 1 });

export default mongoose.model('Consultation', ConsultationSchema);
