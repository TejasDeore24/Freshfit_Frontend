import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Users } from "lucide-react";

function VolunteersList() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const ngoId = localStorage.getItem("ngoId");

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/ngo/${ngoId}/volunteers`);
        if (res.data.success) {
          setVolunteers(res.data.volunteers);
        } else {
          setError("Failed to fetch volunteers.");
        }
      } catch (err) {
        console.error("Error fetching volunteers:", err);
        setError("Error loading volunteers.");
      } finally {
        setLoading(false);
      }
    };
    fetchVolunteers();
  }, [ngoId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-indigo-500 mb-3" size={40} />
        <p>Loading volunteers...</p>
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
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12 px-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Approved Volunteers
      </h1>

      {volunteers.length > 0 ? (
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {volunteers.map((vol) => (
            <div
              key={vol.id}
              className="bg-white p-5 rounded-xl shadow-md border hover:shadow-lg transition"
            >
              <Users className="text-indigo-500 mb-3 mx-auto" size={40} />
              <h2 className="text-lg font-semibold text-gray-800 mb-1">
                {vol.volunteer_name}
              </h2>
              <p className="text-sm text-gray-500">{vol.volunteer_email}</p>
              <p className="text-xs text-gray-400 mt-2">
                Joined: {new Date(vol.joined_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No approved volunteers yet.</p>
      )}
    </div>
  );
}

export default VolunteersList;
