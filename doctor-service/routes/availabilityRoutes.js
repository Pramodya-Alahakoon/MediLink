import { Router } from "express";
import {
  createAvailability,
  getAvailabilityByDoctor,
  updateAvailability,
  deleteAvailability,
} from "../controllers/availabilityController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

// Availability Routes
// Base path: /api/availability

router.post("/", asyncHandler(createAvailability));
router.get("/:doctorId", asyncHandler(getAvailabilityByDoctor));
router.put("/:id", asyncHandler(updateAvailability));
router.delete("/:id", asyncHandler(deleteAvailability));

export default router;
