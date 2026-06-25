import React, { useEffect, useState } from "react";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

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
                className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-300"
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
                        onClick={() => toggleContent(blog?.uniqueId)}
                      >
                        {blog?.isExpanded ? "Read less" : "Read more"}
                      </span>
                    )}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Blogs;
