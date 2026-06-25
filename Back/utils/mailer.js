const nodemailer = require("nodemailer");

/**
 * Create a reusable transporter from env.
 * Recommended env:
 *  - EMAIL_SERVICE=gmail
 *  - EMAIL_USER=your_email@gmail.com
 *  - EMAIL_PASS=your_app_password
 * OR
 *  - EMAIL_HOST, EMAIL_PORT, EMAIL_SECURE, EMAIL_USER, EMAIL_PASS
 */
let cachedTransporter = null;

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  const {
    EMAIL_SERVICE,
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_SECURE,
    EMAIL_USER,
    EMAIL_PASS,
  } = process.env;

  if (!EMAIL_USER || !EMAIL_PASS) {
    throw new Error(
      "Email credentials missing. Please set EMAIL_USER and EMAIL_PASS in Back/.env"
    );
  }

  let service = EMAIL_SERVICE;
  if (!service) {
    // Auto-detect service based on email domain
    const domain = EMAIL_USER.split('@')[1].toLowerCase();
    if (domain.includes('gmail.com')) {
      service = 'gmail';
    } else if (domain.includes('outlook.com') || domain.includes('hotmail.com') || domain.includes('live.com')) {
      service = 'outlook';
    } else if (domain.includes('yahoo.com')) {
      service = 'yahoo';
    } else {
      // Default to gmail if unknown
      service = 'gmail';
    }
  }

  if (EMAIL_HOST) {
    cachedTransporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: Number(EMAIL_PORT || 587),
      secure: String(EMAIL_SECURE || "false") === "true",
      auth: { user: EMAIL_USER, pass: EMAIL_PASS },
    });
  } else {
    cachedTransporter = nodemailer.createTransport({
      service: service,
      auth: { user: EMAIL_USER, pass: EMAIL_PASS },
    });
  }

  return cachedTransporter;
}

async function sendEmail({ to, bcc, subject, html, text }) {
  try {
    const transporter = getTransporter();
    const fromName = process.env.EMAIL_FROM_NAME || "MU CSE Society";
    const fromEmail = process.env.EMAIL_FROM_EMAIL || process.env.EMAIL_USER;

    const mailOptions = {
      from: `${fromName} <${fromEmail}>`,
      to,
      bcc,
      subject,
      html,
      text,
    };

    console.log('Attempting to send email to:', to);
    console.log('Using service:', process.env.EMAIL_SERVICE || 'auto-detected');
    console.log('From email:', fromEmail);

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Email sending failed:', error.message);
    console.error('Error details:', error);
    throw error;
  }
}

module.exports = { sendEmail };
