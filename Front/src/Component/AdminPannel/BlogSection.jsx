import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [blogNameFilter, setBlogNameFilter] = useState("");
  const [authorNameFilter, setAuthorNameFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/SingUpAdmin/getblogs", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        setBlogs(res);
        setFilteredBlogs(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blogs:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = blogs.filter((blog) => {
      return (
        (blog?.blogTitle
          ?.toLowerCase()
          .includes(blogNameFilter?.toLowerCase()) ||
          !blogNameFilter) &&
        (blog?.authorName
          ?.toLowerCase()
          .includes(authorNameFilter?.toLowerCase()) ||
          !authorNameFilter) &&
        (dateFilter
          ? new Date(blog?.date).toLocaleDateString("en-US") ===
            new Date(dateFilter).toLocaleDateString("en-US")
          : true)
      );
    });
    setFilteredBlogs(filtered);
  }, [blogNameFilter, authorNameFilter, dateFilter, blogs]);

  const handleDelete = (id) => {
    setLoading(true);
    fetch(`http://localhost:5000/SingUpAdmin/deleteBlogs?id=${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBlogs((prevBlogs) =>
            prevBlogs.filter((blog) => blog.uniqueId !== id)
          );
          setFilteredBlogs((prevFilteredBlogs) =>
            prevFilteredBlogs.filter((blog) => blog.uniqueId !== id)
          );
          setShowSuccessDialog(true);
          setTimeout(() => setShowSuccessDialog(false), 1500);
        } else {
          setShowRejectDialog(true);
          setTimeout(() => setShowRejectDialog(false), 1500);
        }
      })
      .catch((err) => {
        console.error("Error deleting blog:", err);
        alert("An error occurred. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-16 py-12">
      {showSuccessDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-green-500 text-white text-center px-6 py-4 rounded-lg shadow-lg">
            <p>Blog has been deleted successfully</p>
          </div>
        </div>
      )}
      {showRejectDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-red-500 text-white text-center px-6 py-4 rounded-lg shadow-lg">
            <p>Sorry, something went wrong. Please try again</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="w-16 h-16 border-8 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">All Blogs</h2>

          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={blogNameFilter}
                onChange={(e) => setBlogNameFilter(e.target.value)}
                placeholder="Search by Blog Title"
                className="w-full sm:w-1/3 px-4 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                value={authorNameFilter}
                onChange={(e) => setAuthorNameFilter(e.target.value)}
                placeholder="Search by Author Name"
                className="w-full sm:w-1/3 px-4 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full sm:w-1/3 px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredBlogs?.map((blog, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg overflow-hidden"
              >
                <div className="w-full h-64 relative">
                  <img
                    src={blog?.imgUrl}
                    alt="Blog Cover"
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {blog?.blogTitle}
                  </h3>
                  <p className="text-gray-600 mt-2">{blog?.authorName}</p>
                  <p className="text-gray-500 mt-2">
                    {new Date(blog?.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <Link to={`/editblogs/${blog?.uniqueId}`} target="_blank">
                    <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500 transition">
                      Edit
                    </button>
                  </Link>
                  <button
                    className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-500 transition"
                    onClick={() => handleDelete(blog?.uniqueId)}
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

export default Blogs;
