import React, { useContext, useEffect, useState } from "react";
import {
  FaEnvelope,
  FaFacebook,
  FaLinkedin,
  FaPhone,
  FaWhatsapp,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { userContext } from "../../App";
import ChangePassword from "./ChangePassword";
import { phoneToWhatsAppPath } from "../Common/PhoneInput";
const PP = ({ user }) => {
  const { setLogin, permissionsState, setPermissionsState } =
    useContext(userContext);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const designation = (user?.designation || "").trim().toLowerCase();
  const hideStudentFields = [
    "chief patron",
    "patron",
    "chief advisor",
    "advisor",
    "president",
    "treasurer",
  ].includes(designation);
  useEffect(() => {
    const role = localStorage.getItem("designation");

    fetch(`http://localhost:5000/SingUpAdmin/geRoletPermissions?role=${role}`)
      .then((res) => res.json())
      .then((data) => {
        setPermissionsState(data);
      })
      .catch((err) => {
        console.error("Error fetching permissions:", err);
      });
  }, []);
  return (
    <section className="relative bg-white py-20 px-6 md:px-12 lg:px-24">
      {/* Floating Decorative Elements */}
      <div className="absolute top-10 left-6 w-10 h-10 bg-primary rounded-full blur-xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-16 right-10 w-14 h-14 bg-red-500 rounded-full blur-xl opacity-20 animate-pulse"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] items-center gap-16">
        {/* Left Content - Profile Details */}
        <div className="text-left">
          <h3 className="text-secondary font-semibold text-sm uppercase tracking-widest flex items-center gap-2">
            <span>★</span> Profile Details <span>★</span>
          </h3>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-snug mt-3">
            <span className="text-primary">{user?.name}</span>
          </h2>

          <p className="text-gray-700 text-lg mt-5 leading-relaxed max-w-[600px]">
            {user?.designation} <br />
            {!hideStudentFields && (
              <>
                <span className="font-semibold text-gray-900">
                  Batch: {user?.batch}
                </span>{" "}
                <br />
                <span className="font-semibold text-gray-900">
                  Student id: {user?.id}
                </span>
              </>
            )}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Link to={`/editProfile/${user?.uniqueId}`}>
              <button className="bg-primary text-white px-8 py-4 rounded-full shadow-lg text-lg font-medium flex items-center gap-3 hover:scale-110 hover:shadow-xl transition-all duration-300 ease-in-out">
                Edit Profile
              </button>
            </Link>
            <button
              onClick={() => setShowChangePassword(true)}
              className="bg-secondary text-white px-8 py-4 rounded-full shadow-lg text-lg font-medium flex items-center gap-3 hover:scale-110 hover:shadow-xl transition-all duration-300 ease-in-out"
            >
              Change Password
            </button>
          </div>

          {/* Contact Info */}
          <div className="mt-10">
            <h3 className="text-xl font-semibold text-gray-900">
              Contact Info
            </h3>
            <div className="mt-4 text-gray-700 flex items-center gap-4">
              <FaEnvelope className="text-primary" />
              <p>{user?.email}</p>
            </div>
            <div className="mt-4 text-gray-700 flex items-center gap-4">
              <FaPhone className="text-primary" />
              <p>{user?.mobile}</p>
            </div>
            {user.linkedinId && (
              <div className="mt-4 text-gray-700 flex items-center gap-4">
                <FaLinkedin className="text-primary" />
                <a
                  href={user.linkedinId}
                  className="text-blue-500 font-medium hover:underline"
                >
                  View LinkedIn Profile
                </a>
              </div>
            )}

            {user.facebook && (
              <div className="mt-4 text-gray-700 flex items-center gap-4">
                <FaFacebook className="text-primary" />
                <a
                  href={user.facebook}
                  className="text-blue-500 font-medium hover:underline"
                >
                  View facebook Profile
                </a>
              </div>
            )}
            {user.whatsapp && (
              <div className="mt-4 text-gray-700 flex items-center gap-4">
                <FaWhatsapp className="text-primary" />
                <a
                  href={`https://wa.me/${phoneToWhatsAppPath(user.whatsapp)}`}
                  className="text-blue-500 font-medium hover:underline"
                >
                  View whatsapp
                </a>
              </div>
            )}
          </div>

          {/* Address Sections */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-gray-900">
              Address Information
            </h3>

            {/* Permanent Address */}
            <div className="mt-4 text-gray-700">
              <h4 className="text-lg font-medium">Permanent Address</h4>
              <p>{user?.permanentAddress || "Not Available"}</p>
            </div>

            {/* Current Address */}
            <div className="mt-4 text-gray-700">
              <h4 className="text-lg font-medium">Current Address</h4>
              <p>{user?.currentAddress || "Not Available"}</p>
            </div>
          </div>
        </div>

        {/* Right Content - Profile Picture */}
        <div className="relative flex justify-end">
          <div className="absolute -top-8 left-4 w-6 h-6 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="absolute -bottom-4 right-8 w-6 h-6 bg-red-500 rounded-full animate-spin"></div>

          {/* Profile Image */}
          <img
            src={user?.image || "https://via.placeholder.com/150"}
            alt="Profile"
            className="max-w-xs md:max-w-md drop-shadow-lg rounded-full"
          />
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <ChangePassword
          userEmail={user?.email}
          onClose={() => setShowChangePassword(false)}
        />
      )}
    </section>
  );
};

export default PP;
