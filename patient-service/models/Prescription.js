const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
    index: true
  },
  doctorId: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  medicines: [{
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100
    },
    dosage: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50
    },
    frequency: {
      type: String,
      required: true,
      enum: ['Once daily', 'Twice daily', 'Thrice daily', 'Four times daily', 'Every 6 hours', 'Every 8 hours', 'Every 12 hours', 'As needed'],
      default: 'Twice daily'
    },
    duration: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50
    },
    instructions: {
      type: String,
      required: false,
      trim: true,
      maxlength: 500
    }
  }],
  notes: {
    type: String,
    required: false,
    trim: true,
    maxlength: 1000
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    required: false
  },
  status: {
    type: String,
    required: true,
    enum: ['Active', 'Expired', 'Completed', 'Cancelled'],
    default: 'Active'
  },
  issuedBy: {
    type: String,
    required: false,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Prescription', prescriptionSchema);