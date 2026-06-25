import React, { useEffect, useState } from "react";

const FullGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/SingUpAdmin/allPhotoGallery")
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

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <section className="relative bg-gradient-to-b from-blue-50 to-indigo-100 py-20 px-6 md:px-12 lg:px-24 overflow-hidden">
      {/* Background Glows & Bouncing Ball */}
      <div className="absolute top-10 left-6 w-10 h-10 bg-primary rounded-full blur-xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-16 right-10 w-14 h-14 bg-secondary rounded-full blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute left-1/2 top-0 h-1 w-40 bg-gradient-to-r from-blue-500 to-indigo-500 transform -translate-x-1/2"></div>
      <div className="absolute left-1/3 top-10 w-20 h-1 bg-indigo-400 rotate-45"></div>
      <div className="absolute right-1/3 bottom-10 w-20 h-1 bg-blue-400 -rotate-45"></div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <h3 className="text-indigo-600 font-semibold text-sm uppercase tracking-widest flex justify-center items-center gap-2">
          <span>★</span> Our Gallery <span>★</span>
        </h3>
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-snug mt-3">
          Capturing <span className="text-blue-600">Memorable Moments</span>
        </h2>
        <p className="text-gray-700 text-lg mt-5 leading-relaxed max-w-2xl mx-auto">
          Discover the moments that define our journey. Each image tells a
          unique story of passion and dedication.
        </p>

        {loading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="w-16 h-16 border-8 border-blue-500 border-dashed rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="flex flex-col gap-10 mt-12">
            {photos?.map((photo, index) => (
              <div
                key={index}
                className={`relative group flex flex-col md:flex-row items-center gap-6 p-6 bg-white shadow-lg rounded-xl hover:shadow-2xl transition-all duration-300 ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className="w-full md:w-1/2">
                  <img
                    src={photo?.imgUrl}
                    alt={photo?.title}
                    className="w-full h-72 object-cover rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
                    onClick={() => setSelectedImage(photo?.imgUrl)}
                  />
                </div>
                <div className="w-full md:w-1/2 text-center md:text-left">
                  <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {photo?.title}
                  </h3>
                  <p className="text-gray-600 mt-2 text-sm">
                    {photo?.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
          onClick={closeModal}
        >
          <div
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              className="absolute -top-10 right-0 text-white text-3xl font-bold hover:text-red-400"
            >
              &times;
            </button>
            <img
              src={selectedImage}
              alt="Full view"
              className="w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default FullGallery;
