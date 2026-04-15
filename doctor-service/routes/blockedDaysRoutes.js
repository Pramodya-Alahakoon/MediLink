import { Router } from 'express';
import {
  getBlockedDays,
  blockDateRange,
  updateBlockedDay,
  deleteBlockedDay,
  checkDateBlocked,
} from '../controllers/blockedDaysController.js';

const router = Router();

// Blocked Days Routes
// Base path: /api/availability/blocked-days

// Get all blocked days for a doctor
router.get('/:doctorId', getBlockedDays);

// Check if a specific date is blocked
router.get('/:doctorId/check', checkDateBlocked);

// Block a date range
router.post('/', blockDateRange);

// Update a blocked date range
router.put('/:id', updateBlockedDay);

// Delete/unblock a date range
router.delete('/:id', deleteBlockedDay);

export default router;
