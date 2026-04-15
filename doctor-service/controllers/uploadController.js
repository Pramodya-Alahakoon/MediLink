/**
 * controllers/uploadController.js — Cloudinary upload controller for Doctor Service
 */

import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import { BadRequestError } from "../errors/customErrors.js";

/**
 * Handle single file upload
 * @route POST /api/upload
 * @param {Object} req - Express request object with file
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
export const uploadFile = async (req, res, next) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      throw new BadRequestError("No file uploaded");
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "medilink/doctors",
      resource_type: "auto",
    });

    // Delete local file after successful upload
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Error deleting local file:", err);
    });

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: {
        fileUrl: result.secure_url,
        fileName: result.original_filename,
        originalName: req.file.originalname,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        cloudinaryPublicId: result.public_id,
      },
    });
  } catch (error) {
    // Delete file if there was an error
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    }
    next(error);
  }
};

/**
 * Handle multiple file upload
 * @route POST /api/upload-multiple
 * @param {Object} req - Express request object with files
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
export const uploadMultipleFiles = async (req, res, next) => {
  try {
    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      throw new BadRequestError("No files uploaded");
    }

    // Upload all files to Cloudinary
    const uploadPromises = req.files.map((file) =>
      cloudinary.uploader.upload(file.path, {
        folder: "medilink/doctors",
        resource_type: "auto",
      }),
    );

    const results = await Promise.all(uploadPromises);

    // Delete local files after successful upload
    req.files.forEach((file) => {
      fs.unlink(file.path, (err) => {
        if (err) console.error("Error deleting local file:", err);
      });
    });

    // Map results to response format
    const uploadedFiles = results.map((result) => ({
      fileUrl: result.secure_url,
      fileName: result.original_filename,
      fileSize: result.bytes,
      mimeType: result.resource_type,
      cloudinaryPublicId: result.public_id,
    }));

    res.status(200).json({
      success: true,
      message: `${uploadedFiles.length} file(s) uploaded successfully`,
      data: uploadedFiles,
    });
  } catch (error) {
    // Delete all files if there was an error
    if (req.files) {
      req.files.forEach((file) => {
        fs.unlink(file.path, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
      });
    }
    next(error);
  }
};

/**
 * Delete uploaded file
 * @route DELETE /api/upload/delete/:publicId
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
export const deleteFile = async (req, res, next) => {
  try {
    const { publicId } = req.params;

    // Validate publicId to prevent directory traversal attacks
    if (
      publicId.includes("..") ||
      publicId.includes("/") ||
      publicId.includes("\\")
    ) {
      throw new BadRequestError("Invalid publicId format");
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    res.status(200).json({
      success: true,
      message: "File deleted successfully from Cloudinary",
    });
  } catch (error) {
    next(error);
  }
};
