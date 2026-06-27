import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userContext } from "../../App";
const AdminLogin = () => {
  const { setCheckAdminLogin } = useContext(userContext);
  const [adminCredentials, setAdminCredentials] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminCredentials({ ...adminCredentials, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/SingUpAdmin/login", {
        method: "POST", // Change to POST
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminCredentials), // Ensure adminCredentials is an object with email and password
      });

      const data = await response.json();
      if (response.ok && data.message === "Login successful!") {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("AdminLogin", true);
        setCheckAdminLogin(true);
        navigate("/adminhome");
      } else {
        setError(data.error || "Login failed.");
      }
    } catch (error) {
      setError("Something went wrong, please try again.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center ">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={adminCredentials.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={adminCredentials.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary  focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
