import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaFacebook, FaLinkedin, FaWhatsapp } from "react-icons/fa";

const Alumni = () => {
  const [alumniData, setAlumniData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true); // Loading state to manage loading indication

  // Fetch alumni data when the component mounts
  useEffect(() => {
    axios
      .get("http://localhost:5000/Singup/allalumni")
      .then((response) => {
        setAlumniData(response.data); // Set the data from backend to state
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch((error) => {
        console.error("Error fetching alumni data:", error);
        setLoading(false); // Set loading to false in case of error
      });
  }, []);

  // Filter alumni based on search term
  const filteredAlumni = alumniData.filter((alumni) =>
    alumni.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="relative bg-white py-20 px-6 md:px-12 lg:px-24">
      {/* Floating Decorative Elements */}
      <div className="absolute top-10 left-6 w-10 h-10 bg-primary rounded-full blur-xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-16 right-10 w-14 h-14 bg-red-500 rounded-full blur-xl opacity-20 animate-pulse"></div>

      <div className="max-w-7xl mx-auto text-center">
        <h3 className="text-secondary font-semibold text-sm uppercase tracking-widest flex items-center justify-center gap-2">
          <span>★</span> Our Alumni <span>★</span>
        </h3>
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-snug mt-3">
          <span className="text-primary">Inspiring</span> Journeys of Our
          <span className="text-secondary"> Alumni</span>
        </h2>

        {/* Search Bar */}
        <div className="mt-8 flex justify-center">
          <input
            type="text"
            placeholder="Filter by position (e.g., Web Developer)"
            className="w-full max-w-lg p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Alumni Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div>Loading...</div> // Show loading message while fetching data
          ) : (
            filteredAlumni.map((alumni) => (
              <div
                key={alumni.uniqueId}
                className="bg-white shadow-lg rounded-lg p-6 text-center border border-gray-200 hover:shadow-xl transition-all"
              >
                <img
                  src={alumni.image ? `${alumni.image}` : "default_image_url"} // Use the image path from backend
                  alt={alumni.name}
                  className="w-24 h-24 mx-auto rounded-full mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-900">
                  {alumni.name}
                </h3>
                <p className="text-gray-600 text-sm">{alumni.designation}</p>
                <p className="text-gray-500 text-sm font-medium">
                  {alumni.currentEmployer}
                </p>
                <div className="flex justify-center gap-4 mt-4">
                  <a
                    href={alumni?.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaFacebook className="text-blue-600 text-xl" />
                  </a>
                  <a
                    href={alumni?.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaLinkedin className="text-blue-500 text-xl" />
                  </a>
                  <a
                    href={`https://wa.me/${alumni.whatsapp}`} // Format for WhatsApp link
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaWhatsapp className="text-green-500 text-xl" />
                  </a>
                </div>
                <p className="text-gray-600 text-sm mt-2">{alumni.email}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Alumni;
