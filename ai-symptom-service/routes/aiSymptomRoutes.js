import express from "express";
import { analyzeSymptoms } from "../controllers/aiSymptomController.js";

const router = express.Router();

router.post("/", analyzeSymptoms);

export default router;
