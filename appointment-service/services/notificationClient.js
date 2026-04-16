import axios from "axios";

const NOTIFICATION_URL =
  process.env.NOTIFICATION_SERVICE_URL || "http://notification-service:5003";

/**
 * Fire-and-forget notification. Never throws — just logs on failure.
 * @param {{ email: string, phone: string, name: string, type: string }} payload
 */
export async function sendNotification(payload) {
  try {
    await axios.post(`${NOTIFICATION_URL}/notifications/notify`, payload, {
      timeout: 5000,
    });
    console.log(`✅ Notification sent [${payload.type}] to ${payload.email}`);
  } catch (err) {
    console.warn(`⚠️  Notification failed [${payload.type}]:`, err.message);
  }
}
