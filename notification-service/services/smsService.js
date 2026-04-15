import axios from "axios";

const NOTIFY_API_URL = "https://app.notify.lk/api/v1/send";
const NOTIFY_API_KEY = process.env.NOTIFY_API_KEY;
const NOTIFY_SENDER_ID = process.env.NOTIFY_SENDER_ID;

// Sends an SMS through Notify.lk REST API.
export async function sendSmsNotification({ to, message }) {
  if (!NOTIFY_API_KEY || !NOTIFY_SENDER_ID) {
    throw new Error(
      "Notify.lk is not configured. Set NOTIFY_API_KEY and NOTIFY_SENDER_ID."
    );
  }

  try {
    const response = await axios.get(NOTIFY_API_URL, {
      params: {
        user_id: NOTIFY_API_KEY,
        sender_id: NOTIFY_SENDER_ID,
        to,
        message,
      },
    });

    const payload = response.data || {};
    if (payload.status !== "success") {
      throw new Error(payload.message || "Notify.lk SMS send failed.");
    }

    return payload;
  } catch (error) {
    console.error("SMS send failed:", error.response?.data || error.message);
    throw new Error("Failed to send SMS notification.");
  }
}
