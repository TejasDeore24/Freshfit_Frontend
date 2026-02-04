import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config";

function NGOLogin({ setIsLoggedIn }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const mode = localStorage.getItem("mode");
    if (loggedIn && mode === "ngo") {
      setIsLoggedIn(true);
      navigate("/ngo-dashboard");
    }
  }, [navigate, setIsLoggedIn]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.trimStart() });
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/ngo/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setMessage(data.message);
      setIsSuccess(data.success);

      if (data.success && data.ngo) {
        // Store NGO details properly
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("mode", "ngo");
        localStorage.setItem("ngo", JSON.stringify(data.ngo));
        localStorage.setItem("ngoId", data.ngo.id || data.ngo.ngo_id);

        setIsLoggedIn(true);
        navigate("/ngo-dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage("Server error. Please try again.");
      setIsSuccess(false);
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
        <h2 className="text-3xl font-bold text-center text-green-600">NGO Login</h2>

        {message && (
          <p
            className={`text-sm text-center ${
              isSuccess ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold text-white transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-right mt-1">
          <span
            className="text-blue-500 cursor-pointer underline"
            onClick={() => navigate("/ngo/forgot-password")}
          >
            Forgot Password?
          </span>
        </p>

        <p className="text-sm text-center mt-2">
          Don’t have an account?{" "}
          <span
            className="text-green-600 cursor-pointer underline"
            onClick={() => navigate("/ngo-register")}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}

export default NGOLogin;
