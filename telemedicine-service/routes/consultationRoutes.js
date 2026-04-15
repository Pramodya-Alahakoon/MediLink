import { Router } from 'express';
import {
  createConsultationSession,
  getConsultationsByDoctor,
  getConsultationsByPatient,
  getConsultationByAppointment,
  updateConsultationStatus,
  updateConsultationNotes,
} from '../controllers/consultationController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticateUser, authorizePermissions } from '../middleware/authMiddleware.js';

const router = Router();

/**
 * Consultation Routes — mounted at /api/consultations in app.js
 *
 * Auth uses the shared JWT_SECRET — any valid MediLink token works.
 * Frontend should open meetingLink in browser for video call (Jitsi Meet).
 */

// ── POST /api/consultations/create-session ────────────────────────
// Doctor starts a new Jitsi Meet session for an appointment
router.post(
  '/create-session',
  authenticateUser,
  authorizePermissions('doctor', 'admin'),
  asyncHandler(createConsultationSession)
);

// ── GET /api/consultations/doctor/:doctorId ───────────────────────
// Doctor fetches all their consultation sessions (paginated, filterable by status)
router.get(
  '/doctor/:doctorId',
  authenticateUser,
  authorizePermissions('doctor', 'admin'),
  asyncHandler(getConsultationsByDoctor)
);

// ── GET /api/consultations/patient/:patientId ─────────────────────
// Patient fetches all their consultation sessions
router.get(
  '/patient/:patientId',
  authenticateUser,
  asyncHandler(getConsultationsByPatient)
);

// ── PATCH /api/consultations/:appointmentId/status ────────────────
// Doctor updates session status (scheduled → active → completed/cancelled)
router.patch(
  '/:appointmentId/status',
  authenticateUser,
  authorizePermissions('doctor', 'admin'),
  asyncHandler(updateConsultationStatus)
);

// ── PATCH /api/consultations/:appointmentId/notes ─────────────────
// Doctor adds/updates clinical notes on a consultation
router.patch(
  '/:appointmentId/notes',
  authenticateUser,
  authorizePermissions('doctor', 'admin'),
  asyncHandler(updateConsultationNotes)
);

// ── GET /api/consultations/:appointmentId ─────────────────────────
// Fetch consultation by appointment ID (Doctor or Patient can view)
// MUST be last — otherwise it would swallow /doctor/:id and /patient/:id
router.get(
  '/:appointmentId',
  authenticateUser,
  asyncHandler(getConsultationByAppointment)
);

export default router;
