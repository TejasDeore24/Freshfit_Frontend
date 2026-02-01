import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, Building2, Loader2 } from "lucide-react";

function JoinNgo() {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNgo, setSelectedNgo] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch list of NGOs from backend
  useEffect(() => {
    const fetchNgos = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/ngos");
        setNgos(res.data);
      } catch (err) {
        console.error("Error fetching NGOs:", err);
        setError("Failed to load NGOs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchNgos();
  }, []);

  // ✅ Handle Join NGO Request
  const handleJoin = async (ngoId) => {
    try {
      const userId = localStorage.getItem("userId");

      // Check if user is logged in
      if (!userId) {
        alert("⚠️ Please log in first to join an NGO.");
        return;
      }

      // Prepare request data
      const data = {
        userId: parseInt(userId, 10),
        ngoId: parseInt(ngoId, 10),
      };

      console.log("🧭 Sending volunteer request with:", data);

      const res = await axios.post("http://localhost:5000/api/join-ngo", data);

      if (res.data.success) {
        setSelectedNgo(ngoId);
        setSuccess(true);
        setError(null);
      } else {
        setError(res.data.message || "Failed to send request. Please try again.");
      }
    } catch (err) {
      console.error("Error joining NGO:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Could not send request. Please try again later.");
      }
    }
  };

  // ✅ Show Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-indigo-50 text-gray-700">
        <Loader2 className="animate-spin mb-4 text-indigo-500" size={48} />
        <p>Loading NGOs...</p>
      </div>
    );
  }

  // ✅ Show Error State
  if (error && !success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-gray-700">
        <p className="text-red-500 font-semibold">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  // ✅ Main UI
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-16 px-6">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
        🤝 Join an NGO
      </h1>

      {!success ? (
        ngos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {ngos.map((ngo) => (
              <div
                key={ngo.id}
                className="bg-white p-6 rounded-2xl shadow-md border hover:shadow-xl transition text-center"
              >
                <Building2 className="mx-auto text-green-600 mb-3" size={40} />
                <h2 className="text-xl font-semibold mb-2">
                  {ngo.name || "Unnamed NGO"}
                </h2>
                <p className="text-gray-600 mb-4">
                  {ngo.description || "Join our NGO and make an impact!"}
                </p>
                <button
                  onClick={() => handleJoin(ngo.id)}
                  disabled={selectedNgo === ngo.id}
                  className={`px-5 py-2 rounded-full font-semibold shadow-md transition ${
                    selectedNgo === ngo.id
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-gradient-to-r from-indigo-500 to-blue-600 text-white hover:scale-105"
                  }`}
                >
                  {selectedNgo === ngo.id ? "Request Sent" : "Request to Join"}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600 mt-10">
            <p>No NGOs available right now. Please check back later.</p>
          </div>
        )
      ) : (
        <div className="text-center mt-16">
          <CheckCircle className="mx-auto text-green-500 mb-4" size={60} />
          <h2 className="text-2xl font-semibold text-gray-700">
            Request Sent Successfully!
          </h2>
          <p className="text-gray-600 mt-2">
            You will be notified once the NGO approves your volunteer request.
          </p>
        </div>
      )}
    </div>
  );
}

export default JoinNgo;
