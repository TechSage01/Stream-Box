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
  const category = searchParams.get("category");

  const API_BASE = "https://api.themoviedb.org/3";
  const API_KEY =
    import.meta.env.VITE_TMDB_API_KEY || import.meta.env.VITE_API_KEY;

  useEffect(() => {
    if (!movieName && !category) {
      setMovies([]);
      return;
    }

    const fetchMovies = async () => {
      setLoading(true);
      try {
        let endpoint = "";
        let categoryMode = false;

        if (category) {
          categoryMode = true;
          switch (category) {
            case "nollywood":
              endpoint = `${API_BASE}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
                "nollywood"
              )}&include_adult=false`;
              break;
            case "popular":
              endpoint = `${API_BASE}/movie/popular?api_key=${API_KEY}&include_adult=false`;
              break;
            case "teen-romance":
              endpoint = `${API_BASE}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
                "teen romance"
              )}&include_adult=false`;
              break;
            case "k-drama":
              endpoint = `${API_BASE}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(
                "korean drama"
              )}&include_adult=false`;
              break;
            case "anime":
              endpoint = `${API_BASE}/discover/tv?api_key=${API_KEY}&with_genres=16&sort_by=popularity.desc&include_adult=false`;
              break;
            default:
              categoryMode = false;
              break;
          }
        }

        if (!categoryMode && movieName) {
          endpoint = `${API_BASE}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(
            movieName
          )}&include_adult=false`;
        }

        if (!endpoint) {
          setMovies([]);
          setLoading(false);
          return;
        }

        const res = await fetch(endpoint);

        const data = await res.json();

        const filteredResults = (data.results || []).filter((item) => {
          if (categoryMode) {
            return !!item.title || !!item.name;
          }
          return item.media_type === "movie" || item.media_type === "tv";
        });

        setMovies(filteredResults);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [movieName, category, API_BASE, API_KEY]);

  const categoryTitleMap = {
    nollywood: "Nollywood Movies",
    popular: "Popular Movies",
    "teen-romance": "Teen Romance",
    "k-drama": "K-Drama",
    anime: "Anime",
  };

  const pageTitle = category
    ? categoryTitleMap[category] || "Movies"
    : `Search results for "${movieName}"`;

  return (
    <>
      <Dashboardheader />

      <section
        className="min-h-screen bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: `url(${dashboardBackground})` }}
      >
        <div className="absolute inset-0 bg-black/70" />

        <div className="relative z-10 px-4 py-6">
          <h2 className="text-white text-lg font-semibold mb-4">{pageTitle}</h2>

          {loading && <p className="text-gray-300">Loading results...</p>}

          {!loading && movies.length === 0 && (
            <p className="text-gray-300">No results found.</p>
          )}

          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
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