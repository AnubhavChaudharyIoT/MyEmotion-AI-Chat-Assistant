import React, { useState } from 'react';

const AIChatBox = ({ messages, onSend, loading, messagesEndRef, emotionHeading }) => {
  const [input, setInput] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="
        bg-white bg-opacity-45 backdrop-blur-2xl border border-white/40 rounded-3xl
        shadow-2xl flex flex-col overflow-hidden glass-chat-transition glass-card
        glass-glow
      ">
        <div className="bg-gradient-to-r from-purple-400/80 via-indigo-300/80 to-pink-200/80 px-5 py-4 font-bold text-xl text-center text-gray-800 select-none">
          {emotionHeading || '🤖 Your Buddy'}
        </div>
        <div className="flex flex-col gap-2 px-5 py-4 max-h-[330px] overflow-y-auto glass-scrollbar transition-all">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`
                px-4 py-2 rounded-2xl text-base max-w-[80%]
                ${msg.sender === 'user'
                  ? 'bg-indigo-400/80 text-white font-semibold rounded-br-sm'
                  : 'bg-white/70 text-gray-900 font-medium rounded-bl-sm'
                }
                shadow
              `}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && <div className="text-indigo-500 text-base italic animate-pulse">Model is typing…</div>}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex items-center gap-3 border-t border-white/30 p-3 bg-white/40 backdrop-blur-xl">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message…"
            className="
              flex-1 px-4 py-2 rounded-full border border-white/50 bg-white/35
              shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white/60
              text-gray-700 font-medium placeholder-gray-400 placeholder-opacity-80
              glass-input
              transition
            "
            autoComplete="off"
          />
          <button
            onClick={() => {
              if (input.trim()) {
                onSend(input);
                setInput('');
              }
            }}
            disabled={loading}
            className="
              bg-gradient-to-r from-indigo-400 via-indigo-500 to-purple-500
              hover:from-purple-500 hover:to-indigo-400
              text-white px-5 py-2 rounded-full font-semibold
              drop-shadow-md transition disabled:opacity-50
              focus:outline-none focus:ring-2 focus:ring-indigo-300
              glassy-btn
            "
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatBox;
