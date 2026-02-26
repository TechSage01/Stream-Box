import React from "react";
import {
  FaTwitter,
  FaTiktok,
  FaFacebook,
  FaWhatsapp,
  FaTelegram,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              StreamBox
            </h2>
            <p className="text-sm leading-relaxed text-gray-500">
              Stream unlimited movies, TV shows, and exclusive content.
              Entertainment redefined for modern viewers.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4 mt-6">
              <a href="#" className="hover:text-white transition">
                <FaTwitter size={18} />
              </a>
              <a href="#" className="hover:text-white transition">
                <FaTiktok size={18} />
              </a>
              <a href="#" className="hover:text-white transition">
                <FaFacebook size={18} />
              </a>
              <a href="#" className="hover:text-white transition">
                <FaWhatsapp size={18} />
              </a>
              <a href="#" className="hover:text-white transition">
                <FaTelegram size={18} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">
              Navigation
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="/" className="hover:text-white transition">
                  Home
                </a>
              </li>
              <li>
                <a href="/movies" className="hover:text-white transition">
                  Movies
                </a>
              </li>
              <li>
                <a href="/tv-shows" className="hover:text-white transition">
                  TV Shows
                </a>
              </li>
              <li>
                <a href="/contact-us" className="hover:text-white transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">
              Legal
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="/privacy-policy" className="hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/user-agreement" className="hover:text-white transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <span className="text-gray-500">
                  DMCA
                </span>
              </li>
            </ul>
          </div>

          {/* App / Info */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">
              Get the App
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Stream anywhere. Download our mobile app (Coming Soon).
            </p>

            <div className="border border-gray-700 rounded-md px-4 py-2 text-sm text-gray-500">
              iOS & Android
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-12 pt-6 text-center">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} StreamBox. All rights reserved.
          </p>
          <p className="text-xs text-gray-700 mt-2 max-w-3xl mx-auto">
            Disclaimer: StreamBox does not host or store any media files.
            All content is provided by third-party sources.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;