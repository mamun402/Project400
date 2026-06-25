import React from "react";
import { FaArrowRight } from "react-icons/fa";
import Cap from "../Image/About/GraduatiionCap.png";

const About = () => {
  return (
    <section className="relative bg-white py-20 px-6 md:px-12 lg:px-24">
      {/* Floating Decorative Elements */}
      <div className="absolute top-10 left-6 w-10 h-10 bg-primary rounded-full blur-xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-16 right-10 w-14 h-14 bg-red-500 rounded-full blur-xl opacity-20 animate-pulse"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] items-center gap-16">
        {/* Left Content */}
        <div className="text-left">
          <h3 className="text-secondary font-semibold text-sm uppercase tracking-widest flex items-center gap-2">
            <span>★</span> About Us <span>★</span>
          </h3>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-snug mt-3">
            <span className="text-primary">Shaping</span> the Future of Computer
            Science at <span className="text-secondary">MU CSE Society</span>
          </h2>

          <p className="text-gray-700 text-lg mt-5 leading-relaxed max-w-[600px]">
            MU CSE Society is a non-political organization dedicated to
            promoting the advancement of computer science. We bring together
            students, faculty, and professionals to explore the latest trends,
            enhance skills, and foster innovation.
            <br />
            <span className="font-semibold text-gray-900">
              Join us in shaping the future of technology!
            </span>
          </p>
        </div>

        {/* Right Content - Image */}
        <div className="relative flex justify-end">
          {/* Floating Icons */}
          <div className="absolute -top-8 left-4 w-6 h-6 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="absolute -bottom-4 right-8 w-6 h-6 bg-red-500 rounded-full animate-spin"></div>

          <img
            src={Cap}
            alt="Graduation Cap"
            className="max-w-xs md:max-w-md drop-shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default About;
