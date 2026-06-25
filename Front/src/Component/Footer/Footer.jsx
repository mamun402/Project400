import React from "react";
import { FaFacebookF, FaLinkedinIn, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <section className="bg-white py-16 px-4">
      {/* Floating Decorative Elements */}
      <div className="absolute top-10 left-6 w-10 h-10 bg-primary rounded-full blur-xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-16 right-10 w-14 h-14 bg-secondary rounded-full blur-xl opacity-20 animate-pulse"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
        {/* Left Side - About Section */}
        <div className="space-y-6 text-gray-800">
          <h3 className="text-3xl font-extrabold text-primary">About Us</h3>
          <p className="text-lg md:text-base">
            We are a vibrant community of tech enthusiasts, providing workshops,
            hackathons, and career guidance to help shape the future of Computer
            Science.
          </p>
          <p className="text-lg md:text-base">
            Join us and get involved in building your skills and network.
          </p>
        </div>

        {/* Center - Quick Links */}
        <div className="space-y-6 text-gray-800">
          <h3 className="text-3xl font-extrabold text-primary">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a
                href="http://localhost:5173/"
                className="hover:text-primary transition-all duration-300"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="http://localhost:5173/event"
                className="hover:text-primary transition-all duration-300"
              >
                Events
              </a>
            </li>
            <li>
              <a
                href="#about"
                className="hover:text-primary transition-all duration-300"
              >
                About Us
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="hover:text-primary transition-all duration-300"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Right Side - Social Media */}
        <div className="space-y-6 text-gray-800">
          <h3 className="text-3xl font-extrabold text-primary">Follow Us</h3>
          <div className="flex justify-center md:justify-start gap-6">
            <a
              href="https://www.facebook.com/mucses"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 transition-all duration-300"
            >
              <FaFacebookF className="text-4xl" />
            </a>
            <a
              href="https://www.instagram.com/mucses"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-700 transition-all duration-300"
            >
              <FaInstagram className="text-4xl" />
            </a>
            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-400 transition-all duration-300"
            >
              <FaTwitter className="text-4xl" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section - Copyright */}
      <div className="text-center mt-12 text-gray-600">
        <p className="text-sm">&copy; 2025 CSE Society. All Rights Reserved.</p>
      </div>
    </section>
  );
};

export default Footer;
