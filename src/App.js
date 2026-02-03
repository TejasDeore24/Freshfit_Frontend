import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// User pages
import Home from "./pages/home";
import Donate from "./pages/donate";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import EditProfile from "./pages/editprofile";
import DonationDetails from "./pages/DonationDetails";
import JoinNgo from "./pages/JoinNgo";
import MyVolunteerRequests from "./pages/MyVolunteerRequests";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./ResetPassword";

// NGO pages
import LoginNgo from "./ngo/login";
import RegisterNgo from "./ngo/register";
import NGODashboard from "./ngo/NGODashboard";
import NgoDonations from "./ngo/ngodonations";
import VolunteerRequests from "./ngo/VolunteerRequests";

// Layout
import Header from "./header";
import Footer from "./pages/footer";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mode, setMode] = useState("default"); // default | user | ngo

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    setMode(localStorage.getItem("mode") || "default");
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      setIsLoggedIn(false);
      setMode("default");
    }
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header
          mode={mode}
          setMode={setMode}
          isLoggedIn={isLoggedIn}
          handleLogout={handleLogout}
        />

        <main className="flex-grow px-8 py-6 max-w-7xl mx-auto w-full">
          <Routes>

            {/* ================= PUBLIC ================= */}
            <Route path="/" element={<Home isLoggedIn={isLoggedIn} mode={mode} />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/register" element={<Register />} />

            <Route path="/ngo-login" element={<LoginNgo setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/ngo-register" element={<RegisterNgo />} />

            <Route path="/forgot-password/:role" element={<ForgotPassword />} />
            <Route path="/reset-password/:type" element={<ResetPassword />} />

            {/* ================= USER ================= */}
            <Route
              path="/dashboard"
              element={isLoggedIn && mode === "user" ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/donate"
              element={isLoggedIn && mode === "user" ? <Donate /> : <Navigate to="/login" />}
            />
            <Route
              path="/edit-profile"
              element={isLoggedIn && mode === "user" ? <EditProfile /> : <Navigate to="/login" />}
            />
            <Route
              path="/donation/:id"
              element={isLoggedIn && mode === "user" ? <DonationDetails /> : <Navigate to="/login" />}
            />
            <Route
              path="/join-ngo"
              element={isLoggedIn && mode === "user" ? <JoinNgo /> : <Navigate to="/login" />}
            />
            <Route
              path="/my-volunteer-requests"
              element={
                isLoggedIn && mode === "user" ? (
                  <MyVolunteerRequests />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* ================= NGO ================= */}
            <Route
              path="/ngo-dashboard"
              element={isLoggedIn && mode === "ngo" ? <NGODashboard /> : <Navigate to="/ngo-login" />}
            />
            <Route
              path="/ngo-donations"
              element={isLoggedIn && mode === "ngo" ? <NgoDonations /> : <Navigate to="/ngo-login" />}
            />
            <Route
              path="/ngo/manage-volunteers"
              element={
                isLoggedIn && mode === "ngo" ? (
                  <VolunteerRequests />
                ) : (
                  <Navigate to="/ngo-login" />
                )
              }
            />

            {/* ================= FALLBACK ================= */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
