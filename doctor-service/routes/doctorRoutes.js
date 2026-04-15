import { Router } from 'express';
import {
  registerDoctor,
  getAllDoctors,
  getDoctorsBySpecialty,
  getDoctorById,
  getDoctorByUserId,
  updateDoctorProfile,
  deleteDoctorProfile,
  requestDoctorDeletion,
  rejectDoctorDeletion,
} from '../controllers/doctorController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticateUser, authorizePermissions } from '../middleware/authMiddleware.js';

const router = Router();

// ── Public routes ──────────────────────────────────────────────────────────
router.get('/', asyncHandler(getAllDoctors));

// NOTE: named routes MUST come before /:id wildcard
router.get('/specialty/:specialty', asyncHandler(getDoctorsBySpecialty));
router.get('/user/:userId', asyncHandler(getDoctorByUserId));

// ── Protected: doctors / admins ────────────────────────────────────────────
router.post(
  '/register',
  authenticateUser,
  authorizePermissions('doctor', 'admin'),
  asyncHandler(registerDoctor)
);

router.put(
  '/:id',
  authenticateUser,
  authorizePermissions('doctor', 'admin'),
  asyncHandler(updateDoctorProfile)
);

// ── Admin-only: permanent delete ───────────────────────────────────────────
router.delete(
  '/:id',
  authenticateUser,
  authorizePermissions('admin'),
  asyncHandler(deleteDoctorProfile)
);

// ── Doctor: request soft deletion (admin review required) ──────────────────
router.patch(
  '/:id/request-deletion',
  authenticateUser,
  authorizePermissions('doctor', 'admin'),
  asyncHandler(requestDoctorDeletion)
);

// ── Admin: reject (restore) a deletion request ─────────────────────────────
router.patch(
  '/:id/reject-deletion',
  authenticateUser,
  authorizePermissions('admin'),
  asyncHandler(rejectDoctorDeletion)
);

// Single doctor lookup — public (must be LAST to avoid catching named routes)
router.get('/:id', asyncHandler(getDoctorById));

export default router;
