const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function write(filePath, content) {
    const fullPath = path.join(srcDir, filePath);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(fullPath, content);
}

// 1. AuthContext
write('context/AuthContext.jsx', `import React, { createContext, useState, useContext } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (email) => {
    setUser({ email, name: email.split('@')[0] });
  };
  
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
`);

// 2. ProtectedRoute
write('components/common/ProtectedRoute.jsx', `import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
`);

// 3. Navbar
write('components/common/Navbar.jsx', `import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          BreakLingual
        </Link>
        <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
          &#9776;
        </div>
        <ul className={isOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-links" onClick={() => setIsOpen(false)}>Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/dashboard" className="nav-links" onClick={() => setIsOpen(false)}>Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link to="/materials" className="nav-links" onClick={() => setIsOpen(false)}>Materials</Link>
          </li>
          <li className="nav-item">
            <Link to="/tutor" className="nav-links" onClick={() => setIsOpen(false)}>AI Tutor</Link>
          </li>
          <li className="nav-item">
            <Link to="/quiz" className="nav-links" onClick={() => setIsOpen(false)}>AI Quiz</Link>
          </li>
          <li className="nav-item">
            <Link to="/video" className="nav-links" onClick={() => setIsOpen(false)}>AI Video</Link>
          </li>
          {user ? (
            <li className="nav-item">
              <button className="nav-links-btn" onClick={handleLogout}>Logout ({user.name})</button>
            </li>
          ) : (
            <li className="nav-item">
              <Link to="/login" className="nav-links-btn" onClick={() => setIsOpen(false)}>Login</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
`);

write('components/common/Navbar.css', `.navbar {
  background: #24292e;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.1rem;
  position: sticky;
  top: 0;
  z-index: 999;
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  padding: 0 20px;
}

.navbar-logo {
  color: #fff;
  justify-self: start;
  cursor: pointer;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-menu {
  display: flex;
  list-style: none;
  text-align: center;
  margin: 0;
  padding: 0;
}

.nav-item {
  display: flex;
  align-items: center;
}

.nav-links {
  color: #fff;
  text-decoration: none;
  padding: 0.5rem 1rem;
  transition: all 0.2s ease-out;
}

.nav-links:hover {
  background-color: #f3f3f3;
  color: #24292e;
  border-radius: 4px;
}

.nav-links-btn {
  background: #007bff;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  font-size: 1rem;
  margin-left: 10px;
  transition: background 0.2s ease-in;
}

.nav-links-btn:hover {
  background: #0056b3;
}

.menu-icon {
  display: none;
  color: white;
  font-size: 1.8rem;
  cursor: pointer;
}

@media screen and (max-width: 960px) {
  .menu-icon {
    display: block;
  }
  
  .nav-menu {
    display: flex;
    flex-direction: column;
    width: 100%;
    position: absolute;
    top: 60px;
    left: -100%;
    opacity: 1;
    transition: all 0.5s ease;
    background: #24292e;
  }
  
  .nav-menu.active {
    left: 0;
    opacity: 1;
    transition: all 0.5s ease;
  }
  
  .nav-item {
    padding: 20px 0;
    width: 100%;
    justify-content: center;
  }
  
  .nav-links, .nav-links-btn {
    width: 100%;
    text-align: center;
    padding: 1rem;
    display: table;
  }
}
`);

// 4. Login Page
write('pages/auth/Login.jsx', `import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      login(email);
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome to BreakLingual</h2>
        <p>Login to continue your learning journey.</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              placeholder="Enter any email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="Enter any password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
`);

write('pages/auth/Login.css', `.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px);
  background-color: #f4f6f8;
  padding: 20px;
}

.login-box {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
}

.login-box h2 {
  margin-bottom: 10px;
  color: #333;
  text-align: center;
}

.login-box p {
  color: #666;
  text-align: center;
  margin-bottom: 30px;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  color: #444;
  font-weight: 500;
}

.input-group input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.input-group input:focus {
  border-color: #007bff;
  outline: none;
}

.login-btn {
  width: 100%;
  padding: 12px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

.login-btn:hover {
  background: #0056b3;
}
`);

// 5. Home
write('pages/Home.jsx', `import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <header className="hero-section">
        <h1>Master Any Language with AI</h1>
        <p>Your personalized, AI-driven language learning platform.</p>
        <Link to="/dashboard" className="cta-btn">Start Learning Now</Link>
      </header>
      
      <section className="features-section">
        <div className="feature-card">
          <h3>🤖 AI Tutor</h3>
          <p>Practice conversations in real-time with our advanced AI language models.</p>
        </div>
        <div className="feature-card">
          <h3>📚 Smart Materials</h3>
          <p>Upload documents and get instant translations, pronunciation guides, and summaries.</p>
        </div>
        <div className="feature-card">
          <h3>📝 Dynamic Quizzes</h3>
          <p>Test your knowledge with AI-generated quizzes based on your progress.</p>
        </div>
        <div className="feature-card">
          <h3>🎬 Video Learning</h3>
          <p>Learn from AI-generated videos with natural avatars and multi-language support.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
`);

write('pages/Home.css', `.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fafafa;
  min-height: calc(100vh - 60px);
}

.hero-section {
  text-align: center;
  padding: 80px 20px;
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  width: 100%;
}

.hero-section h1 {
  font-size: 3rem;
  margin-bottom: 20px;
  color: white;
}

.hero-section p {
  font-size: 1.2rem;
  margin-bottom: 40px;
  color: #e0e0e0;
}

.cta-btn {
  background-color: white;
  color: #007bff;
  padding: 15px 30px;
  font-size: 1.2rem;
  border-radius: 30px;
  text-decoration: none;
  font-weight: bold;
  transition: transform 0.2s, box-shadow 0.2s;
}

.cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.features-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  padding: 60px 20px;
  max-width: 1200px;
  width: 100%;
}

.feature-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  text-align: center;
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #24292e;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .hero-section h1 {
    font-size: 2rem;
  }
}
`);

// 6. Dashboard
write('pages/student/Dashboard.jsx', `import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name}!</h1>
        <p>Here's your learning progress for this week.</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Hours Studied</h4>
          <p className="stat-number">12.5</p>
        </div>
        <div className="stat-card">
          <h4>New Words</h4>
          <p className="stat-number">148</p>
        </div>
        <div className="stat-card">
          <h4>Quiz Score</h4>
          <p className="stat-number">92%</p>
        </div>
      </div>
      
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/tutor" className="action-btn">Chat with AI Tutor</Link>
          <Link to="/materials" className="action-btn">Resume Reading</Link>
          <Link to="/quiz" className="action-btn">Take a Quiz</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
`);

write('pages/student/Dashboard.css', `.dashboard-container {
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 40px;
}

.dashboard-header h1 {
  font-size: 2.5rem;
  color: #333;
}

.dashboard-header p {
  color: #666;
  font-size: 1.1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 50px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
  border-top: 4px solid #007bff;
}

.stat-card h4 {
  color: #666;
  margin-bottom: 10px;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #24292e;
}

.quick-actions h2 {
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.action-btn {
  background: #f0f4f8;
  color: #007bff;
  padding: 15px 25px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
  flex: 1;
  text-align: center;
  min-width: 200px;
}

.action-btn:hover {
  background: #007bff;
  color: white;
}
`);

// 7. Dummy pages to show protected routes functionality
write('pages/materials/Materials.jsx', `import React from 'react';
import './Materials.css';

const Materials = () => {
  return (
    <div className="page-container">
      <h1>Learning Materials</h1>
      <p>Upload and manage your learning resources here.</p>
      <div className="card-placeholder">Materials List Placeholder</div>
    </div>
  );
};
export default Materials;
`);

write('pages/materials/Materials.css', `.page-container {
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
}
.card-placeholder {
  background: white;
  padding: 50px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
  margin-top: 20px;
  color: #999;
  border: 2px dashed #ccc;
}
`);

write('pages/tutor/AITutor.jsx', `import React from 'react';
import '../materials/Materials.css';

const AITutor = () => {
  return (
    <div className="page-container">
      <h1>AI Tutor Chat</h1>
      <p>Have natural conversations to improve your skills.</p>
      <div className="card-placeholder">Chat Interface Placeholder</div>
    </div>
  );
};
export default AITutor;
`);

write('pages/quiz/AIQuiz.jsx', `import React from 'react';
import '../materials/Materials.css';

const AIQuiz = () => {
  return (
    <div className="page-container">
      <h1>AI Quiz</h1>
      <p>Test your knowledge with AI-generated questions.</p>
      <div className="card-placeholder">Quiz Interface Placeholder</div>
    </div>
  );
};
export default AIQuiz;
`);

write('pages/video/AIVideo.jsx', `import React from 'react';
import '../materials/Materials.css';

const AIVideo = () => {
  return (
    <div className="page-container">
      <h1>AI Video Generator</h1>
      <p>Create and watch AI-generated language lessons.</p>
      <div className="card-placeholder">Video Player Placeholder</div>
    </div>
  );
};
export default AIVideo;
`);

// 8. AppRoutes
write('routes/AppRoutes.jsx', `import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import ProtectedRoute from '../components/common/ProtectedRoute';
import Home from '../pages/Home';
import Login from '../pages/auth/Login';
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
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            
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
`);

// 9. main.jsx and App.jsx wrapping
write('App.jsx', `import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
`);

write('App.css', `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: #f8f9fa;
  color: #333;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}
`);

console.log('Frontend setup complete.');
