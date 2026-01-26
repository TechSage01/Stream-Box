import React, { useEffect, useState } from "react";
import Moviedisplay from "../components/Moviedisplay.jsx";
import Dashboardheader from "../components/dashboard-header.jsx";
import { useSearchParams } from "react-router-dom";

const Search = () => {
  const [searchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const movieName = searchParams.get("name");

  useEffect(() => {
    if (!movieName) return;

    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=a687c20174983fe7d8ade1c3256b84b4&query=${movieName}`
        );
        const data = await res.json();
        setMovies(data.results || []);
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

      <div className="min-h-screen px-4 py-6">
        <h2 className="text-white text-lg font-semibold mb-4">
          Search results for “{movieName}”
        </h2>

        {loading && (
          <p className="text-gray-400">Loading movies...</p>
        )}

        {!loading && movies.length === 0 && (
          <p className="text-gray-400">No movies found.</p>
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
    </>
  );
};

export default Search;
