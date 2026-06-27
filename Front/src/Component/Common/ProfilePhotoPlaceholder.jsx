import React from "react";

const ProfilePhotoPlaceholder = ({ className = "" }) => {
  return (
    <div className={`relative mx-auto flex items-center justify-center ${className}`}>
      <div className="relative h-24 w-24 overflow-hidden rounded-full border border-gray-300 bg-gray-100 shadow-inner">
        <div className="absolute left-1/2 top-3 h-10 w-10 -translate-x-1/2 rounded-full bg-gray-400" />
        <div className="absolute bottom-0 left-1/2 h-12 w-20 -translate-x-1/2 rounded-t-full bg-gray-400" />
      </div>
    </div>
  );
};

export default ProfilePhotoPlaceholder;
