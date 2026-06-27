import React, { useEffect, useState } from "react";
import {
  FaArrowRight,
  FaFacebook,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa";
import { phoneToWhatsAppPath } from "../Common/PhoneInput";
const Committee = () => {
  const [members, setMembers] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedYearRange, setSelectedYearRange] = useState("");
  const [selectedYear, setSelectedYear] = useState(""); // Store selected year
  const [visibleMembers, setVisibleMembers] = useState(6); // Initially display 6 members

  const designationOrder = [
    "Chief Patron",
    "Patron",
    "Chief Advisor",
    "Advisor",
    "President",
    "Treasurer",
    "Student Advisor",
    "Senior Vice President",
    "Vice President",
    "General Secretary",
    "Joint Secretary",
    "Organizing Secretary",
    "Student Secretary",
    "ACM Coordinator",
    "Office Secretary",
    "Public Relations Secretary",
    "Publication Secretary",
    "Resource Secretary",
    "Web & Design Secretary",
    "Cyber Security Coordinator",
    "Sports Secretary",
    "Cultural Secretary",
    "Finance Executive",
    "Senior Executive Member",
    "Executive Member",
  ];

  useEffect(() => {
    fetch("http://localhost:5000/SingUpAdmin/AllExecutiveprofile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("Token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setMembers(data))
      .catch((err) => console.error("Error fetching members:", err));
  }, []);

  const generateYearRanges = () => {
    const ranges = [];
    const currentYear = new Date().getFullYear();
    for (let i = currentYear + 1; i >= currentYear - 10; i--) {
      ranges.push(`${i - 1}-${i}`);
    }
    return ranges;
  };

  const filteredMembers = selectedYear
    ? members.filter((member) => {
        const [startYear, endYear] = selectedYear.split("-").map(Number);
        const memberStart = new Date(member.startDate).getFullYear();
        const memberEnd = new Date(member.endDate).getFullYear();
        return memberStart === startYear && memberEnd === endYear;
      })
    : members;

  const loadMoreMembers = () => {
    setVisibleMembers((prev) => prev + 6);
  };
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    setSelectedYear(`${currentYear - 1}-${currentYear}`);
  }, []);

  return (
    <section className="relative bg-white py-20 px-6 md:px-12 lg:px-24">
      {/* Floating Decorative Elements */}
      <div className="absolute top-10 left-6 w-10 h-10 bg-primary rounded-full blur-xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-16 right-10 w-14 h-14 bg-red-500 rounded-full blur-xl opacity-20 animate-pulse"></div>

      <div className="max-w-7xl mx-auto text-center">
        <h3 className="text-secondary font-semibold text-sm uppercase tracking-widest mb-6">
          ★ Meet Our Committee ★
        </h3>
        <h2 className="text-4xl font-extrabold text-gray-900 mb-12">
          Members of MU CSE Society
        </h2>

        {/* Year Selector */}
        <div className="mb-8">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="text-gray-700 border border-gray-300 rounded-full px-6 py-3 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select Year Range</option>
            {generateYearRanges().map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {[...filteredMembers]
            ?.sort((a, b) => {
              return (
                designationOrder.indexOf(a.designation) -
                designationOrder.indexOf(b.designation)
              );
            })
            .slice(0, visibleMembers)
            ?.map((member) => (
              <div
                key={member._id}
                className="bg-white p-6 rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300"
              >
                <div className="relative mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 object-cover rounded-full mx-auto mb-4 border-4 border-primary"
                  />
                  {/* Floating Icon */}
                  <div className="absolute top-0 right-0 w-6 h-6 bg-blue-500 rounded-full animate-bounce"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {member.name}
                </h3>
                <p className="text-lg text-gray-600">{member.designation}</p>
                <p className="mt-4 text-gray-500">{member.description}</p>

                <div className="flex justify-center space-x-4 mt-2">
                  {member.linkedinId && (
                    <a
                      href={member.linkedinId}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FaLinkedin className="text-blue-500 text-xl" />
                    </a>
                  )}
                  {member.facebook && (
                    <a href={member.facebook} target="_blank" rel="noreferrer">
                      <FaFacebook className="text-blue-600 text-xl" />
                    </a>
                  )}
                  {member.whatsapp && (
                    <a
                      href={`https://wa.me/${phoneToWhatsAppPath(member.whatsapp)}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FaWhatsapp className="text-green-500 text-xl" />
                    </a>
                  )}
                </div>
              </div>
            ))}
        </div>

        {visibleMembers < filteredMembers.length && (
          <div className="mt-12">
            <button
              onClick={loadMoreMembers}
              className="bg-primary text-white px-8 py-4 rounded-full shadow-lg text-lg font-medium flex items-center gap-3 hover:scale-110 hover:shadow-xl transition-all duration-300 ease-in-out"
            >
              View More <FaArrowRight className="text-lg" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Committee;
