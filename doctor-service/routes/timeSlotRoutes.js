import { Router } from 'express';
import {
  getTimeSlotsByDate,
  getWeekView,
  createTimeSlot,
  updateTimeSlot,
  deleteTimeSlot,
  bookTimeSlot,
  cancelBooking,
  blockTimeSlot,
  unblockTimeSlot,
} from '../controllers/timeSlotController.js';

const router = Router();

// Time Slot Routes
// Base path: /api/availability

// Get week view with all slots
router.get('/week/:doctorId', getWeekView);

// Get slots for a specific date
router.get('/slots/:doctorId/:date', getTimeSlotsByDate);

// Create a custom time slot
router.post('/slots', createTimeSlot);

// Update a time slot
router.put('/slots/:id', updateTimeSlot);

// Delete a time slot
router.delete('/slots/:id', deleteTimeSlot);

// Book a time slot
router.post('/slots/:id/book', bookTimeSlot);

// Cancel booking
router.post('/slots/:id/cancel', cancelBooking);

// Block a time slot
router.post('/slots/:id/block', blockTimeSlot);

// Unblock a time slot
router.post('/slots/:id/unblock', unblockTimeSlot);

export default router;
