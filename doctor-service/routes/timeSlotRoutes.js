import { Router } from "express";
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
} from "../controllers/timeSlotController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
const router = Router();

// Time Slot Routes
// Base path: /api/availability

// Get week view with all slots
router.get("/week/:doctorId", asyncHandler(getWeekView));

// Get slots for a specific date
router.get("/slots/:doctorId/:date", asyncHandler(getTimeSlotsByDate));

// Create a custom time slot
router.post("/slots", asyncHandler(createTimeSlot));

// Update a time slot
router.put("/slots/:id", asyncHandler(updateTimeSlot));

// Delete a time slot
router.delete("/slots/:id", asyncHandler(deleteTimeSlot));

// Book a time slot
router.post("/slots/:id/book", asyncHandler(bookTimeSlot));

// Cancel booking
router.post("/slots/:id/cancel", asyncHandler(cancelBooking));

// Block a time slot
router.post("/slots/:id/block", asyncHandler(blockTimeSlot));

// Unblock a time slot
router.post("/slots/:id/unblock", asyncHandler(unblockTimeSlot));

export default router;
