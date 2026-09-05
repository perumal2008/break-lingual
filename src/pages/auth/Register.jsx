import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) { setError('Please fill in all fields.'); return; }
    setIsLoading(true); setError('');
    const success = await login('email', email, name, 'local-id');
    if (success) navigate('/dashboard', { replace: true });
    else { setError('Registration failed. Please try again.'); setIsLoading(false); }
  };

  const handleSocialLogin = async (provider) => {
    setIsLoading(true); setError('');
    const mockEmail = `${provider}User${Math.floor(Math.random() * 9000) + 1000}@example.com`;
    const success = await login(provider, mockEmail, `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`, `${provider}-${Date.now()}`);
    if (success) navigate('/dashboard', { replace: true });
    else { setError('Social signup failed.'); setIsLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4 page-enter">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl mb-4 shadow-lg shadow-indigo-900/50">
            <span className="text-3xl">🌐</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Break<span className="text-indigo-400">Lingual</span></h1>
          <p className="text-slate-400 mt-1">Start your AI learning journey today</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6">Create an account</h2>

          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg mb-4">{error}</div>}

          <div className="grid grid-cols-2 gap-3 mb-6">
            <button onClick={() => handleSocialLogin('google')} disabled={isLoading}
              className="flex items-center justify-center gap-2 bg-white text-gray-800 font-semibold py-2.5 px-4 rounded-lg hover:bg-gray-100 transition disabled:opacity-50">
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="G" className="w-5 h-5" />
              Google
            </button>
            <button onClick={() => handleSocialLogin('github')} disabled={isLoading}
              className="flex items-center justify-center gap-2 bg-gray-900 text-white font-semibold py-2.5 px-4 rounded-lg border border-white/20 hover:bg-gray-800 transition disabled:opacity-50">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/></svg>
              GitHub
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 border-t border-white/10"></div>
            <span className="text-slate-500 text-xs uppercase tracking-wider">or</span>
            <div className="flex-1 border-t border-white/10"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your Name"
                className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition" required />
            </div>
            <button type="submit" disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold py-2.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 active:scale-[0.98]">
              {isLoading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Creating account...</>
                : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
