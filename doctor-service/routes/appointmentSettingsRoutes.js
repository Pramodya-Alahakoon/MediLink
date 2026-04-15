import { Router } from "express";
import {
  getAppointmentSettings,
  updateAppointmentSettings,
  resetAppointmentSettings,
} from "../controllers/appointmentSettingsController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

// Appointment Settings Routes
// Base path: /api/availability/settings

// Get settings for a doctor
router.get("/:doctorId", asyncHandler(getAppointmentSettings));

// Create or update settings
router.put("/", asyncHandler(updateAppointmentSettings));

// Reset settings to defaults
router.delete("/:doctorId", asyncHandler(resetAppointmentSettings));

export default router;
