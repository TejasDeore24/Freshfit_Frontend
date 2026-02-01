import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Hamburger icons

const Header = ({ mode, setMode, isLoggedIn, handleLogout }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => setMobileOpen(!mobileOpen);

  const navLinkClass = (path) =>
    `px-4 py-2 rounded-full font-semibold transition ${
      location.pathname === path
        ? "bg-indigo-600 text-white"
        : "text-gray-700 hover:bg-indigo-100"
    }`;

  return (
    <header className="bg-gradient-to-r from-blue-100 to-teal-100 text-gray-800
 to-purple-500 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <div>
          <Link to="/" className="text-3xl font-bold text-red hover:text-gray-100">
            DonateHub
          </Link>
        </div>

        {/* Desktop Links */}
        <nav className="hidden md:flex space-x-4 items-center text-lg">
          {mode === "default" && (
            <>
              <Link
                to="/login"
                onClick={() => setMode("user")}
                className={navLinkClass("/login")}
              >
                Donator Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMode("user")}
                className={navLinkClass("/register")}
              >
                Donator Register
              </Link>
              <Link
                to="/ngo-login"
                onClick={() => setMode("ngo")}
                className={navLinkClass("/ngo-login")}
              >
                NGO Login
              </Link>
              <Link
                to="/ngo-register"
                onClick={() => setMode("ngo")}
                className={navLinkClass("/ngo-register")}
              >
                NGO Register
              </Link>
            </>
          )}

          {mode === "user" && (
            <>
              <Link to="/" className={navLinkClass("/")}>
                Home
              </Link>
              {!isLoggedIn ? (
                <>
                  <Link to="/login" className={navLinkClass("/login")}>
                    Login
                  </Link>
                  <Link to="/register" className={navLinkClass("/register")}>
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className={navLinkClass("/dashboard")}>
                    Dashboard
                  </Link>
                  <Link to="/edit-profile" className={navLinkClass("/edit-profile")}>
                    Edit Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition"
                  >
                    Logout
                  </button>
                </>
              )}
            </>
          )}

          {mode === "ngo" && (
            <>
              <Link to="/" className={navLinkClass("/")}>
                Home
              </Link>
              {!isLoggedIn ? (
                <>
                  <Link to="/ngo-login" className={navLinkClass("/ngo-login")}>
                    Login
                  </Link>
                  <Link to="/ngo-register" className={navLinkClass("/ngo-register")}>
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/ngo-dashboard" className={navLinkClass("/ngo-dashboard")}>
                    Dashboard
                  </Link>
                  <Link to="/ngo-donations" className={navLinkClass("/ngo-donations")}>
                    Donations
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition"
                  >
                    Logout
                  </button>
                </>
              )}
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-white">
            {mobileOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white shadow-lg px-6 py-4 space-y-3">
          {mode === "default" && (
            <>
              <Link
                to="/login"
                onClick={() => {
                  setMode("user");
                  setMobileOpen(false);
                }}
                className="block text-gray-700 hover:bg-indigo-100 px-4 py-2 rounded-full"
              >
                Donator Login
              </Link>
              <Link
                to="/register"
                onClick={() => {
                  setMode("user");
                  setMobileOpen(false);
                }}
                className="block text-gray-700 hover:bg-indigo-100 px-4 py-2 rounded-full"
              >
                Donator Register
              </Link>
              <Link
                to="/ngo-login"
                onClick={() => {
                  setMode("ngo");
                  setMobileOpen(false);
                }}
                className="block text-gray-700 hover:bg-indigo-100 px-4 py-2 rounded-full"
              >
                NGO Login
              </Link>
              <Link
                to="/ngo-register"
                onClick={() => {
                  setMode("ngo");
                  setMobileOpen(false);
                }}
                className="block text-gray-700 hover:bg-indigo-100 px-4 py-2 rounded-full"
              >
                NGO Register
              </Link>
            </>
          )}

          {mode === "user" && (
            <>
              <Link to="/" className="block text-gray-700 hover:bg-indigo-100 px-4 py-2 rounded-full">
                Home
              </Link>
              {!isLoggedIn ? (
                <>
                  <Link to="/login" className="block text-gray-700 hover:bg-indigo-100 px-4 py-2 rounded-full">
                    Login
                  </Link>
                  <Link to="/register" className="block text-gray-700 hover:bg-indigo-100 px-4 py-2 rounded-full">
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className="block text-gray-700 hover:bg-indigo-100 px-4 py-2 rounded-full">
                    Dashboard
                  </Link>
                  <Link to="/edit-profile" className="block text-gray-700 hover:bg-indigo-100 px-4 py-2 rounded-full">
                    Edit Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition"
                  >
                    Logout
                  </button>
                </>
              )}
            </>
          )}

          {mode === "ngo" && (
            <>
              <Link to="/" className="block text-gray-700 hover:bg-indigo-100 px-4 py-2 rounded-full">
                Home
              </Link>
              {!isLoggedIn ? (
                <>
                  <Link to="/ngo-login" className="block text-gray-700 hover:bg-indigo-100 px-4 py-2 rounded-full">
                    Login
                  </Link>
                  <Link to="/ngo-register" className="block text-gray-700 hover:bg-indigo-100 px-4 py-2 rounded-full">
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/ngo-dashboard" className="block text-gray-700 hover:bg-indigo-100 px-4 py-2 rounded-full">
                    Dashboard
                  </Link>
                  <Link to="/ngo-donations" className="block text-gray-700 hover:bg-indigo-100 px-4 py-2 rounded-full">
                    Donations
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition"
                  >
                    Logout
                  </button>
                </>
              )}
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
