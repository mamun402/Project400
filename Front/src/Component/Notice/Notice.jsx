import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const getNoticeTimestamp = (notice) => {
  const raw = notice?.date || notice?.createdAt;
  const parsed = raw ? new Date(raw) : null;
  if (!parsed || Number.isNaN(parsed.getTime())) {
    return 0;
  }
  return parsed.getTime();
};

const formatNoticeDate = (notice) => {
  const raw = notice?.date || notice?.createdAt;
  const parsed = raw ? new Date(raw) : null;
  if (!parsed || Number.isNaN(parsed.getTime())) {
    return "";
  }
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsed);
};

const Notice = () => {
  const [notices, setNotices] = useState([]);
  const [currentNotice, setCurrentNotice] = useState(0);

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
        <div className="bg-white rounded-xl shadow-2xl p-6 md:px-12 md:py-8 relative overflow-hidden transform hover:scale-105 transition-all duration-300">
          <h3 className="text-secondary font-semibold text-sm uppercase tracking-widest text-center mb-4">
            <span>★</span> Important Notices <span>★</span>
          </h3>

          <div className="flex justify-between items-center">
            {/* Previous Notice Arrow */}
            <button
              onClick={() =>
                setCurrentNotice(
                  (currentNotice - 1 + notices.length) % notices.length
                )
              }
              className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
              aria-label="Previous notice"
            >
              <FaArrowLeft className="text-xl" />
            </button>

            {/* Notice Content */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <img
                src={notices[currentNotice].imgUrl}
                alt="Notice"
                className="w-72 h-72 object-cover rounded-md shadow-lg"
              />
              <div className="text-center md:text-left">
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
            </div>

            {/* Next Notice Arrow */}
            <button
              onClick={() =>
                setCurrentNotice((currentNotice + 1) % notices.length)
              }
              className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
              aria-label="Next notice"
            >
              <FaArrowRight className="text-xl" />
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
    </section>
  );
};

export default Notice;
