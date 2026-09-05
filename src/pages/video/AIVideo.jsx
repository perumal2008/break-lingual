import React, { useState } from 'react';

// ✅ Curated educational video library with full offline / network fallback support
const VIDEO_LIBRARY = [
  // Math
  { keywords: ['math','algebra','calculus','geometry','trigonometry','arithmetic','number','equation','statistics','probability'], videoId: 'OmJ-4B-mS-Y', title: 'Mathematics Fundamentals - Full Course', channel: 'Khan Academy', category: 'Math' },
  { keywords: ['calculus','derivative','integral','limit'], videoId: 'WUvTyaaNkzM', title: 'Calculus 1 Full Course', channel: 'Professor Leonard', category: 'Math' },
  // Physics
  { keywords: ['physics','newton','force','motion','gravity','energy','momentum','velocity','acceleration','wave','optics','thermodynamics'], videoId: 'b1t41Q3xRM8', title: 'Physics - Laws of Motion Explained', channel: 'The Organic Chemistry Tutor', category: 'Science' },
  { keywords: ['quantum','quantum physics','quantum mechanics'], videoId: 'CBrsWPCp_rs', title: 'Quantum Physics for Beginners', channel: 'Domain of Science', category: 'Science' },
  { keywords: ['relativity','einstein','speed of light'], videoId: 'yuD34tEpRFw', title: "Einstein's Theory of Relativity", channel: 'PBS Space Time', category: 'Science' },
  // Chemistry
  { keywords: ['chemistry','chemical','atom','molecule','periodic','element','reaction','bond','acid','base','organic'], videoId: 'FSyAehMdpyI', title: 'Chemistry Full Course', channel: 'The Organic Chemistry Tutor', category: 'Science' },
  { keywords: ['organic chemistry','carbon','hydrocarbon','alkane','alkene','ester'], videoId: 'bSMx0NS0XfY', title: 'Organic Chemistry Basics', channel: 'Khan Academy', category: 'Science' },
  // Biology
  { keywords: ['biology','cell','dna','gene','genetic','evolution','protein','photosynthesis','mitosis','meiosis','bacteria','virus'], videoId: 'QnQe0xW_JY4', title: 'Biology - The Science of Life', channel: 'Khan Academy', category: 'Science' },
  { keywords: ['photosynthesis','chlorophyll','plant','chloroplast'], videoId: 'g78utcLQrJ4', title: 'Photosynthesis Explained', channel: 'Khan Academy', category: 'Science' },
  { keywords: ['human body','anatomy','heart','lung','brain','organ','digestive','nervous system'], videoId: 'Ae4MadKPJhQ', title: 'Human Body Systems', channel: 'CrashCourse', category: 'Science' },
  // History
  { keywords: ['history','world war','ancient','civilization','roman','greek','egyptian','medieval','revolution','empire'], videoId: 'Yocja_N5s1I', title: 'World History Crash Course', channel: 'CrashCourse', category: 'History' },
  { keywords: ['world war 2','ww2','nazi','hitler','world war ii'], videoId: '-MQDj_hGGFU', title: 'World War II Explained', channel: 'History Channel', category: 'History' },
  { keywords: ['world war 1','ww1','world war i','trench'], videoId: 'dHSQAEam2yc', title: 'World War I Documentary', channel: 'History Channel', category: 'History' },
  { keywords: ['india','indian history','mughal','british india','independence'], videoId: 'fQVHosDd5X8', title: 'History of India', channel: 'Geography Now', category: 'History' },
  // Computer Science / Programming
  { keywords: ['python','programming python','learn python','python tutorial'], videoId: '_uQrJ0TkZlc', title: 'Python Tutorial for Beginners', channel: 'Programming with Mosh', category: 'Tech' },
  { keywords: ['javascript','js','web development','frontend','react','html css'], videoId: 'W6NZfCO5SIk', title: 'JavaScript Tutorial', channel: 'Programming with Mosh', category: 'Tech' },
  { keywords: ['data structure','algorithm','sorting','binary tree','linked list','recursion'], videoId: 'BBpAmxU_NQo', title: 'Data Structures & Algorithms', channel: 'freeCodeCamp', category: 'Tech' },
  { keywords: ['machine learning','artificial intelligence','ai','neural network','deep learning'], videoId: 'NWONeJKn6kc', title: 'Machine Learning for Beginners', channel: 'freeCodeCamp', category: 'Tech' },
  // Languages
  { keywords: ['english','grammar','english grammar','vocabulary','essay'], videoId: 'I9E4B47MKGY', title: 'English Grammar Course', channel: 'EnglishClass101', category: 'Languages' },
  { keywords: ['tamil','learn tamil','tamil language','tamil grammar'], videoId: '0P7SVQHZ0vo', title: 'Tamil Language Basics', channel: 'Learn Tamil', category: 'Languages' },
  { keywords: ['hindi','learn hindi','hindi language'], videoId: 'Hq2Z7k6Xkag', title: 'Hindi for Beginners', channel: 'HindiPod101', category: 'Languages' },
  { keywords: ['spanish','learn spanish','spanish language'], videoId: 'tU0Rl1dVgHM', title: 'Spanish for Beginners', channel: 'SpanishPod101', category: 'Languages' },
  { keywords: ['french','learn french','french language'], videoId: 'H6SuPegEcCE', title: 'French for Beginners', channel: 'FrenchPod101', category: 'Languages' },
  // Default fallback
  { keywords: [], videoId: 'OmJ-4B-mS-Y', title: 'Introduction to Learning & Study Techniques', channel: 'Khan Academy', category: 'General' },
];

const CATEGORIES = [
  { name: 'All', icon: '✨' },
  { name: 'Science', icon: '🔬' },
  { name: 'Math', icon: '📐' },
  { name: 'Tech', icon: '💻' },
  { name: 'History', icon: '📜' },
  { name: 'Languages', icon: '🌍' },
];

const POPULAR_TOPICS = [
  { label: "Newton's Laws", category: 'Science' },
  { label: 'Photosynthesis', category: 'Science' },
  { label: 'Python Programming', category: 'Tech' },
  { label: 'World War II', category: 'History' },
  { label: 'Calculus Basics', category: 'Math' },
  { label: 'Machine Learning', category: 'Tech' },
  { label: 'Tamil Grammar', category: 'Languages' },
  { label: 'Quantum Physics', category: 'Science' },
];

function findVideo(topic) {
  const q = topic.toLowerCase();
  for (const entry of VIDEO_LIBRARY) {
    if (entry.keywords.some(k => q.includes(k))) return entry;
  }
  return VIDEO_LIBRARY[VIDEO_LIBRARY.length - 1];
}

const AIVideo = () => {
  const [topic, setTopic] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [videoData, setVideoData] = useState(null);

  const handleSearch = async (e, overrideTopic) => {
    if (e) e.preventDefault();
    const searchTopic = overrideTopic || topic;
    if (!searchTopic.trim()) return;
    setIsLoading(true);
    setVideoData(null);

    try {
      const res = await fetch('/api/video/script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: searchTopic, language: localStorage.getItem('selectedLanguage') || 'English' }),
      });
      if (!res.ok) throw new Error('Backend unavailable');
      const data = await res.json();
      if (!data.videoId) throw new Error('No video');
      setVideoData(data);
    } catch {
      const matched = findVideo(searchTopic);
      setVideoData({ ...matched, searchedTopic: searchTopic, offline: true });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestion = (s) => {
    setTopic(s);
    handleSearch(null, s);
  };

  const filteredTopics = selectedCategory === 'All' 
    ? POPULAR_TOPICS 
    : POPULAR_TOPICS.filter(t => t.category === selectedCategory);

  return (
    <div className="min-h-full bg-slate-950 text-white p-6 page-enter relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-3">
            🎬 Interactive Video Hub
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold flex items-center justify-center sm:justify-start gap-3">
            <span className="w-11 h-11 bg-gradient-to-br from-rose-500 to-red-600 rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-rose-500/30">▶</span>
            AI Educational Videos
          </h1>
          <p className="text-slate-400 mt-2 text-sm sm:text-base max-w-xl">
            Watch curated high-definition video lessons tailored to your subject in seconds.
          </p>
        </div>

        {/* 3D Glass Search Container */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative group bg-slate-900/90 backdrop-blur-xl border border-white/10 p-2.5 rounded-2xl shadow-2xl shadow-rose-950/20 hover:border-rose-500/30 transition-all duration-300">
            <div className="flex items-center gap-3">
              <span className="pl-3 text-slate-400 text-lg">🔍</span>
              <input
                type="text"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="Search any concept (e.g. Newton's laws, Photosynthesis, Python...)"
                disabled={isLoading}
                className="flex-1 bg-transparent text-white placeholder-slate-500 focus:outline-none text-sm font-medium py-1"
              />
              <button
                type="submit"
                disabled={isLoading || !topic.trim()}
                className="bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm disabled:opacity-40 transition-all duration-200 flex items-center gap-2 shadow-lg shadow-rose-600/30 hover:-translate-y-0.5 active:scale-95"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Finding...</span>
                  </>
                ) : (
                  <span>Watch Video</span>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap border ${
                selectedCategory === cat.name
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 shadow-md shadow-rose-500/10'
                  : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white hover:border-white/20'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Suggested Topics Tags */}
        {!videoData && !isLoading && (
          <div className="mb-10 bg-slate-900/40 border border-white/5 rounded-2xl p-5 backdrop-blur-md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <span>🔥</span> Recommended Topics
              </span>
              <span className="text-slate-600 text-xs">{filteredTopics.length} available</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {filteredTopics.map(item => (
                <button
                  key={item.label}
                  onClick={() => handleSuggestion(item.label)}
                  className="group flex items-center gap-2 text-xs bg-slate-800/80 hover:bg-rose-950/40 text-slate-300 hover:text-rose-200 border border-white/5 hover:border-rose-500/40 px-3.5 py-2 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                >
                  <span className="text-rose-500 group-hover:scale-125 transition-transform">▶</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading Animation */}
        {isLoading && (
          <div className="bg-slate-900/90 rounded-3xl overflow-hidden border border-white/10 shadow-2xl p-8 backdrop-blur-xl text-center">
            <div className="aspect-video bg-slate-800/60 rounded-2xl flex flex-col items-center justify-center gap-4 relative overflow-hidden border border-white/5">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                <div className="w-8 h-8 border-3 border-rose-500/30 border-t-rose-500 rounded-full animate-spin"></div>
              </div>
              <div className="space-y-1">
                <p className="text-white font-bold text-base">Curating Best Video Lesson...</p>
                <p className="text-slate-500 text-xs">Fetching educational content for "{topic}"</p>
              </div>
            </div>
          </div>
        )}

        {/* 3D Glass Video Player Frame */}
        {!isLoading && videoData?.videoId && (
          <div className="bg-slate-900/90 rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-300 hover:border-rose-500/30">
            {/* TV Screen Frame */}
            <div className="aspect-video relative bg-black shadow-inner">
              <iframe
                key={videoData.videoId}
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoData.videoId}?autoplay=1&rel=0`}
                title={videoData.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>

            {/* Video Details Card */}
            <div className="p-6 border-t border-white/10 bg-gradient-to-b from-slate-900/90 to-slate-950">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-rose-500/10 text-rose-400 text-xs font-semibold border border-rose-500/20">
                    📺 {videoData.channel}
                  </span>
                  <h2 className="font-extrabold text-xl text-white leading-snug">{videoData.title}</h2>
                </div>
              </div>

              {videoData.offline && (
                <div className="mt-4 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
                  <span>💡</span>
                  <span>Matched from our verified educational library for <strong>"{videoData.searchedTopic}"</strong></span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 mt-6 pt-4 border-t border-white/5">
                <a
                  href={`https://www.youtube.com/watch?v=${videoData.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs font-bold text-rose-300 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 px-5 py-2.5 rounded-xl transition-all hover:-translate-y-0.5"
                >
                  <span>Open on YouTube</span>
                  <span>↗</span>
                </a>
                <button
                  onClick={() => { setVideoData(null); setTopic(''); }}
                  className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 rounded-xl transition-all"
                >
                  <span>🔄 Search Another Topic</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !videoData && (
          <div className="text-center py-16 px-4 bg-slate-900/30 rounded-3xl border border-white/5">
            <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-rose-500/10 to-amber-500/10 border border-white/10 flex items-center justify-center text-4xl shadow-inner">
              🎬
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Ready to Learn</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Select one of the popular topics above or type any subject into the search bar to start watching.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIVideo;
