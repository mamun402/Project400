import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaCheck, FaTimes } from "react-icons/fa";

const ChangePassword = ({ userEmail, onClose }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // Step 1: Request OTP, Step 2: Verify OTP, Step 3: Change Password
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  // Step 1: Request OTP
  const [currentPassword, setCurrentPassword] = useState("");

  // Step 2: Verify OTP
  const [otp, setOtp] = useState("");

  // Step 3: Change Password
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Calculate password strength
  useEffect(() => {
    let strength = 0;
    if (newPassword.length >= 6) strength += 25;
    if (newPassword.length >= 8) strength += 25;
    if (/[A-Z]/.test(newPassword)) strength += 25;
    if (/[0-9!@#$%^&*]/.test(newPassword)) strength += 25;
    setPasswordStrength(strength);
  }, [newPassword]);

  const handleRequestOTP = async () => {
    if (!currentPassword) {
      setErrorMessage("Please enter your current password");
      setShowErrorDialog(true);
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5000/Auth/request-password-change-otp",
        {
          email: userEmail || localStorage.getItem("username"),
          password: currentPassword,
        }
      );

      setSuccessMessage("OTP sent to your email. Please check your inbox.");
      setShowSuccessDialog(true);
      setTimeout(() => {
        setShowSuccessDialog(false);
        setStep(2);
        setCurrentPassword("");
      }, 2000);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to send OTP";
      setErrorMessage(message);
      setShowErrorDialog(true);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setErrorMessage("Please enter a valid 6-digit OTP");
      setShowErrorDialog(true);
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5000/Auth/verify-password-change-otp",
        {
          email: userEmail || localStorage.getItem("username"),
          otp: otp,
        }
      );

      setSuccessMessage("OTP verified successfully!");
      setShowSuccessDialog(true);
      setTimeout(() => {
        setShowSuccessDialog(false);
        setStep(3);
        setOtp("");
      }, 2000);
    } catch (error) {
      const message = error.response?.data?.message || "Invalid or expired OTP";
      setErrorMessage(message);
      setShowErrorDialog(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      setErrorMessage("Please fill in all password fields");
      setShowErrorDialog(true);
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long");
      setShowErrorDialog(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      setShowErrorDialog(true);
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5000/Auth/change-password",
        {
          email: userEmail || localStorage.getItem("username"),
          newPassword: newPassword,
          confirmPassword: confirmPassword,
        }
      );

      setSuccessMessage("Password changed successfully!");
      setShowSuccessDialog(true);
      setTimeout(() => {
        setShowSuccessDialog(false);
        onClose();
        navigate("/profile");
      }, 2000);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to change password";
      setErrorMessage(message);
      setShowErrorDialog(true);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    await handleRequestOTP();
    setStep(2);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      {/* Success Dialog */}
      {showSuccessDialog && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-51">
          <FaCheck /> {successMessage}
        </div>
      )}

      {/* Error Dialog */}
      {showErrorDialog && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-51">
          <FaTimes /> {errorMessage}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8">
        <div className="flex items-center justify-center mb-6">
          <FaLock className="text-primary text-3xl" />
          <h2 className="text-2xl font-bold ml-3 text-gray-900">Change Password</h2>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white mb-2 transition-all ${
                  s <= step ? "bg-primary" : "bg-gray-300"
                }`}
              >
                {s}
              </div>
              <span className="text-xs text-center text-gray-600">
                {s === 1 ? "Current Password" : s === 2 ? "Verify OTP" : "New Password"}
              </span>
              {s < 3 && (
                <div
                  className={`absolute h-1 w-16 ml-20 transition-all ${
                    s < step ? "bg-primary" : "bg-gray-300"
                  }`}
                  style={{ width: "60px", marginLeft: "50px" }}
                ></div>
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Request OTP */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-gray-600 text-sm mb-4">
              Enter your current password to receive an OTP on your registered email.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                disabled={loading}
              />
            </div>
            <button
              onClick={handleRequestOTP}
              disabled={loading}
              className="w-full py-2 bg-primary text-white font-semibold rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>
        )}

        {/* Step 2: Verify OTP */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-gray-600 text-sm mb-4">
              Enter the 6-digit OTP sent to your email.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                One-Time Password (OTP)
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                maxLength="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-center text-2xl letter-spacing"
                disabled={loading}
              />
            </div>
            <button
              onClick={handleVerifyOTP}
              disabled={loading || otp.length !== 6}
              className="w-full py-2 bg-primary text-white font-semibold rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <button
              onClick={handleResendOTP}
              disabled={loading}
              className="w-full py-2 text-primary font-semibold hover:underline"
            >
              Resend OTP
            </button>
          </div>
        )}

        {/* Step 3: Change Password */}
        {step === 3 && (
          <div className="space-y-4">
            <p className="text-gray-600 text-sm mb-4">
              Enter your new password. Make it strong!
            </p>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-2.5 text-gray-600 hover:text-gray-900"
                >
                  {showNewPassword ? "Hide" : "Show"}
                </button>
              </div>

              {/* Password Strength */}
              {newPassword && (
                <div className="mt-2">
                  <div className="flex gap-1 h-1">
                    {[25, 50, 75, 100].map((threshold, idx) => (
                      <div
                        key={idx}
                        className={`flex-1 rounded-full ${
                          passwordStrength >= threshold ? "bg-primary" : "bg-gray-200"
                        }`}
                      ></div>
                    ))}
                  </div>
                  <span className="text-xs text-gray-600 mt-1 block">
                    {passwordStrength < 50
                      ? "Weak"
                      : passwordStrength < 75
                      ? "Fair"
                      : passwordStrength < 100
                      ? "Good"
                      : "Strong"}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-gray-600 hover:text-gray-900"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Match Indicator */}
            {confirmPassword && (
              <div
                className={`text-sm ${
                  newPassword === confirmPassword ? "text-green-600" : "text-red-600"
                }`}
              >
                {newPassword === confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
              </div>
            )}

            <button
              onClick={handleChangePassword}
              disabled={
                loading ||
                !newPassword ||
                !confirmPassword ||
                newPassword !== confirmPassword ||
                newPassword.length < 6
              }
              className="w-full py-2 bg-primary text-white font-semibold rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? "Changing Password..." : "Change Password"}
            </button>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full mt-6 py-2 text-gray-600 font-semibold hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;
