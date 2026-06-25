import React, { useEffect, useState } from "react";

const TestimonialSlider = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [loading, setLoading] = useState(true); // To handle loading state

  useEffect(() => {
    // Fetch the testimonials from the backend.
    fetch("http://localhost:5000/Singup/gettestimonials") // Adjust the URL accordingly
      .then((response) => response.json())
      .then((data) => {
        if (data.msg === "Testimonials retrieved successfully") {
          setTestimonials(data.testimonials);
          setLoading(false); // Set loading to false when data is fetched
        } else {
          console.error("No testimonials found");
          setLoading(false); // Stop loading if no testimonials are found
        }
      })
      .catch((err) => {
        console.error("Error fetching testimonials:", err);
        setLoading(false); // Stop loading if there’s an error
      });

    // Automatically change testimonial every 6 seconds
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [testimonials]);

  // Show a loading state while the testimonials are being fetched
  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <p>Loading testimonials...</p>
      </div>
    );
  }

  // Render the testimonial slider only if testimonials are available
  if (testimonials.length === 0) {
    return (
      <div className="flex justify-center items-center py-16">
        <p>No testimonials available.</p>
      </div>
    );
  }

  return (
    <section className="bg-[#F4F9FF] py-16 px-6 md:px-12 lg:px-24 relative">
      {/* Floating Decorative Elements */}
      <div className="absolute top-10 left-10 w-8 h-8 bg-primary rounded-full blur-xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-12 h-12 bg-secondary rounded-full blur-xl opacity-20 animate-pulse"></div>

      {/* Heading */}
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h3 className="text-primary font-semibold text-sm uppercase tracking-widest mb-4">
          ★ Testimonial from Our Committee Members ★
        </h3>
        <h2 className="text-4xl font-extrabold text-gray-900">
          What Our Leaders Have to Say
        </h2>
      </div>

      {/* Testimonial Slider */}
      <div className="max-w-7xl mx-auto flex justify-center items-center relative">
        <div className="w-full bg-white p-8 rounded-xl shadow-xl transition-all duration-500 ease-in-out transform hover:scale-105">
          {/* Sliding Animation */}
          <div
            className="opacity-0 transition-opacity duration-700 absolute inset-0 bg-gray-100 rounded-xl"
            style={{
              animation: "fadeIn 1s ease-in-out",
            }}
          ></div>

          <div className="flex justify-center mb-6 mt-12">
            <img
              src={testimonials[currentTestimonial].image}
              alt={testimonials[currentTestimonial].name}
              className="w-32 h-32 object-cover rounded-full shadow-lg border-4 border-primary"
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">
            {testimonials[currentTestimonial].name}
          </h3>
          <p className="text-lg text-gray-600">
            {testimonials[currentTestimonial].designation}
          </p>
          <p className="mt-4 text-gray-500 italic text-lg">
            "{testimonials[currentTestimonial].testimonial}"
          </p>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() =>
            setCurrentTestimonial(
              (currentTestimonial - 1 + testimonials.length) %
                testimonials.length
            )
          }
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-primary text-white p-3 rounded-full hover:bg-primary-dark transition-all duration-300"
        >
          &lt;
        </button>
        <button
          onClick={() =>
            setCurrentTestimonial(
              (currentTestimonial + 1) % testimonials.length
            )
          }
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-primary text-white p-3 rounded-full hover:bg-primary-dark transition-all duration-300"
        >
          &gt;
        </button>
      </div>

      {/* Optional: Add transition to fade the images */}
      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </section>
  );
};

export default TestimonialSlider;
