import React, { useEffect, useState } from "react";

const roles = [
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

const permissions = [
  "Add Notice",
  "Add Event",
  "Add Blog",
  "Add Gallery",
  "Add Testimonial",
];

const ManageUsers = () => {
  const [permissionsState, setPermissionsState] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [hasFetched, setHasFetched] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // Add loading state

  useEffect(() => {
    if (hasFetched) return;

    fetch("http://localhost:5000/SingUpAdmin/getPermissions")
      .then((res) => res.json())
      .then((data) => {
        const fetchedPermissions = data.map((roleData) => ({
          role: roleData.role,
          permissions: roleData.permissions || {},
        }));

        const initialPermissionsState = roles.reduce((acc, role) => {
          const roleData = fetchedPermissions.find(
            (item) => item.role === role
          );

          if (roleData) {
            acc[role] = permissions.reduce((permAcc, permission) => {
              const backendKey = permission
                .replace(/\s+/g, "")
                .replace(/^./, (c) => c.toLowerCase());

              permAcc[permission] = !!roleData.permissions[backendKey];
              return permAcc;
            }, {});
          } else {
            acc[role] = permissions.reduce((pAcc, permission) => {
              pAcc[permission] = false;
              return pAcc;
            }, {});
          }

          return acc;
        }, {});

        setPermissionsState(initialPermissionsState);
        setHasFetched(true);
      })
      .catch((err) => {
        console.error("❌ Error fetching permissions:", err);
      });
  }, [hasFetched]);

  const togglePermission = (role, permission) => {
    setPermissionsState((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [permission]: !prev[role][permission],
      },
    }));
  };

  const handleSave = () => {
    setIsSaving(true); // Set saving state to true when save starts

    fetch("http://localhost:5000/SingUpAdmin/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(permissionsState),
    })
      .then((res) => res.json())
      .then((data) => {
        setSuccessMessage("Permissions saved successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);

        setIsSaving(false); // Reset saving state after save is complete
        setTimeout(() => {
          setHasFetched(false); // Optional: trigger re-fetch after saving
        }, 500);
      })
      .catch((err) => {
        console.error("❌ Save error:", err);
        setSuccessMessage("Failed to save permissions.");
        setTimeout(() => setSuccessMessage(""), 3000);

        setIsSaving(false); // Reset saving state after error
      });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">
        Manage User Permissions
      </h2>

      {successMessage && (
        <div
          className={`${
            successMessage.includes("successfully")
              ? "bg-green-500"
              : "bg-red-500"
          } text-white text-center py-3 rounded-lg mb-6`}
        >
          {successMessage}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left border-b">Role</th>
              {permissions.map((perm) => (
                <th key={perm} className="px-4 py-2 text-center border-b">
                  {perm}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role} className="hover:bg-gray-50">
                <td className="px-4 py-3 border-b font-medium text-gray-700">
                  {role}
                </td>
                {permissions.map((perm) => (
                  <td key={perm} className="px-4 py-3 border-b text-center">
                    <input
                      type="checkbox"
                      className="w-5 h-5 text-blue-600"
                      checked={permissionsState[role]?.[perm] || false}
                      onChange={() => togglePermission(role, perm)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          {isSaving ? "Saving..." : "Save Changes"}{" "}
          {/* Show "Saving..." text */}
        </button>
      </div>
    </div>
  );
};

export default ManageUsers;
