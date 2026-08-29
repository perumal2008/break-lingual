import React, { useState, useEffect } from 'react';


const TranslationWorkspace = () => {
  const [sourceText, setSourceText] = useState('');
  const [language, setLanguage] = useState('Spanish');
  const [isTranslating, setIsTranslating] = useState(false);
  const [result, setResult] = useState(null);
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [flashcards, setFlashcards] = useState([]);

  // Fetch flashcards on load
  const loadFlashcards = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/flashcards');
      const data = await res.json();
      setFlashcards(data);
    } catch (err) {
      console.warn("Could not fetch flashcards:", err);
    }
  };

  useEffect(() => {
    loadFlashcards();
  }, []);

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    
    setIsTranslating(true);
    try {
      const res = await fetch('http://localhost:5000/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceText, language })
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Translation error:", error);
      // Fallback
      setResult({
        translatedText: `Error: Server not running. Mock translation to ${language}.`,
        breakdown: [],
        flashcards: [{word: "Offline", definition: "No server connection"}]
      });
    }
    setIsTranslating(false);
  };

  const handleAddFlashcard = async (card) => {
    try {
      await fetch('http://localhost:5000/api/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(card)
      });
      loadFlashcards();
      alert(`Added "\${card.word}" to flashcards!`);
    } catch (error) {
      console.error("Failed to add flashcard", error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 font-sans">
      
      {/* Main Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Pane - Input */}
        <div className="w-full lg:w-1/2 p-6 border-r border-gray-200 flex flex-col bg-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Source Text</h2>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:border-blue-500"
            >
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Japanese">Japanese</option>
            </select>
          </div>
          
          <textarea
            className="flex-1 w-full border border-gray-300 rounded-lg p-4 resize-none focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
            placeholder="Type or paste text to translate and analyze..."
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
          ></textarea>
          
          <div className="mt-4 flex justify-between items-center">
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              View Flashcards ({flashcards.length})
            </button>
            <button
              onClick={handleTranslate}
              disabled={isTranslating || !sourceText.trim()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {isTranslating ? 'Analyzing...' : 'Analyze & Translate'}
            </button>
          </div>
        </div>

        {/* Right Pane - Output */}
        <div className="w-full lg:w-1/2 p-6 bg-gray-50 flex flex-col overflow-y-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Translation & Analysis</h2>
          
          {!result ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 flex-col">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
              <p>Your analysis will appear here.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Translated Text */}
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Translation ({language})</h3>
                <p className="text-lg text-gray-800">{result.translatedText}</p>
              </div>

              {/* Breakdown */}
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Grammar Breakdown</h3>
                <div className="flex flex-wrap gap-2">
                  {result.breakdown?.map((item, i) => (
                    <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      <strong>{item.word}</strong> <span className="mx-1 text-blue-400">•</span> <span className="italic">{item.pos}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Flashcards */}
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Key Vocabulary</h3>
                <div className="space-y-3">
                  {result.flashcards?.map((card, i) => (
                    <div key={i} className="flex justify-between items-start p-3 bg-gray-50 rounded border border-gray-100">
                      <div>
                        <p className="font-bold text-gray-800">{card.word} <span className="text-xs text-gray-500 font-normal italic ml-1">({card.partOfSpeech})</span></p>
                        <p className="text-sm text-gray-600 mt-1">{card.definition}</p>
                      </div>
                      <button 
                        onClick={() => handleAddFlashcard(card)}
                        className="text-xs bg-white border border-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-100 transition"
                      >
                        + Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Flashcards Drawer/Modal */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end transition-opacity">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-blue-600 text-white">
              <h2 className="text-lg font-bold">My Flashcards</h2>
              <button onClick={() => setIsDrawerOpen(false)} className="text-white hover:text-gray-200 text-xl font-bold">&times;</button>
            </div>
            
            <div className="p-5 overflow-y-auto flex-1 bg-gray-50 space-y-4">
              {flashcards.length === 0 ? (
                <p className="text-center text-gray-500 mt-10">No flashcards saved yet.</p>
              ) : (
                flashcards.map((fc, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h4 className="font-bold text-gray-800 text-lg mb-1">{fc.word}</h4>
                    <p className="text-sm text-gray-500 italic mb-2">{fc.partOfSpeech}</p>
                    <p className="text-sm text-gray-700 mb-2"><strong>Def:</strong> {fc.definition}</p>
                    {fc.sampleSentence && (
                      <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded border-l-2 border-blue-400">"{fc.sampleSentence}"</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TranslationWorkspace;
