import React, { useState } from "react";

const AIImage = () => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [error, setError] = useState("");

  const suggestions = [
    "Diagram of the solar system",
    "How plants photosynthesize",
    "Structure of DNA double helix",
    "Newtons laws of motion",
    "Map of ancient civilizations",
    "Human brain anatomy",
  ];

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setIsLoading(true);
    setImageData(null);
    setError("");
    try {
      const res = await fetch("/api/image/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) throw new Error("Backend not available");
      const data = await res.json();
      setImageData(data);
    } catch (err) {
      console.warn("Backend unavailable, using placeholder:", err);
      setImageData({
        image: `https://placehold.co/512x512/1e1b4b/a78bfa?text=${encodeURIComponent(prompt)}`,
        prompt,
        fallback: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-gray-950 text-white p-6 page-enter">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-xl shadow-lg">🎨</span>
            AI Image Generator
          </h1>
          <p className="text-gray-400 mt-2">Generate educational illustrations and diagrams with AI</p>
        </div>

        <form onSubmit={handleGenerate} className="mb-6">
          <div className="flex gap-2 bg-gray-800 border border-gray-700 p-2 rounded-2xl shadow-inner">
            <input
              type="text"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="e.g. Diagram of the human heart, Solar system illustration..."
              disabled={isLoading}
              className="flex-1 bg-transparent text-white placeholder-gray-500 px-3 py-2 focus:outline-none text-sm"
            />
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-xl font-semibold text-sm disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg"
            >
              {isLoading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span><span>Generating...</span></>
                : "✨ Generate"}
            </button>
          </div>
        </form>

        {!imageData && !isLoading && (
          <div className="mb-8">
            <p className="text-gray-500 text-xs mb-3 uppercase tracking-wider">Try these prompts</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button key={s} onClick={() => setPrompt(s)}
                  className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 px-3 py-2 rounded-xl transition-all hover:-translate-y-0.5">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && <div className="bg-red-900/30 border border-red-700 text-red-400 rounded-xl px-5 py-4 mb-6 text-sm">{error}</div>}

        {isLoading && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="aspect-square bg-gray-800 flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
              <p className="text-gray-500 text-sm">AI is painting your image...</p>
              <p className="text-gray-600 text-xs">This may take 30-60 seconds</p>
            </div>
          </div>
        )}

        {!isLoading && imageData && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
            <img src={imageData.image} alt={imageData.prompt} className="w-full aspect-square object-cover" />
            <div className="p-5 border-t border-gray-800">
              <p className="text-white font-medium">{imageData.prompt}</p>
              {imageData.fallback && <p className="text-yellow-500 text-xs mt-1">Placeholder shown - backend not available on GitHub Pages.</p>}
              <div className="flex gap-3 mt-4">
                <a href={imageData.image} download="ai-image.png"
                  className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition-all">
                  Download
                </a>
                <button onClick={() => { setImageData(null); setPrompt(""); }}
                  className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-xl transition-all">
                  Generate New
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIImage;
