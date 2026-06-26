import React, { useEffect, useState } from "react";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/SingUpAdmin/getblogs"
        );
        const data = await response.json();

        const updatedBlogs = data.map((blog) => ({
          ...blog,
          isExpanded: false,
        }));

        setBlogs(updatedBlogs);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const toggleContent = (id) => {
    setBlogs((prevBlogs) =>
      prevBlogs.map((blog) =>
        blog?.uniqueId === id ? { ...blog, isExpanded: !blog.isExpanded } : blog
      )
    );
  };

  const openBlog = (blog) => {
    setSelectedBlog(blog);
  };

  const closeBlog = () => {
    setSelectedBlog(null);
  };

  const getShortContent = (content, isExpanded) => {
    const words = content.split(" ");
    return isExpanded || words.length <= 60
      ? content
      : words.slice(0, 60).join(" ") + "...";
  };

  return (
    <section className="min-h-screen py-16  bg-gradient-to-r from-blue-50 to-white">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-16">
          <h3 className="text-sm uppercase tracking-widest font-semibold text-gray-500 flex items-center justify-center gap-2">
            <span>📰</span> Latest News <span>📰</span>
          </h3>
          <h2 className="text-4xl font-extrabold text-[#1a1a1a] font-serif mt-2">
            MU CSE Society <span className="text-primary">Blog</span>
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin border-t-4 border-blue-500 w-16 h-16 border-solid rounded-full"></div>
          </div>
        ) : (
          <div className="space-y-16">
            {blogs.map((blog) => (
              <article
                key={blog?.uniqueId}
                className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-300 cursor-pointer hover:shadow-xl transition-shadow duration-300"
                onClick={() => openBlog(blog)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openBlog(blog);
                  }
                }}
              >
                <img
                  src={blog?.imgUrl}
                  alt={blog?.blogTitle}
                  className="w-full h-[350px] object-cover object-center rounded-t-xl"
                />
                <div className="p-8">
                  <h2 className="text-3xl font-bold text-gray-900 font-serif mb-4">
                    {blog?.blogTitle}
                  </h2>
                  <p className="text-sm text-gray-600 italic mb-4">
                    By {blog?.authorName} •{" "}
                    {new Date(blog?.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>

                  <p className="text-gray-800 text-[16px] leading-relaxed">
                    {getShortContent(blog?.content, blog?.isExpanded)}
                    {blog?.content.split(" ")?.length > 60 && (
                      <span
                        className="text-indigo-600 cursor-pointer ml-2 font-medium"
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleContent(blog?.uniqueId);
                        }}
                      >
                        {blog?.isExpanded ? "Read less" : "Read more"}
                      </span>
                    )}
                  </p>
                  <p className="mt-4 text-indigo-600 font-semibold">
                    Read full article →
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {selectedBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <button
              type="button"
              onClick={closeBlog}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/90 px-3 py-2 text-xl text-gray-700 shadow hover:bg-gray-100"
              aria-label="Close blog"
            >
              ×
            </button>

            <img
              src={selectedBlog?.imgUrl}
              alt={selectedBlog?.blogTitle}
              className="h-72 w-full object-cover object-center"
            />

            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 font-serif mb-4">
                {selectedBlog?.blogTitle}
              </h2>
              <p className="text-sm text-gray-600 italic mb-6">
                By {selectedBlog?.authorName} •{" "}
                {new Date(selectedBlog?.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <div className="whitespace-pre-wrap text-[16px] leading-relaxed text-gray-800">
                {selectedBlog?.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Blogs;
