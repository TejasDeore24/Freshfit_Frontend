import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, XCircle } from "lucide-react";
import API_URL from "../config";

function MyVolunteerRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  useEffect(() => {
    if (!userId) {
      setError("You must be logged in.");
      setLoading(false);
      return;
    }

    const fetchRequests = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/volunteer/my-requests/${userId}`
        );
        setRequests(res.data.requests || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load volunteer requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [userId]);

  // ✅ Handle cancel request
  const handleCancel = async (requestId) => {
    const confirmed = window.confirm("Are you sure you want to cancel this request?");
    if (!confirmed) return;

    try {
      const res = await axios.delete(
        `${API_URL}/volunteer/${requestId}/cancel`
      );

      if (res.data.success) {
        setRequests((prev) => prev.filter((r) => r._id !== requestId));
      } else {
        alert(res.data.message || "Failed to cancel request.");
      }
    } catch (err) {
      console.error("Error canceling request:", err);
      alert("Error canceling request. Please try again later.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        My Volunteer Requests
      </h1>

      {requests.length === 0 ? (
        <p className="text-gray-500">No volunteer requests yet.</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">NGO</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Requested On</th>
                <th className="px-4 py-2 text-left">Action</th> {/* New column */}
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req._id} className="border-b">
                  <td className="px-4 py-2">{req.ngo_name}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`font-semibold ${
                        req.status === "Approved"
                          ? "text-green-600"
                          : req.status === "Rejected"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {new Date(req.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    {req.status === "Pending" ? (
                      <button
                        onClick={() => handleCancel(req._id)}
                        className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                      >
                        <XCircle size={16} /> Cancel
                      </button>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MyVolunteerRequests;
