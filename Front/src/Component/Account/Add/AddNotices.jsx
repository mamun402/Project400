import React, { useRef, useState } from "react";

const AddNotices = () => {
  const [info, setInfo] = useState({
    noticeTitle: "",
    description: "",
    category: "General",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState("");

  const fileInputRef = useRef(null);

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files && e.target.files[0];
    setFile(selectedFile || null);
    setImageError("");

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  // ✅ RESET FUNCTION
  const resetForm = () => {
    setInfo({
      noticeTitle: "",
      description: "",
      category: "General",
    });
    setFile(null);
    setPreview(null);
    setImageError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!file) {
      setImageError("Select image to upload");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("noticeTitle", info.noticeTitle);
    formData.append("description", info.description);
    formData.append("category", info.category);
    formData.append("file", file);

    fetch("http://localhost:5000/SingUpAdmin/addnotice", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.msg === "Notice added successfully") {
          setShowSuccessDialog(true);

          // ✅ AUTO RESET AFTER SUCCESS
          resetForm();

          setTimeout(() => setShowSuccessDialog(false), 1500);
        } else {
          setShowRejectDialog(true);
          setTimeout(() => setShowRejectDialog(false), 1500);
        }
      })
      .catch(() => {
        setShowRejectDialog(true);
        setTimeout(() => setShowRejectDialog(false), 1500);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-6">
      {/* Success Dialog */}
      {showSuccessDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg">
            Notice added successfully.
          </div>
        </div>
      )}

      {/* Error Dialog */}
      {showRejectDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg">
            Sorry, something went wrong. Please try again.
          </div>
        </div>
      )}

      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-gray-800 text-center">
          Add New Notice
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="noticeTitle"
            value={info.noticeTitle}
            onChange={handleBlur}
            placeholder="Enter notice title"
            required
            className="w-full px-4 py-2 border rounded-lg"
          />

          <textarea
            name="description"
            value={info.description}
            onChange={handleBlur}
            placeholder="Write your description here..."
            required
            className="w-full h-32 px-4 py-2 border rounded-lg"
          />

          <select
            name="category"
            value={info.category}
            onChange={handleBlur}
            required
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="General">General</option>
            <option value="Event">Event</option>
            <option value="Announcement">Announcement</option>
          </select>

          {/* Image Upload */}
          <div className="flex flex-col items-center">
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mb-4 w-full max-w-xs rounded-lg shadow"
              />
            )}

            {!preview && (
              <label
                htmlFor="dropzone-file"
                className="cursor-pointer flex flex-col items-center justify-center w-full max-w-md border-2 border-dashed border-blue-400 rounded-xl p-6 bg-blue-50"
              >
                <p className="text-sm font-medium text-gray-700">
                  Upload Notice Image <span className="text-red-500">*</span>
                </p>
                <input
                  ref={fileInputRef}
                  id="dropzone-file"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            )}

            {imageError && (
              <p className="mt-2 text-sm text-red-500 font-medium">
                {imageError}
              </p>
            )}

            {preview && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="mt-4 bg-gray-700 hover:bg-gray-800 text-white px-5 py-2 rounded-lg text-sm font-semibold"
                >
                  Change Image
                </button>
              </>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold"
          >
            {loading ? "Uploading..." : "Upload Notice"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNotices;