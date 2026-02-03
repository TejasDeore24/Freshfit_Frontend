import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Loader2,
  MapPin,
  Package,
  Building2,
  ClipboardCheck,
} from "lucide-react";

function DonationDetails() {
  const { id } = useParams(); // donation _id

  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        const res = await fetch(`http://localhost:5000/donation/${id}`);

        // ✅ prevent JSON parse crash
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to fetch donation");
        }

        const data = await res.json();

        if (data.success) {
          setDonation(data.donation);
        } else {
          setError("Donation not found.");
        }
      } catch (err) {
        console.error("Error fetching donation:", err);
        setError("Failed to load donation details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDonation();
  }, [id]);

  // ======================
  // LOADING STATE
  // ======================
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-blue-500" />
      </div>
    );
  }

  // ======================
  // ERROR STATE
  // ======================
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 font-semibold">
        {error}
      </div>
    );
  }

  if (!donation) return null;

  // ======================
  // STATUS HELPERS
  // ======================
  const getStatusPercentage = (status) => {
    switch (status) {
      case "Approved":
      case "Rejected":
        return 100;
      default:
        return 50; // Pending
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-500";
      case "Rejected":
        return "bg-red-500";
      default:
        return "bg-yellow-400";
    }
  };

  // ======================
  // RENDER
  // ======================
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">
          Donation Details
        </h1>

        <div className="bg-white shadow-xl rounded-2xl p-8 space-y-6">
          {/* CATEGORY */}
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-500" />
              <span className="font-semibold text-gray-700">Category</span>
            </div>
            <span className="text-gray-900 font-medium">
              {donation.category || "N/A"}
            </span>
          </div>

          {/* QUANTITY */}
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-green-500" />
              <span className="font-semibold text-gray-700">Quantity</span>
            </div>
            <span className="text-gray-900 font-medium">
              {donation.quantity || "N/A"}
            </span>
          </div>

          {/* ADDRESS */}
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-500" />
              <span className="font-semibold text-gray-700">Address</span>
            </div>
            <span className="text-gray-900 font-medium">
              {donation.address || "N/A"}
            </span>
          </div>

          {/* NGO */}
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-500" />
              <span className="font-semibold text-gray-700">NGO</span>
            </div>
            <span className="text-gray-900 font-medium">
              {donation.ngo_name || "Not assigned"}
            </span>
          </div>

          {/* STATUS */}
          <div className="pt-3">
            <span className="font-semibold text-gray-700 mb-2 block">
              Status
            </span>

            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className={`${statusColor(
                  donation.status
                )} h-4 rounded-full transition-all duration-500`}
                style={{
                  width: `${getStatusPercentage(donation.status)}%`,
                }}
              />
            </div>

            <p
              className={`mt-2 font-semibold text-sm ${
                donation.status === "Approved"
                  ? "text-green-600"
                  : donation.status === "Rejected"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}
            >
              {donation.status || "Pending"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonationDetails;
