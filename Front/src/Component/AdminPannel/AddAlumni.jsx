import axios from "axios";
import React, { useEffect, useState } from "react";

const AddAlumni = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    whatsapp: "",
    currentEmployer: "",
    designation: "",
    linkedin: "",
    facebook: "",
    profileImage: null,
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [submissionError, setSubmissionError] = useState("");
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name === "profileImage" && files && files.length > 0) {
      const file = files[0];

      setFormData((prev) => ({
        ...prev,
        profileImage: file,
      }));

      setPreviewImage(URL.createObjectURL(file));

      // clear image error
      if (fieldErrors.profileImage) {
        setFieldErrors((prev) => ({ ...prev, profileImage: "" }));
      }
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // clear field error when user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateFields = () => {
    const errors = {};
    const bdMobileRegex = /^(017|018|019|016|013|014)\d{8}$/;

    // Required fields
    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.profileImage) errors.profileImage = "Profile image is required";

    // Mobile validation (required)
    if (formData.mobile && !bdMobileRegex.test(formData.mobile)) {
      errors.mobile =
        "Enter a valid 11-digit mobile number starting with 017, 018, 019, 016, 013, or 014";
    }

    // WhatsApp validation (optional)
    if (formData.whatsapp && !bdMobileRegex.test(formData.whatsapp)) {
      errors.whatsapp =
        "Enter a valid 11-digit mobile number starting with 017, 018, 019, 016, 013, or 014";
    }

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
    formDataToSend.append("fullName", formData.fullName);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("mobile", formData.mobile);
    formDataToSend.append("whatsapp", formData.whatsapp);
    formDataToSend.append("linkedin", formData.linkedin);
    formDataToSend.append("designation", formData.designation);
    formDataToSend.append("currentEmployer", formData.currentEmployer);
    formDataToSend.append("facebook", formData.facebook);
    formDataToSend.append("profileImage", formData.profileImage);

    axios
      .post("http://localhost:5000/Singup/addalumni", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        if (res.data.message === "Signup was successful!") {
          setSubmissionSuccess(true);
          setSubmissionError("");

          // reset form (optional)
          setFormData({
            fullName: "",
            email: "",
            mobile: "",
            whatsapp: "",
            currentEmployer: "",
            designation: "",
            linkedin: "",
            facebook: "",
            profileImage: null,
          });
          setPreviewImage(null);
          setFieldErrors({});
        } else {
          setSubmissionSuccess(false);
          setSubmissionError("Failed to add alumni. Please try again.");
        }
      })
      .catch((error) => {
        setSubmissionSuccess(false);
        setSubmissionError("There was an error! Please try again.");
        console.error("There was an error:", error);
      });
  };

  useEffect(() => {
    if (submissionError) {
      const timeout = setTimeout(() => setSubmissionError(""), 2000);
      return () => clearTimeout(timeout);
    }
  }, [submissionError]);

  useEffect(() => {
    if (submissionSuccess) {
      const timeout = setTimeout(() => setSubmissionSuccess(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [submissionSuccess]);

  // avoid memory leak from object URL
  useEffect(() => {
    return () => {
      if (previewImage) URL.revokeObjectURL(previewImage);
    };
  }, [previewImage]);

  return (
    <div className="flex items-center justify-center min-h-screen px-4 mt-10">
      {/* Success and error notifications */}
      {submissionSuccess && (
        <div className="fixed inset-0 flex items-end justify-center px-4 py-6 sm:items-start sm:justify-end z-50">
          <div className="bg-green-400 text-white text-center rounded-lg shadow-lg px-4 py-2">
            Alumni added successfully!
          </div>
        </div>
      )}

      {submissionError && (
        <div className="fixed inset-0 flex items-end justify-center px-4 py-6 sm:items-start sm:justify-end z-50">
          <div className="bg-red-400 text-white text-center rounded-lg shadow-lg px-4 py-2">
            {submissionError}
          </div>
        </div>
      )}

      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-extrabold text-center text-gray-800">
          Add New Alumni
        </h2>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div>
            <label className="block mb-1 text-gray-600">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="e.g. Mamun Billah"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring focus:ring-purple-500"
              required
            />
            {fieldErrors.fullName && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-gray-600">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring focus:ring-purple-500"
              required
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
            )}
          </div>

          {/* Designation (optional) */}
          <div>
            <label className="block mb-1 text-gray-600">Designation</label>
            <input
              type="text"
              name="designation"
              placeholder="e.g. Software Engineer"
              value={formData.designation}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring focus:ring-purple-500"
            />
          </div>

          {/* Current Employer (optional) */}
          <div>
            <label className="block mb-1 text-gray-600">Current Employer</label>
            <input
              type="text"
              name="currentEmployer"
              placeholder="e.g. Google"
              value={formData.currentEmployer}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring focus:ring-purple-500"
            />
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
            {fieldErrors.mobile && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.mobile}</p>
            )}
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block mb-1 text-gray-600">WhatsApp Number</label>
            <input
              type="text"
              name="whatsapp"
              placeholder="WhatsApp Number"
              value={formData.whatsapp}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring focus:ring-purple-500"
            />
            {fieldErrors.whatsapp && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.whatsapp}</p>
            )}
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block mb-1 text-gray-600">LinkedIn URL</label>
            <input
              type="text"
              name="linkedin"
              placeholder="LinkedIn URL"
              value={formData.linkedin}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring focus:ring-purple-500"
            />
          </div>

          {/* Facebook */}
          <div>
            <label className="block mb-1 text-gray-600">Facebook URL</label>
            <input
              type="text"
              name="facebook"
              placeholder="Facebook URL"
              value={formData.facebook}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring focus:ring-purple-500"
            />
          </div>

          {/* Image Upload / Preview (REQUIRED) */}
          {previewImage ? (
            <div className="mt-4 flex flex-col items-center gap-2">
              <img
                src={previewImage}
                alt="Profile Preview"
                className="w-32 h-32 object-cover rounded-full border"
              />
              <label className="cursor-pointer text-sm text-indigo-600 hover:underline">
                Change image
                <input
                  type="file"
                  name="profileImage"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
              {fieldErrors.profileImage && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.profileImage}
                </p>
              )}
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>

              <input
                type="file"
                name="profileImage"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />

              <span className="text-gray-600">
                Upload Your Image
              </span>

              {fieldErrors.profileImage && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.profileImage}
                </p>
              )}
            </label>
          )}

          <button
            type="submit"
            className="w-full py-2 text-white font-bold rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-600"
          >
            Add Alumni
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAlumni;
