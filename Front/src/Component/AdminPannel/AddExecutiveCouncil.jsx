import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddExecutiveCouncil = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [passwordError, setPasswordError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [visible, setVisible] = useState(false);
  const [visibleR, setVisibleR] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    setPasswordError("");
    setFieldErrors({});

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    // Validate mobile number: 11 digits starting with 017, 018, 019, 016, 013, or 014
    const errors = {};
    if (formData.mobile && !/^(017|018|019|016|013|014)\d{8}$/.test(formData.mobile)) {
      errors.mobile = "Enter a valid 11-digit mobile number starting with 017, 018, 019, 016, 013, or 014";
    }
    if (formData.whatsapp && !/^(017|018|019|016|013|014)\d{8}$/.test(formData.whatsapp)) {
      errors.whatsapp = "Enter a valid 11-digit mobile number starting with 017, 018, 019, 016, 013, or 014";
    }
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
          setVisible(true);
        } else {
          setVisibleR(true);
        }
      })
      .catch((error) => {
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
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className={inputClass}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={inputClass}
            required
          />
          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
            className={inputClass}
            required
          />
          {fieldErrors.mobile && <p className="text-red-500 text-sm">{fieldErrors.mobile}</p>}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={inputClass}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={inputClass}
            required
          />
          {passwordError && (
            <p className="text-red-500 text-sm col-span-2 -mt-3">
              {passwordError}
            </p>
          )}
          <input
            type="text"
            name="permanentAddress"
            placeholder="Permanent Address"
            value={formData.permanentAddress}
            onChange={handleChange}
            className={inputClass}
            required
          />
          <input
            type="text"
            name="currentAddress"
            placeholder="Current Address"
            value={formData.currentAddress}
            onChange={handleChange}
            className={inputClass}
            required
          />
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
          <input
            type="text"
            name="whatsapp"
            placeholder="WhatsApp Number"
            value={formData.whatsapp}
            onChange={handleChange}
            className={inputClass}
          />
          <select
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            className={inputClass}
            required
          >
            <option value="">Select Designation</option>
            <option value="Chief Patron">Chief Patron</option>
            <option value="Patron">Patron</option>
            <option value="Chief Advisor">Chief Advisor</option>
            <option value="Advisor">Advisor</option>
            <option value="President">President</option>
            <option value="Treasurer">Treasurer</option>
            <option value="Student Advisor">Student Advisor</option>
          </select>

          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className={inputClass}
          />
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className={inputClass}
          />

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
            <label className="flex items-center justify-center px-6 py-4 border-2 border-dashed border-indigo-300 rounded-md cursor-pointer bg-indigo-50 hover:bg-indigo-100 transition">
              <input
                type="file"
                name="profileImage"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
              <span className="text-indigo-600 font-semibold">
                📁 Upload Profile Image
              </span>
            </label>
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
