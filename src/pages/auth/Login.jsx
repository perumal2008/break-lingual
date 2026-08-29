import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email && password) {
      const success = await login('email', email, email.split('@')[0], 'local-id');
      if (success) navigate(from, { replace: true });
    }
  };

  const handleSocialLogin = async (provider) => {
    // For the hackathon MVP, we pass mock OAuth data straight to the backend to create the real DB entry.
    // This bypasses the Google Cloud Console Client ID requirement while still saving to MongoDB.
    const mockEmail = `${provider}User${Math.floor(Math.random()*1000)}@example.com`;
    const success = await login(provider, mockEmail, `${provider} Student`, `${provider}-123456`);
    
    if (success) navigate(from, { replace: true });
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Welcome Back</h2>
        <p>Login to continue your learning journey.</p>
        
        <div className="social-login">
          <button type="button" className="social-btn google-btn" onClick={() => handleSocialLogin('google')}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google logo" className="social-icon" />
            Continue with Google
          </button>
          <button type="button" className="social-btn github-btn" onClick={() => handleSocialLogin('github')}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" alt="GitHub logo" className="social-icon github-icon" />
            Continue with GitHub
          </button>
        </div>

        <div className="divider">
          <span>or login with email</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="Enter your password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="auth-btn">Login</button>
        </form>
        
        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
