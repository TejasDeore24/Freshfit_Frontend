import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (!savedUser) {
      navigate("/login");
      return;
    }
    setUser(savedUser);

    const fetchDonations = async () => {
      try {
        const res = await fetch(`http://localhost:5000/donations?userId=${savedUser._id}`);
        if (!res.ok) throw new Error("Failed to fetch donations");
        const data = await res.json();
        if (data.success) {
          const formatted = data.donations.map((don) => ({
            ...don,
            date: don.created_at ? new Date(don.created_at) : new Date(),
          }));
          setDonations(formatted);
        } else {
          setError("Failed to fetch donations.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Error fetching donations.");
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [navigate]);

  if (!user) return null;

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">Loading dashboard...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 bg-gray-50">
        {error}
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Welcome back, {user.name} 👋
      </h1>

      {/* Quick Links */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Link to="/donate" className="bg-green-600 text-white px-5 py-2 rounded-lg">
          Donate Now
        </Link>
        <Link to="/edit-profile" className="bg-blue-600 text-white px-5 py-2 rounded-lg">
          Edit Profile
        </Link>
        <Link
          to="/my-volunteer-requests"
          className="bg-purple-600 text-white px-5 py-2 rounded-lg"
        >
          My Volunteer Requests
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="bg-green-100 p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-green-700">Total Donations</h2>
          <p className="text-2xl font-bold mt-2">{donations.length}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-blue-700">Upcoming Pickups</h2>
          <p className="text-2xl font-bold mt-2">2</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-yellow-700">Profile Status</h2>
          <p className="text-2xl font-bold mt-2">Complete</p>
        </div>
      </div>

      {/* Recent Donations */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full min-w-[600px] divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr className="text-left text-gray-700">
              <th className="py-2 px-3">Category</th>
              <th className="py-2 px-3">Quantity</th>
              <th className="py-2 px-3">Date</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {donations.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No donations yet.
                </td>
              </tr>
            ) : (
              donations.map((donation) => (
                <tr key={donation._id} className="border-b text-gray-700">
                  <td className="py-2 px-3">{donation.category || "N/A"}</td>
                  <td className="py-2 px-3">{donation.quantity || "-"}</td>
                  <td className="py-2 px-3">
                    {donation.date ? donation.date.toLocaleDateString() : "N/A"}
                  </td>
                  <td className="py-2 px-3">{donation.status || "Pending"}</td>
                  <td className="py-2 px-3">
                    <button
                      onClick={() => navigate(`/donation/${donation._id}`)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg transition"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
