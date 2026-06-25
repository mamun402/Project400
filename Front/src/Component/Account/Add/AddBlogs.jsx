import React, { useState } from "react";

const AddBlogs = () => {
  const [info, setInfo] = useState({
    blogTitle: "",
    authorName: "",
    content: "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (!info.blogTitle || !info.authorName || !info.content) {
      alert("Please fill in all fields.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("blogTitle", info.blogTitle);
    formData.append("authorName", info.authorName);
    formData.append("content", info.content);
    if (file) {
      formData.append("file", file);
    }

    fetch("http://localhost:5000/SingUpAdmin/addblogs", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.msg === "Blog added successfully") {
          setShowSuccessDialog(true);
          setTimeout(() => setShowSuccessDialog(false), 1500);
        }
      })
      .catch(() => {
        setShowRejectDialog(true);
        setTimeout(() => setShowRejectDialog(false), 1500);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen  py-10 px-4 flex justify-center items-start">
      {/* Success Dialog */}
      {showSuccessDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-green-500 text-white px-6 py-4 rounded-md shadow-md">
            Blog added successfully.
          </div>
        </div>
      )}
      {/* Error Dialog */}
      {showRejectDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-red-500 text-white px-6 py-4 rounded-md shadow-md">
            Sorry, something went wrong. Please try again.
          </div>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-md p-8">
        <h2 className="text-3xl font-bold text-gray-700 mb-6 border-b pb-2">
          📘 Add New Blog
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Blog Title */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Blog Title
            </label>
            <input
              type="text"
              name="blogTitle"
              onBlur={handleBlur}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter blog title"
              required
            />
          </div>

          {/* Author Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Author Name
            </label>
            <input
              type="text"
              name="authorName"
              onBlur={handleBlur}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter author name"
              required
            />
          </div>

          {/* Blog Content */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Blog Content
            </label>
            <textarea
              name="content"
              onBlur={handleBlur}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Write your blog content here..."
              required
            />
          </div>

          {/* Image Upload with Preview */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Upload Image
            </label>
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mb-4 w-full max-w-xs mx-auto rounded-md shadow"
              />
            )}
            <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-blue-400 p-6 rounded-lg bg-blue-50 hover:bg-blue-100 transition">
              <svg
                className="w-8 h-8 text-blue-600 mb-2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
              <span className="text-sm text-blue-600 font-medium">
                Click to upload
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            {loading ? "Uploading..." : "Upload Blog"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBlogs;
