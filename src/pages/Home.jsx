import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <header className="hero-section">
        <div className="hero-content">
          <h1>Break the Language Barrier with BreakLingual</h1>
          <p>Learn languages faster using AI-powered tutors, interactive videos, and personalized learning materials.</p>
          <div className="hero-actions">
            <Link to="/materials" className="btn">Start Learning</Link>
            <Link to="/video" className="btn btn-outline">Explore AI Video</Link>
          </div>
        </div>
        <div className="hero-image">
          {/* Using Unsplash for placeholder images */}
          <img 
            src="https://images.unsplash.com/photo-1546410531-ee4cb43b77a6?auto=format&fit=crop&q=80&w=800" 
            alt="Students learning languages" 
          />
        </div>
      </header>
      
      <section className="features-section">
        <div className="card feature-card">
          <h3>Interactive Materials</h3>
          <p>Upload documents and instantly translate, read, and listen to them.</p>
        </div>
        <div className="card feature-card">
          <h3>24/7 AI Tutor</h3>
          <p>Practice conversations in real-time with our intelligent language models.</p>
        </div>
        <div className="card feature-card">
          <h3>Generative Video</h3>
          <p>Create visual learning aids using cutting-edge AI avatars.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;