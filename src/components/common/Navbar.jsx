import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/',          icon: '🏠', label: 'Home'        },
  { to: '/dashboard', icon: '📊', label: 'Dashboard'   },
  { to: '/materials', icon: '📚', label: 'Materials'   },
  { to: '/tutor',     icon: '🤖', label: 'AI Teacher'  },
  { to: '/quiz',      icon: '📝', label: 'AI Quiz'     },
  { to: '/video',     icon: '🎥', label: 'AI Video'    },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">BL</div>
          <span className="font-bold text-slate-800 text-lg hidden sm:block">BreakLingual</span>
        </NavLink>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          {navItems.slice(1).map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <span>{icon}</span>
              <span className="hidden md:block">{label}</span>
            </NavLink>
          ))}
        </div>

        {/* Auth */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {(user.name || user.email)?.[0]?.toUpperCase()}
                </div>
                <span className="text-sm text-slate-700 font-medium max-w-[120px] truncate">{user.name || user.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-slate-500 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
