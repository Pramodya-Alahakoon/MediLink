import axios from "axios";
import { sanitizeNotifySenderId } from "../utils/senderId.js";

const NOTIFY_API_URL = "https://app.notify.lk/api/v1/send";

const NOTIFY_USER_ID = process.env.NOTIFY_USER_ID;
const NOTIFY_API_KEY = process.env.NOTIFY_API_KEY;
const NOTIFY_SENDER_ID = process.env.NOTIFY_SENDER_ID;

/**
 * Notify.lk accepts GET or POST to /send with query parameters:
 * user_id, api_key, sender_id, to, message
 * @see https://developer.notify.lk/api-endpoints/
 */
export async function sendSmsNotification({ to, message }) {
  if (!NOTIFY_USER_ID || !NOTIFY_API_KEY) {
    throw new Error(
      "Notify.lk is not configured. Set NOTIFY_USER_ID and NOTIFY_API_KEY (and NOTIFY_SENDER_ID)."
    );
  }

  const senderId = sanitizeNotifySenderId(NOTIFY_SENDER_ID);

  try {
    const response = await axios.get(NOTIFY_API_URL, {
      params: {
        user_id: NOTIFY_USER_ID,
        api_key: NOTIFY_API_KEY,
        sender_id: senderId,
        to,
        message,
      },
      validateStatus: () => true,
    });

    const payload =
      typeof response.data === "object" && response.data !== null
        ? response.data
        : {};

    if (response.status >= 400) {
      const detail = response.data;
      console.error("Notify.lk HTTP error:", detail);
      throw new Error(
        typeof detail === "object" && detail.message
          ? String(detail.message)
          : `Notify.lk request failed with status ${response.status}.`
      );
    }

    if (payload.status !== "success") {
      console.error("Notify.lk API failure:", payload);
      throw new Error(payload.message || "Notify.lk SMS send failed.");
    }

    return payload;
  } catch (error) {
    if (error.response?.data !== undefined) {
      console.error("SMS send failed (response data):", error.response.data);
    } else {
      console.error("SMS send failed:", error.message);
    }

    if (error.response?.data) {
      const data = error.response.data;
      const msg =
        typeof data === "object" && data.message
          ? data.message
          : JSON.stringify(data);
      throw new Error(`Notify.lk SMS error: ${msg}`);
    }

    throw error instanceof Error
      ? error
      : new Error("Failed to send SMS notification.");
  }
}
