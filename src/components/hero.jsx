import Herobox from "../assets/streambox background.jpg";
import "./hero.css";

const Hero = () => {
  return (
    <section
      className="hero"
      //   style={{ backgroundImage: `url(${Herobox})` }}
    >
      <div className="overlay">
        <div className="content">
          <h1>
            <span className="streambox-title">StreamBox:</span>
            <br />
            Your Ultimate Streaming Hub
          </h1>
          <p>
            Watch the latest movies, TV shows, and exclusive originals anytime,
            anywhere. Discover trending content, create your watchlist, and
            enjoy a cinematic experience.
          </p>
          <div className="buttons">
            <button className="play-btn" onClick={() => {
              window.location.href = "/signup";
            }}>Continue ➔</button>
            {/* <button className="watchlist-btn">Watchlist</button> */}
          </div>
        </div>
      </div>
    </section>
  );
};
export default Hero;
