import React, { useState } from 'react';
import { UserProfile, MealItem } from '../types';
import { consultDietitian } from '../services/geminiService';
import {
  Sparkles,
  Send,
  X,
  HeartPulse,
  AlertCircle,
  HelpCircle,
  Bot,
  User
} from 'lucide-react';

interface AiDietitianChatProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  activeMeal?: MealItem | null;
}

interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AiDietitianChat: React.FC<AiDietitianChatProps> = ({
  isOpen,
  onClose,
  user,
  activeMeal
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'assistant',
      text: `Hello ${user.name}! I am your AI Clinical Dietitian specialized in diabetic meal nutrition (ICMR-NIN & ADA guidelines).
${activeMeal ? `I see you are viewing **${activeMeal.name}** (GL: ${activeMeal.gl}). How can I assist your dietary decision today?` : `How can I help you customize your meal choices for your ${user.diabetesType.toUpperCase()} management today?`}`,
      timestamp: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    `Can I safely eat ${activeMeal ? activeMeal.name : 'Ragi Dosa'} if my sugar is elevated?`,
    'How do millets prevent post-meal glucose spikes compared to white rice?',
    'What specific kitchen instructions should I give restaurants for diabetic meals?',
    'Explain the clinical difference between Glycemic Index (GI) and Glycemic Load (GL).'
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const response = await consultDietitian(user, activeMeal, query, 'general-question');
      const botMsg: ChatMessage = {
        sender: 'assistant',
        text: response.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Unable to reach the clinical advisory engine. For diabetic meals, prioritize whole grains, minimum 5g of dietary fiber, and a Glycemic Load under 10.',
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-8 h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-200 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold flex items-center gap-1.5">
                <span>AI Clinical Diabetic Dietitian</span>
                <span className="text-[10px] bg-teal-800 text-teal-200 px-1.5 py-0.2 rounded font-mono">
                  Gemini 3.8
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Grounded in ICMR-NIN & ADA clinical diabetes guidelines
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clinical Disclaimer Bar */}
        <div className="px-4 py-1.5 bg-amber-50 border-b border-amber-200 text-[10px] text-amber-800 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
          <span>Informational guidance only. Consult your endocrinologist for insulin dosage adjustments.</span>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs ${
                  m.sender === 'user' ? 'bg-slate-700 text-white' : 'bg-teal-600 text-white'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-slate-900 text-white rounded-tr-xs'
                    : 'bg-slate-100 text-slate-800 rounded-tl-xs whitespace-pre-wrap'
                }`}
              >
                {m.text}
                <div
                  className={`text-[9px] mt-1 text-right ${
                    m.sender === 'user' ? 'text-slate-400' : 'text-slate-400'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-500 italic p-2 bg-slate-50 rounded-lg w-fit">
              <div className="w-2 h-2 rounded-full bg-teal-600 animate-ping" />
              <span>Dr. Sunita is analyzing glycemic biomarkers...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Prompts */}
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-none">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(q)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-900 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-200 bg-white">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about carbohydrates, postprandial glucose, or portion size..."
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              disabled={loading}
              className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            />
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="p-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
