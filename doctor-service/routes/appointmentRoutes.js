import { Router } from "express";
import {
  getDoctorAppointments,
  acceptAppointment,
  rejectAppointment,
} from "../controllers/appointmentController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

// ------------------------------------------------------------------
// Appointment Stub Routes
// These routes are mounted at /api/doctors in app.js
// ------------------------------------------------------------------

// GET /api/doctors/:doctorId/appointments
router.get("/:doctorId/appointments", asyncHandler(getDoctorAppointments));

// PUT /api/doctors/appointments/:id/accept
router.put("/appointments/:id/accept", asyncHandler(acceptAppointment));

// PUT /api/doctors/appointments/:id/reject
router.put("/appointments/:id/reject", asyncHandler(rejectAppointment));

export default router;
