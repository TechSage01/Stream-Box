import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "./carousel.css";
import TrailerModal from "./trailer-modal";

const MovieCarousel = ({ movies = [] }) => {
  const swiperRef = useRef(null);
  const swiperInstance = useRef(null);
  const [activeMovie, setActiveMovie] = useState(movies[0] || {});
  const [showTrailer, setShowTrailer] = useState(false);

  const goToNext = () => {
    swiperInstance.current?.slideNext();
  };

  const goToPrev = () => {
    swiperInstance.current?.slidePrev();
  };

  // Default movies if none provided - using reliable TMDB images
  const defaultMovies = [
    {
      id: 1,
      title: "The Night Agent",
      year: 2023,
      rating: "TV-MA",
      runtime: "50m",
      genres: ["Action", "Drama", "Thriller"],
      description:
        "A low-level FBI agent must uncover a secret while his life spirals out of control.",
      image:
      "https://image.tmdb.org/t/p/original/5P8SmMzSNYikXpxil6BYzJ16611.jpg",
      backdrop: "https://image.tmdb.org/t/p/original/5P8SmMzSNYikXpxil6BYzJ16611.jpg",
      videoId: "ysz5S6PUM-U",
    },
    {
      id: 2,
      title: "Squid Game",
      year: 2021,
      rating: "TV-MA",
      runtime: "55m",
      genres: ["Drama", "Thriller"],
      description:
        "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits with deadly high stakes.",
      image:
        "https://image.tmdb.org/t/p/w500/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg",
      backdrop:
        "https://image.tmdb.org/t/p/original/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg",
      videoId: "ysz5S6PUM-U",
    },
    {
      id: 3,
      title: "Stranger Things",
      year: 2016,
      rating: "TV-14",
      runtime: "50m",
      genres: ["Drama", "Fantasy", "Horror"],
      description:
        "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.",
      image:
        "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
      backdrop:
        "https://image.tmdb.org/t/p/original/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
      videoId: "ysz5S6PUM-U",
    },
    {
      id: 4,
      title: "The Crown",
      year: 2016,
      rating: "TV-MA",
      runtime: "60m",
      genres: ["Biography", "Drama", "History"],
      description:
        "Follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the twentieth century.",
      image: 
        "https://image.tmdb.org/t/p/original/1XDDXPXGiI8id7MrUxK36ke7gkX.jpg",
      backdrop:
        "https://image.tmdb.org/t/p/original/1XDDXPXGiI8id7MrUxK36ke7gkX.jpg",
      videoId: "ysz5S6PUM-U",
    },
    {
      id: 5,
      title: "The Mandalorian",
      year: 2019,
      rating: "TV-14",
      runtime: "45m",
      genres: ["Action", "Adventure", "Sci-Fi"],
      description:
        "The travels of a lone bounty hunter in the outer reaches of the galaxy, far from the authority of the New Republic.",
      image:
        "https://image.tmdb.org/t/p/w500/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg",
      backdrop:
        "https://image.tmdb.org/t/p/original/9ijMGlJKqcslswWUzTEwScm82Gs.jpg",
      videoId: "ysz5S6PUM-U",
    },
    {
      id: 6,
      title: "Wednesday",
      year: 2022,
      rating: "TV-14",
      runtime: "45m",
      genres: ["Comedy", "Crime", "Fantasy"],
      description:
        "Wednesday Addams is sent to Nevermore Academy, a bizarre boarding school where she attempts to master her psychic powers and solve a mystery.",
      image:
        "https://image.tmdb.org/t/p/w500/9PFonBhy4qw0exqhwK4tMKaPyRz.jpg",
      backdrop:
        "https://image.tmdb.org/t/p/original/iHSwvRVsRyxpX7FE7GbviaDvgGZ.jpg",
      videoId: "ysz5S6PUM-U",
    },
    {
      id: 7,
      title: "Breaking Bad",
      year: 2008,
      rating: "TV-MA",
      runtime: "47m",
      genres: ["Crime", "Drama", "Thriller"],
      description:
        "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine.",
      image:
        "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
      backdrop:
        "https://image.tmdb.org/t/p/original/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
      videoId: "ysz5S6PUM-U",
    },
    {
      id: 8,
      title: "Money Heist",
      year: 2017,
      rating: "TV-MA",
      runtime: "70m",
      genres: ["Action", "Crime", "Drama"],
      description:
        "An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history - stealing 2.4 billion euros from the Royal Mint.",
      image:
        "https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg",
      backdrop:
        "https://image.tmdb.org/t/p/original/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg",
      videoId: "ysz5S6PUM-U",
    },
  ];

  const moviesToShow = movies.length > 0 ? movies : defaultMovies;

  const handleSlideChange = (swiper) => {
    setActiveMovie(moviesToShow[swiper.activeIndex]);
  };

  const handleThumbnailClick = (index) => {
    swiperRef.current?.swiper?.slideTo(index);
  };

  return (
    <div className="carousel-container">
      {/* Custom Navigation Buttons */}
      <button className="carousel-nav-btn carousel-nav-prev" onClick={goToPrev}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
        </svg>
      </button>
      <button className="carousel-nav-btn carousel-nav-next" onClick={goToNext}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
        </svg>
      </button>

      {/* Main Carousel */}
      <Swiper
        ref={swiperRef}
        onSwiper={(swiper) => swiperInstance.current = swiper}
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true, dynamicBullets: true }}
        speed={800}
        onSlideChange={handleSlideChange}
        className="main-carousel"
      >
        {moviesToShow.map((movie) => (
          <SwiperSlide key={movie.id}>
            <div
              className="carousel-slide"
              style={{ backgroundImage: `url(${movie.backdrop})` }}
            >
              <div className="carousel-overlay"></div>

              {/* Slide Content */}
              <div className="slide-content">
                <div className="content-text">
                  <h1 className="movie-title">{movie.title}</h1>

                  <div className="movie-meta">
                    <span className="meta-item">{movie.year}</span>
                    <span className="separator">•</span>
                    <span className="meta-item">{movie.rating}</span>
                    <span className="separator">•</span>
                    <span className="meta-item">{movie.runtime}</span>
                  </div>

                  <p className="movie-description">{movie.description}</p>

                  <div className="genres">
                    {movie.genres.map((genre, idx) => (
                      <span key={idx} className="genre-tag">
                        {genre}
                      </span>
                    ))}
                  </div>

                  <div className="action-buttons">
                    <button
                      className="btn-play"
                      onClick={() => setShowTrailer(true)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      Play
                    </button>

                    <button className="btn-info">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                      </svg>
                      More Info
                    </button>

                    <button className="btn-watchlist">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                      Watchlist
                    </button>
                  </div>
                </div>

                <div className="content-image">
                  <img src={movie.image} alt={movie.title} />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnail Carousel */}
      <div className="thumbnails-container">
        <Swiper
          modules={[Navigation]}
          spaceBetween={12}
          slidesPerView="auto"
          className="thumbnails-carousel"
        >
          {moviesToShow.map((movie, index) => (
            <SwiperSlide key={movie.id} className="thumbnail-slide">
              <div
                className={`thumbnail ${
                  activeMovie.id === movie.id ? "active" : ""
                }`}
                onClick={() => handleThumbnailClick(index)}
              >
                <img 
                  src={movie.backdrop} 
                  alt={movie.title}
                  onError={(e) => {
                    e.target.src = 'https://image.tmdb.org/t/p/w200/7vjaCdMw15FEbXyLQTVa04URsPm.jpg';
                  }}
                />
                <div className="thumbnail-overlay">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <p className="thumbnail-title">{movie.title}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Trailer Modal */}
      <TrailerModal
        open={showTrailer}
        onClose={() => setShowTrailer(false)}
        videoId={activeMovie.videoId || "ysz5S6PUM-U"}
        title={activeMovie.title || "Trailer"}
      />
    </div>
  );
};

export default MovieCarousel;
