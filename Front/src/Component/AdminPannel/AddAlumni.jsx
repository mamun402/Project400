import axios from "axios";
import React, { useEffect, useState } from "react";
import ProfilePhotoPlaceholder from "../Common/ProfilePhotoPlaceholder";
import PhoneInput, { getPhoneError } from "../Common/PhoneInput";

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
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const revokePreviewImage = (imageUrl) => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name === "profileImage" && files && files.length > 0) {
      const file = files[0];
      const validImageTypes = ["image/jpeg", "image/jpg", "image/png"];

      if (!validImageTypes.includes(file.type)) {
        setFieldErrors((prev) => ({
          ...prev,
          profileImage: "Only JPG, JPEG, and PNG images are allowed",
        }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setFieldErrors((prev) => ({
          ...prev,
          profileImage: "Image size must be 5MB or less",
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        profileImage: file,
      }));

      setPreviewImage((currentPreview) => {
        revokePreviewImage(currentPreview);
        return URL.createObjectURL(file);
      });

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
    const urlRegex = /^https?:\/\/\S+\.\S+$/i;
    const fullName = formData.fullName.trim();
    const email = formData.email.trim();

    if (!fullName) {
      errors.fullName = "Full name is required";
    } else if (!/^[A-Za-z][A-Za-z .'-]{1,}$/.test(fullName)) {
      errors.fullName = "Enter a valid full name";
    }

    if (!email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Enter a valid email address";
    }

    if (!formData.designation.trim()) {
      errors.designation = "Designation is required";
    }

    if (!formData.mobile.trim()) {
      errors.mobile = "Mobile number is required";
    } else {
      const mobileError = getPhoneError(formData.mobile, "Mobile number", true);
      if (mobileError) errors.mobile = mobileError;
    }

    const whatsappError = getPhoneError(formData.whatsapp, "WhatsApp number");
    if (whatsappError) errors.whatsapp = whatsappError;

    if (!formData.profileImage) errors.profileImage = "Profile image is required";

    if (formData.linkedin && !urlRegex.test(formData.linkedin.trim())) {
      errors.linkedin = "Enter a valid LinkedIn URL starting with http:// or https://";
    }

    if (formData.facebook && !urlRegex.test(formData.facebook.trim())) {
      errors.facebook = "Enter a valid Facebook URL starting with http:// or https://";
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

    setIsSubmitting(true);
    setSubmissionError("");
    setSubmissionSuccess(false);

    const formDataToSend = new FormData();
    formDataToSend.append("fullName", formData.fullName.trim());
    formDataToSend.append("email", formData.email.trim());
    formDataToSend.append("mobile", formData.mobile.trim());
    formDataToSend.append("whatsapp", formData.whatsapp.trim());
    formDataToSend.append("linkedin", formData.linkedin.trim());
    formDataToSend.append("designation", formData.designation.trim());
    formDataToSend.append("currentEmployer", formData.currentEmployer.trim());
    formDataToSend.append("facebook", formData.facebook.trim());
    formDataToSend.append("profileImage", formData.profileImage);

    axios
      .post("http://localhost:5000/Singup/addalumni", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        if (res.status === 201 || res.data.message === "Alumni added successfully") {
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
          setPreviewImage((currentPreview) => {
            revokePreviewImage(currentPreview);
            return null;
          });
          setFieldErrors({});
          setFileInputKey(Date.now());
        } else {
          setSubmissionSuccess(false);
          setSubmissionError(res.data?.message || "Failed to add alumni. Please try again.");
        }
      })
      .catch((error) => {
        setSubmissionSuccess(false);
        if (error.response?.data?.errors) {
          setFieldErrors(error.response.data.errors);
        }
        setSubmissionError(
          error.response?.data?.message ||
            error.response?.data?.error ||
            "There was an error! Please try again."
        );
        console.error("There was an error:", error);
      })
      .finally(() => {
        setIsSubmitting(false);
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
      revokePreviewImage(previewImage);
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
              Full Name <span className="text-red-500">*</span>
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
              Email Address <span className="text-red-500">*</span>
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
            <label className="block mb-1 text-gray-600">
              Designation <span className="text-red-500">*</span>
            </label>
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

          <PhoneInput
            label="Mobile Number"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
            error={fieldErrors.mobile}
          />

          <PhoneInput
            label="WhatsApp Number"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleChange}
            error={fieldErrors.whatsapp}
          />

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
            {fieldErrors.linkedin && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.linkedin}</p>
            )}
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
            {fieldErrors.facebook && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.facebook}</p>
            )}
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
                  key={`change-${fileInputKey}`}
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
            <label className="cursor-pointer flex w-full max-w-lg flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center hover:bg-gray-100">
              <ProfilePhotoPlaceholder className="mb-4 h-24 w-24" />

              <input
                key={`upload-${fileInputKey}`}
                type="file"
                name="profileImage"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />

              <span className="text-gray-600">
                Upload Your Image <span className="text-red-500">*</span>
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
            disabled={isSubmitting}
            className="w-full py-2 text-white font-bold rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Adding..." : "Add Alumni"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAlumni;
