import mongoose from 'mongoose';

const specializations = [
  "Cardiology",
  "Dermatology",
  "Neurology",
  "Endocrinology",
  "Gastroenterology",
  "Pulmonology",
  "Nephrology",
  "Rheumatology",
  "Hematology",
  "Infectious Disease"
];
const appointmentSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' 
    },

    patientName: {
        type: String,
        required: true
    },

    contactPhone: {
      type: String,
      required: [true, "Please provide contact phone number"],
      match: [/^[0-9]{10}$/, "Please provide a valid 10-digit phone number"],
    },

    specialization: {
        type: String,
        enum: specializations
    },


    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Doctor'
    },
    appointmentDate: {
        type: Date,
        required: true  
    },
    symptoms: {
        type: String,
        required: true 
    },
    aiSuggestions: {
        type: String, 
        default: "No suggestions available"
    },
    preMedicationSteps: {
        type: [String],
        default: []
    },
    recommendedSpecialty: {
        type: String,
        enum: [...specializations, "General Medicine"],
        default: "General Medicine"
    },
    urgencyLevel: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium"
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'], 
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export default mongoose.model('Appointment', appointmentSchema);