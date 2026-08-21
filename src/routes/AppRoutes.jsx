import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Home from '../pages/Home';
import AIVideo from '../pages/video/AIVideo';
import AITutor from '../pages/tutor/AITutor';
// Add these two imports:
import Dashboard from '../pages/student/Dashboard';
import AIQuiz from '../pages/quiz/AIQuiz';
import Materials from '../pages/materials/Materials';
import ReadingView from '../pages/materials/ReadingView';

const AppRoutes = () => {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/video" element={<AIVideo />} />
            <Route path="/tutor" element={<AITutor />} />
            {/* Add these two routes: */}
            <Route path="/dashboard" element={<Dashboard />} />
            
           
            <Route path="/quiz" element={<AIQuiz />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default AppRoutes;