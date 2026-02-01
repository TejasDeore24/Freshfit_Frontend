import React from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Building2,
  Gift,
  Recycle,
  HeartHandshake,
  Users
} from "lucide-react";
import Testimonials from "../components/Testimonials";

function Home({ isLoggedIn, mode }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto py-16 px-6 text-center">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
          Welcome to <span className="text-indigo-600">FreshFit</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
          Join us in making the world a better place 🌍. Donate your clothes,
          help NGOs, and support sustainability by giving your old clothes a new life.
        </p>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-6 mb-16">

        {/* User Card */}
        {(mode === "default" || mode === "user") && (
          <div className="bg-white shadow-xl rounded-2xl p-8 text-center border hover:shadow-2xl transition">
            <User className="mx-auto text-indigo-600 mb-4" size={48} />
            <h2 className="text-2xl font-bold text-gray-800 mb-3">For Users</h2>
            <p className="text-gray-600 mb-6">
              Donate clothes easily and track your donations with progress updates.
            </p>
            {!isLoggedIn ? (
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => navigate("/login")}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-semibold shadow-lg hover:scale-105 transition flex items-center justify-center gap-2"
                >
                  👤 Login as User
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg hover:scale-105 transition flex items-center justify-center gap-2"
                >
                  📝 Register as User
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate("/dashboard")}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-300 text-white font-semibold shadow-lg hover:scale-105 transition flex items-center justify-center gap-2"
              >
                📊 Go to Dashboard
              </button>
            )}
          </div>
        )}

        {/* NGO Card */}
        {(mode === "default" || mode === "ngo") && (
          <div className="bg-white shadow-xl rounded-2xl p-8 text-center border hover:shadow-2xl transition">
            <Building2 className="mx-auto text-green-600 mb-4" size={48} />
            <h2 className="text-2xl font-bold text-gray-800 mb-3">For NGOs</h2>
            <p className="text-gray-600 mb-6">
              Accept donations directly from users and manage your NGO dashboard easily.
            </p>
            {!isLoggedIn ? (
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => navigate("/ngo-login")}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold shadow-lg hover:scale-105 transition flex items-center justify-center gap-2"
                >
                  🏢 Login as NGO
                </button>
                <button
                  onClick={() => navigate("/ngo-register")}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg hover:scale-105 transition flex items-center justify-center gap-2"
                >
                  ✨ Register as NGO
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate("/ngo-dashboard")}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold shadow-lg hover:scale-105 transition flex items-center justify-center gap-2"
              >
                📊 Go to NGO Dashboard
              </button>
            )}
          </div>
        )}

        {/* Join NGO Card - visible only to logged-in users */}
        {isLoggedIn && mode === "user" && (
          <div className="bg-white shadow-xl rounded-2xl p-8 text-center border hover:shadow-2xl transition">
            <HeartHandshake className="mx-auto text-purple-600 mb-4" size={48} />
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Want to Be a Part of an NGO?
            </h2>
            <p className="text-gray-600 mb-6">
              Join your favorite NGO and start volunteering today! Help them
              with collection, delivery, or community work.
            </p>
            <button
              onClick={() => navigate("/join-ngo")}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 transition flex items-center justify-center gap-2"
            >
              🤝 Join an NGO
            </button>
          </div>
        )}

        {/* Volunteer Requests Card - visible only to logged-in NGOs */}
        {isLoggedIn && mode === "ngo" && (
          <div className="bg-white shadow-xl rounded-2xl p-8 text-center border hover:shadow-2xl transition">
            <Users className="mx-auto text-teal-600 mb-4" size={48} />
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Manage Volunteer Requests
            </h2>
            <p className="text-gray-600 mb-6">
              Review and approve volunteer requests from users who want to join your NGO.
            </p>
            <button
              onClick={() => navigate("/ngo/manage-volunteers")}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-teal-500 to-green-500 text-white font-semibold shadow-lg hover:scale-105 transition flex items-center justify-center gap-2"
            >
              👥 View Requests
            </button>
          </div>
        )}
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-gray-100 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Why Choose <span className="text-indigo-600">FreshFit?</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
          <div className="bg-white rounded-2xl p-6 shadow-md text-center hover:shadow-xl transition">
            <Gift className="mx-auto text-pink-500 mb-3" size={40} />
            <h3 className="text-xl font-semibold mb-2">Easy Donations</h3>
            <p className="text-gray-600">
              Donate clothes with just a few clicks and help those in need.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md text-center hover:shadow-xl transition">
            <Recycle className="mx-auto text-green-500 mb-3" size={40} />
            <h3 className="text-xl font-semibold mb-2">Sustainability</h3>
            <p className="text-gray-600">
              Promote eco-friendly practices by recycling and reusing clothes.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md text-center hover:shadow-xl transition">
            <HeartHandshake className="mx-auto text-indigo-500 mb-3" size={40} />
            <h3 className="text-xl font-semibold mb-2">Trusted NGOs</h3>
            <p className="text-gray-600">
              Partnered with verified NGOs to ensure your donations reach the right hands.
            </p>
          </div>
        </div>
        {/* Testimonials Section - Horizontal Carousel */}
 <Testimonials/>


        {/* FAQ Section */}
        <div className="bg-gray-100 py-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
            Frequently Asked Questions
          </h2>
          <div className="max-w-4xl mx-auto px-6 space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">How do I donate clothes?</h3>
              <p className="text-gray-600">
                Simply register as a user, select an NGO, and follow the instructions to donate your clothes.
                We’ll provide progress updates once your donation is accepted.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Can I volunteer for an NGO?</h3>
              <p className="text-gray-600">
                Yes! If you’re a registered user, you can join NGOs listed on the platform to volunteer for collection, delivery, and community events.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Are my donations really reaching the NGOs?</h3>
              <p className="text-gray-600">
                Absolutely! We partner only with verified NGOs and provide tracking updates for all donations.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Home;
