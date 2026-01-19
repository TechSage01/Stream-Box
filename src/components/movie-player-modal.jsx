import React from "react";

const MoviePlayerModal = ({ open, onClose, videoUrl }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white text-2xl"
      >
        ✕
      </button>

      <video
        src={videoUrl}
        controls
        autoPlay
        className="w-full max-w-5xl rounded-lg"
      />
    </div>
  );
};

export default MoviePlayerModal;
