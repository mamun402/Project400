import React from "react";
import { FaArrowRight } from "react-icons/fa";
import image1 from "../Image/HeroSection/image1.jpg";
import image2 from "../Image/HeroSection/image2.jpg";
import image3 from "../Image/HeroSection/image3.jpg";
import image4 from "../Image/HeroSection/image4.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-r from-blue-50 to-white">
      {/* Floating Decorative Elements */}
      <div className="absolute top-10 left-6 w-10 h-10 bg-primary rounded-full blur-xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-16 right-10 w-14 h-14 bg-secondary rounded-full blur-xl opacity-20 animate-pulse"></div>

      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Side - Text Content */}
        <div className="text-center md:text-left space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold  leading-tight">
            Welcome to <span className="text-secondary">MU</span>{" "}
            <span className="text-primary">CSE Society</span>
          </h1>
          <p className="text-gray-700 text-lg md:text-xl">
            Join a community driven by technology and creativity. Participate in
            workshops, hackathons, and programming contests to sharpen your
            skills and connect with fellow tech enthusiasts!
          </p>
        </div>

        {/* Right Side - Photo Gallery */}
        <div className="relative grid grid-cols-2 grid-rows-2 gap-4">
          {/* Floating Icons */}
          <div className="absolute -top-8 left-4 w-6 h-6 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="absolute -bottom-4 right-8 w-6 h-6 bg-red-500 rounded-full animate-spin"></div>

          <img
            src={image1}
            alt="Tech Event"
            className="rounded-lg shadow-lg w-full h-auto object-cover transform rotate-2 hover:rotate-0 transition-all duration-300"
          />
          <img
            src={image2}
            alt="Group Work"
            className="rounded-lg shadow-lg w-full h-auto object-cover transform -rotate-2 hover:rotate-0 transition-all duration-300"
          />
          <img
            src={image3}
            alt="Coding Team"
            className="rounded-lg shadow-lg w-full h-auto object-cover transform -rotate-3 hover:rotate-0 transition-all duration-300"
          />
          <img
            src={image4}
            alt="University Event"
            className="rounded-lg shadow-lg w-full h-auto object-cover transform rotate-3 hover:rotate-0 transition-all duration-300"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
