import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <header className="hero-section">
        <h1>Learn Anything in Your Language</h1>
        <p>Break language barriers. Upload courses, documents, or concepts and let AI teach you in the language you understand best.</p>
        <Link to="/dashboard" className="cta-btn">Start Learning Now</Link>
      </header>
      
      <section className="features-section">
        <div className="feature-card" onClick={() => navigate('/tutor')} style={{cursor: 'pointer'}}>
          <h3>🤖 AI Teacher</h3>
          <p>Get personalized explanations and ask complex questions about your study materials in your native language.</p>
        </div>
        <div className="feature-card" onClick={() => navigate('/materials')} style={{cursor: 'pointer'}}>
          <h3>📚 Smart Materials</h3>
          <p>Upload documents and get instant translations, localized summaries, and tailored study guides.</p>
        </div>
        <div className="feature-card" onClick={() => navigate('/quiz')} style={{cursor: 'pointer'}}>
          <h3>📝 Dynamic Quizzes</h3>
          <p>Test your knowledge on any subject with AI-generated quizzes in the language of your choice.</p>
        </div>
        <div className="feature-card" onClick={() => navigate('/video')} style={{cursor: 'pointer'}}>
          <h3>🎬 Video Learning</h3>
          <p>Transform text into engaging video lessons featuring AI avatars teaching you in your preferred language.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
