import React, { useState } from 'react';

// âœ… Large curated educational video library â€” works 100% offline/no-API
const VIDEO_LIBRARY = [
  // Math
  { keywords: ['math','algebra','calculus','geometry','trigonometry','arithmetic','number','equation','statistics','probability'], videoId: 'OmJ-4B-mS-Y', title: 'Mathematics Fundamentals - Full Course', channel: 'Khan Academy' },
  { keywords: ['calculus','derivative','integral','limit'], videoId: 'WUvTyaaNkzM', title: 'Calculus 1 Full Course', channel: 'Professor Leonard' },
  // Physics
  { keywords: ['physics','newton','force','motion','gravity','energy','momentum','velocity','acceleration','wave','optics','thermodynamics'], videoId: 'b1t41Q3xRM8', title: 'Physics - Laws of Motion Explained', channel: 'The Organic Chemistry Tutor' },
  { keywords: ['quantum','quantum physics','quantum mechanics'], videoId: 'CBrsWPCp_rs', title: 'Quantum Physics for Beginners', channel: 'Domain of Science' },
  { keywords: ['relativity','einstein','speed of light'], videoId: 'yuD34tEpRFw', title: "Einstein's Theory of Relativity", channel: 'PBS Space Time' },
  // Chemistry
  { keywords: ['chemistry','chemical','atom','molecule','periodic','element','reaction','bond','acid','base','organic'], videoId: 'FSyAehMdpyI', title: 'Chemistry Full Course', channel: 'The Organic Chemistry Tutor' },
  { keywords: ['organic chemistry','carbon','hydrocarbon','alkane','alkene','ester'], videoId: 'bSMx0NS0XfY', title: 'Organic Chemistry Basics', channel: 'Khan Academy' },
  // Biology
  { keywords: ['biology','cell','dna','gene','genetic','evolution','protein','photosynthesis','mitosis','meiosis','bacteria','virus'], videoId: 'QnQe0xW_JY4', title: 'Biology - The Science of Life', channel: 'Khan Academy' },
  { keywords: ['photosynthesis','chlorophyll','plant','chloroplast'], videoId: 'g78utcLQrJ4', title: 'Photosynthesis Explained', channel: 'Khan Academy' },
  { keywords: ['human body','anatomy','heart','lung','brain','organ','digestive','nervous system'], videoId: 'Ae4MadKPJhQ', title: 'Human Body Systems', channel: 'CrashCourse' },
  // History
  { keywords: ['history','world war','ancient','civilization','roman','greek','egyptian','medieval','revolution','empire'], videoId: 'Yocja_N5s1I', title: 'World History Crash Course', channel: 'CrashCourse' },
  { keywords: ['world war 2','ww2','nazi','hitler','world war ii'], videoId: '-MQDj_hGGFU', title: 'World War II Explained', channel: 'History Channel' },
  { keywords: ['world war 1','ww1','world war i','trench'], videoId: 'dHSQAEam2yc', title: 'World War I Documentary', channel: 'History Channel' },
  { keywords: ['india','indian history','mughal','british india','independence'], videoId: 'fQVHosDd5X8', title: 'History of India', channel: 'Geography Now' },
  // Geography
  { keywords: ['geography','country','continent','map','ocean','river','mountain','climate','weather'], videoId: 'P6wNXpCKgmQ', title: 'World Geography', channel: 'Geography Now' },
  // Computer Science / Programming
  { keywords: ['python','programming python','learn python','python tutorial'], videoId: '_uQrJ0TkZlc', title: 'Python Tutorial for Beginners', channel: 'Programming with Mosh' },
  { keywords: ['javascript','js','web development','frontend','react','html css'], videoId: 'W6NZfCO5SIk', title: 'JavaScript Tutorial', channel: 'Programming with Mosh' },
  { keywords: ['data structure','algorithm','sorting','binary tree','linked list','recursion'], videoId: 'BBpAmxU_NQo', title: 'Data Structures & Algorithms', channel: 'freeCodeCamp' },
  { keywords: ['machine learning','artificial intelligence','ai','neural network','deep learning'], videoId: 'NWONeJKn6kc', title: 'Machine Learning for Beginners', channel: 'freeCodeCamp' },
  { keywords: ['computer science','computer','how computer works','cpu','operating system'], videoId: 'tpIctyqH29Q', title: 'CS50: Introduction to Computer Science', channel: 'Harvard University' },
  // Languages
  { keywords: ['english','grammar','english grammar','vocabulary','essay'], videoId: 'I9E4B47MKGY', title: 'English Grammar Course', channel: 'EnglishClass101' },
  { keywords: ['tamil','learn tamil','tamil language','tamil grammar'], videoId: '0P7SVQHZ0vo', title: 'Tamil Language Basics', channel: 'Learn Tamil' },
  { keywords: ['hindi','learn hindi','hindi language'], videoId: 'Hq2Z7k6Xkag', title: 'Hindi for Beginners', channel: 'HindiPod101' },
  { keywords: ['spanish','learn spanish','spanish language'], videoId: 'tU0Rl1dVgHM', title: 'Spanish for Beginners', channel: 'SpanishPod101' },
  { keywords: ['french','learn french','french language'], videoId: 'H6SuPegEcCE', title: 'French for Beginners', channel: 'FrenchPod101' },
  // Economics / Business
  { keywords: ['economics','economy','supply','demand','market','gdp','inflation','microeconomics','macroeconomics'], videoId: 'GI2KDSZD8Uc', title: 'Economics Explained', channel: 'CrashCourse' },
  { keywords: ['business','entrepreneur','startup','marketing','finance','accounting'], videoId: 'kFRvzAGDCzI', title: 'Business & Entrepreneurship', channel: 'CrashCourse' },
  // Default fallback
  { keywords: [], videoId: 'OmJ-4B-mS-Y', title: 'Introduction to Learning', channel: 'Khan Academy' },
];

const SUGGESTED_TOPICS = [
  'Newton\'s Laws of Motion',
  'Photosynthesis',
  'Python Programming',
  'World War II',
  'DNA and Genetics',
  'Machine Learning',
  'Tamil Language',
  'Organic Chemistry',
];

function findVideo(topic) {
  const q = topic.toLowerCase();
  for (const entry of VIDEO_LIBRARY) {
    if (entry.keywords.some(k => q.includes(k))) return entry;
  }
  return VIDEO_LIBRARY[VIDEO_LIBRARY.length - 1]; // Default
}

const AIVideo = () => {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [videoData, setVideoData] = useState(null);

  const handleSearch = async (e, overrideTopic) => {
    if (e) e.preventDefault();
    const searchTopic = overrideTopic || topic;
    if (!searchTopic.trim()) return;
    setIsLoading(true);
    setVideoData(null);

    // Try backend first, then smart client-side fallback
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
      // âœ… Smart client-side video matching
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

  return (
    <div className="min-h-full bg-gray-950 text-white p-6 page-enter">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <span className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-xl shadow-lg">â–¶</span>
            AI Educational Videos
          </h1>
          <p className="text-gray-400 mt-2">Type any topic and instantly watch the best educational YouTube video</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2 bg-gray-800 border border-gray-700 p-2 rounded-2xl">
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. Newton's laws, Photosynthesis, Python tutorial, World War 2..."
              disabled={isLoading}
              className="flex-1 bg-transparent text-white placeholder-gray-500 px-3 py-2 focus:outline-none text-sm"
            />
            <button
              type="submit"
              disabled={isLoading || !topic.trim()}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl font-semibold text-sm disabled:opacity-50 transition-all flex items-center gap-2 active:scale-95"
            >
              {isLoading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Searching...</>
                : 'ðŸ” Find Video'}
            </button>
          </div>
        </form>

        {/* Suggested Topics */}
        {!videoData && !isLoading && (
          <div className="mb-8">
            <p className="text-gray-500 text-xs mb-3 uppercase tracking-wider">Popular Topics</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_TOPICS.map(s => (
                <button key={s} onClick={() => handleSuggestion(s)}
                  className="text-xs bg-gray-800 hover:bg-red-900/40 text-gray-300 border border-gray-700 hover:border-red-700 px-3 py-2 rounded-xl transition-all hover:-translate-y-0.5">
                  ðŸŽ¬ {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 animate-pulse">
            <div className="aspect-video bg-gray-800 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-red-600/30 border-t-red-600 rounded-full animate-spin"></div>
            </div>
            <div className="p-5 space-y-3">
              <div className="h-5 bg-gray-700 rounded w-2/3"></div>
              <div className="h-4 bg-gray-700 rounded w-1/3"></div>
            </div>
          </div>
        )}

        {/* Video Player */}
        {!isLoading && videoData?.videoId && (
          <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
            <div className="aspect-video relative">
              <iframe
                key={videoData.videoId}
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoData.videoId}?autoplay=1&rel=0`}
                title="Educational Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
            <div className="p-5 border-t border-gray-800">
              <h2 className="font-bold text-lg text-white line-clamp-2">{videoData.title}</h2>
              <p className="text-gray-400 text-sm mt-1">ðŸ“º {videoData.channel}</p>
              {videoData.offline && (
                <p className="text-yellow-600 text-xs mt-1">âœ¨ Best match from our curated library for "{videoData.searchedTopic}"</p>
              )}
              <div className="flex gap-3 mt-4">
                <a href={`https://www.youtube.com/watch?v=${videoData.videoId}`} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-red-400 hover:text-red-300 transition bg-red-900/20 border border-red-900 px-4 py-2 rounded-xl">
                  Open on YouTube â†—
                </a>
                <button onClick={() => setVideoData(null)} className="text-xs text-gray-400 hover:text-white bg-gray-800 px-4 py-2 rounded-xl transition">
                  ðŸ”„ Search Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !videoData && (
          <div className="text-center py-20 text-gray-600">
            <div className="text-6xl mb-4">ðŸŽ¬</div>
            <p className="text-lg">Search for any topic to watch an educational video</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIVideo;
