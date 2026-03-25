import { useParams, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

const MoviePlayer = () => {
  const API_KEY =
    import.meta.env.VITE_TMDB_API_KEY || import.meta.env.VITE_API_KEY;
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const rawType = searchParams.get("type");
  const mediaType = rawType === "tv" || rawType === "animation" ? "tv" : "movie";

  const fetchMovieUrl = `https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${API_KEY}`;
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // DEBUG: Log incoming data
  useEffect(() => {
    console.log("=== MoviePlayer Debug ===");
    console.log("ID from URL:", id);
    console.log("Type from URL:", rawType);
    console.log("Media Type (tv/movie):", mediaType);
    console.log("Fetch URL:", fetchMovieUrl);
  }, [id, rawType, mediaType, fetchMovieUrl]);

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(fetchMovieUrl);
        if (!res.ok) throw new Error("Movie not found");
        const data = await res.json();
        console.log("Fetched movie data:", data);
        setMovie(data);
      } catch (err) {
        console.error("Error fetching movie details:", err);
        setError(err.message || "Error loading movie");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id, mediaType, fetchMovieUrl]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-xl text-red-500">{error || "Movie not found"}</p>
      </div>
    );
  }

  const displayTitle = movie?.title || movie?.name || "Untitled";

  return (
    <div
      className="min-h-screen bg-cover bg-center p-6"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="max-w-6xl mx-auto bg-black bg-opacity-70 rounded-xl p-6 flex flex-col md:flex-row gap-6 text-white">
        {/* Poster */}
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "https://via.placeholder.com/300x450?text=No+Image"
          }
          alt={displayTitle}
          className="rounded-xl shadow-lg w-full md:w-1/3"
        />

        {/* Details & Player */}
        <div className="flex-1 flex flex-col gap-4">
          <h1 className="text-3xl font-bold">{displayTitle}</h1>
          <p className="text-gray-400 text-sm">ID: {id} | Type: {mediaType}</p>
          <p className="text-gray-300">{movie.overview}</p>

          <div className="mt-4 bg-black/50 rounded-xl overflow-hidden">
            <iframe
              src={
                mediaType === "tv"
                  ? `https://vidsrc.me/embed/tv?tmdb=${id}`
                  : `https://vidsrc.me/embed/movie?tmdb=${id}`
              }
              width="100%"
              height="500"
              allowFullScreen
              title="player"
              className="rounded-xl"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
            <p className="text-sm text-gray-400">
              Player: vidsrc.me (TMDB ID: {id})
            </p>
            
            <a 
              href={
                mediaType === "tv"
                  ? `https://vidsrc.me/embed/tv?tmdb=${id}`
                  : `https://vidsrc.me/embed/movie?tmdb=${id}`
              }
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download / External Player
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoviePlayer;