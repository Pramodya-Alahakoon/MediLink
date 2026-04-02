const express = require('express');
const router = express.Router();
const medicalHistoryController = require('../controllers/medicalHistoryController');

/**
 * Medical History routes
 */

// Create new medical history record
router.post('/', medicalHistoryController.createMedicalHistory);

// Get all medical history records for a patient
router.get('/patient/:patientId', medicalHistoryController.getMedicalHistoryByPatientId);

// Get medical history record by ID
router.get('/:id', medicalHistoryController.getMedicalHistoryById);

// Update medical history record
router.put('/:id', medicalHistoryController.updateMedicalHistory);

// Delete medical history record
router.delete('/:id', medicalHistoryController.deleteMedicalHistory);

module.exports = router;