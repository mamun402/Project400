import { ChevronDown, Menu, X } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { userContext } from "../../App";
import logo from "../Image/Logo.jpg";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { login, setLogin, permissionsState, setPermissionsState } =
    useContext(userContext);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

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
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3 cursor-pointer">
            <img src={logo} alt="Logo" className="h-12 w-auto sm:h-14" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/event">Event</NavLink>
            <NavLink to="/committee">Committee</NavLink>
            <NavLink to="/notice">Notices</NavLink>
            <NavLink to="/blogs">Blogs</NavLink>
            <NavLink to="/alumni-network">Alumni Network</NavLink>
            {localStorage.getItem("username") ? (
              <>
                {/* Dropdown inline */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!isDropdownOpen)}
                    className="text-primary font-medium flex items-center hover:text-secondary transition-colors cursor-pointer"
                  >
                    Profile <ChevronDown size={18} className="ml-1" />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-300 rounded-md shadow-lg z-50">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-primary hover:bg-gray-100 cursor-pointer"
                        onClick={() => setDropdownOpen(false)}
                      >
                        My Profile
                      </Link>
                      {permissionsState?.permissions?.addBlog && (
                        <Link
                          to="/addnewblogs"
                          className="block px-4 py-2 text-primary hover:bg-gray-100 cursor-pointer"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Add Blog
                        </Link>
                      )}
                      {permissionsState?.permissions?.addEvent && (
                        <Link
                          to="/addnewevents"
                          className="block px-4 py-2 text-primary hover:bg-gray-100 cursor-pointer"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Add Event
                        </Link>
                      )}
                      {permissionsState?.permissions?.addGallery && (
                        <Link
                          to="/addnewegallerys"
                          className="block px-4 py-2 text-primary hover:bg-gray-100 cursor-pointer"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Add Gallery
                        </Link>
                      )}
                      {permissionsState?.permissions?.addNotice && (
                        <Link
                          to="/addnewnotices"
                          className="block px-4 py-2 text-primary hover:bg-gray-100 cursor-pointer"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Add Notice
                        </Link>
                      )}
                      {permissionsState?.permissions?.addTestimonial && (
                        <Link
                          to="/addnewtestimonial"
                          className="block px-4 py-2 text-primary hover:bg-gray-100 cursor-pointer"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Add Testimonial
                        </Link>
                      )}
                    </div>
                  )}
                </div>

                <span
                  onClick={() => {
                    setLogin(false);
                    localStorage.clear();
                  }}
                >
                  <NavLink to="/">Logout</NavLink>
                </span>
              </>
            ) : (
              <NavLink to="/login">Members Login</NavLink>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="text-gray-700 focus:outline-none cursor-pointer"
            >
              {open ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto">
          <MobileNavLink to="/" setOpen={setOpen}>
            Home
          </MobileNavLink>
          <MobileNavLink to="/event" setOpen={setOpen}>
            Event
          </MobileNavLink>
          <MobileNavLink to="/committee" setOpen={setOpen}>
            Committee
          </MobileNavLink>
          <MobileNavLink to="/notice" setOpen={setOpen}>
            Notices
          </MobileNavLink>
          <MobileNavLink to="/blogs" setOpen={setOpen}>
            Blogs
          </MobileNavLink>
          <MobileNavLink to="/alumni-network" setOpen={setOpen}>
            Alumni Network
          </MobileNavLink>
          {localStorage.getItem("username") ? (
            <>
              <MobileNavLink to="/profile" setOpen={setOpen}>
                My Profile
              </MobileNavLink>
              {permissionsState?.permissions?.addBlog && (
                <MobileNavLink to="/addnewblogs" setOpen={setOpen}>
                  Add Blog
                </MobileNavLink>
              )}
              {permissionsState?.permissions?.addEvent && (
                <MobileNavLink to="/addnewevents" setOpen={setOpen}>
                  Add Event
                </MobileNavLink>
              )}
              {permissionsState?.permissions?.addGallery && (
                <MobileNavLink to="/addnewegallerys" setOpen={setOpen}>
                  Add Gallery
                </MobileNavLink>
              )}
              {permissionsState?.permissions?.addNotice && (
                <MobileNavLink to="/addnewnotices" setOpen={setOpen}>
                  Add Notice
                </MobileNavLink>
              )}
              <MobileNavLink
                to="/"
                setOpen={setOpen}
                onClick={() => {
                  setLogin(false);
                  localStorage.clear();
                }}
              >
                Logout
              </MobileNavLink>
            </>
          ) : (
            <MobileNavLink to="/login" setOpen={setOpen}>
              Members Login
            </MobileNavLink>
          )}
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ to, children }) => (
  <Link
    to={to}
    className="text-primary hover:text-secondary font-medium transition-colors cursor-pointer"
  >
    {children}
  </Link>
);

const MobileNavLink = ({ to, children, setOpen, onClick }) => (
  <Link
    to={to}
    className="block px-4 py-2 text-primary hover:bg-gray-100 cursor-pointer"
    onClick={() => {
      setOpen(false);
      if (onClick) onClick();
    }}
  >
    {children}
  </Link>
);

export default Navbar;
