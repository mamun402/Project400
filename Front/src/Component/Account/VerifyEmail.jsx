import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const VerifyEmail = () => {
  const query = useQuery();
  const token = query.get("token");
  const id = query.get("id");
  const emailFromQuery = query.get("email") || "";

  const [email, setEmail] = useState(emailFromQuery);
  const [status, setStatus] = useState("idle"); // idle | verifying | success | error | resent
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (token && id) {
      setStatus("verifying");
      axios
        .get(`http://localhost:5000/Auth/verify-email?token=${encodeURIComponent(token)}&id=${encodeURIComponent(id)}`)
        .then((res) => {
          setStatus("success");
          setMessage(
            res.data?.message ||
              "Your email is verified. Please wait for admin approval."
          );
        })
        .catch((err) => {
          setStatus("error");
          setMessage(
            err?.response?.data?.message ||
              "Verification failed. The link may be invalid or expired."
          );
        });
    }
  }, [token, id]);

  const handleResend = () => {
    if (!email) {
      setStatus("error");
      setMessage("Please enter your email to resend verification.");
      return;
    }
    setStatus("verifying");
    axios
      .post("http://localhost:5000/Auth/resend-verification", { email })
      .then((res) => {
        setStatus("resent");
        setMessage(res.data?.message || "Verification email sent.");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err?.response?.data?.message || "Failed to resend email.");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white shadow rounded-xl p-6">
        <h1 className="text-2xl font-semibold mb-2">Verify your email</h1>

        {!token || !id ? (
          <>
            <p className="text-gray-700 mb-4">
              We have sent a verification link to your email. Please check your inbox and click the link.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                type="email"
              />
            </div>

            <button
              onClick={handleResend}
              className="w-full bg-gray-900 text-white rounded-lg py-2 hover:opacity-90"
              disabled={status === "verifying"}
            >
              {status === "verifying" ? "Sending..." : "Resend verification email"}
            </button>

            {message ? (
              <div className={`mt-4 text-sm ${status === "error" ? "text-red-600" : "text-green-700"}`}>
                {message}
              </div>
            ) : null}

            <div className="mt-6 text-sm text-gray-700">
              Already verified? <Link className="text-blue-600 underline" to="/login">Go to login</Link>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-700 mb-4">
              {status === "verifying" ? "Verifying your email..." : message}
            </p>
            {status === "success" ? (
              <p className="text-sm text-gray-600">
                Please wait for admin approval before logging in.
              </p>
            ) : status === "error" ? (
              <div className="mt-4">
                <Link className="text-blue-600 underline" to={`/verify-email?email=${encodeURIComponent(emailFromQuery)}`}>
                  Resend verification email
                </Link>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
