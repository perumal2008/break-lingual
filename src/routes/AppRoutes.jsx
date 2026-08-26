import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import ProtectedRoute from '../components/common/ProtectedRoute';
import Home from '../pages/Home';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/student/Dashboard';
import AIVideo from '../pages/video/AIVideo';
import AITutor from '../pages/tutor/AITutor';
import AIQuiz from '../pages/quiz/AIQuiz';
import Materials from '../pages/materials/Materials';

const AppRoutes = () => {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/video" element={<ProtectedRoute><AIVideo /></ProtectedRoute>} />
            <Route path="/tutor" element={<ProtectedRoute><AITutor /></ProtectedRoute>} />
            <Route path="/quiz" element={<ProtectedRoute><AIQuiz /></ProtectedRoute>} />
            <Route path="/materials" element={<ProtectedRoute><Materials /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default AppRoutes;
