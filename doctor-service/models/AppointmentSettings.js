import mongoose from 'mongoose';

/**
 * AppointmentSettings Model — doctor-service
 *
 * Stores doctor's appointment configuration preferences
 * including duration, buffer time, and daily limits.
 */
const AppointmentSettingsSchema = new mongoose.Schema(
  {
    doctorId: {
      type: String,
      required: [true, 'Please provide doctorId'],
      unique: true,
      trim: true,
    },

    // Default appointment duration in minutes (15, 30, 45, 60)
    appointmentDuration: {
      type: Number,
      default: 30,
      min: [15, 'Minimum duration is 15 minutes'],
      max: [120, 'Maximum duration is 120 minutes'],
    },

    // Buffer time between appointments in minutes
    bufferTime: {
      type: Number,
      default: 15,
      min: [0, 'Buffer time cannot be negative'],
      max: [60, 'Maximum buffer time is 60 minutes'],
    },

    // Whether buffer time is enabled
    isBufferTimeEnabled: {
      type: Boolean,
      default: true,
    },

    // Maximum appointments per day
    maxAppointmentsPerDay: {
      type: Number,
      default: 12,
      min: [1, 'Minimum 1 appointment per day'],
      max: [50, 'Maximum 50 appointments per day'],
    },

    // Working hours (default start/end time)
    defaultStartTime: {
      type: String,
      default: '09:00 AM',
      trim: true,
    },

    defaultEndTime: {
      type: String,
      default: '05:00 PM',
      trim: true,
    },

    // Working days (0 = Sunday, 6 = Saturday)
    workingDays: {
      type: [Number],
      default: [1, 2, 3, 4, 5], // Monday to Friday
      validate: {
        validator: function (v) {
          return v.every((day) => day >= 0 && day <= 6);
        },
        message: 'Working days must be between 0 (Sunday) and 6 (Saturday)',
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('AppointmentSettings', AppointmentSettingsSchema);
