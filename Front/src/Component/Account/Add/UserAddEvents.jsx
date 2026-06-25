import React, { useState } from "react";

const UserAddEvents = () => {
  const [info, setInfo] = useState({
    eventname: "",
    organizer: "",
    description: "",
    eventDate: "",
    eventTime: "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setFile(null);
      setPreview(null);
      alert("Please upload a valid image file.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (
      !info.eventname ||
      !info.organizer ||
      !info.description ||
      !info.eventDate ||
      !info.eventTime
    ) {
      alert("Please fill in all fields.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    Object.entries(info).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (file) {
      formData.append("file", file);
    }

    fetch("http://localhost:5000/SingUpAdmin/addevent", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.msg === "Event added successfully") {
          setShowSuccessDialog(true);
          setTimeout(() => setShowSuccessDialog(false), 2000);
          setInfo({
            eventname: "",
            organizer: "",
            description: "",
            eventDate: "",
            eventTime: "",
          });
          setFile(null);
          setPreview(null);
        } else {
          throw new Error("Failed");
        }
      })
      .catch(() => {
        setShowRejectDialog(true);
        setTimeout(() => setShowRejectDialog(false), 2000);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-6 ">
      {/* Success Dialog */}
      {showSuccessDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-green-500 text-white text-center px-6 py-4 rounded-lg shadow-lg">
            <p>Event added successfully.</p>
          </div>
        </div>
      )}

      {/* Error Dialog */}
      {showRejectDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-red-500 text-white text-center px-6 py-4 rounded-lg shadow-lg">
            <p>Sorry, something went wrong. Please try again.</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">
          Add New Event
        </h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Event Name
            </label>
            <input
              type="text"
              name="eventname"
              value={info.eventname}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter Event Name"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Organizer
            </label>
            <input
              type="text"
              name="organizer"
              value={info.organizer}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter Organizer Name"
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
              onChange={handleChange}
              className="w-full px-4 h-32 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter Event Description"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Event Date
            </label>
            <input
              type="date"
              name="eventDate"
              value={info.eventDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Event Time
            </label>
            <input
              type="time"
              name="eventTime"
              value={info.eventTime}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="w-full px-3 mb-8 flex flex-col items-center">
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-4 w-full max-w-xs rounded-lg shadow-lg mx-auto mb-10"
              />
            )}
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
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <span className="text-gray-600">Upload Event Poster</span>
            </label>
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded w-full"
          >
            {loading ? "Uploading..." : "Upload Event"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserAddEvents;
