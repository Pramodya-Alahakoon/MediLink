import mongoose from 'mongoose';

/**
 * BlockedDay Model — doctor-service
 *
 * Stores blocked date ranges for doctors (vacations, holidays, etc.)
 */
const BlockedDaySchema = new mongoose.Schema(
  {
    doctorId: {
      type: String,
      required: [true, 'Please provide doctorId'],
      trim: true,
      index: true,
    },

    // Start date of blocked period
    startDate: {
      type: Date,
      required: [true, 'Please provide start date'],
    },

    // End date of blocked period
    endDate: {
      type: Date,
      required: [true, 'Please provide end date'],
    },

    // Reason for blocking (optional)
    reason: {
      type: String,
      trim: true,
      maxlength: [200, 'Reason cannot exceed 200 characters'],
    },

    // Type of block
    type: {
      type: String,
      enum: {
        values: ['vacation', 'holiday', 'sick', 'personal', 'other'],
        message: 'Type must be vacation, holiday, sick, personal, or other',
      },
      default: 'other',
    },

    // Whether this block is active
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent overlapping blocks for same doctor
BlockedDaySchema.index({ doctorId: 1, startDate: 1, endDate: 1 });

// Validation: endDate must be >= startDate
BlockedDaySchema.pre('save', function (next) {
  if (this.endDate < this.startDate) {
    next(new Error('End date must be greater than or equal to start date'));
  }
  next();
});

export default mongoose.model('BlockedDay', BlockedDaySchema);
