import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const EditNotice = () => {
  const [info, setInfo] = useState({
    noticeTitle: "",
    description: "",
    category: "",
  });
  const [file, setFile] = useState(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [preview, setPreview] = useState(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    // Fetch existing notice details
    fetch(`http://localhost:5000/SingUpAdmin/editnotice/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setInfo({
          noticeTitle: data.noticeTitle,
          description: data.description,
          category: data.category, // Ensure category is also set
        });
      })
      .catch((err) => console.error("Error fetching notice:", err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]); // Assign the selected file
      const file = e.target.files[0];
      setPreview(URL.createObjectURL(file)); // Preview the image
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate fields
    if (!info.noticeTitle || !info.description) {
      alert("অনুগ্রহ করে সব ক্ষেত্র পূরণ করুন।");
      setLoading(false);
      return;
    }

    // Prepare FormData
    const formData = new FormData();
    formData.append("noticeTitle", info.noticeTitle);
    formData.append("description", info.description);
    formData.append("category", info.category);

    if (file) {
      formData.append("file", file); // Ensure `file` is not null
    }

    fetch(`http://localhost:5000/SingUpAdmin/updatenotice/${id}`, {
      method: "PUT",
      body: formData,
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.msg === "Notice updated successfully") {
          setShowSuccessDialog(true);
          setTimeout(() => setShowSuccessDialog(false), 1500);
        } else {
          console.error("Server response:", response);
          alert(response.msg || "Something went wrong.");
        }
      })
      .catch((err) => {
        console.error("Error updating notice:", err);
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
            <p>Notice updated successfully.</p>
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
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">
          Edit Notice
        </h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Notice Title
            </label>
            <input
              type="text"
              name="noticeTitle"
              value={info.noticeTitle}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={handleChange} // Use onChange for real-time updates
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={info.description}
              className="w-full px-4 h-32 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={handleChange} // Use onChange for real-time updates
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Category
            </label>
            <select
              name="category"
              value={info.category}
              onChange={handleChange} // Use onChange for real-time updates
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="General">General</option>
              <option value="Event">Event</option>
              <option value="Announcement">Announcement</option>
            </select>
          </div>
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
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg"
          >
            {loading ? "Updating..." : "Update Notice"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditNotice;
