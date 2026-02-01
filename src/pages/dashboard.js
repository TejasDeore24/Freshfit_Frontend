import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState({ name: "User" });
  const [donations, setDonations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (!savedUser) {
      navigate("/login");
      return;
    }
    setUser(savedUser);

    // Fetch donations
    fetch(`http://localhost:5000/donations?userId=${savedUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const formattedDonations = data.donations.map((donation) => ({
            ...donation,
            date: donation.created_at ? new Date(donation.created_at) : new Date()
          }));
          setDonations(formattedDonations);
        }
      })
      .catch((err) => console.log("Error fetching donations:", err));
  }, [navigate]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">
        Welcome back, {user.name} 👋
      </h1>

      <div className="flex gap-4 mb-6">
        <Link
          to="/donate"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
        >
          Donate Now
        </Link>
        <Link
          to="/edit-profile"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
        >
          Edit Profile
        </Link>
      </div>

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

      <div>
        <h3 className="text-2xl font-semibold mb-2 text-gray-800">Recent Donations</h3>
        <table className="w-full bg-white rounded-lg shadow p-4">
          <thead>
            <tr className="text-left text-gray-700 border-b">
              <th className="py-2 px-3">Category</th>
              <th className="py-2 px-3">Quantity</th>
              <th className="py-2 px-3">Date</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {donations.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-3">
                  No donations yet.
                </td>
              </tr>
            )}
            {donations.map((donation) => (
              <tr key={donation.id} className="border-b text-gray-700">
                <td className="py-2 px-3">{donation.category}</td>
                <td className="py-2 px-3">{donation.quantity}</td>
                <td className="py-2 px-3">{donation.date.toLocaleDateString()}</td>
                <td className="py-2 px-3">
                  {donation.status ? donation.status : "Pending"}
                </td>
                <td className="py-2 px-3">
                  <button
                    onClick={() => navigate(`/donation/${donation.id}`)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
