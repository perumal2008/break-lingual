const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const loginJsx = `import React, { useState } from 'react';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      login(email);
      navigate(from, { replace: true });
    }
  };

  const handleSocialLogin = (provider) => {
    login(\`\${provider}User@example.com\`);
    navigate(from, { replace: true });
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Welcome Back</h2>
        <p>Login to continue your learning journey.</p>
        
        <div className="social-login">
          <button type="button" className="social-btn google-btn" onClick={() => handleSocialLogin('google')}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google logo" className="social-icon" />
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
`;

const registerJsx = `import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../auth/Login.css'; // Reuse styles

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && email && password) {
      // Simulate registering and logging in immediately
      login(email);
      navigate("/dashboard", { replace: true });
    }
  };

  const handleSocialLogin = (provider) => {
    login(\`\${provider}User@example.com\`);
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Create an Account</h2>
        <p>Join BreakLingual and master new languages.</p>
        
        <div className="social-login">
          <button type="button" className="social-btn google-btn" onClick={() => handleSocialLogin('google')}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google logo" className="social-icon" />
            Sign up with Google
          </button>
          <button type="button" className="social-btn github-btn" onClick={() => handleSocialLogin('github')}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" alt="GitHub logo" className="social-icon github-icon" />
            Sign up with GitHub
          </button>
        </div>

        <div className="divider">
          <span>or sign up with email</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input 
              type="text" 
              placeholder="Enter your name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>
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
              placeholder="Create a password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="auth-btn">Register</button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
`;

const authCss = `.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px);
  background-color: #f4f6f8;
  padding: 20px;
}

.auth-box {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 450px;
}

.auth-box h2 {
  margin-bottom: 10px;
  color: #333;
  text-align: center;
}

.auth-box p {
  color: #666;
  text-align: center;
  margin-bottom: 25px;
}

.social-login {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 25px;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 12px;
  border-radius: 4px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #ddd;
  background: white;
  color: #333;
}

.social-btn:hover {
  background: #f8f9fa;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.social-icon {
  width: 20px;
  height: 20px;
  margin-right: 12px;
}

.github-btn {
  background: #24292e;
  color: white;
  border: none;
}

.github-btn:hover {
  background: #1b1f23;
}

.github-icon {
  filter: invert(1);
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin-bottom: 25px;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #ddd;
}

.divider span {
  padding: 0 10px;
  color: #888;
  font-size: 14px;
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
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 15px;
}

.input-group input:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
}

.auth-btn {
  width: 100%;
  padding: 12px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;
}

.auth-btn:hover {
  background: #0056b3;
}

.auth-footer {
  margin-top: 25px;
  margin-bottom: 0 !important;
  font-size: 14px;
}

.auth-footer a {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
}

.auth-footer a:hover {
  text-decoration: underline;
}
`;

fs.writeFileSync(path.join(srcDir, 'pages', 'auth', 'Login.jsx'), loginJsx);
fs.writeFileSync(path.join(srcDir, 'pages', 'auth', 'Login.css'), authCss);
fs.writeFileSync(path.join(srcDir, 'pages', 'auth', 'Register.jsx'), registerJsx);

const appRoutesPath = path.join(srcDir, 'routes', 'AppRoutes.jsx');
let appRoutesContent = fs.readFileSync(appRoutesPath, 'utf8');

if (!appRoutesContent.includes("import Register")) {
  appRoutesContent = appRoutesContent.replace(
    "import Login from '../pages/auth/Login';", 
    "import Login from '../pages/auth/Login';\nimport Register from '../pages/auth/Register';"
  );
}

if (!appRoutesContent.includes("path=\"/register\"")) {
  appRoutesContent = appRoutesContent.replace(
    '<Route path="/login" element={<Login />} />',
    '<Route path="/login" element={<Login />} />\n            <Route path="/register" element={<Register />} />'
  );
}

fs.writeFileSync(appRoutesPath, appRoutesContent);

console.log('Auth pages updated successfully.');
