import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
const API_URL = process.env.Backend_Url || "http://localhost:5000";;

function UserLogin({ setIsLoggedIn }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Show message if redirected from donate page
    if (location.state?.from === "donate") {
      setInfoMessage("Please login to your account for donating.");
    }

    // Redirect if already logged in
    const isLogged = localStorage.getItem("isLoggedIn");
    if (isLogged === "true") {
      setIsLoggedIn(true);
      navigate("/dashboard");
    }
  }, [location, navigate, setIsLoggedIn]);

  // Input change handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        const user = data.user;
        setIsLoggedIn(true);

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("mode", "user");
        localStorage.setItem("user", JSON.stringify(user));

        if (user?._id || user?.id) {
          localStorage.setItem("userId", String(user._id || user.id));
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
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
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold text-white transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
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
