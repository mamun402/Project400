import React, { useRef, useState } from "react";

const AddNotice = () => {
  const initialInfo = {
    noticeTitle: "",
    description: "",
    category: "General",
  };

  const [info, setInfo] = useState(initialInfo);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setErrors((prev) => ({ ...prev, file: "" }));

    if (selectedFile) {
      const validImageTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validImageTypes.includes(selectedFile.type)) {
        setErrors((prev) => ({ ...prev, file: "Only JPG, JPEG, and PNG images are allowed" }));
        setPreview(null);
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, file: "Image size must be 5MB or less" }));
        setPreview(null);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const resetAfterSuccess = () => {
    setInfo({ ...initialInfo });
    setFile(null);
    setPreview(null);
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validateFields = () => {
    const validationErrors = {};
    const noticeTitle = info.noticeTitle.trim();
    const description = info.description.trim();

    if (!noticeTitle) validationErrors.noticeTitle = "Notice title is required";
    else if (noticeTitle.length < 3) validationErrors.noticeTitle = "Notice title must be at least 3 characters";

    if (!description) validationErrors.description = "Description is required";
    else if (description.length < 10) validationErrors.description = "Description must be at least 10 characters";

    if (!info.category) validationErrors.category = "Category is required";
    if (!file) validationErrors.file = "Notice image is required";

    return validationErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateFields();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("noticeTitle", info.noticeTitle.trim());
    formData.append("description", info.description.trim());
    formData.append("category", info.category);
    formData.append("file", file);

    fetch("http://localhost:5000/SingUpAdmin/addnotice", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.msg === "Notice added successfully") {
          setShowSuccessDialog(true);
          resetAfterSuccess();
          setTimeout(() => setShowSuccessDialog(false), 1500);
        } else {
          setErrors((prev) => ({ ...prev, submit: response.msg || "Unable to add notice" }));
          setShowRejectDialog(true);
          setTimeout(() => setShowRejectDialog(false), 1500);
        }
      })
      .catch(() => {
        setErrors((prev) => ({ ...prev, submit: "Sorry, something went wrong. Please try again." }));
        setShowRejectDialog(true);
        setTimeout(() => setShowRejectDialog(false), 1500);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-6">
      {showSuccessDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-green-500 text-white text-center px-6 py-4 rounded-lg shadow-lg">
            <p>Notice added successfully.</p>
          </div>
        </div>
      )}
      {showRejectDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-red-500 text-white text-center px-6 py-4 rounded-lg shadow-lg">
            <p>{errors.submit || "Sorry, something went wrong. Please try again."}</p>
          </div>
        </div>
      )}
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Add New Notice</h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Notice Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="noticeTitle"
              value={info.noticeTitle}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter Notice Title"
              required
            />
            {errors.noticeTitle && <p className="text-red-500 text-sm mt-1">{errors.noticeTitle}</p>}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={info.description}
              onChange={handleChange}
              className="w-full px-4 h-32 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter Notice Description"
              required
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={info.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="General">General</option>
              <option value="Event">Event</option>
              <option value="Announcement">Announcement</option>
            </select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>

          <div className="w-full px-3 mb-8 flex flex-col items-center">
            {preview && (
              <img src={preview} alt="Preview" className="mt-4 w-full max-w-xs rounded-lg shadow-lg mx-auto mb-6" />
            )}

            {!preview && (
              <label className="cursor-pointer flex w-full max-w-lg flex-col items-center justify-center rounded-xl border-2 border-dashed border-green-400 bg-white p-6 text-center" htmlFor="dropzone-file">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <h2 className="mt-4 text-xl font-medium text-gray-700 tracking-wide">
                  Upload image <span className="text-red-500">*</span>
                </h2>
                <p className="mt-2 text-gray-500 tracking-wide">Upload your file JPEG, PNG, JPG.</p>
                <input ref={fileInputRef} id="dropzone-file" type="file" className="hidden" name="category_image" accept="image/*" onChange={handleFileChange} />
              </label>
            )}

            {errors.file && <p className="mt-2 text-sm text-red-500 font-medium">{errors.file}</p>}

            {preview && (
              <>
                <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-2 bg-gray-700 hover:bg-gray-800 text-white px-5 py-2 rounded-lg text-sm font-semibold">
                  Change Image
                </button>
              </>
            )}
          </div>

          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg" disabled={loading}>
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNotice;
