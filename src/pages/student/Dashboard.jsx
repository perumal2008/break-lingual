import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const statCards = [
  { key: 'time',      icon: '⏱️', label: 'Study Time',          color: 'from-blue-500 to-blue-700' },
  { key: 'materials', icon: '📚', label: 'Materials Translated', color: 'from-purple-500 to-purple-700' },
  { key: 'quiz',      icon: '🎯', label: 'Avg Quiz Score',       color: 'from-green-500 to-green-700' },
];

const quickLinks = [
  { to: '/materials', icon: '📤', label: 'Upload Material',    desc: 'Translate any document or text', color: 'border-blue-200 hover:border-blue-400' },
  { to: '/tutor',     icon: '🤖', label: 'Ask AI Teacher',     desc: 'Chat and get instant answers',  color: 'border-purple-200 hover:border-purple-400' },
  { to: '/quiz',      icon: '📝', label: 'Take AI Quiz',       desc: 'Test your knowledge on any topic', color: 'border-green-200 hover:border-green-400' },
  { to: '/video',     icon: '🎥', label: 'Watch AI Video',     desc: 'Find educational videos',      color: 'border-orange-200 hover:border-orange-400' },
];

const Dashboard = () => {
  const { user } = useAuth();

  const getMaterialsCount = () => {
    try { return JSON.parse(localStorage.getItem('materialsHistory') || '[]').length; }
    catch { return 0; }
  };

  const getQuizAverage = () => {
    try {
      const scores = JSON.parse(localStorage.getItem('quizScores') || '[]');
      if (!scores.length) return 0;
      return Math.round(scores.reduce((a, s) => a + s, 0) / scores.length);
    } catch { return 0; }
  };

  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const [studySecs, setStudySecs] = useState(parseInt(localStorage.getItem('studyTime') || '0', 10));
  const [matCount, setMatCount]   = useState(getMaterialsCount);
  const [quizAvg, setQuizAvg]     = useState(getQuizAverage);

  useEffect(() => {
    const onTime = () => setStudySecs(parseInt(localStorage.getItem('studyTime') || '0', 10));
    const onMat  = () => setMatCount(getMaterialsCount());
    const onQuiz = () => setQuizAvg(getQuizAverage());
    window.addEventListener('studyTimeUpdated', onTime);
    window.addEventListener('materialsUpdated', onMat);
    window.addEventListener('quizScoreUpdated', onQuiz);
    return () => {
      window.removeEventListener('studyTimeUpdated', onTime);
      window.removeEventListener('materialsUpdated', onMat);
      window.removeEventListener('quizScoreUpdated', onQuiz);
    };
  }, []);

  const statValues = { time: formatTime(studySecs), materials: matCount, quiz: `${quizAvg}%` };

  return (
    <div className="min-h-full bg-slate-50 p-6 page-enter">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Welcome back, <span className="text-blue-600">{user?.name || 'Learner'}</span>! 👋
          </h1>
          <p className="text-slate-500 mt-1">Here's your learning progress at a glance.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {statCards.map(({ key, icon, label, color }) => (
            <div key={key} className={`bg-gradient-to-br ${color} rounded-2xl p-5 text-white shadow-md`}>
              <div className="text-3xl mb-2">{icon}</div>
              <div className="text-3xl font-bold mb-1">{statValues[key]}</div>
              <div className="text-sm opacity-80">{label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-semibold text-slate-700 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickLinks.map(({ to, icon, label, desc, color }) => (
            <Link key={to} to={to} className={`group bg-white border-2 ${color} rounded-2xl p-5 transition-all hover:shadow-md hover:-translate-y-0.5`}>
              <div className="text-3xl mb-3">{icon}</div>
              <div className="font-semibold text-slate-800 group-hover:text-blue-600 transition">{label}</div>
              <div className="text-xs text-slate-500 mt-1">{desc}</div>
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
  const history = (() => {
    try { return JSON.parse(localStorage.getItem('materialsHistory') || '[]').slice(0, 3); }
    catch { return []; }
  })();

  if (!history.length) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-700 mb-4">Recent Translations</h2>
      <div className="space-y-3">
        {history.map((item, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 flex items-start gap-4 hover:shadow-sm transition">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-xl flex-shrink-0">📄</div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-slate-800 truncate">{item.title || `Translation ${i + 1}`}</div>
              <div className="text-sm text-slate-500 mt-0.5 line-clamp-2">{item.summary || item.translatedText?.substring(0, 100)}</div>
            </div>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full whitespace-nowrap">{item.language || 'Translated'}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
