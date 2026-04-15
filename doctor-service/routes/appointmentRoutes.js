import { Router } from 'express';
import {
  getDoctorAppointments,
  acceptAppointment,
  rejectAppointment,
  completeAppointment,
} from '../controllers/appointmentController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticateUser, authorizePermissions } from '../middleware/authMiddleware.js';

const router = Router();

/**
 * Appointment routes from doctor's perspective
 * Mounted at /api/doctors in app.js
 *
 * All routes require authentication — doctor or admin only.
 */

// GET  /api/doctors/:doctorId/appointments — view doctor's appointments
router.get(
  '/:doctorId/appointments',
  authenticateUser,
  authorizePermissions('doctor', 'admin'),
  asyncHandler(getDoctorAppointments)
);

// PUT  /api/doctors/appointments/:id/accept — confirm an appointment
router.put(
  '/appointments/:id/accept',
  authenticateUser,
  authorizePermissions('doctor', 'admin'),
  asyncHandler(acceptAppointment)
);

// PUT  /api/doctors/appointments/:id/reject — decline an appointment
router.put(
  '/appointments/:id/reject',
  authenticateUser,
  authorizePermissions('doctor', 'admin'),
  asyncHandler(rejectAppointment)
);

// PUT  /api/doctors/appointments/:id/complete — mark appointment as done
router.put(
  '/appointments/:id/complete',
  authenticateUser,
  authorizePermissions('doctor', 'admin'),
  asyncHandler(completeAppointment)
);

export default router;
