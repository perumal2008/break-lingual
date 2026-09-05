import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const statCards = [
  { key: 'time',      icon: '⏱️', label: 'Study Time',          color: 'from-blue-500 to-indigo-600' },
  { key: 'materials', icon: '📚', label: 'Materials',            color: 'from-purple-500 to-pink-600' },
  { key: 'quiz',      icon: '🎯', label: 'Quiz Score',           color: 'from-emerald-500 to-teal-600' },
];

const quickLinks = [
  { to: '/materials', icon: '📤', label: 'Upload Material',    desc: 'Translate any document', color: 'from-blue-500/10 to-indigo-500/10', border: 'border-blue-500/20 hover:border-blue-500/40' },
  { to: '/tutor',     icon: '🤖', label: 'Ask AI Teacher',     desc: 'Chat and get answers',   color: 'from-purple-500/10 to-pink-500/10', border: 'border-purple-500/20 hover:border-purple-500/40' },
  { to: '/quiz',      icon: '📝', label: 'Take AI Quiz',       desc: 'Test your knowledge',    color: 'from-emerald-500/10 to-teal-500/10', border: 'border-emerald-500/20 hover:border-emerald-500/40' },
  { to: '/video',     icon: '🎥', label: 'Watch Videos',       desc: 'Educational videos',     color: 'from-red-500/10 to-orange-500/10', border: 'border-red-500/20 hover:border-red-500/40' },
  { to: '/image',     icon: '🎨', label: 'AI Image',           desc: 'Generate diagrams',      color: 'from-pink-500/10 to-rose-500/10', border: 'border-pink-500/20 hover:border-pink-500/40' },
];

const Dashboard = () => {
  const { user } = useAuth();
  const getMaterialsCount = () => { try { return JSON.parse(localStorage.getItem('materialsHistory') || '[]').length; } catch { return 0; } };
  const getQuizAverage = () => { try { const s = JSON.parse(localStorage.getItem('quizScores') || '[]'); return s.length ? Math.round(s.reduce((a, b) => a + b, 0) / s.length) : 0; } catch { return 0; } };
  const formatTime = (s) => { const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60); return h > 0 ? `${h}h ${m}m` : `${m}m`; };

  const [studySecs, setStudySecs] = useState(parseInt(localStorage.getItem('studyTime') || '0', 10));
  const [matCount, setMatCount] = useState(getMaterialsCount);
  const [quizAvg, setQuizAvg] = useState(getQuizAverage);

  useEffect(() => {
    const onTime = () => setStudySecs(parseInt(localStorage.getItem('studyTime') || '0', 10));
    const onMat = () => setMatCount(getMaterialsCount());
    const onQuiz = () => setQuizAvg(getQuizAverage());
    window.addEventListener('studyTimeUpdated', onTime);
    window.addEventListener('materialsUpdated', onMat);
    window.addEventListener('quizScoreUpdated', onQuiz);
    return () => { window.removeEventListener('studyTimeUpdated', onTime); window.removeEventListener('materialsUpdated', onMat); window.removeEventListener('quizScoreUpdated', onQuiz); };
  }, []);

  const statValues = { time: formatTime(studySecs), materials: matCount, quiz: `${quizAvg}%` };

  return (
    <div className="min-h-full bg-slate-950 p-6 page-enter">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Welcome back, <span className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">{user?.name || 'Learner'}</span> 👋</h1>
          <p className="text-slate-500 mt-1">Here's your learning progress at a glance.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {statCards.map(({ key, icon, label, color }) => (
            <div key={key} className="relative overflow-hidden bg-slate-900 border border-white/5 rounded-2xl p-5">
              <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-10`}></div>
              <div className="relative">
                <div className="text-2xl mb-2">{icon}</div>
                <div className="text-3xl font-bold text-white mb-1">{statValues[key]}</div>
                <div className="text-sm text-slate-400">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <h2 className="text-lg font-semibold text-slate-300 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          {quickLinks.map(({ to, icon, label, desc, color, border }) => (
            <Link key={to} to={to} className={`group bg-gradient-to-br ${color} border ${border} rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}>
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{icon}</div>
              <div className="font-semibold text-white text-sm">{label}</div>
              <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
            </Link>
          ))}
        </div>

        {/* Recent Materials */}
        <RecentMaterials />
      </div>
    </div>
  );
};

const RecentMaterials = () => {
  const history = (() => { try { return JSON.parse(localStorage.getItem('materialsHistory') || '[]').slice(0, 3); } catch { return []; } })();
  if (!history.length) return null;
  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-300 mb-4">Recent Translations</h2>
      <div className="space-y-2">
        {history.map((item, i) => (
          <div key={i} className="bg-slate-900 border border-white/5 rounded-xl p-4 flex items-start gap-4 hover:bg-slate-800/80 transition">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-lg flex-shrink-0">📄</div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-white truncate">{item.title || `Translation ${i + 1}`}</div>
              <div className="text-sm text-slate-500 mt-0.5 line-clamp-1">{item.summary || item.translatedText?.substring(0, 100)}</div>
            </div>
            <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-full whitespace-nowrap">{item.language || 'Translated'}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
