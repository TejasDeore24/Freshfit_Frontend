import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/home";
import Donate from "./pages/donate";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Footer from "./pages/footer";
 import EditProfile from "./pages/editprofile";
import NgoDonations from "./ngo/ngodonations";
import DonationDetails from "./pages/DonationDetails";
import JoinNgo from "./pages/JoinNgo";
import VolunteerRequests from "./ngo/VolunteerRequests";

// NGO pages
import LoginNgo from "./ngo/login";
import RegisterNgo from "./ngo/register";
import NGODashboard from "./ngo/NGODashboard";

// Header Component
import Header from "./header";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./ResetPassword";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mode, setMode] = useState("default"); // default | user | ngo

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);

    const savedMode = localStorage.getItem("mode") || "default";
    setMode(savedMode);
  }, []);

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      setIsLoggedIn(false);
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("mode");
      localStorage.removeItem("user");
      localStorage.removeItem("ngo");
      setMode("default");
    }
  };

  return (
    <Router>
       <div className="flex flex-col min-h-screen">
        <Header mode={mode} setMode={setMode} isLoggedIn={isLoggedIn} handleLogout={handleLogout} />

        <main className="flex-grow px-8 py-6 max-w-7xl mx-auto w-full">
          <Routes>
            {/* Public Route */}
            <Route path="/" element={<Home isLoggedIn={isLoggedIn} mode={mode} />} />

            {/* User & NGO Login/Register */}
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/ngo-login" element={<LoginNgo setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/ngo-register" element={<RegisterNgo />} />

            {/* User Protected Routes */}
            <Route
              path="/donate"
              element={
                isLoggedIn && mode === "user" ? <Donate /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/dashboard"
              element={
                isLoggedIn && mode === "user" ? <Dashboard /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/edit-profile"
              element={
                isLoggedIn && mode === "user" ? <EditProfile /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/donation/:id"
              element={
                isLoggedIn && mode === "user" ? <DonationDetails /> : <Navigate to="/login" replace />
              }
            />

            {/* NGO Protected Routes */}
            <Route
              path="/ngo-dashboard"
              element={
                isLoggedIn && mode === "ngo" ? <NGODashboard /> : <Navigate to="/ngo-login" replace />
              }
            />
            <Route
              path="/ngo-donations"
              element={
                isLoggedIn && mode === "ngo" ? <NgoDonations /> : <Navigate to="/ngo-login" replace />
              }
            />

            {/* Redirect unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/join-ngo" element={<JoinNgo />} />
             <Route path="/ngo/manage-volunteers" element={<VolunteerRequests />} />

            <Route path="/forgot-password/:role" element={<ForgotPassword />} />
            <Route path="/forgot-password" element={<ForgotPassword type="user" />} />
            <Route path="/ngo/forgot-password" element={<ForgotPassword type="ngo" />} />
            <Route path="/reset-password/:type" element={<ResetPassword />} />

          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
