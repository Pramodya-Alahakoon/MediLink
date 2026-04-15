import express from "express";
import { sendNotification } from "../controllers/notificationController.js";

const router = express.Router();

// Single notification endpoint for external microservice integration.
router.post("/notify", sendNotification);

export default router;
