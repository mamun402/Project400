import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const EditBlogs = () => {
  const [info, setInfo] = useState({
    blogTitle: "",
    authorName: "",
    content: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [preview, setPreview] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    // Fetch blog data by blogId
    fetch(`http://localhost:5000/SingUpAdmin/blog/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setInfo({
          blogTitle: data.blogTitle || "",
          authorName: data.authorName || "",
          content: data.content || "",
        });
      })
      .catch((err) => console.error("Error fetching blog:", err));
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    const file = e.target.files[0];
    setPreview(URL.createObjectURL(file)); // Preview the image
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (!info.blogTitle || !info.authorName || !info.content) {
      alert("Please fill in all the fields.");
      setLoading(false);
      return;
    }

    const formData = new FormData();

    if (file) formData.append("file", file);
    formData.append("blogTitle", info.blogTitle);
    formData.append("authorName", info.authorName);
    formData.append("content", info.content);

    fetch(`http://localhost:5000/SingUpAdmin/editblogs/${id}`, {
      method: "PUT",
      body: formData,
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.msg === "Blog updated successfully") {
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
    <div className="flex items-center min-h-screen p-4 justify-center">
      {showSuccessDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-green-500 text-white text-center px-6 py-4 rounded-lg shadow-lg">
            <p>Blog successfully updated.</p>
          </div>
        </div>
      )}
      {showRejectDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-red-500 text-white text-center px-6 py-4 rounded-lg shadow-lg">
            <p>Sorry, something went wrong. Please try again.</p>
          </div>
        </div>
      )}
      <div className="flex flex-col overflow-hidden bg-white rounded-md shadow-lg md:flex-row md:flex-1 lg:max-w-screen-md">
        <div className="p-5 bg-white md:flex-1">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
            <h3 className="my-4 text-2xl font-semibold text-gray-700">
              Edit Blog
            </h3>
            <input
              type="text"
              name="blogTitle"
              value={info.blogTitle}
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-4 focus:ring-blue-200"
              onChange={handleInputChange}
              placeholder="Enter blog title"
              required
            />
            <input
              type="text"
              name="authorName"
              value={info.authorName}
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-4 focus:ring-blue-200"
              onChange={handleInputChange}
              placeholder="Enter author's name"
              required
            />
            <textarea
              name="content"
              value={info.content}
              className="px-4 h-32 py-2 border border-gray-300 rounded focus:outline-none focus:ring-4 focus:ring-blue-200"
              onChange={handleInputChange}
              placeholder="Enter blog content"
              required
            />
            <div>
              <label htmlFor="file" className="font-semibold text-gray-600">
                Blog Image
              </label>
              <div className="w-full px-3 mb-8 flex flex-col items-center">
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="mt-4 w-full max-w-xs rounded-lg shadow-lg mx-auto mb-10"
                  />
                )}
                <label
                  className="cursor-pointer flex w-full max-w-lg flex-col items-center justify-center rounded-xl border-2 border-dashed border-green-400 bg-white p-6 text-center"
                  htmlFor="dropzone-file"
                >
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
                  <h2 className="mt-4 text-xl font-medium text-gray-700 tracking-wide">
                    Image
                  </h2>
                  <p className="mt-2 text-gray-500 tracking-wide">
                    Upload your file JPEG, PNG, JPG.
                  </p>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBlogs;
