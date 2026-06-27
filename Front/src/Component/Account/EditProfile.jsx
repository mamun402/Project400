import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PhoneInput, { getPhoneError } from "../Common/PhoneInput";
import ProfilePhotoPlaceholder from "../Common/ProfilePhotoPlaceholder";

const EditProfile = () => {
  const { id } = useParams();
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
    batch: "",
    id: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [passwordError, setPasswordError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [visible, setVisible] = useState(false);
  const [visibleR, setVisibleR] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/Singup/singleUser?id=${id}`)
      .then((res) => {
        const data = res.data[0]; // Assuming the response is an array
        setFormData({
          fullName: data.name || "",
          email: data.email || "",
          mobile: data.mobile || "",
          permanentAddress: data.permanentAddress || "",
          currentAddress: data.currentAddress || "",
          linkedinId: data.linkedinId || "",
          facebook: data.facebook || "",
          whatsapp: data.whatsapp || "",
          batch: data.batch || "",
          id: data.id || "",
          password: "", // Leave password empty for now
          confirmPassword: "", // Leave confirm password empty for now
        });
        setImagePreview(data.profileImageUrl || null); // Assuming the backend returns the image URL
      })
      .catch((err) => {
        console.error("Failed to fetch user", err);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (name === "profileImage" && files) {
      setFormData((prev) => ({
        ...prev,
        profileImage: files[0],
      }));

      const previewUrl = URL.createObjectURL(files[0]);
      setImagePreview(previewUrl);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (name === "password" || name === "confirmPassword") {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setPasswordError("");
    setFieldErrors({});

    // Validate password match
    if (formData.password && formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    const errors = {};
    const mobileError = getPhoneError(formData.mobile, "Mobile number");
    if (mobileError) errors.mobile = mobileError;

    const whatsappError = getPhoneError(formData.whatsapp, "WhatsApp number");
    if (whatsappError) errors.whatsapp = whatsappError;
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Append only non-null and non-empty values
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          formDataToSend.append(key, value);
        }
      });

      const response = await axios.put(
        `http://localhost:5000/Singup/editProfile/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.message === "Profile updated successfully") {
        setVisible(true);
        setTimeout(() => navigate("/profile"), 2000);
      } else {
        setVisibleR(true);
        setTimeout(() => setVisibleR(false), 2000);
        console.warn("Unexpected response:", response.data);
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        setFieldErrors(error.response.data.errors);
      }
      setVisibleR(true);
      setTimeout(() => setVisibleR(false), 2000);
      console.error("Update error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 mt-10">
      {visible && (
        <div className="fixed inset-0 flex items-end justify-center px-4 py-6 sm:items-start sm:justify-end z-50">
          <div className="bg-green-500 text-white rounded-lg px-4 py-2">
            Profile updated successfully!
          </div>
        </div>
      )}
      {visibleR && (
        <div className="fixed inset-0 flex items-end justify-center px-4 py-6 sm:items-start sm:justify-end z-50">
          <div className="bg-red-500 text-white rounded-lg px-4 py-2">
            Update failed. Try again.
          </div>
        </div>
      )}

      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-extrabold text-center text-gray-800">
          Edit Profile
        </h2>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {/* Input Fields */}
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
          <PhoneInput
            label="Mobile Number"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            error={fieldErrors.mobile}
          />
          {/* Password Fields */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
          {passwordError && (
            <p className="text-red-500 text-sm">{passwordError}</p>
          )}
          {/* Other Fields */}
          <input
            type="text"
            name="permanentAddress"
            placeholder="Permanent Address"
            value={formData.permanentAddress}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
          <input
            type="text"
            name="linkedinId"
            placeholder="LinkedIn URL"
            value={formData.linkedinId}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring focus:ring-purple-500"
          />

          <input
            type="text"
            name="facebook"
            placeholder="Facebook URL"
            value={formData.facebook}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring focus:ring-purple-500"
          />
          <PhoneInput
            label="WhatsApp Number"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleChange}
            error={fieldErrors.whatsapp}
          />
          <input
            type="text"
            name="batch"
            placeholder="Batch"
            value={formData.batch}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring focus:ring-purple-500"
          />
          <input
            type="text"
            name="id"
            placeholder="Id"
            value={formData.id}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring focus:ring-purple-500"
          />
          {/* ...other fields... */}

          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-full mx-auto"
            />
          )}

          <div className="flex flex-col items-center">
            {imagePreview ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer rounded-xl border-2 border-dashed border-green-400 px-6 py-3 text-center text-gray-700"
              >
                Change image
              </button>
            ) : (
              <label
                htmlFor="profile-image-upload"
                className="cursor-pointer flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-center hover:bg-gray-100"
              >
                <ProfilePhotoPlaceholder className="mb-3 h-20 w-20" />
                <span className="text-gray-600">Upload New Image</span>
              </label>
            )}
            <input
              id="profile-image-upload"
              ref={fileInputRef}
              type="file"
              name="profileImage"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 font-bold text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
