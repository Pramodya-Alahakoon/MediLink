import { Router } from "express";
import {
  getBlockedDays,
  blockDateRange,
  updateBlockedDay,
  deleteBlockedDay,
  checkDateBlocked,
} from "../controllers/blockedDaysController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

// Blocked Days Routes
// Base path: /api/availability/blocked-days

// Get all blocked days for a doctor
router.get("/:doctorId", asyncHandler(getBlockedDays));

// Check if a specific date is blocked
router.get("/:doctorId/check", asyncHandler(checkDateBlocked));

// Block a date range
router.post("/", asyncHandler(blockDateRange));

// Update a blocked date range
router.put("/:id", asyncHandler(updateBlockedDay));

// Delete/unblock a date range
router.delete("/:id", asyncHandler(deleteBlockedDay));

export default router;
