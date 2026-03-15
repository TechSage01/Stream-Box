import React, { useEffect, useState } from "react";
import Moviedisplay from "../components/Moviedisplay.jsx";
import Dashboardheader from "../components/dashboard-header.jsx";
import { useSearchParams } from "react-router-dom";
import dashboardBackground from "../assets/dashboard-background.png";

const Search = () => {
  const [searchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const movieName = searchParams.get("name");

  useEffect(() => {
    if (!movieName) return;

    const fetchMovies = async () => {
      const API_KEY = import.meta.env.VITE_API_KEY;
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${movieName}&include_adult=false`
        );

        const data = await res.json();

        // Keep only movies and TV shows
        const filteredResults = (data.results || []).filter(
          (item) =>
            item.media_type === "movie" || item.media_type === "tv"
        );

        setMovies(filteredResults);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [movieName]);

  return (
    <>
      <Dashboardheader />

      {/* BACKGROUND SECTION */}
      <section
        className="min-h-screen bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: `url(${dashboardBackground})` }}
      >
        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/70" />

        {/* CONTENT */}
        <div className="relative z-10 px-4 py-6">
          <h2 className="text-white text-lg font-semibold mb-4">
            Search results for “{movieName}”
          </h2>

          {loading && (
            <p className="text-gray-300">Loading results...</p>
          )}

          {!loading && movies.length === 0 && (
            <p className="text-gray-300">No results found.</p>
          )}

          <div
            className="
              grid gap-4
              grid-cols-2
              sm:grid-cols-3
              md:grid-cols-4
              lg:grid-cols-5
            "
          >
            {movies.map((movie) => (
              <Moviedisplay key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Search;