import { Router } from 'express';
import {
  createConsultationSession,
  getConsultationsByDoctor,
  getConsultationByAppointment,
  updateConsultationStatus,
  updateConsultationNotes,
  getConsultationsByPatient,
} from '../controllers/consultationController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticateUser, authorizePermissions } from '../middleware/authMiddleware.js';

const router = Router();

/**
 * Consultation Routes — mounted at /api/doctors/consultations in app.js
 */

// Create a new Jitsi session for an appointment (Doctor only)
router.post(
  '/create-session',
  authenticateUser,
  authorizePermissions('doctor', 'admin'),
  asyncHandler(createConsultationSession)
);

// Get all consultations for a specific doctor (paginated + filterable by status)
router.get(
  '/doctor/:doctorId',
  authenticateUser,
  authorizePermissions('doctor', 'admin'),
  asyncHandler(getConsultationsByDoctor)
);

// Get all consultations for a specific patient (patient, doctor, or admin)
router.get(
  '/by-patient/:patientId',
  authenticateUser,
  asyncHandler(getConsultationsByPatient)
);

// Update consultation status (scheduled → active → completed / cancelled)
router.patch(
  '/:appointmentId/status',
  authenticateUser,
  authorizePermissions('doctor', 'admin'),
  asyncHandler(updateConsultationStatus)
);

// Update clinical notes on a consultation
router.patch(
  '/:appointmentId/notes',
  authenticateUser,
  authorizePermissions('doctor', 'admin'),
  asyncHandler(updateConsultationNotes)
);

// Get consultation details by appointment ID (Doctor or Patient can view)
router.get(
  '/:appointmentId',
  authenticateUser,
  asyncHandler(getConsultationByAppointment)
);

export default router;

