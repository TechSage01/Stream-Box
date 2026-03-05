import React, { useEffect, useState } from "react";
import Dashboardheader from "../components/dashboard-header.jsx";
import Moviedisplay from "../components/Moviedisplay.jsx";
import dashboardBackground from "../assets/dashboard-background.png";

const Trending = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("watchedMovies")) || [];
      setMovies(stored);
    } catch (err) {
      console.error("Failed to read watched movies", err);
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
            Most Watched
          </h2>

          {movies.length === 0 && (
            <p className="text-gray-300">You haven't watched any movies yet.</p>
          )}

          {/* numbered ranking list */}
          {movies.length > 0 && (
            <ol className="space-y-4">
              {movies.map((movie, idx) => (
                <li
                  key={movie.id}
                  className="flex items-center gap-4 bg-white/5 p-3 rounded-md"
                >
                  <span className="text-white text-xl font-bold w-8 text-center">
                    {idx + 1}.
                  </span>
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                        : "https://via.placeholder.com/50x75?text=No+Image"
                    }
                    alt={movie.title}
                    className="w-12 h-18 object-cover rounded"
                  />
                  <span className="text-white font-semibold truncate">
                    {movie.title}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>
    </>
  );
};

export default Trending;
