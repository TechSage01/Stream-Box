import React from "react";

const TrailerModal = ({ open, onClose, videoId, title }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative w-full max-w-3xl mx-4">
        <div className="bg-black rounded-lg overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b border-white/10">
            <h3 className="text-white font-semibold">{title || "Trailer"}</h3>
            <button
              onClick={onClose}
              className="text-white bg-white/5 px-3 py-1 rounded hover:bg-white/10"
              aria-label="Close trailer"
            >
              ✕
            </button>
          </div>

          <div className="w-full h-0 pb-[56.25%] relative">
            <iframe
              title="trailer"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;
