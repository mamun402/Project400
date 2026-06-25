import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditGallery = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [info, setInfo] = useState({
    title: "",
    description: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [preview, setPreview] = useState(null);
  // Fetch existing gallery data
  useEffect(() => {
    fetch(`http://localhost:5000/SingUpAdmin/singleGallery/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setInfo({ title: data.title, description: data.description });
      })
      .catch((err) => console.error("Error fetching gallery data:", err));
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Submit edited gallery
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }
    formData.append("title", info.title);
    formData.append("description", info.description);

    fetch(`http://localhost:5000/SingUpAdmin/editGallery/${id}`, {
      method: "PUT",
      body: formData,
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.msg === "Gallery updated successfully") {
          setShowSuccessDialog(true);
          setTimeout(() => {
            setShowSuccessDialog(false);
          }, 1500);
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
            <p>Gallery updated successfully!</p>
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
      <div className="flex flex-col overflow-hidden bg-white rounded-md shadow-lg max md:flex-row md:flex-1 lg:max-w-screen-md">
        <div className="p-5 bg-white md:flex-1">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
            <h3 className="my-4 text-2xl font-semibold text-gray-700">
              Edit Gallery
            </h3>
            <input
              type="text"
              name="title"
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-4 focus:ring-blue-200"
              onChange={handleChange}
              value={info.title}
              required
              placeholder="Enter gallery title"
            />
            <textarea
              name="description"
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-4 focus:ring-blue-200"
              onChange={handleChange}
              value={info.description}
              required
              placeholder="Enter gallery description"
            />
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
            {file && (
              <div className="mt-4">
                <p className="text-gray-600">Preview:</p>
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-lg shadow-md"
                />
              </div>
            )}
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            >
              {loading ? "Updating..." : "Update Gallery"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditGallery;
