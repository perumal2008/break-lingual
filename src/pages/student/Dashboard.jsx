import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const getMaterialsCount = () => {
    try {
      const history = JSON.parse(localStorage.getItem('materialsHistory') || '[]');
      return history.length;
    } catch {
      return 0;
    }
  };

  const [studySeconds, setStudySeconds] = useState(parseInt(localStorage.getItem('studyTime') || '0', 10));
  const [materialsCount, setMaterialsCount] = useState(getMaterialsCount());

  useEffect(() => {
    const handleTimeUpdate = () => {
      setStudySeconds(parseInt(localStorage.getItem('studyTime') || '0', 10));
    };
    
    const handleMaterialsUpdate = () => {
      setMaterialsCount(getMaterialsCount());
    };

    window.addEventListener('studyTimeUpdated', handleTimeUpdate);
    window.addEventListener('materialsUpdated', handleMaterialsUpdate);
    
    return () => {
      window.removeEventListener('studyTimeUpdated', handleTimeUpdate);
      window.removeEventListener('materialsUpdated', handleMaterialsUpdate);
    };
  }, []);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name}!</h1>
        <p>Here's your learning progress for this week.</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Time Spent</h4>
          <p className="stat-number">{formatTime(studySeconds)}</p>
        </div>
        <div className="stat-card">
          <h4>Materials Translated</h4>
          <p className="stat-number">{materialsCount}</p>
        </div>
        <div className="stat-card">
          <h4>Average Quiz Score</h4>
          <p className="stat-number">92%</p>
        </div>
      </div>
      
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/tutor" className="action-btn">Chat with AI Teacher</Link>
          <Link to="/materials" className="action-btn">Upload New Material</Link>
          <Link to="/quiz" className="action-btn">Take a Topic Quiz</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
