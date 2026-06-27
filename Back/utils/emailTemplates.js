function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function verifyEmailTemplate({ name = "Member", verifyUrl }) {
  const safeName = escapeHtml(name);
  const safeUrl = escapeHtml(verifyUrl);

  return `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2>Welcome to MU CSE Society, ${safeName}!</h2>
    <p>Thanks for signing up. Please verify your email to continue.</p>
    <p>
      <a href="${safeUrl}" style="display:inline-block;padding:10px 14px;background:#111827;color:#fff;text-decoration:none;border-radius:6px;">
        Verify Email
      </a>
    </p>
    <p>If the button doesn't work, copy and paste this link into your browser:</p>
    <p style="word-break: break-all;">${safeUrl}</p>
    <p style="margin-top:24px;">— MU CSE Society Team</p>
  </div>
  `;
}

function noticeEmailTemplate({ title, description }) {
  const safeTitle = escapeHtml(title);
  const safeDesc = escapeHtml(description).replace(/\n/g, "<br/>");

  return `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2>New Notice: ${safeTitle}</h2>
    <div style="margin-top:10px;">${safeDesc}</div>
    <p style="margin-top:24px;">— MU CSE Society</p>
  </div>
  `;
}

function passwordChangeOTPTemplate({ name = "Member", otp }) {
  const safeName = escapeHtml(name);
  const safeOTP = escapeHtml(String(otp));

  return `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; background: #f9fafb; padding: 20px; border-radius: 8px;">
    <h2>Password Change Request - MU CSE Society</h2>
    <p>Hello ${safeName},</p>
    <p>You have requested to change your password. Please use the following One-Time Password (OTP) to verify your email and proceed with the password change:</p>
    
    <div style="background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
      <p style="font-size: 14px; color: #666; margin: 0 0 10px 0;">Your One-Time Password:</p>
      <p style="font-size: 32px; font-weight: bold; color: #111827; letter-spacing: 4px; margin: 0;">
        ${safeOTP}
      </p>
    </div>
    
    <p style="color: #666; font-size: 14px;">
      <strong>Important:</strong> This OTP will expire in 10 minutes. Do not share this OTP with anyone.
    </p>
    
    <p style="color: #666; font-size: 14px;">
      If you did not request this, please ignore this email and your password will remain unchanged.
    </p>
    
    <p style="margin-top: 24px; color: #666;">— MU CSE Society Team</p>
  </div>
  `;
}

module.exports = { verifyEmailTemplate, noticeEmailTemplate, passwordChangeOTPTemplate };
