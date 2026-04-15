import sendGridMail from "@sendgrid/mail";

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM;

if (SENDGRID_API_KEY) {
  sendGridMail.setApiKey(SENDGRID_API_KEY);
}

// Sends a plain text email through SendGrid.
export async function sendEmailNotification({ to, subject, text }) {
  if (!SENDGRID_API_KEY || !EMAIL_FROM) {
    throw new Error(
      "SendGrid is not configured. Set SENDGRID_API_KEY and EMAIL_FROM."
    );
  }

  try {
    await sendGridMail.send({
      to,
      from: EMAIL_FROM,
      subject,
      text,
    });
  } catch (error) {
    console.error("Email send failed:", error.response?.body || error.message);
    throw new Error("Failed to send email notification.");
  }
}
