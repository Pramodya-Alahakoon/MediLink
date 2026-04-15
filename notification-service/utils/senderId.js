/**
 * Notify.lk sender_id rules: max 11 characters, alphanumeric (no spaces/symbols).
 * Unapproved or invalid values fall back to NotifyDEMO for testing.
 */

const DEFAULT_SENDER_ID = "NotifyDEMO";
const MAX_LEN = 11;

/**
 * @param {string|undefined} raw
 * @returns {string}
 */
export function sanitizeNotifySenderId(raw) {
  if (!raw || typeof raw !== "string") {
    return process.env.NOTIFY_SENDER_FALLBACK || DEFAULT_SENDER_ID;
  }

  const trimmed = raw.trim();
  if (!trimmed) {
    return process.env.NOTIFY_SENDER_FALLBACK || DEFAULT_SENDER_ID;
  }

  // Alphanumeric only; strip anything else (underscores, etc.).
  const alphanumeric = trimmed.replace(/[^a-zA-Z0-9]/g, "");
  const candidate = alphanumeric.slice(0, MAX_LEN);

  if (candidate.length === 0) {
    return process.env.NOTIFY_SENDER_FALLBACK || DEFAULT_SENDER_ID;
  }

  return candidate;
}
