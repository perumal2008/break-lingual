import React, { useState, useEffect } from 'react';
import './Materials.css';

const Materials = () => {
  const [file, setFile] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [history, setHistory] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);

  useEffect(() => {
    // Load history on mount
    try {
      const savedHistory = JSON.parse(localStorage.getItem('materialsHistory') || '[]');
      setHistory(savedHistory);
    } catch {
      setHistory([]);
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setSelectedResult(null); 
    }
  };

  const handleTranslate = async () => {
    if (!file) return;

    setIsTranslating(true);

    try {
      // We pass the filename as the text to simulate document scanning
      const response = await fetch('http://localhost:5000/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sourceText: `Content extracted from document: ${file.name}`,
          language: 'Spanish' // default for MVP
        })
      });
      
      const data = await response.json();
      
      const newTranslation = {
        id: Date.now(),
        originalName: file.name,
        date: new Date().toLocaleDateString(),
        summary: data.summary,
        translatedText: data.translatedText
      };

      const updatedHistory = [newTranslation, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('materialsHistory', JSON.stringify(updatedHistory));
      
      window.dispatchEvent(new Event('materialsUpdated'));
      
      setSelectedResult(newTranslation);
      setFile(null); 
    } catch (error) {
      console.error("API error:", error);
      alert("Failed to reach AI server. Please make sure the backend is running.");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleDelete = (id) => {
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('materialsHistory', JSON.stringify(updatedHistory));
    window.dispatchEvent(new Event('materialsUpdated'));
    
    if (selectedResult && selectedResult.id === id) {
      setSelectedResult(null);
    }
  };

  const handleView = (item) => {
    setSelectedResult(item);
  };

  return (
    <div className="materials-page-container">
      <div className="materials-header">
        <h1>Smart Materials Translator</h1>
        <p>Upload any Document, PDF, or Image to get an instant AI translation.</p>
      </div>

      <div className="materials-layout">
        <div className="upload-column">
          <div className="upload-section">
            <div className="file-drop-area">
              <span className="upload-icon">📄</span>
              <h3>Drag & Drop your file here</h3>
              <p>or</p>
              <input 
                type="file" 
                id="file-upload" 
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" 
                onChange={handleFileChange}
                className="file-input"
              />
              <label htmlFor="file-upload" className="browse-btn">Browse Files</label>
            </div>

            {file && (
              <div className="file-info">
                <p>Selected File: <strong>{file.name}</strong></p>
                <button 
                  className="translate-btn" 
                  onClick={handleTranslate} 
                  disabled={isTranslating}
                >
                  {isTranslating ? 'Translating with AI...' : 'Translate Material'}
                </button>
              </div>
            )}
          </div>

          <div className="history-section">
            <h3>Previous Uploads</h3>
            {history.length === 0 ? (
              <p className="empty-history">No materials uploaded yet.</p>
            ) : (
              <ul className="history-list">
                {history.map(item => (
                  <li key={item.id} className="history-item">
                    <div className="history-info">
                      <strong>{item.originalName}</strong>
                      <span className="history-date">{item.date}</span>
                    </div>
                    <div className="history-actions">
                      <button className="view-btn" onClick={() => handleView(item)}>View</button>
                      <button className="delete-btn" onClick={() => handleDelete(item.id)}>Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="result-column">
          {selectedResult ? (
            <div className="translation-result">
              <div className="success-banner">
                ✅ Viewing: <strong>{selectedResult.originalName}</strong>
              </div>
              
              <div className="result-card">
                <h4>AI Summary</h4>
                <p>{selectedResult.summary}</p>
              </div>
              
              <div className="result-card translation-card">
                <h4>Translated Content</h4>
                <p>{selectedResult.translatedText}</p>
              </div>
            </div>
          ) : (
            <div className="empty-result">
              <p>Select a material from your history or upload a new one to see the translation here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Materials;
