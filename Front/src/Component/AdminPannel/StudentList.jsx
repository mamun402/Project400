import React, { useEffect, useState } from "react";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [position, setPosition] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/SingUpAdmin/Allmemberprofile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("Token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error(err));
  }, []);

  const handlePromote = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleDelete = (student) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${student.name}?`
    );
    if (!confirmDelete) return;

    fetch(`http://localhost:5000/SingUpAdmin/deleteMember/${student.uniqueId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("Token")}`,
      },
    })
      .then((res) => res.json())
      .then(() => {
        setStudents((prevStudents) =>
          prevStudents.filter((s) => s.uniqueId !== student.uniqueId)
        );
      })
      .catch((err) => console.error(err));
  };


  const submitPromotion = () => {
    if (!position || !startDate || !endDate) {
      alert("Please fill all fields");
      return;
    }

    fetch(
      `http://localhost:5000/SingUpAdmin/promote/${selectedStudent.uniqueId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
        body: JSON.stringify({ position, startDate, endDate }),
      }
    )
      .then((res) => res.json())
      .then(() => {
        // Update the students list by modifying the selected student's designation and dates
        setStudents((prevStudents) =>
          prevStudents.map((s) =>
            s.uniqueId === selectedStudent.uniqueId
              ? { ...s, designation: position, startDate, endDate }
              : s
          )
        );
        setShowModal(false);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Members List</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">ID</th>
            <th className="border p-2">Batch</th>
            <th className="border p-2">Email</th>
            {/* <th className="border p-2">Start - End</th> */}
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 &&
            students?.map((student) => (
              <tr key={student.id} className="border">
                <td className="border p-2">{student.name}</td>
                <td className="border p-2">{student.id}</td>
                <td className="border p-2">{student.batch}</td>
                <td className="border p-2">{student.email || "N/A"}</td>
                {/* <td className="border p-2">
                {student.startDate && student.endDate
                  ? `${student.startDate} - ${student.endDate}`
                  : "N/A"}
              </td> */}
                <td className="border p-2 text-center">
                  <div className="flex flex-wrap gap-2 justify-center">
                    <button
                      onClick={() => handlePromote(student)}
                      className="bg-blue-500 text-white px-4 py-1 rounded"
                    >
                      Promote
                    </button>
                    <button
                      onClick={() => handleDelete(student)}
                      className="bg-red-500 text-white px-4 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">
              Promote {selectedStudent.name}
            </h3>
            <select
              className="w-full p-2 border rounded mb-2"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            >
              <option value="">Select Position</option>
              <option value="Chief Patron">Chief Patron</option>
              <option value="Patron">Patron</option>
              <option value="Chief Advisor">Chief Advisor</option>
              <option value="Advisor">Advisor</option>
              <option value="President">President</option>
              <option value="Treasurer">Treasurer</option>
              <option value="Student Advisor">Student Advisor</option>
              <option value="Senior Vice President">
                Senior Vice President
              </option>
              <option value="Vice President">Vice President</option>
              <option value="General Secretary">General Secretary</option>
              <option value="Joint Secretary">Joint Secretary</option>
              <option value="Organizing Secretary">Organizing Secretary</option>
              <option value="Student Secretary">Student Secretary</option>
              <option value="ACM Coordinator">ACM Coordinator</option>
              <option value="Office Secretary">Office Secretary</option>
              <option value="Public Relations Secretary">
                Public Relations Secretary
              </option>
              <option value="Publication Secretary">
                Publication Secretary
              </option>
              <option value="Resource Secretary">Resource Secretary</option>
              <option value="Web & Design Secretary">
                Web & Design Secretary
              </option>
              <option value="Cyber Security Coordinator">
                Cyber Security Coordinator
              </option>
              <option value="Sports Secretary">Sports Secretary</option>
              <option value="Cultural Secretary">Cultural Secretary</option>
              <option value="Finance Executive">Finance Executive</option>
              <option value="Senior Executive Member">
                Senior Executive Member
              </option>
              <option value="Executive Member">Executive Member</option>
            </select>

            <input
              type="date"
              className="w-full p-2 border rounded mb-2"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              className="w-full p-2 border rounded mb-2"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-1 rounded"
              >
                Cancel
              </button>
              <button
                onClick={submitPromotion}
                className="bg-green-500 text-white px-4 py-1 rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
