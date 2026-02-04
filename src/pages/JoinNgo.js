import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, Building2, Loader2 } from "lucide-react";
import API_URL from "../config";

 

function JoinNgo() {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNgo, setSelectedNgo] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // ======================
  // FETCH NGOs
  // ======================
  useEffect(() => {
    const fetchNgos = async () => {
      try {
        const res = await axios.get(` ${API_URL}/ngos`);

        if (res.data.success) {
          setNgos(res.data.ngos);
        } else {
          setError("Failed to load NGOs.");
        }
      } catch (err) {
        console.error("Error fetching NGOs:", err);
        setError("Failed to load NGOs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNgos();
  }, []);

  // ======================
  // JOIN NGO
  // ======================
  const handleJoin = async (ngoId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user?._id) {
        alert("⚠️ Please log in first to join an NGO.");
        return;
      }

      const res = await axios.post(`${API_URL}/volunteer/join`, {
        userId: user._id,
        ngoId,
      });

      if (res.data.success) {
        setSelectedNgo(ngoId);
        setSuccess(true);
        setError(null);
      } else {
        setError(res.data.message || "Failed to send request.");
      }
    } catch (err) {
      console.error("Error joining NGO:", err);
      setError(
        err.response?.data?.message ||
          "Could not send request. Please try again later."
      );
    }
  };

  // ======================
  // LOADING STATE
  // ======================
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-indigo-50">
        <Loader2 className="animate-spin mb-4 text-indigo-500" size={48} />
        <p className="text-gray-700">Loading NGOs...</p>
      </div>
    );
  }

  // ======================
  // ERROR STATE
  // ======================
  if (error && !success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50">
        <p className="text-red-500 font-semibold">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  // ======================
  // MAIN UI
  // ======================
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
                key={ngo._id}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition text-center"
              >
                <Building2 className="mx-auto text-green-600 mb-3" size={40} />
                <h2 className="text-xl font-semibold mb-2">
                  {ngo.name || "Unnamed NGO"}
                </h2>
                <p className="text-gray-600 mb-4">
                  {ngo.description || "Join our NGO and make an impact!"}
                </p>
                <button
                  onClick={() => handleJoin(ngo._id)}
                  disabled={selectedNgo === ngo._id}
                  className={`px-5 py-2 rounded-full font-semibold transition ${
                    selectedNgo === ngo._id
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {selectedNgo === ngo._id ? "Request Sent" : "Request to Join"}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">
            No NGOs available right now.
          </p>
        )
      ) : (
        <div className="text-center mt-16">
          <CheckCircle className="mx-auto text-green-500 mb-4" size={60} />
          <h2 className="text-2xl font-semibold text-gray-700">
            Request Sent Successfully!
          </h2>
          <p className="text-gray-600 mt-2">
            You’ll be notified once the NGO approves your request.
          </p>
        </div>
      )}
    </div>
  );
}

export default JoinNgo;
