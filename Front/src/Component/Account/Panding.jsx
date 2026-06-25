import React from "react";
import { FaClock } from "react-icons/fa";

const PendingProfile = () => {
  return (
    <section className="relative py-20 px-6 md:px-12 lg:px-24 flex items-center justify-center min-h-screen">
      <div className="max-w-2xl text-center bg-white p-8 rounded-xl shadow-lg">
        <FaClock className="text-primary text-6xl mx-auto" />
        <h2 className="text-3xl font-extrabold text-gray-900 mt-4">
          Your Profile is Awaiting Approval
        </h2>
        <p className="text-gray-700 mt-4 text-lg">
          Thank you for signing up! Your profile is currently under review by
          our admin team. You will be notified once it is approved.
        </p>
        <p className="text-gray-600 mt-2">
          If you have any questions, please contact support.
        </p>
      </div>
    </section>
  );
};

export default PendingProfile;
