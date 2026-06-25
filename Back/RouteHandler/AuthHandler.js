const express = require("express");
const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = require("../Scheema/UserScheema");
const User = new mongoose.model("User", userSchema);

const { sendEmail } = require("../utils/mailer");
const { verifyEmailTemplate } = require("../utils/emailTemplates");

const router = express.Router();

function createEmailVerificationToken(user) {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashed = crypto.createHash("sha256").update(rawToken).digest("hex");

  user.emailVerificationToken = hashed;
  user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
  return rawToken;
}

/**
 * Verify email:
 * GET /Auth/verify-email?id=<mongoId>&token=<rawToken>
 */
router.get("/verify-email", async (req, res) => {
  try {
    const { id, token } = req.query;
    if (!id || !token) {
      return res.status(400).json({ message: "Missing id or token" });
    }

    const hashed = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      _id: id,
      emailVerificationToken: hashed,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired verification link",
        code: "INVALID_OR_EXPIRED",
      });
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    // After email verification, user should go to admin approval section
    if (!user.designation || user.designation === "unverified") {
      user.designation = "pending";
    }

    await user.save();

    return res.status(200).json({
      message: "Email verified successfully. Please wait for admin approval.",
    });
  } catch (error) {
    console.error("verify-email error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * Resend verification:
 * POST /Auth/resend-verification { email }
 */
router.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.emailVerified) {
      return res.status(200).json({ message: "Email already verified" });
    }

    const rawToken = createEmailVerificationToken(user);
    await user.save();

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const verifyUrl = `${clientUrl}/verify-email?token=${rawToken}&id=${user._id}`;

    try {
      await sendEmail({
        to: user.email,
        subject: "Verify your email - MU CSE Society",
        html: verifyEmailTemplate({ name: user.name || "Member", verifyUrl }),
        text: `Verify your email: ${verifyUrl}`,
      });
      return res.status(200).json({ message: "Verification email sent" });
    } catch (error) {
      console.error("Resend verification email failed:", error.message || error);
      return res.status(500).json({ message: "Failed to send verification email. Please try again later." });
    }
  } catch (error) {
    console.error("resend-verification error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
