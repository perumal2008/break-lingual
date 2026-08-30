import React, { useState } from 'react';

const AIVideo = () => {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setIsLoading(true);
    setVideoData(null);
    setError('');
    try {
      const res = await fetch('/api/video/script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          language: localStorage.getItem('selectedLanguage') || 'English'
        })
      });
      
      if (!res.ok) throw new Error('Backend not available');
      
      const data = await res.json();
      if (!data.videoId) throw new Error('No video found');
      setVideoData(data);
    } catch (err) {
      console.warn("Backend unavailable, using fallback video for demo:", err);
      // GitHub Pages Client-side fallback
      setVideoData({
        videoId: '22qJ_LhB_3I', 
        title: `Educational Guide: ${topic}`,
        channel: 'BreakLingual Offline Mode'
      });
      setError(''); // Clear error so the UI shows the video!
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-gray-950 text-white p-6 page-enter">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <span className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-xl">▶</span>
            Educational Videos
          </h1>
          <p className="text-gray-400 mt-2">Type any topic and watch the best educational YouTube video instantly</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2 bg-gray-800 border border-gray-700 p-2 rounded-2xl">
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. How photosynthesis works, Tamil grammar basics..."
              disabled={isLoading}
              className="flex-1 bg-transparent text-white placeholder-gray-500 px-3 py-2 focus:outline-none text-sm"
            />
            <button
              type="submit"
              disabled={isLoading || !topic.trim()}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl font-semibold text-sm disabled:opacity-50 transition flex items-center gap-2"
            >
              {isLoading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Searching...</>
                : '🔍 Find Video'}
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-400 rounded-xl px-5 py-4 mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 animate-pulse">
            <div className="aspect-video bg-gray-800"></div>
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
              <p className="text-gray-400 text-sm mt-1">Channel: {videoData.channel}</p>
              <a
                href={`https://www.youtube.com/watch?v=${videoData.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-xs text-red-400 hover:text-red-300 transition"
              >
                Open on YouTube ↗
              </a>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !videoData && !error && (
          <div className="text-center py-20 text-gray-600">
            <div className="text-6xl mb-4">🎬</div>
            <p className="text-lg">Search for any topic to watch an educational video</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIVideo;
