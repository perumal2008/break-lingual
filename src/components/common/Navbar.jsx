import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/dashboard', icon: '📊', label: 'Dashboard'   },
  { to: '/materials', icon: '📚', label: 'Materials'   },
  { to: '/tutor',     icon: '🤖', label: 'AI Teacher'  },
  { to: '/quiz',      icon: '📝', label: 'Quiz'        },
  { to: '/video',     icon: '🎥', label: 'Video'       },
  { to: '/image',     icon: '🎨', label: 'Image'       },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="bg-slate-900/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition">BL</div>
          <span className="font-bold text-white text-lg hidden sm:block">Break<span className="text-indigo-400">Lingual</span></span>
        </NavLink>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-0.5">
          {navItems.map(({ to, icon, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-500/15 text-indigo-300'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`
              }>
              <span className="text-base">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-slate-400 hover:text-white p-2">
          {mobileOpen ? '✕' : '☰'}
        </button>

        {/* Auth */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg">
                <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {(user.name || user.email)?.[0]?.toUpperCase()}
                </div>
                <span className="text-sm text-slate-300 font-medium max-w-[100px] truncate">{user.name || user.email}</span>
              </div>
              <button onClick={handleLogout} className="text-sm text-slate-500 hover:text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition font-medium">Logout</button>
            </>
          ) : (
            <NavLink to="/login" className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white text-sm font-semibold px-5 py-2 rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all hover:-translate-y-0.5">Login</NavLink>
          )}
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-slate-900 border-t border-white/5 px-4 py-3 space-y-1">
          {navItems.map(({ to, icon, label }) => (
            <NavLink key={to} to={to} onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition ${isActive ? 'bg-indigo-500/15 text-indigo-300' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              <span>{icon}</span><span>{label}</span>
            </NavLink>
          ))}
          <div className="border-t border-white/5 pt-2 mt-2">
            {user ? (
              <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="text-sm text-red-400 px-3 py-2">Logout</button>
            ) : (
              <NavLink to="/login" onClick={() => setMobileOpen(false)} className="text-sm text-indigo-400 px-3 py-2">Login</NavLink>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
