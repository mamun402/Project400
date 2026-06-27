import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PhoneInput, { getPhoneError } from "../Common/PhoneInput";
import ProfilePhotoPlaceholder from "../Common/ProfilePhotoPlaceholder";

const AddExecutiveCouncil = () => {
  const navigate = useNavigate();

  const emptyFormData = {
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    permanentAddress: "",
    currentAddress: "",
    profileImage: null,
    linkedinId: "",
    facebook: "",
    whatsapp: "",
    designation: "",
    startDate: "",
    endDate: "",
  };

  const [formData, setFormData] = useState({ ...emptyFormData });

  const [imagePreview, setImagePreview] = useState(null);
  const [passwordError, setPasswordError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [visible, setVisible] = useState(false);
  const [visibleR, setVisibleR] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === "profileImage" && files) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    if (name === "password" || name === "confirmPassword") {
      setPasswordError("");
    }
  };

  const resetForm = () => {
    setFormData({ ...emptyFormData });
    setImagePreview(null);
    setPasswordError("");
    setFieldErrors({});
    setFileInputKey(Date.now());
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

    if (!formData.permanentAddress.trim()) errors.permanentAddress = "Permanent address is required";
    if (!formData.currentAddress.trim()) errors.currentAddress = "Current address is required";
    if (!formData.designation) errors.designation = "Designation is required";
    if (!formData.profileImage) errors.profileImage = "Profile image is required";

    const mobileError = getPhoneError(formData.mobile, "Mobile number", true);
    if (mobileError) errors.mobile = mobileError;

    const whatsappError = getPhoneError(formData.whatsapp, "WhatsApp number");
    if (whatsappError) errors.whatsapp = whatsappError;

    if (formData.startDate && formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      errors.endDate = "End date cannot be before start date";
    }

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setPasswordError("");
    setFieldErrors({});

    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    axios
      .post("http://localhost:5000/SingUpAdmin/user", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.message === "Signup was successful!") {
          resetForm();
          setVisible(true);
        } else {
          setVisibleR(true);
        }
      })
      .catch((error) => {
        if (error.response?.data?.errors) {
          setFieldErrors(error.response.data.errors);
        }
        setVisibleR(true);
        console.error("There was an error!", error);
      });
  };

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        setVisible(false);
        navigate("/adminhome", { replace: true });
      }, 2000);
    }
  }, [visible, navigate]);

  useEffect(() => {
    if (visibleR) {
      setTimeout(() => {
        setVisibleR(false);
      }, 2000);
    }
  }, [visibleR]);

  const inputClass =
    "w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition";

  return (
    <div className="flex items-center justify-center min-h-screen  px-4 py-10">
      {visible && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-md z-50 animate-slide-in">
          ✅ Executive Member Added!
        </div>
      )}
      {visibleR && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-md z-50 animate-slide-in">
          ❌ Sorry, something went wrong.
        </div>
      )}

      <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          Add Executive Council Member
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <div className="space-y-1">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name *"
              value={formData.fullName}
              onChange={handleChange}
              className={inputClass}
              required
            />
            {fieldErrors.fullName && <p className="text-red-500 text-sm">{fieldErrors.fullName}</p>}
          </div>
          <div className="space-y-1">
            <input
              type="email"
              name="email"
              placeholder="Email *"
              value={formData.email}
              onChange={handleChange}
              className={inputClass}
              required
            />
            {fieldErrors.email && <p className="text-red-500 text-sm">{fieldErrors.email}</p>}
          </div>
          <PhoneInput
            label="Mobile Number"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
            error={fieldErrors.mobile}
          />
          <div className="space-y-1">
            <input
              type="password"
              name="password"
              placeholder="Password *"
              value={formData.password}
              onChange={handleChange}
              className={inputClass}
              required
            />
            {fieldErrors.password && <p className="text-red-500 text-sm">{fieldErrors.password}</p>}
          </div>
          <div className="space-y-1">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password *"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={inputClass}
              required
            />
            {(fieldErrors.confirmPassword || passwordError) && (
              <p className="text-red-500 text-sm">{fieldErrors.confirmPassword || passwordError}</p>
            )}
          </div>
          <div className="space-y-1">
            <input
              type="text"
              name="permanentAddress"
              placeholder="Permanent Address *"
              value={formData.permanentAddress}
              onChange={handleChange}
              className={inputClass}
              required
            />
            {fieldErrors.permanentAddress && <p className="text-red-500 text-sm">{fieldErrors.permanentAddress}</p>}
          </div>
          <div className="space-y-1">
            <input
              type="text"
              name="currentAddress"
              placeholder="Current Address *"
              value={formData.currentAddress}
              onChange={handleChange}
              className={inputClass}
              required
            />
            {fieldErrors.currentAddress && <p className="text-red-500 text-sm">{fieldErrors.currentAddress}</p>}
          </div>
          <input
            type="text"
            name="linkedinId"
            placeholder="LinkedIn URL"
            value={formData.linkedinId}
            onChange={handleChange}
            className={inputClass}
          />
          <input
            type="text"
            name="facebook"
            placeholder="Facebook URL"
            value={formData.facebook}
            onChange={handleChange}
            className={inputClass}
          />
          <PhoneInput
            label="WhatsApp Number"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleChange}
            error={fieldErrors.whatsapp}
          />
          <div className="space-y-1">
            <select
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className={inputClass}
              required
            >
            <option value="">Select Designation *</option>
            <option value="Chief Patron">Chief Patron</option>
            <option value="Patron">Patron</option>
            <option value="Chief Advisor">Chief Advisor</option>
            <option value="Advisor">Advisor</option>
            <option value="President">President</option>
            <option value="Treasurer">Treasurer</option>
            <option value="Student Advisor">Student Advisor</option>
            </select>
            {fieldErrors.designation && <p className="text-red-500 text-sm">{fieldErrors.designation}</p>}
          </div>

          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className={inputClass}
          />
          <div className="space-y-1">
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className={inputClass}
            />
            {fieldErrors.endDate && <p className="text-red-500 text-sm">{fieldErrors.endDate}</p>}
          </div>

          <div className="col-span-2">
            {imagePreview && (
              <div className="flex justify-center mb-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 rounded-full object-cover border-2 border-indigo-400"
                />
              </div>
            )}
            <label className="flex flex-col items-center justify-center px-6 py-4 border border-dashed border-gray-300 rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
              <ProfilePhotoPlaceholder className="mb-3 h-24 w-24" />
              <input
                key={fileInputKey}
                type="file"
                name="profileImage"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
              <span className="text-indigo-600 font-semibold">
                Upload Profile Image <span className="text-red-500">*</span>
              </span>
            </label>
            {fieldErrors.profileImage && <p className="text-red-500 text-sm mt-2">{fieldErrors.profileImage}</p>}
          </div>

          <button
            type="submit"
            className="col-span-2 w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-semibold rounded-md hover:from-purple-600 hover:to-indigo-600 transition"
          >
            ➕ Add Member
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExecutiveCouncil;
