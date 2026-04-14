const path = require('path');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');

/**
 * Handle single file upload
 * @route POST /api/upload
 * @param {Object} req - Express request object with file
 * @param {Object} res - Express response object
 */
exports.uploadFile = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'medilink/patients',
      resource_type: 'auto'
    });

    // Delete local file after successful upload
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Error deleting local file:', err);
    });

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        fileUrl: result.secure_url,
        fileName: result.original_filename,
        originalName: req.file.originalname,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        cloudinaryPublicId: result.public_id
      }
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    
    // Delete file if there was an error
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error uploading file',
      error: error.message
    });
  }
};

/**
 * Handle multiple file upload
 * @route POST /api/upload-multiple
 * @param {Object} req - Express request object with files
 * @param {Object} res - Express response object
 */
exports.uploadMultipleFiles = async (req, res) => {
  try {
    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    // Upload all files to Cloudinary
    const uploadPromises = req.files.map(file => 
      cloudinary.uploader.upload(file.path, {
        folder: 'medilink/patients',
        resource_type: 'auto'
      })
    );

    const results = await Promise.all(uploadPromises);

    // Delete local files after successful upload
    req.files.forEach(file => {
      fs.unlink(file.path, (err) => {
        if (err) console.error('Error deleting local file:', err);
      });
    });

    // Map results to response format
    const uploadedFiles = results.map(result => ({
      fileUrl: result.secure_url,
      fileName: result.original_filename,
      fileSize: result.bytes,
      mimeType: result.resource_type,
      cloudinaryPublicId: result.public_id
    }));

    res.status(200).json({
      success: true,
      message: `${uploadedFiles.length} file(s) uploaded successfully`,
      data: uploadedFiles
    });
  } catch (error) {
    console.error('Error uploading files:', error);

    // Delete all files if there was an error
    if (req.files) {
      req.files.forEach(file => {
        fs.unlink(file.path, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error uploading files',
      error: error.message
    });
  }
};

/**
 * Delete uploaded file
 * @route DELETE /api/delete-file/:publicId
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteFile = async (req, res) => {
  try {
    const { publicId } = req.params;

    // Validate publicId to prevent directory traversal attacks
    if (publicId.includes('..') || publicId.includes('/') || publicId.includes('\\')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid publicId format'
      });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    res.status(200).json({
      success: true,
      message: 'File deleted successfully from Cloudinary'
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting file',
      error: error.message
    });
  }
};