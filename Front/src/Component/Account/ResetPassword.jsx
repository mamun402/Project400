import axios from "axios";
import React, { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
  const { email, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const decodedEmail = useMemo(() => {
    try {
      return decodeURIComponent(email || "");
    } catch (error) {
      return "";
    }
  }, [email]);

  const decodedToken = useMemo(() => {
    try {
      return decodeURIComponent(token || "");
    } catch (error) {
      return "";
    }
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");

    if (!decodedEmail || !decodedToken) {
      setErrorMessage("Invalid reset link. Please request a new one.");
      return;
    }

    if (!password || password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/Singup/reset-password",
        {
          email: decodedEmail,
          token: decodedToken,
          password,
        }
      );
      setMessage(response.data?.message || "Password reset successful.");
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      const apiMessage = error?.response?.data?.error || error?.message;
      setErrorMessage(apiMessage || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-white">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-extrabold text-center text-primary">
          Reset Password
        </h2>
        <p className="text-center text-gray-700 mt-2">
          Create a new password for your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          <div>
            <label htmlFor="password" className="sr-only">
              New password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="new-password"
              className="block w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="New password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="sr-only">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
              className="block w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </div>

          {message && (
            <p className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              {message}
            </p>
          )}
          {errorMessage && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-transform transform hover:scale-105"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
