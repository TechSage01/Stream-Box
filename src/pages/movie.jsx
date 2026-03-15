import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Dashboardheader from "../components/dashboard-header.jsx";
import Moviedisplay from "../components/Moviedisplay.jsx";
import { FaPlay, FaInfoCircle, FaPlus, FaStar, FaClock, FaCalendarAlt,  FaArrowLeft, FaRegBookmark, FaSpinner} from "react-icons/fa";
import { MdClose } from "react-icons/md";

const MoviePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      const API_KEY = import.meta.env.VITE_API_KEY;

      try {
        // Fetch movie details
        const movieRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
        );
        const movieData = await movieRes.json();
        setMovie(movieData);

        // Fetch credits (cast & crew)
        const creditsRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}`
        );
        const creditsData = await creditsRes.json();
        setCredits(creditsData);

        // Fetch similar movies
        const similarRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${API_KEY}`
        );
        const similarData = await similarRes.json();
        setSimilarMovies(similarData.results?.slice(0, 6) || []);

        // Fetch trailer
        const videosRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`
        );
        const videosData = await videosRes.json();
        const trailer = videosData.results?.find(v => v.type === "Trailer" && v.site === "YouTube");
        if (trailer) {
          setTrailerKey(trailer.key);
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
    window.scrollTo(0, 0);
  }, [id]);

  const formatRuntime = (minutes) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getYear = (date) => {
    if (!date) return "";
    return new Date(date).getFullYear();
  };

  const handleSimilarClick = (movieId) => {
    navigate(`/movie/${movieId}`);
    window.scrollTo(0, 0);
  };

  const [watchlistLoading, setWatchlistLoading] = useState(false);

const handleWatchlistClick = (movie) => {
  setWatchlistLoading(true);

  try {
    const stored = JSON.parse(localStorage.getItem("watchlist")) || [];
    const alreadyAdded = stored.find((m) => m.id === movie.id);

    let updated;

    if (alreadyAdded) {
      // remove from watchlist
      updated = stored.filter((m) => m.id !== movie.id);
      localStorage.setItem("watchlist", JSON.stringify(updated));
    } else {
      // add to watchlist
      updated = [...stored, movie];
      localStorage.setItem("watchlist", JSON.stringify(updated));
    }

    setTimeout(() => {
      setWatchlistLoading(false);

      if (!alreadyAdded) {
        alert(`${movie.title} has been added successfully`);
      } else {
        alert(`${movie.title} has been removed from your watchlist`);
      }
    }, 300);

  } catch (err) {
    console.error("Failed to update watchlist", err);
    setWatchlistLoading(false);
  }
};

  if (loading) {
    return (
      <>
        <Dashboardheader />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </>
    );
  }

  if (!movie) {
    return (
      <>
        <Dashboardheader />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <p className="text-white">Movie not found</p>
        </div>
      </>
    );
  }

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/300x450?text=No+Image";

  return (
    <>
      <Dashboardheader />

      {/* HERO SECTION */}
      <div className="relative min-h-[80vh] bg-black">
        {/* BACKDROP */}
        {backdropUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backdropUrl})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
          </div>
        )}

        {!backdropUrl && (
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        )}

        {/* CONTENT */}
        <div className="relative z-10 px-4 md:px-12 py-8 flex flex-col md:flex-row gap-8 items-end md:items-center max-w-7xl mx-auto">
          {/* POSTER */}
          <div className="hidden md:block flex-shrink-0">
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-64 rounded-lg shadow-2xl border-2 border-white/10"
            />
          </div>

          {/* INFO */}
          <div className="flex-1 text-center md:text-left">
            {/* TITLE */}
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              {movie.title}
            </h1>

            {/* META INFO */}
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
              {movie.release_date && (
                <span className="meta-item flex items-center gap-2">
                  <FaCalendarAlt size={12} />
                  {getYear(movie.release_date)}
                </span>
              )}
              {movie.runtime && (
                <span className="meta-item flex items-center gap-2">
                  <FaClock size={12} />
                  {formatRuntime(movie.runtime)}
                </span>
              )}
              {movie.vote_average > 0 && (
                <span className="meta-item flex items-center gap-2 text-yellow-400">
                  <FaStar size={12} />
                  {movie.vote_average.toFixed(1)}
                </span>
              )}
              {movie.adult && (
                <span className="meta-item bg-red-600">18+</span>
              )}
            </div>

            {/* GENRES */}
            {movie.genres?.length > 0 && (
              <div className="genres justify-center md:justify-start mb-6">
                {movie.genres.map((genre) => (
                  <span key={genre.id} className="genre-tag">
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* TAGLINE */}
            {movie.tagline && (
              <p className="text-gray-400 text-lg italic mb-4">"{movie.tagline}"</p>
            )}

            {/* OVERVIEW */}
            <p className="text-gray-300 text-sm md:text-base max-w-2xl mb-8 leading-relaxed">
              {movie.overview}
            </p>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <button
                onClick={()=> navigate(`/play/${movie.id}`)}
                className="btn-play flex items-center gap-3 px-8 py-3"
              >
                <FaPlay size={18} />
                Watch Now
              </button>

              {trailerKey && (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="btn-info flex items-center gap-3 px-8 py-3"
                >
                  <FaInfoCircle size={18} />
                  View Trailer
                </button>
              )}

              <button className="btn-watchlist flex items-center justify-center w-12 h-12"
                onClick={() => handleWatchlistClick(movie)}
                disabled={watchlistLoading}
              >
              {watchlistLoading ? (
                <FaSpinner className="spinner-icon" />
              ) : (
                <FaRegBookmark/>
              )}
                {/* <FaPlus size={18} /> */}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CAST & CREW SECTION */}
      {credits?.cast?.length > 0 && (
        <div className="bg-[#141414] py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Cast & Crew</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
              {credits.cast.slice(0, 10).map((person) => (
                <div key={person.id} className="flex-shrink-0 w-24 text-center">
                  <img
                    src={
                      person.profile_path
                        ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                        : "https://via.placeholder.com/100x150?text=No+Image"
                    }
                    alt={person.name}
                    className="w-20 h-20 rounded-full object-cover mx-auto mb-2 border-2 border-red-600"
                  />
                  <p className="text-white text-sm font-medium truncate">{person.name}</p>
                  <p className="text-gray-400 text-xs">{person.character}</p>
                </div>
              ))}
            </div>

            {/* DIRECTOR */}
            {credits.crew?.find((c) => c.job === "Director") && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-gray-400">
                  <span className="text-white font-semibold">Director: </span>
                  {credits.crew.find((c) => c.job === "Director").name}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SIMILAR MOVIES SECTION */}
      {similarMovies.length > 0 && (
        <div className="bg-black py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Similar Movies</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {similarMovies.map((similarMovie) => (
                <div
                  key={similarMovie.id}
                  onClick={() => handleSimilarClick(similarMovie.id)}
                  className="cursor-pointer group"
                >
                  <div className="relative rounded-lg overflow-hidden aspect-[2/3] mb-2">
                    <img
                      src={
                        similarMovie.poster_path
                          ? `https://image.tmdb.org/t/p/w500${similarMovie.poster_path}`
                          : "https://via.placeholder.com/300x450?text=No+Image"
                      }
                      alt={similarMovie.title}
                      className="w-full h-full object-cover transition transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <FaPlay size={30} className="text-white" />
                    </div>
                  </div>
                  <p className="text-white text-sm font-medium truncate group-hover:text-red-500 transition">
                    {similarMovie.title}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {getYear(similarMovie.release_date)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TRAILER MODAL */}
      {showTrailer && trailerKey && (
        <div className="fixed inset-0 z-[1000] bg-black/90 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-10 right-0 text-white text-3xl hover:text-red-500 transition"
            >
              <MdClose />
            </button>
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                title="Movie Trailer"
                className="w-full h-full rounded-lg"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      <style>{`
        .meta-item {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          color: #e5e5e5;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .genre-tag {
          display: inline-block;
          padding: 6px 14px;
          background-color: rgba(229, 9, 20, 0.8);
          color: #ffffff;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .btn-play {
          background-color: #e50914;
          color: #ffffff;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .btn-play:hover {
          background-color: #b00710;
          transform: scale(1.05);
        }

        .btn-info {
          background-color: rgba(255, 255, 255, 0.15);
          color: #ffffff;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .btn-info:hover {
          background-color: rgba(255, 255, 255, 0.25);
          border-color: rgba(255, 255, 255, 0.5);
          transform: scale(1.05);
        }

        .btn-watchlist {
          background-color: rgba(255, 255, 255, 0.15);
          color: #ffffff;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-watchlist:hover {
          background-color: rgba(255, 255, 255, 0.25);
          transform: scale(1.05);
        }

        .scrollbar-thin::-webkit-scrollbar {
          height: 6px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(229, 9, 20, 0.8);
          border-radius: 3px;
        }

        @media (max-width: 768px) {
          .min-h-\\[80vh\\] {
            min-height: 60vh;
          }
        }
      `}</style>
    </>
  );
};

export default MoviePage;


