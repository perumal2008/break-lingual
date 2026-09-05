import React, { useState } from 'react';
import { fetchApi } from '../../utils/api';

const STYLES = [
  { id: 'Diagram', label: 'Educational Diagram', icon: '📐' },
  { id: '3D Render', label: '3D Render', icon: '🧊' },
  { id: 'Digital Art', label: 'Digital Art', icon: '🎨' },
  { id: 'Photorealistic', label: 'Realistic', icon: '📷' },
  { id: 'Minimalist Vector', label: 'Vector Art', icon: '✏️' },
];

const SUGGESTIONS = [
  'Diagram of the human heart and blood flow',
  'Solar system with labeled planet orbits',
  'Structure of a plant cell with chloroplasts',
  'Newton\'s third law equal action and reaction',
  'DNA double helix molecular structure',
  'Water cycle evaporation condensation precipitation',
];

const AIImage = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('Diagram');
  const [isLoading, setIsLoading] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [fullPreview, setFullPreview] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e, overridePrompt) => {
    if (e) e.preventDefault();
    const finalPrompt = overridePrompt || prompt;
    if (!finalPrompt.trim()) return;

    setIsLoading(true);
    setImageData(null);

    try {
      const res = await fetchApi('/image/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: finalPrompt, style: selectedStyle }),
      });

      if (!res.ok) throw new Error('Backend unavailable');

      const data = await res.json();
      setImageData(data);
    } catch {
      // ✅ Client-side fallback via Pollinations AI FLUX generator (works 100% on frontend / GitHub Pages)
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(selectedStyle + ': ' + finalPrompt + ', high quality, detailed educational diagram')}?width=768&height=768&seed=${Math.floor(Math.random()*100000)}&nologo=true&model=flux`;
      setImageData({
        image: imageUrl,
        prompt: finalPrompt,
        style: selectedStyle,
        source: 'Pollinations AI (FLUX)',
        offline: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (s) => {
    setPrompt(s);
    handleGenerate(null, s);
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-full bg-slate-950 text-white p-6 page-enter relative overflow-hidden">
      {/* Ambient Glow backdrop */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-3">
            ✨ Generative AI Canvas
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold flex items-center justify-center sm:justify-start gap-3">
            <span className="w-11 h-11 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-600 rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">🎨</span>
            AI Image Generator
          </h1>
          <p className="text-slate-400 mt-2 text-sm sm:text-base max-w-xl">
            Create high-quality educational diagrams, 3D visual models, and illustrations instantly.
          </p>
        </div>

        {/* 3D Search & Controls Frame */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 p-5 rounded-3xl shadow-2xl shadow-purple-950/20 mb-8 transition-all hover:border-purple-500/30">
          <form onSubmit={handleGenerate} className="space-y-4">
            {/* Input Bar */}
            <div className="flex items-center gap-2 bg-slate-950 border border-white/10 p-2 rounded-2xl focus-within:border-purple-500/50 transition">
              <span className="pl-3 text-slate-400 text-lg">✨</span>
              <input
                type="text"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Describe what image or diagram you want to generate..."
                disabled={isLoading}
                className="flex-1 bg-transparent text-white placeholder-slate-500 focus:outline-none text-sm font-medium py-1"
              />
              <button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm disabled:opacity-40 transition-all duration-200 flex items-center gap-2 shadow-lg shadow-purple-600/30 hover:-translate-y-0.5 active:scale-95"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Painting...</span>
                  </>
                ) : (
                  <span>Generate</span>
                )}
              </button>
            </div>

            {/* Style Selector */}
            <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 scrollbar-none">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider pr-2 whitespace-nowrap">Style:</span>
              {STYLES.map(style => (
                <button
                  type="button"
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap border ${
                    selectedStyle === style.id
                      ? 'bg-purple-500/20 border-purple-500/40 text-purple-300 shadow-md shadow-purple-500/10'
                      : 'bg-slate-800/60 border-white/5 text-slate-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <span>{style.icon}</span>
                  <span>{style.label}</span>
                </button>
              ))}
            </div>
          </form>
        </div>

        {/* Suggested Prompts */}
        {!imageData && !isLoading && (
          <div className="mb-10 bg-slate-900/40 border border-white/5 rounded-2xl p-5 backdrop-blur-md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <span>💡</span> Inspired Prompts
              </span>
              <span className="text-slate-600 text-xs">Click to generate</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => handleSuggestionClick(s)}
                  className="group text-xs bg-slate-800/80 hover:bg-purple-950/40 text-slate-300 hover:text-purple-200 border border-white/5 hover:border-purple-500/40 px-3.5 py-2 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                >
                  <span className="text-purple-400 group-hover:scale-125 transition-transform inline-block mr-1.5">✦</span>
                  <span>{s}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State Skeleton */}
        {isLoading && (
          <div className="bg-slate-900/90 rounded-3xl border border-white/10 overflow-hidden shadow-2xl p-8 backdrop-blur-xl">
            <div className="aspect-square max-w-lg mx-auto bg-slate-800/60 rounded-2xl flex flex-col items-center justify-center gap-4 relative overflow-hidden border border-white/5">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-pulse"></div>
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shadow-lg">
                <div className="w-8 h-8 border-3 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
              </div>
              <div className="text-center space-y-1 z-10">
                <p className="text-white font-bold text-base">Rendering AI Visual...</p>
                <p className="text-slate-400 text-xs">Style: <strong>{selectedStyle}</strong></p>
                <p className="text-slate-500 text-xs mt-2">Diffusion model is building your illustration</p>
              </div>
            </div>
          </div>
        )}

        {/* 3D Glass Display Container */}
        {!isLoading && imageData?.image && (
          <div className="bg-slate-900/90 rounded-3xl border border-white/10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all hover:border-purple-500/30">
            {/* Image display area */}
            <div className="relative group max-w-2xl mx-auto p-4 sm:p-6 flex items-center justify-center">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-slate-950">
                <img
                  src={imageData.image}
                  alt={imageData.prompt}
                  className="w-full h-auto max-h-[512px] object-contain transition-transform duration-300 group-hover:scale-[1.01]"
                  loading="lazy"
                />
                <button
                  onClick={() => setFullPreview(true)}
                  className="absolute top-3 right-3 bg-slate-950/80 hover:bg-slate-950 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md"
                >
                  🔍 Zoom View
                </button>
              </div>
            </div>

            {/* Meta info & actions */}
            <div className="p-6 border-t border-white/10 bg-gradient-to-b from-slate-900/90 to-slate-950">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold">
                    🎨 {imageData.style || selectedStyle}
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-slate-800 text-slate-400 text-xs font-medium border border-white/5">
                    Model: {imageData.source || 'FLUX.1 AI'}
                  </span>
                </div>
                <button
                  onClick={copyPrompt}
                  className="text-xs text-slate-400 hover:text-white transition flex items-center gap-1"
                >
                  <span>{copied ? '✓ Copied' : '📋 Copy Prompt'}</span>
                </button>
              </div>

              <p className="text-white font-medium text-sm leading-relaxed mb-6 bg-slate-950/50 p-3.5 rounded-xl border border-white/5">
                "{imageData.prompt}"
              </p>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={imageData.image}
                  download="breaklingual-ai-image.png"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-purple-600/25 hover:-translate-y-0.5"
                >
                  <span>⬇️ Download High-Res</span>
                </a>
                <button
                  onClick={() => { setImageData(null); setPrompt(''); }}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2.5 rounded-xl transition-all"
                >
                  <span>✨ Create Another</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Full-screen Zoom Modal */}
      {fullPreview && imageData?.image && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setFullPreview(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={imageData.image}
              alt={imageData.prompt}
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border border-white/20 object-contain"
            />
            <button
              onClick={() => setFullPreview(false)}
              className="absolute -top-10 right-0 text-white hover:text-purple-400 text-sm font-bold bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg border border-white/20"
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIImage;
