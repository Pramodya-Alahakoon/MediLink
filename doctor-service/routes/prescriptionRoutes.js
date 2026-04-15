import { Router } from 'express';
import {
  createPrescription,
  getPrescriptionsByDoctor,
  getPrescriptionsByPatient,
  getPrescriptionById,
  updatePrescription,
  deletePrescription,
} from '../controllers/prescriptionController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticateUser, authorizePermissions } from '../middleware/authMiddleware.js';

const router = Router();

/**
 * Prescription Routes — mounted at /api/prescriptions
 *
 * IMPORTANT: Specific paths (/doctor/:id, /patient/:id) MUST come
 * before the generic /:id route to avoid Express matching them incorrectly.
 */

// ── Create ─────────────────────────────────────────────────────────────────
router.post(
  '/',
  authenticateUser,
  authorizePermissions('doctor', 'admin'),
  asyncHandler(createPrescription)
);

// ── Specific list routes (must be BEFORE /:id) ───────────────────────────
router.get(
  '/doctor/:doctorId',
  authenticateUser,
  authorizePermissions('doctor', 'admin'),
  asyncHandler(getPrescriptionsByDoctor)
);

router.get(
  '/patient/:patientId',
  authenticateUser,
  asyncHandler(getPrescriptionsByPatient)
);

// ── Single prescription by Mongo ID ──────────────────────────────────────
router.get(
  '/:id',
  authenticateUser,
  asyncHandler(getPrescriptionById)
);

// ── Update & Delete ───────────────────────────────────────────────────────
router.put(
  '/:id',
  authenticateUser,
  authorizePermissions('doctor', 'admin'),
  asyncHandler(updatePrescription)
);

router.delete(
  '/:id',
  authenticateUser,
  authorizePermissions('doctor', 'admin'),
  asyncHandler(deletePrescription)
);

export default router;
