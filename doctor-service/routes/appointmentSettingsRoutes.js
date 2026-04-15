import { Router } from 'express';
import {
  getAppointmentSettings,
  updateAppointmentSettings,
  resetAppointmentSettings,
} from '../controllers/appointmentSettingsController.js';

const router = Router();

// Appointment Settings Routes
// Base path: /api/availability/settings

// Get settings for a doctor
router.get('/:doctorId', getAppointmentSettings);

// Create or update settings
router.put('/', updateAppointmentSettings);

// Reset settings to defaults
router.delete('/:doctorId', resetAppointmentSettings);

export default router;
