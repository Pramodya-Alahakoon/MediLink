import { Router } from "express";
import {
  registerDoctor,
  getAllDoctors,
  getDoctorsBySpecialty,
  getDoctorById,
  getDoctorByUserId,
  updateDoctorProfile,
  deleteDoctorProfile,
} from "../controllers/doctorController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

// If you want to enforce authentication for specific routes, uncomment these:
// import { authenticateUser, authorizePermissions } from '../middleware/authMiddleware.js';

const router = Router();

// Public / General routes
router.post("/register", asyncHandler(registerDoctor));
router.get("/", asyncHandler(getAllDoctors));
router.get("/specialty/:specialty", asyncHandler(getDoctorsBySpecialty)); // Get doctors by specialization (must be before /:id)
router.get("/user/:userId", asyncHandler(getDoctorByUserId)); // Must be before /:id
router.get("/:id", asyncHandler(getDoctorById));

// Update/Delete routes (Typically protected by authMiddleware in production)
// Example with auth: router.put('/:id', authenticateUser, authorizePermissions('doctor', 'admin'), updateDoctorProfile);
router.put("/:id", asyncHandler(updateDoctorProfile));
router.delete("/:id", asyncHandler(deleteDoctorProfile));

export default router;
