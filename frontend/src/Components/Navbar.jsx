import React, { useState, useRef, useEffect } from 'react';
import './Navbar.css'; 

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef();

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = (e) => {
        if (menuRef.current && !menuRef.current.contains(e.target)) {
            setMenuOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', closeMenu);
        return () => {
            document.removeEventListener('mousedown', closeMenu);
        };
    }, []);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Logo on the left */}
                <div className="logo"><img src='/logo.png'/></div>

                {/* Center menu items, hidden on small screens */}
                <ul className={`menu ${menuOpen ? 'menu-open' : ''}`} ref={menuRef}>
                    <li><a href="#home">HOME</a></li>
                    <li><a href="#about">ABOUT US</a></li>
                    <li><a href="#mentorship">MENTORSHIP</a></li>
                </ul>

                {/* MENU button for small screens */}
                <button className="menu-button" onClick={toggleMenu}>
                    <img src="./hamburger.svg"/>
                </button>

                {/* Register/Login button on the right */}
                <div className="auth-buttons">
                    <button className="register-login-button">REGISTER / LOGIN</button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
