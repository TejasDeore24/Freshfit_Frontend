import React, { useEffect, useState } from "react";

const NGODashboard = () => {
  const [ngo, setNgo] = useState(null);
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState({
    totalDonations: 0,
    volunteers: 0,
    pending: 0,
  });

  useEffect(() => {
    const loggedNgo = JSON.parse(localStorage.getItem("ngo"));
    if (loggedNgo) {
      setNgo(loggedNgo);

      // ✅ Fetch donations for this NGO
      fetch(`http://localhost:5000/ngo/${loggedNgo.id}/donations`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setDonations(data.donations);
        })
        .catch(err => console.error(err));

      // ✅ Fetch stats dynamically (including volunteers)
      fetch(`http://localhost:5000/ngo/${loggedNgo.id}/stats`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setStats({
              totalDonations: data.totalDonations,
              volunteers: data.volunteers, // ✅ dynamic volunteer count
              pending: data.pending,
            });
          }
        })
        .catch(err => console.error(err));
    }
  }, []);

  const updateStatus = (donationId, newStatus) => {
    fetch(`http://localhost:5000/donations/${donationId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setDonations(prev =>
            prev.map(donation =>
              donation.id === donationId
                ? { ...donation, status: newStatus }
                : donation
            )
          );
        } else {
          alert("Failed to update status");
        }
      })
      .catch(err => console.error(err));
  };

  if (!ngo)
    return (
      <p className="text-center mt-10 text-gray-700">
        Please login as NGO to access dashboard.
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-bold mb-6">Welcome, {ngo.name}!</h2>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Total Donations</h3>
          <p className="text-3xl text-green-600">{stats.totalDonations}</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Active Volunteers</h3>
          <p className="text-3xl text-blue-600">{stats.volunteers}</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Pending Requests</h3>
          <p className="text-3xl text-red-600">{stats.pending}</p>
        </div>
      </div>

      {/* Recent Donations */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">Recent Donations</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2 border">Donor</th>
                <th className="p-2 border">Item</th>
                <th className="p-2 border">Quantity</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Approve</th>
                <th className="p-2 border">Reject</th>
              </tr>
            </thead>
            <tbody>
              {donations.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="p-2 border text-center text-gray-500"
                  >
                    No donations yet.
                  </td>
                </tr>
              ) : (
                donations.map(donation => (
                  <tr key={donation.id}>
                    <td className="p-2 border">{donation.donor_name}</td>
                    <td className="p-2 border">{donation.category}</td>
                    <td className="p-2 border">{donation.quantity}</td>
                    <td
                      className={`p-2 border font-semibold ${
                        donation.status === "Approved"
                          ? "text-green-600"
                          : donation.status === "Pending"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {donation.status || "Pending"}
                    </td>
                    <td className="p-2 border text-center">
                      <button
                        onClick={() => updateStatus(donation.id, "Approved")}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                        disabled={donation.status === "Approved"}
                      >
                        Approve
                      </button>
                    </td>
                    <td className="p-2 border text-center">
                      <button
                        onClick={() => updateStatus(donation.id, "Rejected")}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                        disabled={donation.status === "Rejected"}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NGODashboard;
