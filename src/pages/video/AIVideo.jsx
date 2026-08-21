import React, { useState } from 'react';
import './AIVideo.css';

const AIVideo = () => {
  const [script, setScript] = useState('');

  return (
    <div className="video-module">
      <div className="video-header">
        <h2>Generate AI Learning Videos</h2>
        <p>Turn your language scripts into engaging avatar-led lessons.</p>
      </div>

      <div className="video-grid">
        {/* Editor Sidebar */}
        <div className="video-editor card">
          <div className="editor-group">
            <label>Video Script</label>
            <textarea 
              placeholder="Hola, bienvenidos a la clase de hoy..."
              value={script}
              onChange={(e) => setScript(e.target.value)}
              rows="6"
            />
          </div>

          <div className="editor-group">
            <label>Select Avatar</label>
            <div className="avatar-selection">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" alt="Avatar 1" className="avatar-icon active" />
              <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150" alt="Avatar 2" className="avatar-icon" />
            </div>
          </div>

          <button className="btn generate-btn">Generate Video</button>
        </div>

        {/* Preview Area */}
        <div className="video-preview card">
          <div className="player-wrapper">
            <img 
              src="https://images.unsplash.com/photo-1616469829581-73993eb86b02?auto=format&fit=crop&q=80&w=800" 
              alt="Video Preview Placeholder" 
              className="preview-image"
            />
            <div className="play-overlay">
              <span>▶</span>
            </div>
          </div>
          <div className="video-details">
            <h3>Preview Mode</h3>
            <p className="status-text">Draft - Ready to generate</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIVideo;