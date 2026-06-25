import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ViewGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [expandedPhotoId, setExpandedPhotoId] = useState(null); // Track which photo description is expanded

  // Fetch gallery photos from API
  useEffect(() => {
    fetch("http://localhost:5000/SingUpAdmin/allPhotoGallery", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        setPhotos(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching gallery photos:", err);
        setLoading(false);
      });
  }, []);

  // Handle delete function
  const handleDelete = (id) => {
    fetch(`http://localhost:5000/SingUpAdmin/deletePhotoGallery?id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPhotos((prevPhotos) =>
            prevPhotos.filter((photo) => photo.uniqueId !== id)
          );
          setShowSuccessDialog(true);
          setTimeout(() => setShowSuccessDialog(false), 1500);
        } else {
          setShowRejectDialog(true);
          setTimeout(() => setShowRejectDialog(false), 1500);
        }
      })
      .catch((err) => {
        console.error("Error deleting photo:", err);
        alert("There was an issue. Please try again.");
      });
  };

  // Toggle description visibility
  const toggleDescription = (id) => {
    if (expandedPhotoId === id) {
      setExpandedPhotoId(null); // Collapse the description if already expanded
    } else {
      setExpandedPhotoId(id); // Expand the description
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-16 py-12">
      {/* Success Dialog */}
      {showSuccessDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-green-500 text-white text-center px-6 py-4 rounded-lg shadow-lg z-50">
            <p>The photo has been removed from the gallery.</p>
          </div>
        </div>
      )}

      {/* Error Dialog */}
      {showRejectDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-red-500 text-white text-center px-6 py-4 rounded-lg shadow-lg">
            <p>Sorry, please try again.</p>
          </div>
        </div>
      )}

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="w-16 h-16 border-8 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Gallery</h2>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {photos?.map((photo, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg overflow-hidden"
              >
                <div className="w-full h-64 relative">
                  <img
                    src={photo?.imgUrl}
                    alt={photo?.title}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {photo?.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 mt-2">
                    {expandedPhotoId === photo?.uniqueId
                      ? photo?.description
                      : `${photo?.description.substring(0, 100)}...`}
                  </p>

                  {/* See More / See Less Button */}
                  <button
                    className="text-sky-900 mt-2"
                    onClick={() => toggleDescription(photo?.uniqueId)}
                  >
                    {expandedPhotoId === photo?.uniqueId
                      ? "See Less"
                      : "See More"}
                  </button>

                  <Link to={`/editgallery/${photo?.uniqueId}`} target="_blank">
                    <button className="mt-4 w-full bg-sky-900 text-white py-2 rounded-lg hover:bg-sky-800 transition">
                      Edit
                    </button>
                  </Link>

                  <button
                    className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-500 transition"
                    onClick={() => handleDelete(photo?.uniqueId)}
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

export default ViewGallery;
