const express = require("express");
const mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const userSchema = require("../Scheema/UserScheema");
const User = new mongoose.model("User", userSchema);

const { sendEmail } = require("../utils/mailer");
const { verifyEmailTemplate, passwordChangeOTPTemplate } = require("../utils/emailTemplates");

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

/**
 * Request password change OTP:
 * POST /Auth/request-password-change-otp
 * Body: { email, password }
 */
router.post("/request-password-change-otp", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.passwordChangeOTP = otp;
    user.passwordChangeOTPExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    user.passwordChangeOTPVerified = false;

    await user.save();

    try {
      await sendEmail({
        to: user.email,
        subject: "Password Change Verification - MU CSE Society",
        html: passwordChangeOTPTemplate({ name: user.name || "Member", otp }),
        text: `Your password change OTP is: ${otp}. This OTP will expire in 10 minutes.`,
      });

      return res.status(200).json({
        message: "OTP sent to your email",
        otpSent: true,
      });
    } catch (error) {
      console.error("OTP email send failed:", error.message || error);
      return res.status(500).json({ message: "Failed to send OTP email. Please try again later." });
    }
  } catch (error) {
    console.error("request-password-change-otp error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * Verify password change OTP:
 * POST /Auth/verify-password-change-otp
 * Body: { email, otp }
 */
router.post("/verify-password-change-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({
      email,
      passwordChangeOTP: otp,
      passwordChangeOTPExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
        code: "INVALID_OR_EXPIRED_OTP",
      });
    }

    user.passwordChangeOTPVerified = true;
    await user.save();

    return res.status(200).json({
      message: "OTP verified successfully. You can now change your password.",
      otpVerified: true,
    });
  } catch (error) {
    console.error("verify-password-change-otp error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * Change password after OTP verification:
 * POST /Auth/change-password
 * Body: { email, newPassword, confirmPassword }
 */
router.post("/change-password", async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if OTP was verified
    if (!user.passwordChangeOTPVerified) {
      return res.status(400).json({ message: "Please verify OTP first" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.passwordChangeOTP = undefined;
    user.passwordChangeOTPExpires = undefined;
    user.passwordChangeOTPVerified = false;

    await user.save();

    return res.status(200).json({
      message: "Password changed successfully",
      passwordChanged: true,
    });
  } catch (error) {
    console.error("change-password error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
