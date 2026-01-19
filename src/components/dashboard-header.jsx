import React, { useEffect, useState, useRef } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import avatar from "../assets/avatar.jpg";
import streambox from "../assets/streambox.png";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

const Dashboardheader = () => {
  const [modal, setModal] = useState(false);
  const [username, setUsername] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false); // ✅ added

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsername(user.displayName || "User");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      await signOut(auth);

      setTimeout(() => {
        navigate("/login");
      }, 1200); // ⏳ loading before redirect
    } catch (err) {
      console.error("Logout failed:", err);
      setLogoutLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Selected profile image:", file);
    }
  };

  return (
    <header className="w-full bg-black shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Logo */}
          <img
            src={streambox}
            alt="StreamBox Logo"
            className="h-10 mx-auto sm:mx-0"
          />

          {/* Right Section */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            {/* Avatar + Welcome */}
            <div className="flex items-center gap-2">
              <img
                src={avatar}
                alt="Profile"
                className="h-10 w-10 rounded-full border-2 border-red-600 cursor-pointer"
                onClick={() => setShowProfileModal(true)}
              />

              <span className="text-sm text-gray-300 whitespace-nowrap">
                Welcome back,{" "}
                <span className="text-white font-semibold">{username}</span>
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => setModal(true)}
              className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md text-sm transition w-full sm:w-auto"
            >
              <FiLogOut size={16} />
              Logout
            </button>

            {/* Logout Modal */}
            {modal && (
              <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center px-4">
                <div className="bg-white p-6 rounded-xl text-center max-w-sm w-full shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Confirm Logout
                  </h3>

                  <p className="text-sm text-gray-600 mt-2">
                    Are you sure you want to log out of your account?
                  </p>

                  <div className="mt-5 flex gap-3 justify-center">
                    <button
                      onClick={() => setModal(false)}
                      disabled={logoutLoading}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md font-semibold transition"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleLogout}
                      disabled={logoutLoading}
                      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md font-semibold transition
                        ${
                          logoutLoading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700 text-white"
                        }`}
                    >
                      {logoutLoading && (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      )}
                      {logoutLoading ? "Logging out..." : "Yes, Logout"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hidden File Input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Profile Picture Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center px-4">
          <div className="bg-white p-6 rounded-xl text-center max-w-sm w-full shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800">
              Change Profile Picture?
            </h3>

            <p className="text-sm text-gray-600 mt-2">
              Are you sure you want to update your profile picture?
            </p>

            <div className="mt-5 flex gap-3 justify-center">
              <button
                onClick={() => setShowProfileModal(false)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-semibold transition"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setShowProfileModal(false);
                  fileInputRef.current.click();
                }}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-semibold transition"
              >
                Yes, Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Dashboardheader;
