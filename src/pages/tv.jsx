import React, { useEffect, useMemo, useState } from "react";
import { FiSearch, FiStar } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Dashboardheader from "../components/dashboard-header.jsx";
const API_BASE = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p/w500";

const tabs = [
  { key: "popular", label: "Popular" },
  { key: "top_rated", label: "Top Rated" },
  { key: "airing_today", label: "Airing Today" },
  { key: "on_the_air", label: "On The Air" },
];

const TvPage = () => {
  const navigate = useNavigate();
  const API_KEY =
    import.meta.env.VITE_TMDB_API_KEY || import.meta.env.VITE_API_KEY;

  const [tab, setTab] = useState("popular");
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(query.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [query]);

  const endpoint = useMemo(() => {
    if (!API_KEY) return "";
    if (debounced) {
      return `${API_BASE}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(
        debounced
      )}&page=${page}&include_adult=false`;
    }
    return `${API_BASE}/tv/${tab}?api_key=${API_KEY}&page=${page}`;
  }, [API_KEY, debounced, tab, page]);

  useEffect(() => {
    if (!endpoint) {
      setError("Missing TMDB API key in .env (VITE_TMDB_API_KEY)");
      return;
    }

    const controller = new AbortController();

    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(endpoint, { signal: controller.signal });
        if (!res.ok) throw new Error("Failed request");
        const data = await res.json();
        const next = data.results || [];
        setTotalPages(data.total_pages || 1);
        setList((prev) => (page === 1 ? next : [...prev, ...next]));
      } catch (e) {
        if (e.name !== "AbortError") setError("Could not load TV series.");
      } finally {
        setLoading(false);
      }
    };

    run();
    return () => controller.abort();
  }, [endpoint, page]);

  const searching = debounced.length > 0;

  const handleCardClick = (id) => {
    navigate(`/movie/${id}?type=tv`);
  };
  
  return (
    <>
    <Dashboardheader />
    <main className="min-h-screen bg-black text-white">
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <h1 className="text-2xl md:text-3xl font-bold">TV Series</h1>

          <div className="relative w-full md:w-[380px]">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search TV series..."
              className="w-full bg-[#141414] border border-white/10 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-700"
            />
          </div>
        </div>

        {searching && (
          <div className="relative z-10 px-4 py-6">
            <h2 className="text-white text-lg font-semibold mb-4">
              Search results for “{debounced || query}”
            </h2>

            {loading && <p className="text-gray-300">Loading results...</p>}

            {!loading && list.length === 0 && (
              <p className="text-gray-300">No results found.</p>
            )}
          </div>
        )}

        {!searching && (
          <div className="mt-5 flex flex-wrap gap-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => {
                  setTab(t.key);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-md text-sm transition ${
                  tab === t.key
                    ? "bg-red-700 text-white"
                    : "bg-[#171717] text-gray-300 hover:bg-[#222]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        {error && (
          <p className="mt-4 text-sm text-red-400 border border-red-700/40 bg-red-900/20 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {list.map((show) => (
            <article
              key={show.id}
              onClick={() => handleCardClick(show.id)}
              className="bg-[#111] rounded-lg overflow-hidden border border-white/5 hover:border-red-700/60 transition cursor-pointer hover:scale-105 transform"
            >
              <img
                src={
                  show.poster_path
                    ? `${IMG}${show.poster_path}`
                    : "https://via.placeholder.com/500x750?text=No+Image"
                }
                alt={show.name}
                className="w-full h-[260px] object-cover"
                loading="lazy"
              />
              <div className="p-3">
                <h3 className="font-semibold text-sm truncate">{show.name}</h3>
                <div className="mt-1 flex justify-between text-xs text-gray-400">
                  <span>{show.first_air_date?.split("-")[0] || "N/A"}</span>
                  <span className="inline-flex items-center gap-1">
                    <FiStar className="text-yellow-400" />
                    {Number(show.vote_average || 0).toFixed(1)}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {loading && <p className="mt-6 text-gray-400 text-sm">Loading...</p>}

        {!loading && list.length > 0 && page < totalPages && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setPage((p) => p + 1)}
              className="bg-red-700 hover:bg-red-800 px-5 py-2 rounded-md text-sm"
            >
              Load More
            </button>
          </div>
        )}
      </section>
    </main>
    </>
  );
};

export default TvPage;