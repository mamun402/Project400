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

module.exports = { verifyEmailTemplate, noticeEmailTemplate };
