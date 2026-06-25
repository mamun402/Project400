// AddTastimonial.jsx
import React, { useEffect, useState } from "react";

const AddTastimonial = () => {
  // State for the testimonial text.
  const [testimonial, setTestimonial] = useState("");
  // State for profile data.
  const [profile, setProfile] = useState(null);
  // UI states for loading and notification dialogs.
  const [loading, setLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  // Fetch the user's profile.
  useEffect(() => {
    const username = localStorage.getItem("username");
    fetch("http://localhost:5000/Singup/Profile?email=" + username, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("Token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile(data[0]);
      })
      .catch((err) => console.error("Error fetching profile:", err));
  }, []);

  // Handle form submission.
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate: testimonial must not be empty.
    if (!testimonial) {
      alert("Please enter a testimonial.");
      setLoading(false);
      return;
    }

    // Ensure profile data is loaded.
    if (!profile) {
      alert("Profile not loaded yet. Please try again.");
      setLoading(false);
      return;
    }

    // Create the payload.
    const payload = {
      name: profile.name,
      designation: profile.designation,
      image: profile.image || "", // image URL already saved
      testimonial: testimonial,
    };

    // POST the data to your backend.
    fetch("http://localhost:5000/Singup/addtestimonial", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.msg === "Testimonial added successfully") {
          setShowSuccessDialog(true);
          setTestimonial(""); // Clear the input on success.
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
    <div className="min-h-screen py-10 px-4 flex justify-center items-start">
      {/* Success Dialog */}
      {showSuccessDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-green-500 text-white px-6 py-4 rounded-md shadow-md">
            Testimonial added successfully.
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
          ✨ Add New Testimonial
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Testimonial Input Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Testimonial
            </label>
            <textarea
              name="testimonial"
              rows={6}
              value={testimonial}
              onChange={(e) => setTestimonial(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Write your testimonial here..."
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            {loading ? "Uploading..." : "Submit Testimonial"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTastimonial;
