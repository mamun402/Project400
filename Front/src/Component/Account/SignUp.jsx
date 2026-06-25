import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    profileImage: null,
    linkedinId: "",
    facebook: "",
    whatsapp: "",
    mobile: "",
    batch: "",
    id: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [passwordError, setPasswordError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [visible, setVisible] = useState(false);
  const [visibleR, setVisibleR] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === "profileImage" && files) {
      setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
      const file = files[0];
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: type === "checkbox" ? checked : value }));
    }

    if (name === "password" || name === "confirmPassword") setPasswordError("");
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateFields = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    // Full Name validation: letters and spaces only, at least 2 characters
    if (!/^[A-Za-z\s]{2,}$/.test(formData.fullName.trim())) {
      errors.fullName = "Fill up the Name correctly";
    }

    // Email basic check
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = "Enter a valid email address";
    }

    // Password match
    if (formData.password !== formData.confirmPassword) errors.password = "Passwords do not match";

    // Mobile number validation: 11 digits starting with 017, 018, 019, 016, 013, or 014
    if (formData.mobile && !/^(017|018|019|016|013|014)\d{8}$/.test(formData.mobile)) {
      errors.mobile = "Enter a valid 11-digit mobile number starting with 017, 018, 019, 016, 013, or 014";
    }

    // Whatsapp number validation: 11 digits starting with 017, 018, 019, 016, 013, or 014
    if (formData.whatsapp && !/^(017|018|019|016|013|014)\d{8}$/.test(formData.whatsapp)) {
      errors.whatsapp = "Enter a valid 11-digit mobile number starting with 017, 018, 019, 016, 013, or 014";
    }

    // Profile Image check
    if (!formData.profileImage) errors.profileImage = "Upload photo to signup";

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    axios
      .post("http://localhost:5000/Singup/user", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        if (res.data.needsEmailVerification) {
          setVisible(true);
        } else if (res.data.errors) {
          setFieldErrors(res.data.errors);
        } else if (res.data.error === "Email already existed") {
          setErrorMessage("Email already existed");
          setVisibleR(true);
        } else if (res.data.message) {
          setVisibleR(true);
        }
      })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data.errors) {
          setFieldErrors(error.response.data.errors);
        } else if (error.response && error.response.data && error.response.data.error === "Email already existed") {
          setErrorMessage("Email already existed");
          setVisibleR(true);
        } else {
          setVisibleR(true);
          console.error("There was an error!", error);
        }
      });
  };

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        setVisible(false);
        navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`, { replace: true });
      }, 2000);
    }
  }, [visible, navigate]);

  useEffect(() => {
    if (visibleR) {
      setTimeout(() => {
        setVisibleR(false);
        setErrorMessage("");
      }, 2000);
    }
  }, [visibleR]);

  return (
    <div className="flex items-center justify-center min-h-screen px-4 mt-10">
      {/* Success and error notifications */}
      {visible && (
        <div className="fixed inset-0 flex items-end justify-center px-4 py-6 sm:items-start sm:justify-end z-50">
          <div className="bg-green-400 text-white text-center rounded-lg shadow-lg px-4 py-2">
            Signup successful!
          </div>
        </div>
      )}
      {visibleR && (
        <div className="fixed inset-0 flex items-end justify-center px-4 py-6 sm:items-start sm:justify-end z-50">
          <div className="bg-red-400 text-white text-center rounded-lg shadow-lg px-4 py-2">
            {errorMessage || "Sorry, something went wrong. Please try again."}
          </div>
        </div>
      )}

      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-extrabold text-center text-gray-800">Register</h2>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div>
            <label className="block mb-1 text-gray-600">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="e.g. Ruksana"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring focus:ring-purple-500"
            />
            {fieldErrors.fullName && <p className="text-red-500 text-sm mt-1">{fieldErrors.fullName}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-gray-600">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring focus:ring-purple-500"
            />
            {fieldErrors.email && <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>}
          </div>

          {/* Mobile */}
          <div>
            <label className="block mb-1 text-gray-600">
              Mobile Number
            </label>
            <input
              type="text"
              name="mobile"
              placeholder="Mobile Number"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring focus:ring-purple-500"
            />
            {fieldErrors.mobile && <p className="text-red-500 text-sm mt-1">{fieldErrors.mobile}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-gray-600">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring focus:ring-purple-500"
            />
            {fieldErrors.password && <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-1 text-gray-600">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="********"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring focus:ring-purple-500"
            />
            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
          </div>

          {/* Social Links */}
          <input
            type="text"
            name="linkedinId"
            placeholder="LinkedIn URL"
            value={formData.linkedinId}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring focus:ring-purple-500"
          />
          {fieldErrors.linkedinId && <p className="text-red-500 text-sm mt-1">{fieldErrors.linkedinId}</p>}

          <input
            type="text"
            name="facebook"
            placeholder="Facebook URL"
            value={formData.facebook}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring focus:ring-purple-500"
          />
          {fieldErrors.facebook && <p className="text-red-500 text-sm mt-1">{fieldErrors.facebook}</p>}

          <input
            type="text"
            name="whatsapp"
            placeholder="Whatsapp Number"
            value={formData.whatsapp}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring focus:ring-purple-500"
          />
          {fieldErrors.whatsapp && <p className="text-red-500 text-sm mt-1">{fieldErrors.whatsapp}</p>}

          {/* Image Upload / Preview */}
          {imagePreview ? (
            <div className="mt-4 flex flex-col items-center gap-2">
              <img src={imagePreview} alt="Profile Preview" className="w-32 h-32 object-cover rounded-full border" />
              <label className="cursor-pointer text-sm text-indigo-600 hover:underline">
                Change image
                <input type="file" name="profileImage" accept="image/*" onChange={handleChange} className="hidden" />
              </label>
              {fieldErrors.profileImage && <p className="text-red-500 text-sm mt-1">{fieldErrors.profileImage}</p>}
            </div>
          ) : (
            <label className="cursor-pointer flex w-full max-w-lg flex-col items-center justify-center rounded-xl border-2 border-dashed border-green-400 bg-white p-6 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-green-800"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <input type="file" name="profileImage" accept="image/*" onChange={handleChange} className="hidden" />
              <span className="text-gray-600">Upload Your Image <span className="text-red-500">*</span></span>
              {fieldErrors.profileImage && <p className="text-red-500 text-sm mt-1">{fieldErrors.profileImage}</p>}
            </label>
          )}

          <button type="submit" className="w-full py-2 text-white font-bold rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-600">
            Sign UP
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
