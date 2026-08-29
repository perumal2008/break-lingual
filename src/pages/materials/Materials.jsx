import React, { useState, useEffect } from 'react';
import localforage from 'localforage';
import './Materials.css';

const Materials = () => {
  const [file, setFile] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [history, setHistory] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [language, setLanguage] = useState('Tamil');
  const [prompt, setPrompt] = useState('');

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
      // Read file as Data URL to store in IndexedDB
      const fileDataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
      });

      // Send the actual file to the backend
      const formData = new FormData();
      formData.append('file', file);
      formData.append('language', language);
      formData.append('sourceText', '');
      formData.append('prompt', prompt);

      const response = await fetch('http://localhost:5000/api/translate', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to translate');
      }
      
      const translationId = Date.now();
      
      const newTranslation = {
        id: translationId,
        originalName: file.name,
        date: new Date().toLocaleDateString(),
        summary: data.summary,
        translatedText: data.translatedText
      };

      // Save file data to IndexedDB to avoid 5MB localStorage limit
      await localforage.setItem(`file_${translationId}`, fileDataUrl);

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

  const handleOpenOriginal = async () => {
    try {
      const fileData = await localforage.getItem(`file_${selectedResult.id}`);
      if (fileData) {
        const newWindow = window.open();
        newWindow.document.write(`<iframe src="${fileData}" width="100%" height="100%" style="border:none;"></iframe>`);
      } else {
        alert("Original file data not found. It may have been uploaded before this feature was added.");
      }
    } catch (err) {
      console.error("Failed to load file", err);
      alert("Failed to load original file.");
    }
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
              <div className="file-info" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <p>Selected File: <strong>{file.name}</strong></p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <label htmlFor="material-lang" style={{ fontWeight: '500', color: '#555' }}>Translate to:</label>
                  <select 
                    id="material-lang"
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc', outline: 'none' }}
                  >
                    <option value="Tamil">Tamil</option>
                    <option value="Telugu">Telugu</option>
                    <option value="Hindi">Hindi</option>
                    <option value="English">English</option>
                  </select>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', textAlign: 'left' }}>
                  <label htmlFor="custom-prompt" style={{ fontWeight: '500', color: '#555', fontSize: '0.9rem' }}>
                    Custom Instructions (Optional):
                  </label>
                  <textarea 
                    id="custom-prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g. Summarize only the introduction, keep it formal..."
                    style={{ 
                      padding: '10px', 
                      borderRadius: '6px', 
                      border: '1px solid #ccc', 
                      outline: 'none', 
                      resize: 'vertical',
                      minHeight: '60px',
                      fontFamily: 'inherit',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>

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
              <div className="success-banner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>✅ Viewing: <strong>{selectedResult.originalName}</strong></span>
                <button 
                  onClick={handleOpenOriginal}
                  style={{ background: 'white', color: '#007bff', border: '1px solid #007bff', padding: '4px 10px', borderRadius: '4px', fontSize: '13px', cursor: 'pointer' }}
                >
                  📄 Open Original
                </button>
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
