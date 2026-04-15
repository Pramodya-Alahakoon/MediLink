import { Router } from 'express';
import {
  createConsultationSession,
  getConsultationByAppointment,
  updateConsultationStatus,
} from '../controllers/consultationController.js';

const router = Router();

// ------------------------------------------------------------------
// Consultation Routes
// Mounted at /api/doctors/consultations
// ------------------------------------------------------------------

router.post('/create-session', createConsultationSession);
router.patch('/:appointmentId/status', updateConsultationStatus);
router.get('/:appointmentId', getConsultationByAppointment);

export default router;
