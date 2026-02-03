import React, { useEffect, useState } from "react";

const NgoDonations = () => {
  const [ngo, setNgo] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load logged-in NGO and fetch donations
  useEffect(() => {
    const loggedNgo = JSON.parse(localStorage.getItem("ngo"));
    if (!loggedNgo?._id) {
      setError("Please login as NGO to view donations.");
      setLoading(false);
      return;
    }
    setNgo(loggedNgo);

    const fetchDonations = async () => {
      try {
        const res = await fetch(`http://localhost:5000/ngo/${loggedNgo._id}/donations`);
        const data = await res.json();
        if (data.success) setDonations(data.donations || []);
        else setError("Failed to fetch donations.");
      } catch (err) {
        console.error("Error fetching donations:", err);
        setError("Error fetching donations.");
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  // Update donation status
  const handleStatusChange = async (donationId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/donations/${donationId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setDonations((prev) =>
          prev.map((d) => (d._id === donationId ? { ...d, status: newStatus } : d))
        );
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Error updating donation status");
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-700">Loading donations...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!ngo) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">All Donations for {ngo.name}</h1>

      <div className="bg-white shadow rounded-lg p-6 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2 border">Donor Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Address</th>
              <th className="p-2 border">Item</th>
              <th className="p-2 border">Quantity</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
              <th className="p-2 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {donations.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-2 border text-center text-gray-500">
                  No donations yet.
                </td>
              </tr>
            ) : (
              donations.map((donation) => (
                <tr key={donation._id}>
                  <td className="p-2 border">{donation.donor_name}</td>
                  <td className="p-2 border">{donation.donor_email}</td>
                  <td className="p-2 border">{donation.address}</td>
                  <td className="p-2 border">{donation.category}</td>
                  <td className="p-2 border">{donation.quantity}</td>
                  <td className={`p-2 border font-semibold ${
                    donation.status === "Approved" ? "text-green-600" :
                    donation.status === "Rejected" ? "text-red-600" : "text-yellow-600"
                  }`}>
                    {donation.status}
                  </td>
                  <td className="p-2 border space-x-2">
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded"
                      disabled={donation.status === "Approved"}
                      onClick={() => handleStatusChange(donation._id, "Approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      disabled={donation.status === "Rejected"}
                      onClick={() => handleStatusChange(donation._id, "Rejected")}
                    >
                      Reject
                    </button>
                  </td>
                  <td className="p-2 border">
                    {new Date(donation.created_at).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NgoDonations;
