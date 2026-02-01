import { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { type } = useParams(); // 'user' or 'ngo'
  const token = location.state?.token || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);

    if (!newPassword || !confirmPassword) {
      setMessage("Please fill all fields");
      setIsError(true);
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      setIsError(true);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/${type}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage(data.message);
        setIsError(false);

        setTimeout(() => {
          navigate(type === "ngo" ? "/ngo-login" : "/login");
        }, 2000);
      } else {
        setMessage(data.message);
        setIsError(true);
      }
    } catch (err) {
      console.error(err);
      setMessage("Error connecting to server");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Reset Password
        </h2>

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 text-white font-semibold rounded ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          } transition`}
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>

        {message && (
          <p
            className={`text-sm text-center mt-2 ${isError ? "text-red-600" : "text-green-600"}`}
          >
            {message}
          </p>
        )}

        <p
          className="text-center text-sm mt-2 text-blue-500 cursor-pointer hover:underline"
          onClick={() => navigate(type === "ngo" ? "/ngo-login" : "/login")}
        >
          Back to Login
        </p>
      </form>
    </div>
  );
}
