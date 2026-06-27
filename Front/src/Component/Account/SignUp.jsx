import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PhoneInput, { getPhoneError } from "../Common/PhoneInput";
import ProfilePhotoPlaceholder from "../Common/ProfilePhotoPlaceholder";

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
    const fullName = formData.fullName.trim();
    const email = formData.email.trim();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    if (!fullName) {
      errors.fullName = "Full name is required";
    } else if (!/^[A-Za-z][A-Za-z .'-]{1,}$/.test(fullName)) {
      errors.fullName = "Enter a valid full name";
    }

    if (!email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      errors.email = "Enter a valid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(password)) {
      errors.password = "Password must contain uppercase, lowercase, and a number";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (confirmPassword !== password) {
      errors.confirmPassword = "Passwords do not match";
    }

    const mobileError = getPhoneError(formData.mobile, "Mobile number", true);
    if (mobileError) errors.mobile = mobileError;

    const whatsappError = getPhoneError(formData.whatsapp, "WhatsApp number");
    if (whatsappError) errors.whatsapp = whatsappError;

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

          <PhoneInput
            label="Mobile Number"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
            error={fieldErrors.mobile}
          />

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
            {(fieldErrors.confirmPassword || passwordError) && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.confirmPassword || passwordError}</p>
            )}
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

          <PhoneInput
            label="WhatsApp Number"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleChange}
            error={fieldErrors.whatsapp}
          />

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
            <label className="cursor-pointer flex w-full max-w-lg flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center hover:bg-gray-100">
              <ProfilePhotoPlaceholder className="mb-4 h-24 w-24" />
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
