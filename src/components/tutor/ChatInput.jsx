import React, { useState } from 'react';
import './ChatInput.css';

const ChatInput = ({ onSendMessage }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className="chat-input-container" onSubmit={handleSubmit}>
      <button type="button" className="icon-btn" title="Voice Input">
        🎙️
      </button>
      
      <textarea
        className="chat-textarea"
        placeholder="Type your message or practice your pronunciation..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        rows="1"
      />
      
      <button 
        type="submit" 
        className="btn send-btn"
        disabled={!text.trim()}
      >
        Send
      </button>
    </form>
  );
};

export default ChatInput;