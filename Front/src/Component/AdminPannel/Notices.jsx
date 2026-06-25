import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Notice = () => {
  const [notices, setNotices] = useState([]);
  const [filteredNotices, setFilteredNotices] = useState([]);
  const [titleFilter, setTitleFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/SingUpAdmin/allNotice", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        setNotices(res);
        setFilteredNotices(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching notices:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = notices.filter((notice) => {
      return (
        (notice?.noticeTitle
          ?.toLowerCase()
          .includes(titleFilter.toLowerCase()) ||
          !titleFilter) &&
        (notice?.category === categoryFilter || !categoryFilter)
      );
    });
    setFilteredNotices(filtered);
  }, [titleFilter, categoryFilter, notices]);

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/SingUpAdmin/deleteNotice?id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setNotices((prevNotices) =>
            prevNotices.filter((notice) => notice.uniqueId !== id)
          );
          setFilteredNotices((prevFilteredNotices) =>
            prevFilteredNotices.filter((notice) => notice.uniqueId !== id)
          );
          setShowSuccessDialog(true);
          setTimeout(() => setShowSuccessDialog(false), 1500);
        } else {
          setShowRejectDialog(true);
          setTimeout(() => setShowRejectDialog(false), 1500);
        }
      })
      .catch((err) => {
        console.error("Error deleting notice:", err);
        alert("Something went wrong. Please try again.");
      });
  };

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-16 py-12">
      {showSuccessDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-green-500 text-white text-center px-6 py-4 rounded-lg shadow-lg">
            <p>Notice has been deleted</p>
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

      {loading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="w-16 h-16 border-8 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">All Notices</h2>

          <div className="mb-8 flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={titleFilter}
              onChange={(e) => setTitleFilter(e.target.value)}
              placeholder="Search by Title"
              className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-lg"
            />

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">All Categories</option>
              <option value="General">General</option>
              <option value="Event">Event</option>
              <option value="Announcement">Announcement</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredNotices?.map((notice, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg overflow-hidden"
              >
                <div className="w-full h-64 relative">
                  <img
                    src={notice?.imgUrl}
                    alt="Notice Cover"
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {notice?.noticeTitle}
                  </h3>
                  <p className="text-gray-600 mt-2">{notice?.category}</p>

                  <Link to={`/editnotice/${notice?.uniqueId}`} target="_blank">
                    <button className="mt-4 w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                      Edit
                    </button>
                  </Link>

                  <button
                    className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-700 transition"
                    onClick={() => handleDelete(notice?.uniqueId)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Notice;
