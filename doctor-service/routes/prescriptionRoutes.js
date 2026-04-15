import { Router } from "express";
import {
  createPrescription,
  getPrescriptionsByDoctor,
  getPrescriptionsByPatient,
  getPrescriptionById,
} from "../controllers/prescriptionController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

// Prescription Routes
// Base path: /api/prescriptions

router.post("/", asyncHandler(createPrescription));
router.get("/:id", asyncHandler(getPrescriptionById));

// Specific lookups
router.get("/doctor/:doctorId", asyncHandler(getPrescriptionsByDoctor));
router.get("/patient/:patientId", asyncHandler(getPrescriptionsByPatient));

export default router;
