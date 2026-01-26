  import React, { useEffect, useState, useRef } from "react";
  import { signOut, onAuthStateChanged } from "firebase/auth";
  import { auth } from "../firebase";
  import avatar from "../assets/avatar.jpg";
  import streambox from "../assets/streambox.png";
  import { useNavigate } from "react-router-dom";
  import { GiHamburgerMenu } from "react-icons/gi";
  import { AiOutlineClose } from "react-icons/ai";
  import { motion, AnimatePresence } from "framer-motion";
  import { useLocation } from "react-router-dom";
  import {
    FiLogOut,
    FiSearch,
    FiHome,
    FiFilm,
    FiTv,
    FiTrendingUp,
  } from "react-icons/fi";

  const Dashboardheader = () => {
    const [username, setUsername] = useState("");
    const [movieName, setMoviename] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);
    const [hoverProfile, setHoverProfile] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);

    const navigate = useNavigate();
    const profileRef = useRef(null);
    const fileInputRef = useRef(null);

    /* AUTH USER */
    useEffect(() => {
      const unsub = onAuthStateChanged(auth, (user) => {
        if (user) setUsername(user.displayName || "User");
      });
      return () => unsub();
    }, []);

    /* CLOSE PROFILE DROPDOWN WHEN CLICK OUTSIDE */
    useEffect(() => {
      const close = (e) => {
        if (profileRef.current && !profileRef.current.contains(e.target)) {
          setProfileOpen(false);
        }
      };
      document.addEventListener("mousedown", close);
      return () => document.removeEventListener("mousedown", close);
    }, []);

    /* CLOSE SUGGESTIONS DROPDOWN WHEN CLICK OUTSIDE */
    useEffect(() => {
      const close = (e) => {
        if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
          setShowSuggestions(false);
        }
      };
      document.addEventListener("mousedown", close);
      return () => document.removeEventListener("mousedown", close);
    }, []);

    // Track viewport width to make menu open on md+ by default
    useEffect(() => {
      const check = () => {
        const desktop = typeof window !== "undefined" && window.innerWidth >= 768;
        setIsDesktop(desktop);
        setMenuOpen(desktop);
      };

      check();
      window.addEventListener("resize", check);
      return () => window.removeEventListener("resize", check);
    }, []);

    /* FETCH SUGGESTIONS WHEN USER TYPES */
    useEffect(() => {
      if (!movieName.trim() || movieName.length < 1) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      const fetchSuggestions = async () => {
        setSearchLoading(true);
        try {
          const res = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=a687c20174983fe7d8ade1c3256b84b4&query=${movieName}`
          );
          const data = await res.json();
          setSuggestions((data.results || []).slice(0, 6));
          setShowSuggestions(true);
        } catch (error) {
          console.error(error);
        } finally {
          setSearchLoading(false);
        }
      };

      const timer = setTimeout(fetchSuggestions, 300);
      return () => clearTimeout(timer);
    }, [movieName]);

    const toMoviesPage = () => {
      if (!movieName.trim()) return;
      navigate(`/search?name=${movieName}`);
      setMenuOpen(false);
      setShowSuggestions(false);
    };

    const handleSuggestionClick = (movie) => {
      setMoviename(movie.title);
      navigate(`/search?name=${movie.title}`);
      setShowSuggestions(false);
      setMenuOpen(false);
    };

    const handleLogout = async () => {
      try {
        setLogoutLoading(true);
        await signOut(auth);
        navigate("/login");
      } catch (err) {
        console.error(err);
        setLogoutLoading(false);
      }
    };

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        console.log("Selected image:", file);
      }
    };

    const location = useLocation();

    const menuItems = [
      { name: "Home", path: "/dashboard", icon: FiHome },
      { name: "Movies", path: "/movies", icon: FiFilm },
      { name: "TV Shows", path: "/tv", icon: FiTv },
      { name: "Most Watched", path: "/trending", icon: FiTrendingUp },
    ];

    return (
      <>
        <header className="sticky top-0 z-50 bg-black/90 backdrop-blur border-b border-white/5">
          <nav className="max-w-7xl mx-auto px-4">
            {/* MOBILE LAYOUT: Two rows (shown on 768px and below) */}
            <div className="md:hidden">
              {/* FIRST ROW: Logo, Hamburger, Profile */}
              <div className="flex items-center justify-between py-4">
                {/* LEFT: Hamburger */}
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="text-white text-2xl hover:text-red-600 transition"
                >
                  {menuOpen ? <AiOutlineClose /> : <GiHamburgerMenu />}
                </button>

                {/* CENTER: Logo */}
                <img
                  src={streambox}
                  alt="StreamBox"
                  className="h-9 cursor-pointer opacity-90 hover:opacity-100 bg-transparent"
                  onClick={() => navigate("/dashboard")}
                />

                {/* RIGHT: PROFILE PICTURE */}
                <div
                  className="relative"
                  onMouseEnter={() => setHoverProfile(true)}
                  onMouseLeave={() => setHoverProfile(false)}
                >
                  <img
                    src={avatar}
                    alt="Profile"
                    className="h-10 w-10 rounded-full border-2 border-red-700 hover:border-red-600 cursor-pointer"
                    onClick={() => setShowProfileModal(true)}
                    ref={profileRef}
                  />
                  {hoverProfile && (
                    <div className="absolute right-0 mt-2 w-max bg-black text-white px-3 py-1 rounded-md shadow-lg text-sm whitespace-nowrap">
                      Hi, {username}
                    </div>
                  )}
                </div>
              </div>

              {/* SECOND ROW: Search input (centered) */}
              <div className="flex justify-center pb-4 px-4">
                <div ref={suggestionsRef} className="w-full max-w-[400px] relative">
                  <div className="flex w-full min-w-0 bg-[#121212] rounded-md overflow-hidden border border-[#b00020]/50 focus-within:border-[#b00020] focus-within:shadow-[0_0_10px_rgba(176,0,32,0.55)] transition">
                    <input
                      type="text"
                      placeholder="Search movies, TV shows..."
                      value={movieName}
                      onChange={(e) => setMoviename(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && toMoviesPage()}
                      className="
                        flex-1 min-w-0
                        bg-transparent text-white placeholder-gray-400
                        px-3 sm:px-5 py-2.5
                        text-sm
                        focus:outline-none
                      "
                    />
                    <button
                      onClick={toMoviesPage}
                      className="
                        bg-[#b00020] hover:bg-[#8f001a]
                        px-4 sm:px-5
                        flex items-center justify-center
                        transition
                        active:scale-95
                      "
                    >
                      <FiSearch className="text-white" size={18} />
                    </button>
                  </div>

                  {/* SUGGESTIONS DROPDOWN */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full mt-2 w-full bg-[#1a1a1a] border border-[#b00020]/50 rounded-md shadow-xl z-50 max-h-[300px] overflow-y-auto">
                      {suggestions.map((movie) => (
                        <button
                          key={movie.id}
                          onClick={() => handleSuggestionClick(movie)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#b00020]/20 transition text-left border-b border-white/5 last:border-b-0"
                        >
                          <img
                            src={
                              movie.poster_path
                                ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                                : "https://via.placeholder.com/50x75?text=No+Image"
                            }
                            alt={movie.title}
                            className="w-10 h-16 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">
                              {movie.title}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {movie.release_date?.split("-")[0] || "N/A"}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* DESKTOP LAYOUT: Single row (shown on 768px and above) */}
            <div className="hidden md:flex items-center justify-between py-4 gap-4">
              {/* LEFT: Hamburger + Logo */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="text-white text-2xl hover:text-red-600 transition"
                >
                  {menuOpen ? <AiOutlineClose /> : <GiHamburgerMenu />}
                </button>

                <img
                  src={streambox}
                  alt="StreamBox"
                  className="h-9 cursor-pointer opacity-90 hover:opacity-100 bg-transparent"
                  onClick={() => navigate("/dashboard")}
                />
              </div>

              {/* CENTER: Search input */}
              <div className="flex-1 flex justify-center">
                <div ref={suggestionsRef} className="w-full max-w-[400px] relative">
                  <div className="flex w-full bg-[#1a1a1a] rounded-md overflow-hidden">
                    <input
                      type="text"
                      placeholder="Search movies, TV shows..."
                      value={movieName}
                      onChange={(e) => setMoviename(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && toMoviesPage()}
                      className="
                        w-full bg-transparent text-white placeholder-gray-400
                        px-5 py-2 text-sm
                        focus:outline-none focus:ring-1 focus:ring-red-700
                      "
                    />
                    <button
                      onClick={toMoviesPage}
                      className="
                        bg-red-700 hover:bg-red-800
                        px-5
                        flex items-center justify-center transition
                      "
                    >
                      <FiSearch className="text-white" size={18} />
                    </button>
                  </div>

                  {/* SUGGESTIONS DROPDOWN */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full mt-2 w-full bg-[#1a1a1a] border border-red-700/50 rounded-md shadow-xl z-50 max-h-[300px] overflow-y-auto">
                      {suggestions.map((movie) => (
                        <button
                          key={movie.id}
                          onClick={() => handleSuggestionClick(movie)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-700/20 transition text-left border-b border-white/5 last:border-b-0"
                        >
                          <img
                            src={
                              movie.poster_path
                                ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                                : "https://via.placeholder.com/50x75?text=No+Image"
                            }
                            alt={movie.title}
                            className="w-10 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="text-white text-sm font-medium truncate">
                              {movie.title}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {movie.release_date?.split("-")[0] || "N/A"}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT: PROFILE PICTURE */}
              <div
                className="relative"
                onMouseEnter={() => setHoverProfile(true)}
                onMouseLeave={() => setHoverProfile(false)}
              >
                <img
                  src={avatar}
                  alt="Profile"
                  className="h-12 w-12 rounded-full border-2 border-red-700 hover:border-red-600 cursor-pointer"
                  onClick={() => setShowProfileModal(true)}
                  ref={profileRef}
                />
                {hoverProfile && (
                  <div className="absolute right-0 mt-2 w-max bg-black text-white px-3 py-1 rounded-md shadow-lg text-sm whitespace-nowrap">
                    Hi, {username}
                  </div>
                )}
              </div>
            </div>
          </nav>

          {/* HAMBURGER MENU */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                className="fixed inset-0 bg-black z-40 md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMenuOpen(false)}
              />
            )}
          </AnimatePresence>

          {/* SIDEBAR */}
          <AnimatePresence>
            {menuOpen && (
              <motion.aside
                className="fixed top-0 left-0 h-full w-[280px] bg-black z-50 shadow-2xl md:top-14 md:absolute md:h-auto md:w-[320px]"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
                drag="x"
                dragConstraints={{ left: -300, right: 0 }}
                onDragEnd={(e, info) => {
                  if (info.offset.x < -120) setMenuOpen(false);
                }}
              >
                {/* HEADER */}
                <div className="px-4 py-4 border-b border-white/10 flex items-center justify-between">
                  <img src={streambox} alt="StreamBox" className="h-6" />
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="text-white text-xl hover:text-red-500 transition"
                  >
                    <AiOutlineClose />
                  </button>
                </div>

                {/* MENU */}
                <div className="flex flex-col px-2 py-4 gap-1 border m-2 rounded-md bg-black">
                  {menuItems.map(({ name, path, icon: Icon }) => {
                    const active = location.pathname === path;

                    return (
                      <button
                        key={name}
                        onClick={() => {
                          navigate(path);
                          setMenuOpen(false);
                        }}
                        className={`
                    flex items-center gap-3 px-4 py-3 rounded-md text-sm transition
                    ${
                      active
                        ? "bg-red-700 text-white"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }
                  `}
                      >
                        <Icon size={18} />
                        {name}
                      </button>
                    );
                  })}

                  {/* LOGOUT */}
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    disabled={logoutLoading}
                    className="mt-4 flex items-center gap-3 px-4 py-3 rounded-md text-red-500 hover:bg-white/5 transition"
                  >
                    <FiLogOut size={18} />
                    {logoutLoading ? "Logging out..." : "Logout"}
                  </button>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        </header>

        {/* HIDDEN FILE INPUT */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />

        {/* PROFILE PICTURE MODAL */}
        {showProfileModal && (
          <div className="fixed inset-0 bg-black/60 z-[1000] flex items-center justify-center px-4">
            <div className="bg-white p-6 rounded-xl text-center max-w-sm w-full shadow-xl">
              <h3 className="text-lg font-semibold text-gray-800">
                Change Profile Picture?
              </h3>

              <p className="text-sm text-gray-600 mt-2">
                Do you want to update your profile picture?
              </p>

              <div className="mt-5 flex gap-3 justify-center">
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-md font-semibold"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    setShowProfileModal(false);
                    fileInputRef.current.click();
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-semibold"
                >
                  Yes, Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* LOGOUT CONFIRMATION MODAL */}
        {showLogoutModal && (
          <div className="fixed inset-0 bg-black/60 z-[1000] flex items-center justify-center px-4">
            <div className="bg-white p-6 rounded-xl text-center max-w-sm w-full shadow-xl">
              <h3 className="text-lg font-semibold text-gray-800">
                Confirm Logout?
              </h3>

              <p className="text-sm text-gray-600 mt-2">
                Are you sure you want to logout?
              </p>

              <div className="mt-5 flex gap-3 justify-center">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md font-semibold"
                >
                  Cancel
                </button>

                <button
                  onClick={handleLogout}
                  disabled={logoutLoading}
                  className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-md font-semibold disabled:opacity-50"
                >
                  {logoutLoading ? "Logging out..." : "Yes, Logout"}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  export default Dashboardheader;
