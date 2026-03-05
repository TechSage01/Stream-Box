import React, { useEffect, useState } from "react";
import Dashboardheader from "../components/dashboard-header.jsx";
import Moviedisplay from "../components/Moviedisplay.jsx";
import dashboardBackground from "../assets/dashboard-background.png";

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("watchlist")) || [];
      setWatchlist(stored);
    } catch (err) {
      console.error("Failed to read watchlist", err);
    }
  }, []);

  return (
    <>
      <Dashboardheader />

      <section
        className="min-h-screen bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: `url(${dashboardBackground})` }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 px-4 py-6">
          <h2 className="text-white text-lg font-semibold mb-4">
            My Watchlist
          </h2>

          {watchlist.length === 0 && (
            <p className="text-gray-300">Your watchlist is empty. Add movies to watch later!</p>
          )}

          {watchlist.length > 0 && (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {watchlist.map((movie) => (
                <Moviedisplay key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Watchlist;
