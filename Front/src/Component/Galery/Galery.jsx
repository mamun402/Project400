import React, { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import img1 from "../Image/Galery/img1.jpg";
import img2 from "../Image/Galery/img2.jpg";
import img3 from "../Image/Galery/img3.jpg";
import img4 from "../Image/Galery/img4.jpg";
import img5 from "../Image/Galery/img5.jpg";
import img6 from "../Image/Galery/img6.jpg";

const images = [img1, img2, img3, img4, img5, img6];

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ NEW: for full view modal
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

  return (
    <section className="relative bg-white py-20 px-6 md:px-12 lg:px-24">
      <div className="absolute top-10 left-6 w-10 h-10 bg-primary rounded-full blur-xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-16 right-10 w-14 h-14 bg-secondary rounded-full blur-xl opacity-20 animate-pulse"></div>

      <div className="max-w-7xl mx-auto text-center">
        <h3 className="text-secondary font-semibold text-sm uppercase tracking-widest flex justify-center items-center gap-2">
          <span>★</span> Gallery <span>★</span>
        </h3>
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-snug mt-3">
          Captured <span className="text-primary">Moments</span> of Impact
        </h2>
        <p className="text-gray-700 text-lg mt-5 leading-relaxed max-w-2xl mx-auto">
          Explore the impactful moments from our missionary work, where each
          picture tells a story of dedication, passion, and service.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-10 max-w-5xl mx-auto">
          {photos?.map((image, index) => (
            <div key={index} className="overflow-hidden rounded-lg shadow-lg">
              <img
                src={image?.imgUrl}
                alt={`Mission ${index + 1}`}
                className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105 cursor-pointer"
                onClick={() => setSelectedImage(image?.imgUrl)}
              />
            </div>
          ))}
        </div>

        <Link to="/fullgallery">
          <button className="mt-8 bg-primary text-white px-8 py-4 rounded-full shadow-lg text-lg font-medium flex items-center gap-3 mx-auto hover:scale-110 hover:shadow-xl transition-all duration-300 ease-in-out">
            View More <FaArrowRight className="text-lg" />
          </button>
        </Link>
      </div>

      {/* ✅ Full View Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-5xl w-full px-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-4 text-white text-3xl font-bold hover:text-red-500"
            >
              &times;
            </button>

            {/* Full Image */}
            <img
              src={selectedImage}
              alt="Full View"
              className="w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
