import React, { useEffect, useState } from "react";

const NgoDonations = () => {
  const [ngo, setNgo] = useState(null);
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const loggedNgo = JSON.parse(localStorage.getItem("ngo"));
    if (loggedNgo) {
      setNgo(loggedNgo);

      fetch(`http://localhost:5000/ngo/${loggedNgo.id}/donations`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setDonations(data.donations);
        })
        .catch((err) => console.error("Error fetching donations:", err));
    }
  }, []);

 const handleStatusChange = (donationId, newStatus) => {
  fetch(`http://localhost:5000/donations/${donationId}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        setDonations((prev) =>
          prev.map((donation) =>
            donation.id === donationId
              ? { ...donation, status: newStatus }
              : donation
          )
        );
      } else {
        console.error("Update failed:", data.message);
      }
    })
    .catch((err) => console.error("Error updating status:", err));
};

  if (!ngo) {
    return (
      <div className="text-center mt-10">
        <p>Please login as NGO to access donations.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">All Donations for {ngo.name}</h1>

      <div className="bg-white shadow rounded-lg p-6">
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
                <td colSpan="8" className="p-2 border text-center">
                  No donations yet.
                </td>
              </tr>
            ) : (
              donations.map((donation) => (
                <tr key={donation.id}>
                  <td className="p-2 border">{donation.donor_name}</td>
                  <td className="p-2 border">{donation.donor_email}</td>
                  <td className="p-2 border">{donation.address}</td>
                  <td className="p-2 border">{donation.category}</td>
                  <td className="p-2 border">{donation.quantity}</td>
                  <td className={`p-2 border ${donation.status === "Approved"
                      ? "text-green-600"
                      : donation.status === "Pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}>{donation.status}</td>
                  <td className="p-2 border space-x-2">
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded"
                      disabled={donation.status === "Approved"}
                      onClick={() => handleStatusChange(donation.id, "Approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      disabled={donation.status === "Rejected"}
                      onClick={() => handleStatusChange(donation.id, "Rejected")}
                    >
                      Reject
                    </button>
                  </td>
                  <td className="p-2 border">{new Date(donation.created_at).toLocaleString()}</td>
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
