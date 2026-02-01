import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

function VolunteerRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get logged-in NGO ID from localStorage
  const ngoId = localStorage.getItem("ngoId");

  // Redirect or handle if NGO not logged in
  useEffect(() => {
    if (!ngoId) {
      setError("You must be logged in as an NGO to view requests.");
      setLoading(false);
    }
  }, [ngoId]);

  // Fetch all volunteer requests for this NGO
  useEffect(() => {
    const fetchRequests = async () => {
      if (!ngoId) return;
      try {
        const res = await axios.get(`http://localhost:5000/ngo/${ngoId}/volunteer-requests`);
        if (res.data.success) {
          setRequests(res.data.requests);
        } else {
          setError("Failed to fetch requests.");
        }
      } catch (err) {
        console.error("Error fetching volunteer requests:", err);
        setError("Error loading volunteer requests.");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [ngoId]);

  // Handle Approve / Reject
  const handleStatusUpdate = async (requestId, status) => {
    try {
      const res = await axios.put(`http://localhost:5000/volunteer/${requestId}/status`, { status });
      if (res.data.success) {
        setRequests((prev) =>
          prev.map((req) =>
            req.id === requestId ? { ...req, status } : req
          )
        );
      } else {
        alert(res.data.message || "Failed to update request status.");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update request status.");
    }
  };

  // Loading UI
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-indigo-500 mb-3" size={40} />
        <p>Loading volunteer requests...</p>
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-semibold">
        {error}
      </div>
    );
  }

  // Main UI
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12 px-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Volunteer Requests
      </h1>

      {requests.length > 0 ? (
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white p-5 rounded-xl shadow-md border hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-1">{req.user_name}</h2>
              <p className="text-sm text-gray-500 mb-3">{req.user_email}</p>
              <p className="text-sm text-gray-600 mb-4">
                Status:{" "}
                <b
                  className={
                    req.status === "Approved"
                      ? "text-green-600"
                      : req.status === "Rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }
                >
                  {req.status}
                </b>
              </p>

              {req.status === "Pending" && (
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => handleStatusUpdate(req.id, "Approved")}
                    className="flex items-center gap-1 px-4 py-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition"
                  >
                    <CheckCircle size={18} /> Approve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(req.id, "Rejected")}
                    className="flex items-center gap-1 px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
                  >
                    <XCircle size={18} /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No volunteer requests yet.</p>
      )}
    </div>
  );
}

export default VolunteerRequests;
