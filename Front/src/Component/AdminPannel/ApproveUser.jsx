import React, { useEffect, useState } from "react";

const ApproveUser = () => {
  const [users, setUsers] = useState([]);
  const [nameSearch, setNameSearch] = useState("");
  const [batchSearch, setBatchSearch] = useState("");
  const [idSearch, setIdSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/Singup/Alluserprofile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("Token")}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setUsers(res.filter((user) => user.designation === "pending"));
      })
      .catch((err) => console.error(err));
  }, []);

  const handleApprove = (id) => {
    fetch(`http://localhost:5000/SingUpAdmin/approve/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("Token")}`,
      },
    })
      .then((res) => res.json())
      .then(() => {
        setUsers(users.filter((user) => user.uniqueId !== id));
      })
      .catch((err) => console.error(err));
  };

  const handleReject = (id) => {
    fetch(`http://localhost:5000/SingUpAdmin/reject/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("Token")}`,
      },
    })
      .then((res) => res.json())
      .then(() => {
        setUsers(users.filter((user) => user.uniqueId !== id));
      })
      .catch((err) => console.error(err));
  };

  // Filter users based on search inputs
  const filteredUsers = users.filter((user) => {
    return (
      user.name.toLowerCase().includes(nameSearch.toLowerCase()) &&
      user.batch.toLowerCase().includes(batchSearch.toLowerCase()) &&
      user.id.toLowerCase().includes(idSearch.toLowerCase())
    );
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Pending User Approvals</h2>

      {/* Search Filters */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by Name"
          className="p-2 border rounded w-1/3"
          value={nameSearch}
          onChange={(e) => setNameSearch(e.target.value)}
        />
      </div>

      {/* User Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Image</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user.uniqueId} className="border">
                <td className="border p-2">
                  <img
                    src={user.image || "https://via.placeholder.com/50"}
                    alt="User"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </td>
                <td className="border p-2">{user.name}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2 flex gap-2 justify-center">
                  <button
                    onClick={() => handleApprove(user.uniqueId)}
                    className="bg-green-500 text-white px-4 py-1 rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(user.uniqueId)}
                    className="bg-red-500 text-white px-4 py-1 rounded"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center p-4 text-gray-500">
                There are no pending users to approve.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ApproveUser;
