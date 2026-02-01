import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function UserLogin({ setIsLoggedIn }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Show message if redirected from donate page
    if (location.state?.from === "donate") {
      setInfoMessage("Please login to your account for donating.");
    }

    // If already logged in, redirect to dashboard
    const isLogged = localStorage.getItem("isLoggedIn");
    if (isLogged === "true") {
      setIsLoggedIn(true);
      navigate("/dashboard");
    }
  }, [location, navigate, setIsLoggedIn]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  // Handle login submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        // ✅ Store login details
        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("mode", "user");
        localStorage.setItem("user", JSON.stringify(data.user));

        // ✅ Important: store user ID as string for later use (e.g., volunteer requests)
        if (data.user && data.user.id) {
          localStorage.setItem("userId", String(data.user.id));
          console.log("✅ User ID stored:", data.user.id);
        } else {
          console.warn("⚠️ No user ID found in login response");
        }

        navigate("/dashboard");
      } else {
        setError(data.message || "Invalid email or password.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-5 border border-gray-200"
      >
        <h2 className="text-3xl font-bold text-center text-blue-600">User Login</h2>

        {infoMessage && <p className="text-blue-500 text-center">{infoMessage}</p>}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Login
        </button>

        <p className="text-sm text-right mt-1">
          <span
            className="text-blue-500 cursor-pointer underline"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </span>
        </p>

        <p className="text-sm text-center mt-2">
          Don’t have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer underline"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}

export default UserLogin;
