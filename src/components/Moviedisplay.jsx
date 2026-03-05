import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlay, FaBookmark, FaRegBookmark, FaSpinner } from "react-icons/fa";

const Moviedisplay = ({ movie }) => {
  const navigate = useNavigate();
  const [inWatchlist, setInWatchlist] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("watchlist")) || [];
      return stored.some((m) => m.id === movie.id);
    } catch {
      return false;
    }
  });
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : movie.image
    ? movie.image
    : "https://via.placeholder.com/300x450?text=No+Image";

  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  const handleWatchClick = (e) => {
    e.stopPropagation();
    try {
      const stored = JSON.parse(localStorage.getItem("watchedMovies")) || [];
      if (!stored.find((m) => m.id === movie.id)) {
        stored.push(movie);
        localStorage.setItem("watchedMovies", JSON.stringify(stored));
      }
    } catch (err) {
      console.error("Failed to save watched movie", err);
    }
  };

  const handleWatchlistClick = (e) => {
    e.stopPropagation();
    setWatchlistLoading(true);
    try {
      const stored = JSON.parse(localStorage.getItem("watchlist")) || [];
      if (inWatchlist) {
        const updated = stored.filter((m) => m.id !== movie.id);
        localStorage.setItem("watchlist", JSON.stringify(updated));
        setInWatchlist(false);
      } else {
        if (!stored.find((m) => m.id === movie.id)) {
          stored.push(movie);
          localStorage.setItem("watchlist", JSON.stringify(stored));
          setInWatchlist(true);
        }
      }
    } catch (err) {
      console.error("Failed to update watchlist", err);
    } finally {
      // simulate brief delay to make spinner visible
      setTimeout(() => {
        setWatchlistLoading(false);
        if (!inWatchlist) {
          alert(`${movie.title} has been added successfully`);
        } else {
          alert(`${movie.title} has been removed from your watchlist`);
        }
      }, 300);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white/5 backdrop-blur-md border border-white/10 rounded-md overflow-hidden shadow-lg hover:scale-[1.02] transition cursor-pointer group"
    >
      <div className="relative">
        <img
          src={imageUrl}
          alt={movie.title}
          className="w-full h-[320px] object-cover"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
          <FaPlay size={40} className="text-white" />
        </div>
        {/* Watchlist Button */}
        <button
          onClick={handleWatchlistClick}
          disabled={watchlistLoading}
          className={
            `absolute top-2 right-2 bg-black/60 p-2 rounded-full transition ` +
            (watchlistLoading ? "cursor-wait" : "hover:bg-black/80 cursor-pointer")
          }
          title={
            watchlistLoading
              ? "Updating..."
              : inWatchlist
              ? "Remove from Watchlist"
              : "Add to Watchlist"
          }
        >
          {watchlistLoading ? (
            <FaSpinner className="text-white animate-spin" size={16} />
          ) : inWatchlist ? (
            <FaBookmark className="text-red-500" size={16} />
          ) : (
            <FaRegBookmark className="text-white" size={16} />
          )}
        </button>
      </div>

      <div className="p-3 space-y-2">
        <p className="text-white font-semibold text-sm truncate group-hover:text-red-500 transition">
          {movie.title}
        </p>

        <button onClick={handleWatchClick} className="w-full text-sm bg-[#b00020] hover:bg-[#8f001a] text-white py-2 rounded-md transition">
          Watch now
        </button>
      </div>
    </div>
  );
};

export default Moviedisplay;
