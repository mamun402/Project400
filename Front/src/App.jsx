import { createContext, useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import "./App.css";
import AddBlogs from "./Component/Account/Add/AddBlogs";
import AddGallerys from "./Component/Account/Add/AddGallerys";
import AddNotices from "./Component/Account/Add/AddNotices";
import AddTastimonial from "./Component/Account/Add/AddTastimonial";
import UserAddEvents from "./Component/Account/Add/UserAddEvents";
import EditProfile from "./Component/Account/EditProfile";
import ForgotPassword from "./Component/Account/ForgotPassword";
import Login from "./Component/Account/Login";
import Profile from "./Component/Account/Profile";
import ResetPassword from "./Component/Account/ResetPassword";
import Signup from "./Component/Account/SignUp";
import VerifyEmail from "./Component/Account/VerifyEmail";
import AdminPanel from "./Component/AdminPannel/AdminHome";
import AdminLogin from "./Component/AdminPannel/AdminLogin";
import Alumni from "./Component/Alumni/Alumni";
import Blogs from "./Component/Blogs/Blogs";
import Committee from "./Component/Committee/Committee";
import EditBlogs from "./Component/EditBlogs/EditBlogs";
import EditGallery from "./Component/EditGallery/EditGallery";
import EditNotice from "./Component/EditNotice/EditNotice";
import Event from "./Component/Event/Event";
import Footer from "./Component/Footer/Footer";
import FullGallery from "./Component/FullGallery/FullGallery";
import Home from "./Component/Home/Home";
import Navbar from "./Component/Nevbar/Nevbar";
import Notice from "./Component/Notice/Notice";
export const userContext = createContext();
function App() {
  const [count, setCount] = useState(0);
  const [login, setLogin] = useState(false);
  const [checkadminlogin, setCheckAdminLogin] = useState(false);
  const [formData, setFormData] = useState({});
  const isAdminLoggedIn = localStorage.getItem("AdminLogin");
  const isLogin = localStorage.getItem("normaluser");
  const [permissionsState, setPermissionsState] = useState({});
  useEffect(() => {
    const role = localStorage.getItem("designation");

    fetch(`http://localhost:5000/SingUpAdmin/geRoletPermissions?role=${role}`)
      .then((res) => res.json())
      .then((data) => {
        setPermissionsState(data);
      })
      .catch((err) => {
        console.error("Error fetching permissions:", err);
      });
  }, []);
  return (
    <userContext.Provider
      value={[
        login,
        setLogin,
        formData,
        setFormData,
        checkadminlogin,
        setCheckAdminLogin,
        permissionsState,
        setPermissionsState,
      ]}
    >
      <Routes>
        <Route
          path="/"
          element={
            <>
              {" "}
              <Navbar />
              <Home />
              <Footer />
            </>
          }
        />
        <Route
          path="/committee"
          element={
            <>
              {" "}
              <Navbar />
              <Committee />
              <Footer />
            </>
          }
        />
        <Route
          path="/event"
          element={
            <>
              {" "}
              <Navbar />
              <Event />
              <Footer />
            </>
          }
        />
        <Route
          path="/blogs"
          element={
            <>
              {" "}
              <Navbar />
              <Blogs />
              <Footer />
            </>
          }
        />
        <Route
          path="/notice"
          element={
            <>
              {" "}
              <Navbar />
              <Notice />
              <Footer />
            </>
          }
        />
        
        <Route
          path="/verify-email"
          element={
            <>
              <Navbar />
              <VerifyEmail />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              {" "}
              <Navbar />
              <Login />
              <Footer />
            </>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <>
              {" "}
              <Navbar />
              <ForgotPassword />
              <Footer />
            </>
          }
        />
        <Route
          path="/reset-password/:email/:token"
          element={
            <>
              {" "}
              <Navbar />
              <ResetPassword />
              <Footer />
            </>
          }
        />
        <Route
          path="/signup"
          element={
            <>
              {" "}
              <Navbar />
              <Signup />
              <Footer />
            </>
          }
        />
        {(login || isLogin) && (
          <>
            <Route
              path="/profile"
              element={
                <>
                  {" "}
                  <Navbar />
                  <Profile />
                  <Footer />
                </>
              }
            />
            <Route
              path="/editProfile/:id"
              element={
                <>
                  {" "}
                  <Navbar />
                  <EditProfile />
                  <Footer />
                </>
              }
            />
          </>
        )}

        <Route
          path="/addnewblogs"
          element={
            <>
              {" "}
              <Navbar />
              <AddBlogs />
              <Footer />
            </>
          }
        />
        <Route
          path="/addnewevents"
          element={
            <>
              {" "}
              <Navbar />
              <UserAddEvents />
              <Footer />
            </>
          }
        />
        <Route
          path="/addnewegallerys"
          element={
            <>
              {" "}
              <Navbar />
              <AddGallerys />
              <Footer />
            </>
          }
        />
        <Route
          path="/addnewtestimonial"
          element={
            <>
              {" "}
              <Navbar />
              <AddTastimonial />
              <Footer />
            </>
          }
        />
        <Route
          path="/addnewnotices"
          element={
            <>
              {" "}
              <Navbar />
              <AddNotices />
              <Footer />
            </>
          }
        />

        <Route
          path="/fullgallery"
          element={
            <>
              {" "}
              <Navbar />
              <FullGallery />
              <Footer />
            </>
          }
        />
        <Route
          path="/alumni-network"
          element={
            <>
              {" "}
              <Navbar />
              <Alumni />
              <Footer />
            </>
          }
        />
        <Route
          path="/adminlogin"
          element={
            <>
              {" "}
              <AdminLogin />
            </>
          }
        />
        {(isAdminLoggedIn || checkadminlogin) && (
          <>
            <Route
              path="/adminhome"
              element={
                <>
                  {" "}
                  <AdminPanel />
                </>
              }
            />
            <Route
              path="/editnotice/:id"
              element={
                <>
                  {" "}
                  <EditNotice />
                </>
              }
            />

            <Route
              path="/editblogs/:id"
              element={
                <>
                  {" "}
                  <EditBlogs />
                </>
              }
            />
            <Route
              path="/editgallery/:id"
              element={
                <>
                  {" "}
                  <EditGallery />
                </>
              }
            />
          </>
        )}
      </Routes>
    </userContext.Provider>
  );
}

export default App;
