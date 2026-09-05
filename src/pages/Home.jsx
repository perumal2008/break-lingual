import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const features = [
  { to: '/tutor',     icon: '🤖', title: 'AI Teacher',       desc: 'Get personalized explanations in your language', color: 'from-blue-500 to-indigo-600' },
  { to: '/materials', icon: '📚', title: 'Smart Materials',   desc: 'Upload docs for instant translations & summaries', color: 'from-purple-500 to-pink-600' },
  { to: '/quiz',      icon: '📝', title: 'Dynamic Quizzes',   desc: 'AI-generated quizzes to test your knowledge', color: 'from-emerald-500 to-teal-600' },
  { to: '/video',     icon: '🎥', title: 'Video Learning',    desc: 'Watch curated educational videos on any topic', color: 'from-red-500 to-orange-600' },
  { to: '/image',     icon: '🎨', title: 'AI Image',          desc: 'Generate educational diagrams with AI', color: 'from-pink-500 to-rose-600' },
];

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white page-enter">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent"></div>
        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
          <div className="inline-block mb-4 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-300 text-sm font-medium">✨ AI-Powered Language Learning</div>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Learn <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Anything</span> in<br/>Your Language
          </h1>
          <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Break language barriers. Upload courses, documents, or concepts and let AI teach you in the language you understand best.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/dashboard" className="px-8 py-3.5 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-500/25 transition-all hover:-translate-y-0.5 active:scale-95">Start Learning →</Link>
            <Link to="/tutor" className="px-8 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold rounded-2xl transition-all hover:-translate-y-0.5">Try AI Teacher</Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ to, icon, title, desc, color }) => (
            <div key={to} onClick={() => navigate(to)} className="group cursor-pointer bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5">
              <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform`}>{icon}</div>
              <h3 className="font-bold text-white text-lg mb-1">{title}</h3>
              <p className="text-sm text-slate-400">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer accent */}
      <div className="text-center pb-10 text-slate-600 text-xs">Built with ❤️ for BreakLingual Hackathon</div>
    </div>
  );
};

export default Home;
