/**
 * Validation Utilities for Doctor Service
 *
 * Provides helper functions for common validation patterns
 */

import { BadRequestError } from "../errors/customErrors.js";

/**
 * Validate MongoDB ObjectId format
 */
export const isValidObjectId = (id) => {
  return id.match(/^[0-9a-fA-F]{24}$/);
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (10 digits)
 */
export const isValidPhone = (phone) => {
  return /^[0-9]{10}$/.test(phone);
};

/**
 * Validate time format (HH:MM AM/PM or HH:MM)
 */
export const isValidTime = (timeStr) => {
  const regex = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9](\s(AM|PM))?$/;
  return regex.test(timeStr);
};

/**
 * Validate date format (YYYY-MM-DD)
 */
export const isValidDate = (dateStr) => {
  const regex = /^(\d{4})-(\d{2})-(\d{2})$/;
  if (!regex.test(dateStr)) return false;

  const date = new Date(dateStr);
  return (
    date instanceof Date &&
    !isNaN(date) &&
    date.toISOString().split("T")[0] === dateStr
  );
};

/**
 * Helper: Check if value is within a range
 */
export const isInRange = (value, min, max) => {
  return value >= min && value <= max;
};

/**
 * Helper: Required field validator
 */
export const validateRequiredFields = (data, requiredFields) => {
  const missing = requiredFields.filter((field) => !data[field]);
  if (missing.length > 0) {
    throw new BadRequestError(`Required fields missing: ${missing.join(", ")}`);
  }
};

/**
 * Helper: Validate specialization against known specializations
 */
export const VALID_SPECIALIZATIONS = [
  "Cardiology",
  "Dermatology",
  "Orthopedics",
  "Neurology",
  "Psychiatry",
  "General Practice",
  "Pediatrics",
  "Gynecology",
  "Oncology",
  "ENT",
  "Ophthalmology",
  "Urology",
  "Gastroenterology",
  "Rheumatology",
  "Endocrinology",
];

export const isValidSpecialization = (spec) => {
  return VALID_SPECIALIZATIONS.includes(spec);
};

/**
 * Helper: Validate appointment duration (in minutes)
 */
export const isValidDuration = (duration) => {
  return isInRange(duration, 15, 120) && duration % 15 === 0;
};

/**
 * Helper: Validate working days array
 */
export const VALID_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const isValidWorkingDays = (days) => {
  if (!Array.isArray(days)) return false;
  return days.every((day) => VALID_DAYS.includes(day)) && days.length > 0;
};
