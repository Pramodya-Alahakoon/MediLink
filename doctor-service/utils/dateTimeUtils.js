/**
 * Date/Time Utilities for Doctor Service
 *
 * Helper functions for date and time manipulation
 */

/**
 * Convert time string to minutes since midnight
 * Supports formats: "09:30 AM", "14:30", "09:30"
 */
export const timeToMinutes = (timeStr) => {
  if (!timeStr) return null;

  const parts = timeStr.split(" ");
  const timePart = parts[0];
  const period = parts[1]?.toUpperCase() || null;

  const [hours, minutes] = timePart.split(":").map(Number);

  if (isNaN(hours) || isNaN(minutes)) return null;

  let totalMinutes = hours * 60 + minutes;

  // Handle 12-hour format
  if (period === "PM" && hours !== 12) {
    totalMinutes += 12 * 60;
  } else if (period === "AM" && hours === 12) {
    totalMinutes -= 12 * 60;
  }

  return totalMinutes;
};

/**
 * Convert minutes since midnight to time string
 * Returns format: "HH:MM AM/PM"
 */
export const minutesToTime = (minutes) => {
  if (!minutes && minutes !== 0) return null;

  let hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? "PM" : "AM";

  if (hours > 12) hours -= 12;
  if (hours === 0) hours = 12;

  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")} ${period}`;
};

/**
 * Format date to YYYY-MM-DD
 */
export const formatDate = (date) => {
  if (typeof date === "string") {
    return date; // Already formatted
  }

  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  return date.toISOString().split("T")[0];
};

/**
 * Get day name from date
 */
export const getDayName = (date) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  if (typeof date === "string") {
    date = new Date(date + "T00:00:00");
  }

  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  return days[date.getDay()];
};

/**
 * Get week view data (current week starting from Monday)
 */
export const getWeekDates = (date = new Date()) => {
  if (typeof date === "string") {
    date = new Date(date + "T00:00:00");
  }

  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday

  const monday = new Date(d.setDate(diff));
  const weekDates = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(date.getDate() + i);
    weekDates.push({
      date: formatDate(date),
      day: getDayName(date),
      dayNum: i,
    });
  }

  return weekDates;
};

/**
 * Check if date is in the past
 */
export const isDateInPast = (date) => {
  const compareDate =
    typeof date === "string" ? new Date(date + "T00:00:00") : new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return compareDate < today;
};

/**
 * Check if date is within date range
 */
export const isDateInRange = (date, startDate, endDate) => {
  const checkDate =
    typeof date === "string" ? new Date(date + "T00:00:00") : new Date(date);
  const start =
    typeof startDate === "string"
      ? new Date(startDate + "T00:00:00")
      : new Date(startDate);
  const end =
    typeof endDate === "string"
      ? new Date(endDate + "T23:59:59")
      : new Date(endDate);

  return checkDate >= start && checkDate <= end;
};

/**
 * Add days to a date
 */
export const addDays = (date, days) => {
  if (typeof date === "string") {
    date = new Date(date + "T00:00:00");
  }

  const result = new Date(date);
  result.setDate(result.getDate() + days);

  return formatDate(result);
};

/**
 * Calculate duration between two times in minutes
 */
export const calculateDuration = (startTime, endTime) => {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);

  if (startMinutes === null || endMinutes === null) return null;

  let duration = endMinutes - startMinutes;
  if (duration < 0) {
    duration += 24 * 60; // Handle next day
  }

  return duration;
};

/**
 * Get current date in YYYY-MM-DD format
 */
export const getTodayDate = () => {
  return formatDate(new Date());
};

/**
 * Check if two dates are the same day
 */
export const isSameDay = (date1, date2) => {
  const d1 = formatDate(date1);
  const d2 = formatDate(date2);
  return d1 === d2;
};
