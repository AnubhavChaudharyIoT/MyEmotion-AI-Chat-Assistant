import React, { useState, useRef, useEffect } from 'react';
import AIChatBox from './components/AIChatBox';
import FaceEmotionDetector from './components/FaceEmotionDetector';
import axios from 'axios';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [emotionHeading, setEmotionHeading] = useState('');
  const [currentEmotion, setCurrentEmotion] = useState('');
  const [detectOnce, setDetectOnce] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);


  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleEmotionDetect = (emotion) => {
    const emotionGreetingMap = {
      happy: 'You look joyful today! 😊',
      sad: 'You seem a little down. 😔',
      angry: 'Looks like something is bothering you. 😠',
      surprised: 'Something caught your attention! 😮',
      neutral: 'You seem calm. 😊',
      fearful: 'It’s okay to feel anxious sometimes. 😟',
      disgusted: 'Something feels off? 😕'
    };

    const emotionPromptMap = {
      happy: "That's a beautiful smile! What's making you feel so good today?",
      sad: "I'm here for you. Do you want to talk about what's bothering you?",
      angry: "I understand things can be frustrating. Want to share what happened?",
      surprised: "You look surprised! Want to tell me what just happened?",
      neutral: "Hey there, how are you feeling today?",
      fearful: "It’s okay to feel scared sometimes. Want to talk about it?",
      disgusted: "Did something feel uncomfortable or unpleasant?"
    };

    const greeting = emotionGreetingMap[emotion];
    const prompt = emotionPromptMap[emotion];

    if (greeting && prompt) {
      setEmotionHeading(greeting);
      setMessages([{ sender: 'ai', text: prompt }]);
      setCurrentEmotion(emotion);
      setDetectOnce(true);
    }
  };

  const sendMessageToGemini = async (userInput) => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 1000));

    const prompt = `You are a kind, emotionally-aware AI assistant. The user's detected mood is "${currentEmotion}". They said: "${userInput}". Based on that, continue the conversation naturally. Be empathetic, ask follow-up questions, and keep the conversation flowing.`;

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
          contents: [{ parts: [{ text: prompt }] }]
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      const reply =
        response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
        'Hmm... I didn’t quite catch that. Can you say it another way?';

      setMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
    } catch (err) {
      console.error('Gemini API Error:', err);
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Something went wrong while contacting Gemini API.' }
      ]);
    }
    setLoading(false);
  };

  const handleUserSend = (userText) => {
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    sendMessageToGemini(userText);
  };

  return (
    <div
      className="w-screen h-screen flex flex-col items-center justify-center  relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #d1eaff 0%, #b8a5ff 50%, #ffdde1 100%)',
        backgroundAttachment: 'fixed',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}
    >
      {/* Gradient light overlays for layered glassmorphism */}
      <div className="absolute top-0 left-0 right-0   pointer-events-none">
        <div className="absolute left-[-20vw] top-0 w-[65vw] h-screen bg-blue-200 bg-opacity-40 rounded-full blur-3xl"></div>
        <div className="absolute right-[-18vw] w-[48vw] h-screen bg-pink-100 bg-opacity-50 rounded-full blur-3xl"></div>
      </div>

      {/* Main centered column */}
      <div className="flex flex-col items-center justify-center w-full max-w-2xl px-4">
        {/* Emotion detector at top */}
        {!detectOnce && (
          <div className="mb-8">
            <FaceEmotionDetector onDetect={handleEmotionDetect} />
          </div>
        )}

        {/* Heading */}
        {emotionHeading && (
          <h2 className="text-2xl font-bold bg-white/30 rounded-xl px-7 py-3 mb-5 border border-white/40 shadow-xl backdrop-blur-lg text-center z-10 glass-head">
            {emotionHeading}
          </h2>
        )}

        {/* Chat box */}
        <div className="w-full mb-5">
          <AIChatBox
            messages={messages}
            onSend={handleUserSend}
            loading={loading}
            messagesEndRef={messagesEndRef}
            emotionHeading={emotionHeading}
          />
        </div>

        {/* Start Again button */}
        {detectOnce && (
          <button
            className="bg-white bg-opacity-30 border border-white/40 shadow-xl text-indigo-700 px-7 py-2 rounded-full glassy-btn font-semibold tracking-wide transition hover:bg-opacity-50 backdrop-blur-lg flex items-center gap-2 mb-2"
            onClick={() => {
              setDetectOnce(false);
              setMessages([]);
              setEmotionHeading('');
              setCurrentEmotion('');
            }}
          >
            <span className="text-lg">🔄</span>
            Start Again
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
