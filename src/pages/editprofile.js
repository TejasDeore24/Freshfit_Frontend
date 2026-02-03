import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function EditProfile() {
  const [profile, setProfile] = useState({ name: "", email: "", password: "", _id: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setProfile({
        name: savedUser.name || "",
        email: savedUser.email || "",
        password: "",
        _id: savedUser._id,
      });
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("http://localhost:5000/edit-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      // 🔒 SAFE RESPONSE HANDLING
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Request failed");
      }

      const data = await res.json();

      if (data.success) {
        const updatedUser = {
          _id: profile._id,
          name: profile.name,
          email: profile.email,
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));

        setMessage({ type: "success", text: "Profile updated successfully!" });
        setTimeout(() => navigate("/dashboard"), 1200);
      } else {
        setMessage({ type: "error", text: data.message || "Update failed." });
      }
    } catch (err) {
      console.error("Edit profile error:", err);
      setMessage({ type: "error", text: "Server error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white shadow-lg p-6 rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Edit Profile</h2>

      {message && (
        <p
          className={`text-center mb-4 font-medium ${
            message.type === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {message.text}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={profile.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
          className="w-full px-4 py-2 border rounded"
        />

        <input
          type="email"
          name="email"
          value={profile.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full px-4 py-2 border rounded"
        />

        <input
          type="password"
          name="password"
          value={profile.password}
          onChange={handleChange}
          placeholder="Leave blank to keep current password"
          className="w-full px-4 py-2 border rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

export default EditProfile;
