import React, { useEffect, useState } from "react";
import Dashboardheader from "../components/dashboard-header.jsx";
import Moviedisplay from "../components/Moviedisplay.jsx";
import dashboardBackground from "../assets/dashboard-background.png";

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=a687c20174983fe7d8ade1c3256b84b4&page=${page}&sort_by=popularity.desc`
        );
        const data = await res.json();
        setMovies(data.results || []);
        setTotalPages(data.total_pages || 1);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [page]);

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Dashboardheader />

      <section
        className="min-h-screen bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: `url(${dashboardBackground})` }}
      >
        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/80" />

        {/* CONTENT */}
        <div className="relative z-10 px-4 py-6">
          {/* PAGE TITLE */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white text-2xl font-bold">Movies</h2>
            <span className="text-gray-400 text-sm">
              Page {page} of {totalPages}
            </span>
          </div>

          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {!loading && movies.length === 0 && (
            <p className="text-gray-300 text-center py-10">No movies found.</p>
          )}

          {/* MOVIES GRID */}
          {!loading && movies.length > 0 && (
            <>
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {movies.map((movie) => (
                  <Moviedisplay key={movie.id} movie={movie} />
                ))}
              </div>

              {/* PAGINATION */}
              <div className="flex justify-center items-center gap-4 mt-10">
                <button
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className={`px-4 py-2 rounded-md font-semibold transition ${
                    page === 1
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                >
                  Previous
                </button>

                <span className="text-white font-medium">
                  {page} / {totalPages > 500 ? 500 : totalPages}
                </span>

                <button
                  onClick={handleNextPage}
                  disabled={page >= (totalPages > 500 ? 500 : totalPages)}
                  className={`px-4 py-2 rounded-md font-semibold transition ${
                    page >= (totalPages > 500 ? 500 : totalPages)
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default MoviesPage;
