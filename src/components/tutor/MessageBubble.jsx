import React from 'react';
import './MessageBubble.css';

const MessageBubble = ({ message }) => {
  const isAI = message.sender === 'ai';

  return (
    <div className={`message-wrapper ${isAI ? 'ai-message' : 'user-message'}`}>
      {isAI && (
        <img 
          src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=100&h=100" 
          alt="AI Tutor Avatar" 
          className="avatar"
        />
      )}
      
      <div className="message-content">
        <div className="bubble">
          <p>{message.text}</p>
        </div>
        <span className="timestamp">{message.timestamp}</span>
      </div>

      {!isAI && (
        <img 
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100&h=100" 
          alt="User Avatar" 
          className="avatar"
        />
      )}
    </div>
  );
};

export default MessageBubble;