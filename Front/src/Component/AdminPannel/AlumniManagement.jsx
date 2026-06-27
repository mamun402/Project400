import React, { useEffect, useState } from "react";

const createEmptyAlumniForm = () => ({
  fullName: "",
  email: "",
  mobile: "",
  whatsapp: "",
  currentEmployer: "",
  designation: "",
  linkedin: "",
  facebook: "",
  profileImage: null,
});

const AlumniManagement = () => {
  const [alumni, setAlumni] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAlumni, setEditingAlumni] = useState(null);
  const [alumniForm, setAlumniForm] = useState(createEmptyAlumniForm());
  const [alumniPreview, setAlumniPreview] = useState("");
  const [alumniFile, setAlumniFile] = useState(null);
  const [alumniError, setAlumniError] = useState("");
  const [alumniSuccess, setAlumniSuccess] = useState("");
  const [alumniSubmitting, setAlumniSubmitting] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/Singup/allalumni", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setAlumni(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (!alumniError && !alumniSuccess) return undefined;

    const timer = setTimeout(() => {
      setAlumniError("");
      setAlumniSuccess("");
    }, 2500);

    return () => clearTimeout(timer);
  }, [alumniError, alumniSuccess]);

  const handleEdit = (item) => {
    setEditingAlumni(item);
    setAlumniForm({
      fullName: item.name || "",
      email: item.email || "",
      mobile: item.mobile || "",
      whatsapp: item.whatsapp || "",
      currentEmployer: item.currentEmployer || "",
      designation: item.designation || "",
      linkedin: item.linkedin || "",
      facebook: item.facebook || "",
      profileImage: null,
    });
    setAlumniPreview(item.image || "");
    setAlumniFile(null);
    setAlumniError("");
    setAlumniSuccess("");
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profileImage" && files && files[0]) {
      if (alumniPreview && alumniPreview.startsWith("blob:")) {
        URL.revokeObjectURL(alumniPreview);
      }
      setAlumniFile(files[0]);
      setAlumniPreview(URL.createObjectURL(files[0]));
      return;
    }

    setAlumniForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!alumniForm.fullName.trim()) {
      setAlumniError("Full name is required.");
      return;
    }

    if (!alumniForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(alumniForm.email.trim())) {
      setAlumniError("Please provide a valid email address.");
      return;
    }

    if (!alumniForm.designation.trim()) {
      setAlumniError("Designation is required.");
      return;
    }

    if (!alumniForm.mobile.trim()) {
      setAlumniError("Mobile number is required.");
      return;
    }

    setAlumniSubmitting(true);
    setAlumniError("");
    setAlumniSuccess("");

    const formData = new FormData();
    formData.append("fullName", alumniForm.fullName.trim());
    formData.append("email", alumniForm.email.trim());
    formData.append("mobile", alumniForm.mobile.trim());
    formData.append("whatsapp", alumniForm.whatsapp.trim());
    formData.append("linkedin", alumniForm.linkedin.trim());
    formData.append("designation", alumniForm.designation.trim());
    formData.append("currentEmployer", alumniForm.currentEmployer.trim());
    formData.append("facebook", alumniForm.facebook.trim());
    if (alumniFile) {
      formData.append("profileImage", alumniFile);
    }

    fetch(`http://localhost:5000/Singup/editalumni/${editingAlumni._id}`, {
      method: "PUT",
      headers: {
        authorization: `Bearer ${localStorage.getItem("Token")}`,
      },
      body: formData,
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Unable to update alumni.");
        }
        return data;
      })
      .then((data) => {
        setAlumni((prev) =>
          prev.map((item) => (item._id === editingAlumni._id ? data.alumni : item))
        );
        setAlumniSuccess("Alumni updated successfully.");
        setShowModal(false);
        setEditingAlumni(null);
        setAlumniForm(createEmptyAlumniForm());
        setAlumniPreview("");
        setAlumniFile(null);
      })
      .catch((err) => {
        setAlumniError(err.message || "Unable to update alumni.");
      })
      .finally(() => {
        setAlumniSubmitting(false);
      });
  };

  const handleDelete = (item) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${item.name}?`);
    if (!confirmDelete) return;

    fetch(`http://localhost:5000/Singup/deletealumni/${item._id}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${localStorage.getItem("Token")}`,
      },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Unable to delete alumni.");
        }
        return data;
      })
      .then(() => {
        setAlumni((prev) => prev.filter((entry) => entry._id !== item._id));
        setAlumniSuccess("Alumni deleted successfully.");
      })
      .catch((err) => {
        setAlumniError(err.message || "Unable to delete alumni.");
      });
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Alumni Management</h2>
        <span className="text-sm text-gray-600">{alumni.length} alumni</span>
      </div>

      {alumniError && (
        <div className="mb-4 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {alumniError}
        </div>
      )}
      {alumniSuccess && (
        <div className="mb-4 rounded border border-green-300 bg-green-50 px-3 py-2 text-sm text-green-700">
          {alumniSuccess}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-300 bg-white">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border-b border-gray-300 p-2 text-left">Name</th>
              <th className="border-b border-gray-300 p-2 text-left">Email</th>
              <th className="border-b border-gray-300 p-2 text-left">Designation</th>
              <th className="border-b border-gray-300 p-2 text-left">Current Employer</th>
              <th className="border-b border-gray-300 p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {alumni.length > 0 ? (
              alumni.map((item) => (
                <tr key={item._id || item.uniqueId} className="border-b border-gray-200">
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-600">
                          {item.name ? item.name.charAt(0) : "A"}
                        </div>
                      )}
                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td className="p-2">{item.email || "N/A"}</td>
                  <td className="p-2">{item.designation || "N/A"}</td>
                  <td className="p-2">{item.currentEmployer || "N/A"}</td>
                  <td className="p-2 text-center">
                    <div className="flex flex-wrap justify-center gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="rounded bg-blue-500 px-4 py-1 text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="rounded bg-red-500 px-4 py-1 text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No alumni have been added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && editingAlumni && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-60 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">Edit Alumni</h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingAlumni(null);
                  setAlumniForm(createEmptyAlumniForm());
                  setAlumniPreview("");
                  setAlumniFile(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={alumniForm.fullName}
                    onChange={handleChange}
                    className="w-full rounded border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={alumniForm.email}
                    onChange={handleChange}
                    className="w-full rounded border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Mobile</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={alumniForm.mobile}
                    onChange={handleChange}
                    className="w-full rounded border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">WhatsApp</label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={alumniForm.whatsapp}
                    onChange={handleChange}
                    className="w-full rounded border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Designation</label>
                  <input
                    type="text"
                    name="designation"
                    value={alumniForm.designation}
                    onChange={handleChange}
                    className="w-full rounded border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Current Employer</label>
                  <input
                    type="text"
                    name="currentEmployer"
                    value={alumniForm.currentEmployer}
                    onChange={handleChange}
                    className="w-full rounded border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">LinkedIn</label>
                  <input
                    type="url"
                    name="linkedin"
                    value={alumniForm.linkedin}
                    onChange={handleChange}
                    className="w-full rounded border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Facebook</label>
                  <input
                    type="url"
                    name="facebook"
                    value={alumniForm.facebook}
                    onChange={handleChange}
                    className="w-full rounded border border-gray-300 px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Profile Image</label>
                <input
                  type="file"
                  name="profileImage"
                  accept="image/png,image/jpeg"
                  onChange={handleChange}
                  className="w-full rounded border border-gray-300 px-3 py-2"
                />
              </div>

              {alumniPreview && (
                <div className="flex justify-center">
                  <img
                    src={alumniPreview}
                    alt="Preview"
                    className="h-24 w-24 rounded-full object-cover"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingAlumni(null);
                    setAlumniForm(createEmptyAlumniForm());
                    setAlumniPreview("");
                    setAlumniFile(null);
                  }}
                  className="rounded bg-gray-500 px-4 py-2 text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={alumniSubmitting}
                  className="rounded bg-green-600 px-4 py-2 text-white disabled:opacity-70"
                >
                  {alumniSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlumniManagement;
