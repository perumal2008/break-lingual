import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import TranslationWorkspace from '../pages/TranslationWorkspace';

const AppRoutes = () => {
  return (
    <Router>
      <div className="app-container h-screen flex flex-col">
        <Navbar />
        <main className="main-content flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* MVP Route */}
          <Route path="/workspace" element={<TranslationWorkspace />} />
          
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
