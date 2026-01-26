import React from "react";

const Moviedisplay = ({ movie }) => {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/300x450?text=No+Image";

  return (
    <div className="
      bg-white/5 backdrop-blur-md
      border border-white/10
      rounded-md overflow-hidden
      shadow-lg
      hover:scale-[1.02] transition
    ">
      <img
        src={imageUrl}
        alt={movie.title}
        className="w-full h-[320px] object-cover"
      />

      <div className="p-3 space-y-2">
        <p className="text-white font-semibold text-sm truncate">
          {movie.title}
        </p>

        <button className="
          w-full text-sm
          bg-[#b00020] hover:bg-[#8f001a]
          text-white py-2 rounded-md
          transition
        ">
          Watch now
        </button>
      </div>
    </div>
  );
};

export default Moviedisplay;
