import React, { useEffect, useState } from "react";

const getNoticeTimestamp = (notice) => {
  const candidates = [notice?.createdAt, notice?.updatedAt, notice?.date, notice?.displayDate];

  for (const raw of candidates) {
    if (!raw) continue;

    const parsed = new Date(raw);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.getTime();
    }
  }

  if (notice?._id && typeof notice._id === "string" && notice._id.length === 24) {
    try {
      const objectIdTimestamp = parseInt(notice._id.substring(0, 8), 16) * 1000;
      const parsed = new Date(objectIdTimestamp);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed.getTime();
      }
    } catch (error) {
      console.error("Could not derive notice timestamp from ObjectId:", error);
    }
  }

  return 0;
};

const formatNoticeDate = (notice) => {
  const timestamp = getNoticeTimestamp(notice);
  if (!timestamp) {
    return "";
  }

  return `${new Date(timestamp).toLocaleString("en-GB", {
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
  const [sortOrder, setSortOrder] = useState("latest");
  const [selectedNotice, setSelectedNotice] = useState(null);

  const handleOpenNotice = (notice) => {
    setSelectedNotice(notice);
  };

  const handleCloseNotice = () => {
    setSelectedNotice(null);
  };

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await fetch("http://localhost:5000/SingUpAdmin/allNotice");
        const data = await response.json();
        if (data && Array.isArray(data)) {
          setNotices([...data]);
        }
      } catch (error) {
        console.error("Error fetching notices:", error);
      }
    };

    fetchNotices();
  }, []);

  const sortedNotices = [...notices].sort((a, b) => {
    const diff = getNoticeTimestamp(b) - getNoticeTimestamp(a);
    return sortOrder === "latest" ? diff : -diff;
  });

  if (notices.length === 0) {
    return (
      <section className="relative bg-[#F4F9FF] px-6 py-12 md:px-12 lg:px-24">
        <div className="mx-auto max-w-7xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-lg font-medium text-slate-700">Loading notices...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-[#F4F9FF] px-6 py-12 md:px-12 lg:px-24">
      <div className="absolute left-6 top-6 h-12 w-12 rounded-full bg-primary opacity-30 blur-xl animate-pulse"></div>
      <div className="absolute bottom-6 right-10 h-10 w-10 rounded-full bg-red-500 opacity-20 blur-xl animate-pulse"></div>

      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-secondary">
              <span>★</span> Important Notices <span>★</span>
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Browse all notices and stay informed about the latest updates and announcements from our society.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-600" htmlFor="notice-sort">
              Sort by
            </label>
            <select
              id="notice-sort"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="rounded-full border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-primary"
            >
              <option value="latest">Latest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>
        </div>

        <div className="space-y-5">
          {sortedNotices.map((notice) => {
            const noticeDate = formatNoticeDate(notice);
            return (
              <button
                key={notice._id || notice.id}
                type="button"
                onClick={() => handleOpenNotice(notice)}
                className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg md:p-6"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-start">
                  <img
                    src={notice.imgUrl}
                    alt={notice.noticeTitle}
                    className="h-48 w-full rounded-xl object-cover shadow-sm md:h-40 md:w-56"
                  />

                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                        {notice.category || "Notice"}
                      </span>
                      {noticeDate ? (
                        <span className="text-sm text-slate-500">{noticeDate}</span>
                      ) : null}
                    </div>
                    <h4 className="text-xl font-semibold text-slate-900">
                      {notice.noticeTitle}
                    </h4>
                    <p className="mt-3 text-base leading-7 text-slate-700">
                      {notice.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedNotice ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
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
              {selectedNotice.category || "Notice"}
            </p>
            <p className="mb-4 whitespace-pre-line text-lg text-gray-800">
              {selectedNotice.description}
            </p>
            <p className="text-sm text-gray-500">{formatNoticeDate(selectedNotice)}</p>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default Notice;
