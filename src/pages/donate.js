import { useState, useEffect } from "react";
import API_URL from "../config";

function Donate() {
  const [formData, setFormData] = useState({
    ngo_id: "",
    category: "",
    quantity: "",
    address: "",
    notes: "",
  });
  const [photo, setPhoto] = useState(null);
  const [ngos, setNgos] = useState([]);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [user, setUser] = useState(null);

  // Load logged-in user info and fetch NGOs
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser) setUser(loggedInUser);

    fetch("http://localhost:5000/ngos")
      .then(res => res.json())
      .then(data => {
        if (data.success) setNgos(data.ngos); // Make sure backend returns _id
      })
      .catch(() => setMessage("Error fetching NGOs."));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage("");
  };

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user._id) {
      setMessage("You must be logged in to donate.");
      return;
    }

    for (let key in formData) {
      if (!formData[key] && key !== "notes") {
        setMessage("Please fill in all required fields.");
        return;
      }
    }

    if (!photo) {
      setMessage("Please upload a photo of the item.");
      return;
    }

    // Prepare FormData
    const donationData = new FormData();
    donationData.append("user_id", user._id); // ✅ use _id from MongoDB
    donationData.append("ngo_id", formData.ngo_id); // ✅ ensure this is Mongo _id
    donationData.append("category", formData.category);
    donationData.append("quantity", formData.quantity);
    donationData.append("address", formData.address);
    donationData.append("notes", formData.notes);
    donationData.append("photo", photo);

    try {
      const res = await fetch( `${API_URL}/donate`, {
        method: "POST",
        body: donationData,
      });
      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        setMessage("Donation submitted successfully!");
      } else {
        setMessage(data.message || "Error submitting donation.");
      }
    } catch (err) {
      setMessage("Server error. Please try again.");
    }
  };

  const handleDonateMore = () => {
    setFormData({
      ngo_id: "",
      category: "",
      quantity: "",
      address: "",
      notes: "",
    });
    setPhoto(null);
    setMessage("");
    setSubmitted(false);
  };

  if (!user) {
    return (
      <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow text-center">
        <p>Please login to donate.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Donate Item</h2>

      {message && (
        <p
          className={`text-center mb-4 ${
            submitted ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          <p className="text-gray-700 font-medium">
            Donor: {user.name} ({user.email})
          </p>

          {/* NGO Dropdown */}
          <select
            name="ngo_id"
            value={formData.ngo_id}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select NGO</option>
            {ngos.map((ngo) => (
              <option key={ngo._id} value={ngo._id}>
                {ngo.name}
              </option>
            ))}
          </select>

          {/* Category Dropdown */}
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select Category</option>
            <option value="Clothes">Clothes</option>
            <option value="Books">Books</option>
            <option value="Food">Food</option>
            <option value="Toys">Toys</option>
            <option value="Other">Other</option>
          </select>

          <input
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Quantity"
            type="number"
            className="w-full border p-2 rounded"
            required
          />

          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Pickup Address"
            className="w-full border p-2 rounded"
            rows="3"
            required
          />

          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Additional Notes (optional)"
            className="w-full border p-2 rounded"
            rows="2"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border p-2 rounded"
            required
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Submit Donation
          </button>
        </form>
      ) : (
        <div className="text-center">
          <button
            onClick={handleDonateMore}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Donate More
          </button>
        </div>
      )}
    </div>
  );
}

export default Donate;
