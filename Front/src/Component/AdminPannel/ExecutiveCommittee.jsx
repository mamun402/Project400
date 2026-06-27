import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Option,
  Select,
  Typography,
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import Datepicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaFacebookF, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { phoneToWhatsAppPath } from "../Common/PhoneInput";

const ExecutiveCommittee = () => {
  const [members, setMembers] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedYearRange, setSelectedYearRange] = useState("");

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

  const filteredMembers = members.filter((member) => {
    if (!selectedYearRange) return true;

    const [startYear, endYear] = selectedYearRange.split("-").map(Number);
    const memberStart = new Date(member.startDate).getFullYear();
    const memberEnd = new Date(member.endDate).getFullYear();

    return memberStart === startYear && memberEnd === endYear;
  });

  const handleEdit = (member) => {
    setCurrentMember(member);
    setStartDate(member?.startDate ? new Date(member.startDate) : null);
    setEndDate(member?.endDate ? new Date(member.endDate) : null);
    setOpenEdit(true);
  };

  const handleSave = () => {
    if (!currentMember?.designation || !startDate || !endDate) {
      alert("Please fill all fields.");
      return;
    }

    fetch(
      `http://localhost:5000/SingUpAdmin/promote/${currentMember?.uniqueId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
        body: JSON.stringify({
          position: currentMember.designation,
          startDate,
          endDate,
        }),
      }
    )
      .then((res) => res.json())
      .then(() => {
        setMembers((prevMembers) =>
          prevMembers.map((member) =>
            member.uniqueId === currentMember.uniqueId
              ? {
                  ...member,
                  designation: currentMember.designation,
                  startDate,
                  endDate,
                }
              : member
          )
        );
        setOpenEdit(false);
      })
      .catch((err) => console.error("Error updating member:", err));
  };

  const handleDelete = (member) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${member.name}?`
    );
    if (!confirmDelete) return;

    fetch(`http://localhost:5000/SingUpAdmin/deleteMember/${member.uniqueId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("Token")}`,
      },
    })
      .then((res) => res.json())
      .then(() => {
        setMembers((prevMembers) =>
          prevMembers.filter((m) => m.uniqueId !== member.uniqueId)
        );
      })
      .catch((err) => console.error("Error deleting member:", err));
  };

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    setSelectedYearRange(`${currentYear - 1}-${currentYear}`);
  }, []);

  return (
    <div className="p-6 min-h-screen">
      <Typography
        variant="h2"
        className="text-center mb-6 font-bold text-blue-600"
      >
        Executive Committee
      </Typography>

      <div className="flex justify-end mb-6">
        <Select
          value={selectedYearRange}
          onChange={(value) => setSelectedYearRange(value)}
          className="w-64"
        >
          {generateYearRanges()?.map((range) => (
            <Option key={range} value={range}>
              {range}
            </Option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...filteredMembers]
          .sort((a, b) => {
            return (
              designationOrder.indexOf(a.designation) -
              designationOrder.indexOf(b.designation)
            );
          })
          ?.map((member) => (
            <div
              key={member._id}
              className="relative bg-gradient-to-br from-white to-blue-50 border border-gray-200 rounded-2xl shadow-lg p-6 text-center hover:shadow-2xl transition-all"
            >
              <img
                className="w-24 h-24 mx-auto rounded-full border-4 border-blue-400 shadow-md object-cover"
                src={member.image || "default-profile.png"}
                alt={member.name}
              />
              <h5 className="text-xl font-bold text-gray-900 mt-4">
                {member.name}
              </h5>
              {member.designation && (
                <p className="text-blue-600 font-semibold mt-1">
                  {member.designation}
                </p>
              )}
              {member.batch && (
                <p className="text-gray-500 text-sm mt-1">
                  Batch: {member.batch}
                </p>
              )}
              {member.startDate && member.endDate && (
                <p className="text-sm text-gray-700 mt-1">
                  <span className="font-semibold">Term:</span>{" "}
                  {new Date(member.startDate).getFullYear()} -{" "}
                  {new Date(member.endDate).getFullYear()}
                </p>
              )}

              {/* Contact Info */}
              <div className="text-sm text-gray-600 mt-2 space-y-1">
                {member.email && (
                  <p>
                    <strong>Email:</strong> {member.email}
                  </p>
                )}
                {member.mobile && (
                  <p>
                    <strong>Mobile:</strong> {member.mobile}
                  </p>
                )}
                <div className="flex justify-center space-x-4 mt-2">
                  {member.linkedinId && (
                    <a
                      href={member.linkedinId}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FaLinkedinIn className="text-blue-600 text-2xl hover:text-blue-800 transition-all" />
                    </a>
                  )}
                  {member.facebook && (
                    <a href={member.facebook} target="_blank" rel="noreferrer">
                      <FaFacebookF className="text-blue-600 text-2xl hover:text-blue-800 transition-all" />
                    </a>
                  )}
                  {member.whatsapp && (
                    <a
                      href={`https://wa.me/${phoneToWhatsAppPath(member.whatsapp)}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FaWhatsapp className="text-green-600 text-2xl hover:text-green-800 transition-all" />
                    </a>
                  )}
                </div>
              </div>

              <div className="mt-4 flex justify-center gap-4">
                <Button
                  size="sm"
                  color="blue"
                  onClick={() => handleEdit(member)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  color="red"
                  onClick={() => handleDelete(member)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={openEdit} handler={setOpenEdit} size="lg" className="p-6">
        <DialogHeader className="text-2xl font-semibold text-gray-800">
          Edit Member Information
        </DialogHeader>
        <DialogBody className="bg-white p-8 rounded-xl shadow-lg">
          <div className="space-y-6">
            {/* Designation */}
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Designation
              </label>
              <Select
                value={currentMember?.designation || ""}
                onChange={(value) =>
                  setCurrentMember({
                    ...currentMember,
                    designation: value,
                  })
                }
              >
                {designationOrder.map((designation) => (
                  <Option key={designation} value={designation}>
                    {designation}
                  </Option>
                ))}
              </Select>
            </div>

            {/* Dates aligned right */}
            <div className="flex flex-col md:flex-row justify-end gap-4">
              <div className="flex flex-col space-y-2 w-full md:w-1/2">
                <label className="text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <Datepicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="MMM d, yyyy"
                  className="border border-gray-300 rounded-lg p-2"
                  placeholderText="Select Start Date"
                />
              </div>

              <div className="flex flex-col space-y-2 w-full md:w-1/2">
                <label className="text-sm font-medium text-gray-700">
                  End Date
                </label>
                <Datepicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  dateFormat="MMM d, yyyy"
                  className="border border-gray-300 rounded-lg p-2"
                  placeholderText="Select End Date"
                />
              </div>
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-end space-x-4">
          <Button variant="text" color="red" onClick={() => setOpenEdit(false)}>
            Cancel
          </Button>
          <Button
            variant="gradient"
            className="bg-green-500"
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default ExecutiveCommittee;
