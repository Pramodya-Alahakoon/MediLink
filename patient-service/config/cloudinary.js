/**
 * config/cloudinary.js — Cloudinary configuration for Patient Service
 */

const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dnjq7l123',
  api_key: process.env.CLOUDINARY_API_KEY || '334213839224793',
  api_secret: process.env.CLOUDINARY_API_SECRET || '6Vs2LWGTMoQ3tA87qcR7JovBs9k',
});

module.exports = cloudinary;
