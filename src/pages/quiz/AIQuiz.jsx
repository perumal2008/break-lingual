import React, { useState } from 'react';
import './AIQuiz.css';

const AIQuiz = () => {
  const [step, setStep] = useState('setup'); // setup -> taking -> results
  const [score, setScore] = useState(0);

  // Simulated AI Generated Quiz (POST /quiz/generate)
  const quizData = [
    {
      question: "What is the primary function of the mitochondria?",
      options: ["Protein synthesis", "Energy (ATP) production", "Photosynthesis", "Cell division"],
      correctAnswer: 1
    }
  ];

  const handleComplete = () => {
    // Simulating GET /recommendations based on performance
    setScore(100);
    setStep('results');
  };

  return (
    <div className="quiz-container card">
      {step === 'setup' && (
        <div className="quiz-setup">
          <h2>AI Quiz Generation</h2>
          <p>The AI has analyzed your document "Cell Biology" and generated a personalized quiz.</p>
          <button className="btn" onClick={() => setStep('taking')}>Start Quiz</button>
        </div>
      )}

      {step === 'taking' && (
        <div className="quiz-taking">
          <div className="quiz-header">
            <h3>Question 1 of 1</h3>
            <span className="timer">10:00</span>
          </div>
          <h2>{quizData[0].question}</h2>
          <div className="options-grid">
            {quizData[0].options.map((opt, index) => (
              <button 
                key={index} 
                className="btn-outline option-btn"
                onClick={handleComplete}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'results' && (
        <div className="quiz-results">
          <h2>Quiz Complete!</h2>
          <div className="score-circle">
            <span>{score}%</span>
          </div>
          
          <div className="adaptive-learning-analysis">
            <h3>Performance Analysis</h3>
            <ul className="analysis-list">
              <li className="strength">✅ Strong Concept: Cellular Energy</li>
              <li className="weakness">⚠️ Weak Concept: Requires review of "Protein Synthesis"</li>
            </ul>
            
            <div className="recommendations">
              <h4>Recommended Next Steps:</h4>
              <button className="btn btn-outline">Generate Video Lesson on Protein Synthesis</button>
              <button className="btn btn-outline">Ask AI Tutor to Explain</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIQuiz;