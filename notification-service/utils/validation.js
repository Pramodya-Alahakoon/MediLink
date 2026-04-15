/**
 * Input validation helpers for the notification API.
 * Sri Lanka mobile (international): 947XXXXXXXX — 11 digits total (94 + 9-digit national number).
 * @see Notify.lk docs (e.g. 9471XXXXXXX)
 */

// Pragmatic email check (aligned with common backend validation).
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 947 + 8 digits (mobile subscriber length per Notify.lk examples)
const LK_MOBILE_INTL_REGEX = /^947\d{8}$/;

/**
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  if (!email || typeof email !== "string") return false;
  const trimmed = email.trim();
  return EMAIL_REGEX.test(trimmed) && trimmed.length <= 254;
}

/**
 * Normalizes common SL inputs to 947XXXXXXXX (11 digits).
 * Accepts e.g. 0712345678, 712345678, 94712345678, +94 71 234 5678.
 * @param {string} phone
 * @returns {string|null} normalized digits or null if not parseable
 */
export function normalizeLkPhone(phone) {
  if (phone === undefined || phone === null) return null;
  const digits = String(phone).replace(/\D/g, "");

  // Already international 11-digit form
  if (digits.length === 11 && digits.startsWith("947")) {
    return LK_MOBILE_INTL_REGEX.test(digits) ? digits : null;
  }

  // Domestic 10-digit form starting with 0 (e.g. 0712345678)
  if (digits.length === 10 && digits.startsWith("0")) {
    const candidate = `94${digits.slice(1)}`;
    return LK_MOBILE_INTL_REGEX.test(candidate) ? candidate : null;
  }

  // 9-digit mobile without leading 0 (e.g. 712345678)
  if (digits.length === 9 && digits.startsWith("7")) {
    const candidate = `94${digits}`;
    return LK_MOBILE_INTL_REGEX.test(candidate) ? candidate : null;
  }

  return null;
}

/**
 * @param {string} phone
 * @returns {boolean}
 */
export function isValidLkPhone(phone) {
  return normalizeLkPhone(phone) !== null;
}
