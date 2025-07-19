import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        {/* About */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">TripForge AI</h3>
          <p className="text-sm text-gray-400 max-w-xl mx-auto">
            Your smart travel companion. Plan personalized, multi-city itineraries effortlessly with the power of AI.
          </p>
        </div>

        {/* Horizontal Links */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-300 mb-6">
          <Link href="/itinerary-form" className="hover:underline">Plan Your Trip</Link>
          <Link href="/save_trips_page" className="hover:underline">Saved Trips</Link>
          <Link href="/explore" className="hover:underline">Explore</Link>
          <Link href="/about" className="hover:underline">About Us</Link>
          <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
          <Link href="/terms" className="hover:underline">Terms of Service</Link>
        </div>

        {/* Copyright */}
        <div className="text-gray-500 text-sm border-t border-gray-800 pt-4">
          © {new Date().getFullYear()} TripForge AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
