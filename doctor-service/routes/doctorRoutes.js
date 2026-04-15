import { Router } from 'express';
import {
  registerDoctor,
  getAllDoctors,
  getDoctorsBySpecialty,
  getDoctorById,
  getDoctorByUserId,
  updateDoctorProfile,
  deleteDoctorProfile,
} from '../controllers/doctorController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticateUser, authorizePermissions } from '../middleware/authMiddleware.js';

const router = Router();

/**
 * Doctor Routes — mounted at /api/doctors
 *
 * Public:    GET /  |  GET /specialty/:s  |  GET /user/:userId  |  GET /:id
 * Protected: POST /register  |  PUT /:id  |  DELETE /:id
 */

// ── Public routes ──────────────────────────────────────────────────────────
router.get('/', asyncHandler(getAllDoctors));

// NOTE: /specialty/:specialty and /user/:userId MUST come before /:id
router.get('/specialty/:specialty', asyncHandler(getDoctorsBySpecialty));
router.get('/user/:userId', asyncHandler(getDoctorByUserId));

// ── Protected: only doctors / admins can register and modify profiles ─────
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

router.delete(
  '/:id',
  authenticateUser,
  authorizePermissions('admin'),
  asyncHandler(deleteDoctorProfile)
);

// Single doctor lookup — public (must be last to avoid catching named routes)
router.get('/:id', asyncHandler(getDoctorById));

export default router;
