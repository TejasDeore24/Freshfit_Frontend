// src/ngo/register.js
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterNgo() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setMsg({ type: "", text: "" });
  };

  const validate = () => {
    const { name, email, password, confirmPassword, phone, address } = form;
    if (!name || !email || !password || !confirmPassword || !phone || !address) {
      return "Please fill in all required fields.";
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Please enter a valid email.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (password !== confirmPassword) return "Passwords do not match.";
    if (!/^\d{7,15}$/.test(phone)) return "Phone must be 7–15 digits.";
    return null;
    };

  const onSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return setMsg({ type: "error", text: err });

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/ngo/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          address: form.address,
          description: form.description,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Registration failed.");
      }

      setMsg({ type: "success", text: "Registration successful! Redirecting to login…" });
      // optional: remember we are working in NGO mode
      localStorage.setItem("mode", "ngo");
      setTimeout(() => navigate("/ngo-login"), 1000);
    } catch (e2) {
      setMsg({ type: "error", text: e2.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow p-8">
        <h1 className="text-3xl font-bold text-center mb-2">Register your NGO</h1>
        <p className="text-center text-gray-600 mb-6">
          Create an NGO account to manage donations and pickups.
        </p>

        {msg.text && (
          <div
            className={`mb-4 rounded-md p-3 text-sm ${
              msg.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
            }`}
          >
            {msg.text}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">NGO Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="e.g., Helping Hands Foundation"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="contact@ngo.org"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Phone *</label>
              <input
                name="phone"
                value={form.phone}
                onChange={onChange}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="9876543210"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Address *</label>
            <textarea
              name="address"
              value={form.address}
              onChange={onChange}
              className="w-full border rounded-lg px-3 py-2"
              rows="2"
              placeholder="Full postal address"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">About / Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              className="w-full border rounded-lg px-3 py-2"
              rows="3"
              placeholder="What does your NGO do?"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Password *</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={onChange}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Minimum 6 characters"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={onChange}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Re-enter password"
              />
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Create NGO Account"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already registered?{" "}
          <Link to="/ngo-login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>

        <p className="text-xs text-center text-gray-500 mt-2">
          Are you a donor?{" "}
          <Link to=".\pages\register.js" className="underline">
            Register as Donator
          </Link>
        </p>
      </div>
    </div>
  );
}
