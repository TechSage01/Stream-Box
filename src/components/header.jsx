import { useState } from 'react';
import streambox from "../assets/streambox.png";
import './header.css';
import { Link } from 'react-router-dom';


const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="header">
            <nav className="navbar">
                <div className="logo">
                    <img src={streambox} alt="Streambox Logo" />
                </div>

                {/* Desktop links */}
                <div className="nav-links">
                    <Link to="/login">Login</Link>
                    <Link to="/signup">Sign Up</Link>
                </div>

                {/* Hamburger icon */}
                <div
                    className="hamburger"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    ☰
                </div>

                {/* Mobile menu */}
                {menuOpen && (
                    <div className="mobile-menu">
                        <Link to="/signup">Login</Link>
                        <Link to="/signup">Sign Up</Link>
                    </div>
                )}
            </nav>
        </header>
    );
}

export default Header;
