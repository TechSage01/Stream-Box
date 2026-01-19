import React, { useState } from "react";
import dashboardbackground from "../assets/dashboard-background.png";
import posterImg from "../assets/streambox.png";
import TrailerModal from "./trailer-modal";

const Dashboardhero = () => {
  const [show, setShow] = useState(false);

  const featured = {
    title: "The StreamBox Premiere",
    year: 2024,
    rating: "PG-13",
    runtime: "2h 10m",
    genres: ["Action", "Drama"],
    description:
      "An epic tale of streaming triumph — a thrilling journey through creativity and community.",
  };

  return (
    <section
      className="relative w-full h-screen bg-center bg-cover"
      style={{ backgroundImage: `url(${dashboardbackground})` }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90"></div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 h-full flex flex-col justify-center lg:flex-row lg:items-end lg:pb-24 gap-10">
        {/* Text Section */}
        <div className="w-full lg:w-2/3 text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-lg">
            {featured.title}
          </h1>

          <div className="mt-3 flex items-center justify-center lg:justify-start gap-3 text-sm text-gray-300">
            <span>{featured.year}</span>
            <span>•</span>
            <span>{featured.rating}</span>
            <span>•</span>
            <span>{featured.runtime}</span>
          </div>

          <p className="mt-6 text-gray-200 max-w-xl lg:max-w-2xl text-sm sm:text-base lg:text-lg drop-shadow-md">
            {featured.description}
          </p>

          {/* Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row items-center sm:items-start justify-center lg:justify-start gap-4">
            <button
              onClick={() => setShow(true)}
              className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-md font-bold hover:scale-105 transition transform shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              Play
            </button>

            <button className="flex items-center justify-center px-6 py-3 border border-gray-300 text-white rounded-md hover:bg-white/20 transition shadow-md">
              More Info
            </button>

            <button className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition">
              + Watchlist
            </button>
          </div>

          {/* Genres */}
          <div className="mt-6 text-sm text-gray-400">
            <strong className="text-white">Genres:</strong>{" "}
            {featured.genres.join(", ")}
          </div>
        </div>

        {/* Poster / Thumbnail */}
        <div className="w-full lg:w-1/3 flex justify-center lg:justify-end">
          <div className="w-56 sm:w-72 lg:w-64 shadow-2xl rounded-md overflow-hidden transform hover:scale-105 transition duration-300">
            <img
              src={posterImg}
              alt="Featured poster"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      <TrailerModal
        open={show}
        onClose={() => setShow(false)}
        videoId="ysz5S6PUM-U"
        title={featured.title}
      />
    </section>
  );
};

export default Dashboardhero;
