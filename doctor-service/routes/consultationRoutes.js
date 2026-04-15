import { Router } from "express";
import {
  createConsultationSession,
  getConsultationByAppointment,
  updateConsultationStatus,
} from "../controllers/consultationController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

// ------------------------------------------------------------------
// Consultation Routes
// Mounted at /api/doctors/consultations
// ------------------------------------------------------------------

router.post("/create-session", asyncHandler(createConsultationSession));
router.patch("/:appointmentId/status", asyncHandler(updateConsultationStatus));
router.get("/:appointmentId", asyncHandler(getConsultationByAppointment));

export default router;
