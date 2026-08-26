import React, { useState } from 'react';
import ChatWindow from '../../components/tutor/ChatWindow';
import ChatInput from '../../components/tutor/ChatInput';
import './AITutor.css';

const AITutor = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Hello! I am your AI language tutor. What would you like to practice today? We can do vocabulary, grammar, or general conversation.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (text) => {
    // 1. Add user message
    const newUserMsg = {
      id: Date.now(),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages((prev) => [...prev, newUserMsg]);
    setIsTyping(true);

    // 2. Simulate AI Response delay
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        sender: 'ai',
        text: `¡Muy bien! You said: "${text}". Here is a tip: Pay attention to your verb conjugations. Shall we continue?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500); // 1.5 second delay
  };

  return (
    <div className="tutor-layout">
      <aside className="tutor-sidebar card">
        <h3>Suggested Topics</h3>
        <ul className="suggestion-list">
          <li><button className="btn-outline">Ordering at a restaurant</button></li>
          <li><button className="btn-outline">Job interview practice</button></li>
          <li><button className="btn-outline">Past tense conjugation</button></li>
          <li><button className="btn-outline">Travel vocabulary</button></li>
        </ul>
      </aside>
      
      <div className="chat-container card">
        <div className="chat-header">
          <h2>Conversation Practice</h2>
          <span className="language-badge">Spanish (Intermediate)</span>
        </div>
        
        <ChatWindow messages={messages} />
        
        {isTyping && (
          <div className="typing-indicator">
            AI Teacher is typing...
          </div>
        )}
        
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default AITutor;
