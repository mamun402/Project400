import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const getNoticeTimestamp = (notice) => {
  const raw = notice?.createdAt || notice?.date;
  const parsed = raw ? new Date(raw) : null;
  if (!parsed || Number.isNaN(parsed.getTime())) {
    return 0;
  }
  return parsed.getTime();
};

const formatNoticeDate = (notice) => {
  const raw = notice?.createdAt || notice?.date;
  const parsed = raw ? new Date(raw) : null;
  if (!parsed || Number.isNaN(parsed.getTime())) {
    return "";
  }

  return `${parsed.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })}`;
};

const Notice = () => {
  const [notices, setNotices] = useState([]);
  const [currentNotice, setCurrentNotice] = useState(0);
  const [selectedNotice, setSelectedNotice] = useState(null);

  const handleOpenNotice = (notice) => {
    setSelectedNotice(notice);
  };

  const handleCloseNotice = () => {
    setSelectedNotice(null);
  };

  useEffect(() => {
    // Fetch notices from the backend
    const fetchNotices = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/SingUpAdmin/allNotice"
        ); // Adjust the endpoint based on your server
        const data = await response.json();
        if (data && Array.isArray(data)) {
          const sortedNotices = [...data].sort(
            (a, b) => getNoticeTimestamp(b) - getNoticeTimestamp(a)
          );
          setNotices(sortedNotices);
          setCurrentNotice(0);
        }
      } catch (error) {
        console.error("Error fetching notices:", error);
      }
    };

    fetchNotices();
  }, []);

  useEffect(() => {
    if (notices.length === 0) {
      return undefined;
    }
    const interval = setInterval(() => {
      setCurrentNotice((prev) => (prev + 1) % notices.length);
    }, 5000); // Change notice every 5 seconds

    return () => clearInterval(interval);
  }, [notices.length]);

  if (notices.length === 0) {
    return <p>Loading notices...</p>;
  }
  const activeNotice = notices[currentNotice];
  const activeNoticeDate = formatNoticeDate(activeNotice);

  return (
    <section className="relative bg-[#F4F9FF] py-12 px-6 md:px-12 lg:px-24">
      <div className="absolute top-6 left-6 w-12 h-12 bg-primary rounded-full blur-xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-6 right-10 w-10 h-10 bg-red-500 rounded-full blur-xl opacity-20 animate-pulse"></div>

      <div className="max-w-7xl mx-auto">
        <div className="relative">
          <button
            onClick={() =>
              setCurrentNotice(
                (currentNotice - 1 + notices.length) % notices.length
              )
            }
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-blue-200 bg-white/90 p-3 text-blue-600 shadow-lg hover:text-blue-800"
            aria-label="Previous notice"
          >
            <FaArrowLeft className="text-xl" />
          </button>

          <button
            onClick={() =>
              setCurrentNotice((currentNotice + 1) % notices.length)
            }
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-blue-200 bg-white/90 p-3 text-blue-600 shadow-lg hover:text-blue-800"
            aria-label="Next notice"
          >
            <FaArrowRight className="text-xl" />
          </button>

          <div className="bg-white rounded-xl shadow-2xl p-6 md:px-12 md:py-8 relative overflow-hidden transform hover:scale-105 transition-all duration-300">
            <h3 className="text-secondary font-semibold text-sm uppercase tracking-widest text-center mb-4">
              <span>★</span> Important Notices <span>★</span>
            </h3>

            <div className="flex items-center justify-center gap-4">
              {/* Notice Content */}
              <button
                type="button"
                onClick={() => handleOpenNotice(notices[currentNotice])}
                className="flex flex-1 flex-col md:flex-row items-start gap-8 min-w-0 text-left bg-transparent border-0 p-0 cursor-pointer"
              >
                <img
                  src={notices[currentNotice].imgUrl}
                  alt="Notice"
                  className="w-72 h-72 object-cover rounded-md shadow-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0 text-center md:text-left">
                  <h4 className="text-2xl font-semibold text-gray-900 mb-2">
                    {notices[currentNotice].noticeTitle}
                  </h4>
                  <p className="text-lg text-gray-800 mb-4">
                    {notices[currentNotice].description}
                  </p>
                  <p className="text-sm text-gray-600 italic">
                    {notices[currentNotice].category}
                  </p>
                </div>
              </button>
            </div>
            {activeNoticeDate ? (
              <div className="absolute bottom-4 right-12 text-xs text-gray-600">
                {activeNoticeDate}
              </div>
            ) : null}

            {/* Notice Button */}
            {/* <div className="mt-4 text-center">
              <button className="bg-primary text-white px-6 py-3 rounded-full shadow-lg text-lg font-medium flex items-center justify-center gap-2 hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out">
                View All Notices <FaArrowRight className="text-lg" />
              </button>
            </div> */}
          </div>
        </div>
      </div>

      {selectedNotice ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={handleCloseNotice}
              className="absolute right-4 top-4 text-xl text-gray-500 hover:text-gray-800"
              aria-label="Close notice"
            >
              ×
            </button>

            <img
              src={selectedNotice.imgUrl}
              alt={selectedNotice.noticeTitle}
              className="mb-4 h-72 w-full rounded-lg object-cover"
            />
            <h4 className="mb-2 text-2xl font-semibold text-gray-900">
              {selectedNotice.noticeTitle}
            </h4>
            <p className="mb-4 text-sm text-gray-600 italic">
              {selectedNotice.category}
            </p>
            <p className="mb-4 whitespace-pre-line text-lg text-gray-800">
              {selectedNotice.description}
            </p>
            <p className="text-sm text-gray-500">
              {activeNoticeDate}
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default Notice;
