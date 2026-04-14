/**
 * routes/uploadRoutes.js — File upload routes for Doctor Service
 */

import express from 'express';
import upload from '../middleware/multerConfig.js';
import { uploadFile, uploadMultipleFiles, deleteFile } from '../controllers/uploadController.js';

const router = express.Router();

/**
 * File upload routes
 */

// Single file upload
router.post('/single', upload.single('file'), uploadFile);

// Multiple file upload
router.post('/multiple', upload.array('files', 5), uploadMultipleFiles);

// Delete uploaded file
router.delete('/delete/:publicId', deleteFile);

export default router;
