import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const MoviePlayer = () => {
  const API_KEY = import.meta.env.VITE_API_KEY;

  const { id } = useParams();
  const fetchMovieUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`;
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      try {
        const res = await fetch(fetchMovieUrl);
        const data = await res.json();
        setMovie(data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!movie) {
    return <div className="text-center mt-10">Movie not found.</div>;
  }

  // Function for the download button
  const handleDownload = () => {
    const movieUrl = `https://vidsrc.xyz/embed/movie?tmdb=${id}`;
    window.open(movieUrl, "_blank");
    alert(
      "The movie has opened in a new tab. You can try to download it from there using browser options (right-click → Save As)."
    );
  };

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
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="rounded-xl shadow-lg w-full md:w-1/3"
        />

        {/* Details & Player */}
        <div className="flex-1 flex flex-col gap-4">
          <h1 className="text-3xl font-bold">{movie.title}</h1>
          <p className="text-gray-300">{movie.overview}</p>
          <div className="mt-4">
            <iframe
              src={`https://vidsrc.xyz/embed/movie?tmdb=${id}`}
              width="100%"
              height="500"
              allowFullScreen
              title="movie player"
              className="rounded-xl shadow-lg"
            />
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="mt-4 bg-red-600 hover:bg-red-700 transition text-white font-bold py-2 px-4 rounded-lg w-40"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoviePlayer;