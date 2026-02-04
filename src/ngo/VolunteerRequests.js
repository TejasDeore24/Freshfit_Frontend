import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { CheckCircle, XCircle, Loader2, RefreshCw } from "lucide-react";
import API_URL from "../config";

function VolunteerRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ngo = JSON.parse(localStorage.getItem("ngo"));
  const ngoId = ngo?._id;

  // ======================
  // FETCH VOLUNTEER REQUESTS
  // ======================
  const fetchRequests = useCallback(async () => {
    if (!ngoId) return;

    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(
        `${API_URL}/ngo/${ngoId}/volunteer-requests`
      );

      if (res.data.success) {
        setRequests(res.data.requests);
      } else {
        setError("Failed to fetch volunteer requests.");
      }
    } catch (err) {
      console.error("Error fetching volunteer requests:", err);
      setError("Error loading volunteer requests.");
    } finally {
      setLoading(false);
    }
  }, [ngoId]);

  // ======================
  // CHECK LOGIN
  // ======================
  useEffect(() => {
    if (!ngoId) {
      setError("You must be logged in as an NGO to view volunteer requests.");
      setLoading(false);
    }
  }, [ngoId]);

  // ======================
  // LOAD DATA
  // ======================
  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // ======================
  // UPDATE REQUEST STATUS
  // ======================
  const handleStatusUpdate = async (requestId, status) => {
    try {
      const res = await axios.put(
        `${API_URL}/volunteer/${requestId}/status`,
        { status }
      );

      if (res.data.success) {
        setRequests((prev) =>
          prev.map((req) =>
            req._id === requestId ? { ...req, status } : req
          )
        );
      } else {
        alert(res.data.message || "Failed to update request.");
      }
    } catch (err) {
      console.error("Error updating request:", err);
      alert("Failed to update request status.");
    }
  };

  // ======================
  // UI STATES
  // ======================
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-indigo-500 mb-3" size={40} />
        <p>Loading volunteer requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-500 font-semibold">
        {error}
        <button
          onClick={fetchRequests}
          className="mt-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <RefreshCw size={16} /> Retry
        </button>
      </div>
    );
  }

  // ======================
  // MAIN UI
  // ======================
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12 px-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Volunteer Requests
      </h1>

      {requests.length > 0 ? (
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-white p-5 rounded-xl shadow-md border hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-1">
                {req.user?.name || "Unknown User"}
              </h2>

              <p className="text-sm text-gray-500 mb-3">
                {req.user?.email || "No email"}
              </p>

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
                  {req.status || "Pending"}
                </b>
              </p>

              {req.status === "Pending" && (
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() =>
                      handleStatusUpdate(req._id, "Approved")
                    }
                    className="flex items-center gap-1 px-4 py-2 rounded-full bg-green-500 text-white hover:bg-green-600"
                  >
                    <CheckCircle size={18} /> Approve
                  </button>

                  <button
                    onClick={() =>
                      handleStatusUpdate(req._id, "Rejected")
                    }
                    className="flex items-center gap-1 px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600"
                  >
                    <XCircle size={18} /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No volunteer requests yet.
        </p>
      )}
    </div>
  );
}

export default VolunteerRequests;
