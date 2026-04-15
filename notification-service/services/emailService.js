const sendGridMail = require("@sendgrid/mail");

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL;

if (SENDGRID_API_KEY) {
  sendGridMail.setApiKey(SENDGRID_API_KEY);
}

async function sendEmailNotification({ to, subject, text, html }) {
  if (!SENDGRID_API_KEY || !SENDGRID_FROM_EMAIL) {
    throw new Error(
      "SendGrid is not configured. Set SENDGRID_API_KEY and SENDGRID_FROM_EMAIL."
    );
  }

  await sendGridMail.send({
    to,
    from: SENDGRID_FROM_EMAIL,
    subject,
    text,
    html,
  });
}

module.exports = {
  sendEmailNotification,
};
