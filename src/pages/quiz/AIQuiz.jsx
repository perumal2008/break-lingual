import React, { useState } from 'react';

const AIQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const mockQuestions = [
    {
      question: "Which part of speech is the word 'Innovate'?",
      options: ["Noun", "Verb", "Adjective", "Adverb"],
      correct: "Verb"
    },
    {
      question: "What does 'Resilient' mean in the context of the translation?",
      options: [
        "Easily broken",
        "Able to withstand difficult conditions",
        "A type of software pattern",
        "To start a new process"
      ],
      correct: "Able to withstand difficult conditions"
    }
  ];

  const handleSelect = (option) => {
    setSelectedAnswer(option);
  };

  const handleNext = () => {
    let currentScore = score === null ? 0 : score;
    if (selectedAnswer === mockQuestions[currentQuestion].correct) {
      currentScore += 1;
    }
    
    setScore(currentScore);
    
    if (currentQuestion + 1 < mockQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      // Finish Quiz
      setCurrentQuestion(currentQuestion + 1);
      
      // Calculate final percentage
      const finalScore = currentScore;
      const totalQuestions = mockQuestions.length;
      const percentage = Math.round((finalScore / totalQuestions) * 100);
      
      // Update global localStorage array
      const existingScores = JSON.parse(localStorage.getItem('quizScores') || '[]');
      existingScores.push(percentage);
      localStorage.setItem('quizScores', JSON.stringify(existingScores));
      
      // Dispatch event to update Dashboard immediately
      window.dispatchEvent(new Event('quizScoreUpdated'));
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(null);
    setSelectedAnswer(null);
  };

  const isFinished = currentQuestion >= mockQuestions.length;

  return (
    <div className="flex flex-col items-center py-10 px-4 min-h-full bg-gray-50">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">AI Quiz</h1>
        <p className="text-gray-600 mb-8">Test your knowledge with AI-generated questions based on your recent materials.</p>
        
        {!isFinished ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm font-semibold text-gray-500 uppercase">Question {currentQuestion + 1} of {mockQuestions.length}</span>
            </div>
            
            <h2 className="text-xl text-gray-800 font-medium mb-6">{mockQuestions[currentQuestion].question}</h2>
            
            <div className="space-y-3">
              {mockQuestions[currentQuestion].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(option)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedAnswer === option 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleNext}
                disabled={!selectedAnswer}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {currentQuestion === mockQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
              <span className="text-3xl">🎉</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz Completed!</h2>
            <p className="text-lg text-gray-600 mb-6">
              You scored {Math.round((score / mockQuestions.length) * 100)}%
            </p>
            <p className="text-sm text-gray-500 mb-8">This score has been saved and your Dashboard average is updated!</p>
            
            <button
              onClick={resetQuiz}
              className="px-6 py-2 bg-gray-800 text-white font-semibold rounded-lg shadow-sm hover:bg-gray-900 transition"
            >
              Take Another Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIQuiz;
