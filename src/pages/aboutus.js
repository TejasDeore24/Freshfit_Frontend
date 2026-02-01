import React from "react";

function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center text-red-600 mb-6">
        About DonateHub
      </h1>
      <p className="text-lg text-gray-700 mb-4 leading-relaxed">
        DonateHub is a community-driven platform designed to connect generous donors with NGOs
        and those in need. Whether it's clothing, essentials, or other goods, we believe in
        making the donation process easier, faster, and more impactful.
      </p>
      <p className="text-lg text-gray-700 mb-4 leading-relaxed">
        Our mission is to build a bridge between kindness and need. We ensure your contributions
        reach trusted organizations and make a real difference. Every donation counts!
      </p>
      <p className="text-lg text-gray-700 leading-relaxed">
        Join us in our journey to create a more caring world — one donation at a time.
      </p>
    </div>
  );
}

export default About;
