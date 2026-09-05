import React, { useState } from 'react';
import { fetchApi } from '../../utils/api';

const AIQuiz = () => {

  const [stage, setStage] = useState('setup'); // setup | loading | quiz | result
  const [topicInput, setTopicInput] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);

  const generateQuiz = async (type) => {
    setStage('loading');
    let payload = {};
    if (type === 'topic') payload = { topic: topicInput };
    else {
      const history = JSON.parse(localStorage.getItem('materialsHistory') || '[]');
      if (!history.length) { alert("Upload a material first!"); setStage('setup'); return; }
      payload = { sourceText: history[0].originalText || history[0].summary };
    }

    try {
      const res = await fetchApi('/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Backend not available');
      const data = await res.json();
      setQuestions(data);
      setCurrentQ(0);
      setSelected(null);
      setRevealed(false);
      setScore(0);
      setStage('quiz');
    } catch (err) {
      console.warn("Backend unavailable, using fallback quiz:", err);
      // GitHub Pages Client-side fallback
      setQuestions([
        {
          question: `What is the core concept of ${type === 'topic' ? topicInput : 'your uploaded document'}?`,
          options: ["Understanding the basics", "Memorizing formulas", "Skipping chapters", "None of the above"],
          correct: "Understanding the basics"
        },
        {
          question: "Which learning method is most effective according to research?",
          options: ["Passive reading", "Active recall and testing", "Highlighting everything", "Listening while sleeping"],
          correct: "Active recall and testing"
        },
        {
          question: "How can you best apply this knowledge?",
          options: ["Never use it", "Teach it to someone else", "Write it down once", "Only read it in books"],
          correct: "Teach it to someone else"
        }
      ]);
      setCurrentQ(0);
      setSelected(null);
      setRevealed(false);
      setScore(0);
      setStage('quiz');
    }
  };

  const submitAnswer = () => {
    if (!selected) return;
    setRevealed(true);
    if (selected === questions[currentQ].correct) setScore(s => s + 1);
  };

  const nextQuestion = () => {
    if (currentQ + 1 < questions.length) {
      setCurrentQ(q => q + 1);
      setSelected(null);
      setRevealed(false);
    } else {
      const pct = Math.round(((score + (selected === questions[currentQ].correct ? 1 : 0)) / questions.length) * 100);
      const existing = JSON.parse(localStorage.getItem('quizScores') || '[]');
      existing.push(pct);
      localStorage.setItem('quizScores', JSON.stringify(existing));
      window.dispatchEvent(new Event('quizScoreUpdated'));
      setStage('result');
    }
  };

  const finalScore = Math.round((score / questions.length) * 100);

  // ── SETUP ──
  if (stage === 'setup') return (
    <div className="min-h-full bg-slate-50 flex items-start justify-center p-6 pt-12 page-enter">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🎯</div>
          <h1 className="text-3xl font-bold text-slate-800">AI Quiz</h1>
          <p className="text-slate-500 mt-2">Generate a quiz from any topic or your uploaded materials</p>
        </div>
        <div className="space-y-4">
          {/* Topic Input */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-700 mb-3">📌 Generate from a Topic</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={topicInput}
                onChange={e => setTopicInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && topicInput.trim() && generateQuiz('topic')}
                placeholder="e.g. Photosynthesis, World War 2, Tamil grammar..."
                className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={() => generateQuiz('topic')}
                disabled={!topicInput.trim()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-40 transition"
              >
                Generate
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 border-t border-slate-200"></div>
            <span className="text-slate-400 text-xs uppercase tracking-widest">or</span>
            <div className="flex-1 border-t border-slate-200"></div>
          </div>

          {/* From Material */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-700 mb-1">📚 Generate from Latest Material</h3>
            <p className="text-slate-500 text-sm mb-4">Quiz yourself on the last document you uploaded</p>
            <button
              onClick={() => generateQuiz('material')}
              className="w-full bg-purple-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-purple-700 transition"
            >
              Generate from Document
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ── LOADING ──
  if (stage === 'loading') return (
    <div className="min-h-full bg-slate-50 flex flex-col items-center justify-center page-enter">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
      <p className="text-slate-600 font-medium">Generating your quiz with AI...</p>
    </div>
  );

  // ── QUIZ ──
  if (stage === 'quiz' && questions.length) {
    const q = questions[currentQ];
    return (
      <div className="min-h-full bg-slate-50 flex items-start justify-center p-6 pt-10 page-enter">
        <div className="w-full max-w-2xl">
          {/* Progress */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500">Question {currentQ + 1} of {questions.length}</span>
            <span className="text-sm font-bold text-blue-600">Score: {score} / {currentQ}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 mb-6">
            <div className="bg-blue-600 h-1.5 rounded-full transition-all" style={{ width: `${((currentQ) / questions.length) * 100}%` }}></div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-4">
            <h2 className="text-lg font-semibold text-slate-800 mb-5">{q.question}</h2>
            <div className="space-y-3">
              {q.options.map((opt, i) => {
                let cls = 'border-slate-200 bg-white text-slate-700 hover:border-blue-400 cursor-pointer';
                if (revealed) {
                  if (opt === q.correct) cls = 'border-green-500 bg-green-50 text-green-800';
                  else if (opt === selected) cls = 'border-red-500 bg-red-50 text-red-800';
                  else cls = 'border-slate-200 bg-slate-50 text-slate-400';
                } else if (opt === selected) {
                  cls = 'border-blue-500 bg-blue-50 text-blue-800';
                }
                return (
                  <button
                    key={i}
                    disabled={revealed}
                    onClick={() => setSelected(opt)}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${cls}`}
                  >
                    <span className="mr-2 opacity-60">{String.fromCharCode(65 + i)}.</span> {opt}
                    {revealed && opt === q.correct && <span className="float-right">✅</span>}
                    {revealed && opt === selected && opt !== q.correct && <span className="float-right">❌</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanation banner */}
          {revealed && (
            <div className={`rounded-xl px-4 py-3 text-sm font-medium mb-4 ${selected === q.correct ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {selected === q.correct ? '✅ Correct! Well done.' : `❌ Incorrect. The correct answer is: "${q.correct}"`}
            </div>
          )}

          <div className="flex justify-end">
            {!revealed ? (
              <button onClick={submitAnswer} disabled={!selected}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700 disabled:opacity-40 transition">
                Submit Answer
              </button>
            ) : (
              <button onClick={nextQuestion}
                className="bg-slate-800 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-900 transition">
                {currentQ + 1 < questions.length ? 'Next Question →' : 'Finish Quiz'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── RESULT ──
  return (
    <div className="min-h-full bg-slate-50 flex items-center justify-center p-6 page-enter">
      <div className="w-full max-w-md text-center">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10">
          <div className="text-6xl mb-4">{finalScore >= 70 ? '🎉' : finalScore >= 40 ? '💪' : '📖'}</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Quiz Complete!</h2>
          <p className="text-slate-500 mb-6">You scored</p>
          <div className={`text-6xl font-black mb-2 ${finalScore >= 70 ? 'text-green-600' : finalScore >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
            {finalScore}%
          </div>
          <p className="text-slate-400 text-sm mb-8">({score} out of {questions.length} correct)</p>
          <p className="text-xs text-slate-400 mb-6">Score saved to your Dashboard</p>
          <button onClick={() => { setStage('setup'); setTopicInput(''); }}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
            Try Another Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIQuiz;
