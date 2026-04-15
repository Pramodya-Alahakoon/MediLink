const axios = require("axios");

const NOTIFY_LK_API_URL =
  process.env.NOTIFY_LK_API_URL || "https://app.notify.lk/api/v1/send";
const NOTIFY_LK_USER_ID = process.env.NOTIFY_LK_USER_ID;
const NOTIFY_LK_API_KEY = process.env.NOTIFY_LK_API_KEY;
const NOTIFY_LK_SENDER_ID = process.env.NOTIFY_LK_SENDER_ID || "NotifyDEMO";

async function sendSmsNotification({ to, message }) {
  if (!NOTIFY_LK_USER_ID || !NOTIFY_LK_API_KEY || !NOTIFY_LK_SENDER_ID) {
    throw new Error(
      "Notify.lk is not configured. Set NOTIFY_LK_USER_ID, NOTIFY_LK_API_KEY, and NOTIFY_LK_SENDER_ID."
    );
  }

  const response = await axios.get(NOTIFY_LK_API_URL, {
    params: {
      user_id: NOTIFY_LK_USER_ID,
      api_key: NOTIFY_LK_API_KEY,
      sender_id: NOTIFY_LK_SENDER_ID,
      to,
      message,
    },
  });

  const payload = response.data || {};
  if (payload.status !== "success") {
    throw new Error(payload.message || "Notify.lk SMS send failed.");
  }

  return payload;
}

module.exports = {
  sendSmsNotification,
};
