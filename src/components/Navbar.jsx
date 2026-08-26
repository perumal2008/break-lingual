import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">BreakLingual</Link>
      </div>
      <div className="nav-links">
        <Link to="/materials">Materials</Link>
        <Link to="/tutor">AI Teacher</Link>
        <Link to="/video">AI Video</Link>
        <button className="btn btn-outline nav-btn">Login</button>
      </div>
    </nav>
  );
};

export default Navbar;
