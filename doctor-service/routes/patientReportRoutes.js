import { Router } from 'express';
import { getPatientReports } from '../controllers/patientReportController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticateUser, authorizePermissions } from '../middleware/authMiddleware.js';

const router = Router();

/**
 * Patient Report Routes (doctor-service)
 * Mounted at /api/doctors in app.js
 *
 * Doctors can view reports uploaded by their patients.
 * Proxies the request to patient-service internally.
 */

// GET /api/doctors/patient/:patientId/reports
router.get(
  '/patient/:patientId/reports',
  authenticateUser,
  authorizePermissions('doctor', 'admin'),
  asyncHandler(getPatientReports)
);

export default router;
