/**
 * routes/uploadRoutes.js — File upload routes for Doctor Service
 */

import express from "express";
import upload from "../middleware/multerConfig.js";
import {
  uploadFile,
  uploadMultipleFiles,
  deleteFile,
} from "../controllers/uploadController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

/**
 * File upload routes
 */

// Single file upload
router.post("/single", upload.single("file"), asyncHandler(uploadFile));

// Multiple file upload
router.post(
  "/multiple",
  upload.array("files", 5),
  asyncHandler(uploadMultipleFiles),
);

// Delete uploaded file
router.delete("/delete/:publicId", asyncHandler(deleteFile));

export default router;
