import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2, MapPin, Package, Building2, ClipboardCheck } from "lucide-react";

function DonationDetails() {
  const { id } = useParams();
  const [donation, setDonation] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/donation/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setDonation(data.donation);
      })
      .catch((err) => console.log(err));
  }, [id]);

  if (!donation)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-blue-500" />
      </div>
    );

  // Determine status progress percentage
  const getStatusPercentage = (status) => {
    switch (status) {
      case "Approved":
        return 100;
      case "Rejected":
        return 100;
      default: // Pending
        return 50;
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800 tracking-tight">
          Donation Details
        </h1>

        <div className="bg-white shadow-xl rounded-2xl p-8 space-y-6 transition transform hover:scale-[1.01] duration-300">
          {/* Category */}
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-500" />
              <span className="font-semibold text-gray-700">Category</span>
            </div>
            <span className="text-gray-900 font-medium">{donation.category}</span>
          </div>

          {/* Quantity */}
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-green-500" />
              <span className="font-semibold text-gray-700">Quantity</span>
            </div>
            <span className="text-gray-900 font-medium">{donation.quantity}</span>
          </div>

          {/* Address */}
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-500" />
              <span className="font-semibold text-gray-700">Address</span>
            </div>
            <span className="text-gray-900 font-medium">{donation.address}</span>
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

          {/* Status */}
          <div className="pt-3">
            <span className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
              Status
            </span>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
              <div
                className={`${statusColor(donation.status)} h-4 rounded-full transition-all duration-500`}
                style={{ width: `${getStatusPercentage(donation.status)}%` }}
              ></div>
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
