import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { to: "/", text: "Home", icon: "🏠" },
    { to: "/dashboard", text: "Dashboard", icon: "📊" },
    { to: "/materials", text: "Materials", icon: "📚" },
    { to: "/tutor", text: "AI Teacher", icon: "🤖" },
    { to: "/quiz", text: "AI Quiz", icon: "📝" },
    { to: "/video", text: "AI Video", icon: "🎬" },
  ];

  return (
    <nav className={`navbar ${!isVisible ? 'collapsed' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          {isVisible ? "BreakLingual" : "BL"}
        </Link>
        <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
          &#9776;
        </div>
        <ul className={isOpen ? 'nav-menu active' : 'nav-menu'}>
          {navItems.map((item, index) => (
            <li className="nav-item" key={index}>
              <Link to={item.to} className="nav-links" onClick={() => setIsOpen(false)} title={item.text}>
                {isVisible ? item.text : <span className="nav-icon" style={{fontSize: '1.2rem'}}>{item.icon}</span>}
              </Link>
            </li>
          ))}

          {user ? (
            <li className="nav-item">
              <button className={`nav-links-btn ${!isVisible ? 'icon-only' : ''}`} onClick={handleLogout} title="Logout">
                {isVisible ? "Logout" : "🚪"}
              </button>
            </li>
          ) : (
            <li className="nav-item">
              <Link to="/login" className={`nav-links-btn ${!isVisible ? 'icon-only' : ''}`} onClick={() => setIsOpen(false)} title="Login">
                {isVisible ? "Login" : "🔑"}
              </Link>
            </li>
          )}
          
          <li className="nav-item">
            <button className="toggle-navbar-btn" onClick={() => setIsVisible(!isVisible)} title="Toggle Menu">
              {isVisible ? "▲" : "▼"}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
