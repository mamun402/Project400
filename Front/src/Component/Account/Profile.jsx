import React, { useEffect, useState } from "react";
import PP from "./PP";
import PendingProfile from "./Panding";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(
      "http://localhost:5000/Singup/Profile?email=" +
        localStorage.getItem("username"),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
      }
    )
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          throw new Error(data?.error || data?.message || "Failed to load profile");
        }
        const nextUser = Array.isArray(data) ? data[0] : data?.user || data;
        if (!nextUser) {
          throw new Error("Profile not found");
        }
        setUser(nextUser);
        localStorage.setItem("designation", nextUser.designation);
        localStorage.setItem("userId", nextUser?.uniqueId);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Failed to load profile");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin border-t-4 border-blue-500 w-16 h-16 border-solid rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-10">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return user.designation === "pending" ? (
    <PendingProfile />
  ) : (
    <PP user={user} />
  );
};

export default Profile;
