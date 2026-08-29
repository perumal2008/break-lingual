import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

const AITutor = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your **AI Language Teacher** powered by Groq Llama 3.\n\nYou can:\n- Ask me questions about your uploaded materials\n- Practice grammar or vocabulary\n- Chat in any language\n\nHow can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [contextText, setContextText] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    try {
      const history = JSON.parse(localStorage.getItem('materialsHistory') || '[]');
      if (history.length > 0) setContextText(history[0].originalText || history[0].summary || '');
    } catch (e) {}
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = { role: 'user', content: input.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updated.map(m => ({ role: m.role, content: m.content })),
          contextText
        })
      });
      const data = await res.json();
      setMessages([...updated, data]);
    } catch (err) {
      setMessages([...updated, {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please check your backend and try again."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-gray-50 page-enter" style={{ height: 'calc(100vh - 64px)' }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3 flex-shrink-0 shadow-sm">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-xl">🤖</div>
        <div>
          <h1 className="font-bold text-gray-800">AI Teacher</h1>
          <p className="text-xs text-gray-500">
            Groq Llama 3 · {contextText ? '📚 Material context loaded' : 'No material loaded — upload one for context'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm flex-shrink-0 mb-1">🤖</div>
            )}

            <div className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-br-none'
                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
            }`}>
              {msg.role === 'user' ? (
                <span>{msg.content}</span>
              ) : (
                <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-headings:my-1 prose-strong:text-gray-900 prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded prose-code:text-xs">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mb-1">
                You
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex items-end gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm flex-shrink-0">🤖</div>
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
              <span className="flex gap-1 items-center">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-4 flex-shrink-0">
        <form onSubmit={handleSend} className="flex gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask your AI Teacher anything..."
            disabled={isLoading}
            className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-2"
          >
            {isLoading
              ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              : <>Send <span className="text-blue-300">↵</span></>}
          </button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-2">AI can make mistakes — use it as a learning aid</p>
      </div>
    </div>
  );
};

export default AITutor;
