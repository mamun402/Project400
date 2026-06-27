import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { userContext } from "../../App";
import PendingProfile from "./Panding";
import loginImage from "../Image/Icon.jpg"; // Replace with the path to your image

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [visible, setVisible] = useState(false);
  const [visibleR, setVisibleR] = useState(false);
  const [profile, setProfile] = useState(false);
  const [pendingApproval, setPendingApproval] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { setLogin } = useContext(userContext);

  const navigate = useNavigate();

  const onSubmit = (data) => {
    const { email, password } = data;
    setLoading(true);
    if (email && password) {
      axios
        .post("http://localhost:5000/Singup/login", data)
        .then((res) => {
          if (res.data.error) {
            if (res.data.code === "PENDING_ADMIN_APPROVAL") {
              setPendingApproval(true);
              setVisibleR(false);
              setLoading(false);
              return;
            }
            setErrorMessage(res.data.error);
            setVisibleR(true);
            setLoading(false);
          } else {
            setVisible(true);
            setProfile(true);
            setLogin(true);

            localStorage.setItem("username", email);
            localStorage.setItem("normaluser", true);

            localStorage.setItem("Token", res.data.access_token);

            setLoading(false);
          }
        })
        .catch((err) => {
          setLoading(false);
          console.error("Login error: ", err);
          const apiError = err?.response?.data;
          if (apiError?.code === "PENDING_ADMIN_APPROVAL") {
            setPendingApproval(true);
            setVisibleR(false);
            return;
          }
          const apiMessage = apiError?.error || apiError?.message;
          setErrorMessage(apiMessage || "Something went wrong. Please try again.");
          setVisibleR(true);
        });
    }
  };

  useEffect(() => {
    if (profile) {
      const timer = setTimeout(() => {
        navigate("/profile", { replace: true });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [profile, navigate]);

  useEffect(() => {
    if (visible) {
      const timeout = setTimeout(() => {
        setVisible(false);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [visible]);

  useEffect(() => {
    if (visibleR) {
      const timeout = setTimeout(() => {
        setVisibleR(false);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [visibleR]);

  if (pendingApproval) {
    return <PendingProfile />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-white">
      {visible && (
        <div className="fixed inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end transition-all duration-500 z-50">
          <div className="max-w-xl w-full bg-green-400 text-white shadow-lg rounded-lg pointer-events-auto h-10 text-center z-50">
            Login Successful
          </div>
        </div>
      )}
      {visibleR && (
        <div className="fixed inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end transition-all duration-500 z-50">
          <div className="max-w-xl w-full bg-red-400 text-white shadow-lg rounded-lg pointer-events-auto h-10 text-center z-50">
            {errorMessage}
          </div>
        </div>
      )}
      <div className="flex flex-col md:flex-row max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden w-full">
        <div className="w-full md:w-1/2">
          <img
            src={loginImage}
            alt="Login"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="w-full p-8 flex flex-col justify-center md:w-1/2 lg:w-2/3">
          <h2 className="text-4xl font-extrabold text-center text-primary">
            Welcome Back
          </h2>
          <p className="text-center text-gray-700 mb-6">
            Sign in to access your account
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  {...register("email", { required: "Email is required" })}
                  type="email"
                  autoComplete="email"
                  className="block w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Email address"
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-2">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  type="password"
                  autoComplete="current-password"
                  className="block w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Password"
                />

                <div className="mt-2 text-right">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </Link>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 mt-2">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 mt-6 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-transform transform hover:scale-105"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
          <div className="mt-6 text-center text-gray-600">
            <p className="text-sm">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Be a member
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
