const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');

/**
 * Prescription routes
 */

// Create new prescription
router.post('/', prescriptionController.addPrescription);

// Get all prescriptions for a patient with pagination and filtering
router.get('/patient/:patientId', prescriptionController.getPrescriptionsByPatientId);

// Get active prescriptions for a patient
router.get('/patient/:patientId/active', prescriptionController.getActivePrescriptions);

// Get prescription by ID
router.get('/:id', prescriptionController.getPrescriptionById);

// Update prescription
router.put('/:id', prescriptionController.updatePrescription);

// Delete prescription
router.delete('/:id', prescriptionController.deletePrescription);

module.exports = router;