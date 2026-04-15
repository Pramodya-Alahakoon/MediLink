import mongoose from 'mongoose';

/**
 * TimeSlot Model — doctor-service
 *
 * Represents individual time slots for appointments.
 * A time slot can be: available, booked, or blocked.
 */
const TimeSlotSchema = new mongoose.Schema(
  {
    doctorId: {
      type: String,
      required: [true, 'Please provide doctorId'],
      trim: true,
      index: true,
    },

    // Date of the slot (YYYY-MM-DD format for easy querying)
    date: {
      type: String,
      required: [true, 'Please provide date'],
      trim: true,
      index: true,
    },

    // Day of week (Monday, Tuesday, etc.)
    day: {
      type: String,
      required: [true, 'Please provide day'],
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },

    // Start time (e.g., "09:00 AM")
    startTime: {
      type: String,
      required: [true, 'Please provide start time'],
      trim: true,
    },

    // End time (e.g., "09:30 AM")
    endTime: {
      type: String,
      required: [true, 'Please provide end time'],
      trim: true,
    },

    // Slot status
    status: {
      type: String,
      enum: {
        values: ['available', 'booked', 'blocked'],
        message: 'Status must be available, booked, or blocked',
      },
      default: 'available',
    },

    // If booked, store appointment reference
    appointmentId: {
      type: String,
      trim: true,
      default: null,
    },

    // If booked, store patient info (denormalized for quick access)
    patientId: {
      type: String,
      trim: true,
      default: null,
    },

    patientName: {
      type: String,
      trim: true,
      default: null,
    },

    // Appointment type/purpose
    appointmentType: {
      type: String,
      trim: true,
      default: null,
    },

    // Notes for this slot
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient querying
TimeSlotSchema.index({ doctorId: 1, date: 1, startTime: 1 });
TimeSlotSchema.index({ doctorId: 1, date: 1, status: 1 });

export default mongoose.model('TimeSlot', TimeSlotSchema);
