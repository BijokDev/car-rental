import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, Sparkles } from 'lucide-react';
import { getGeminiResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hi! I am AJ, your private chauffeur concierge. How can I assist with your transportation plans today?', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      if (window.innerWidth < 768) {
        document.body.style.overflow = 'hidden';
      }
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await getGeminiResponse(input);
      const botMsg: ChatMessage = { role: 'model', text: responseText, timestamp: new Date() };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 bg-brand-900 text-white p-5 rounded-2xl shadow-2xl hover:scale-105 transition-all z-50 flex items-center gap-3 group animate-bounce"
        >
          <Bot className="w-6 h-6 text-gold-500" />
          <span className="hidden sm:block font-black uppercase tracking-widest text-[11px]">
            Consult AJ AI
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-0 md:inset-auto md:bottom-10 md:right-10 w-full md:w-[420px] md:h-[650px] md:max-h-[85vh] bg-white md:rounded-3xl shadow-2xl z-[120] flex flex-col border border-gray-100 overflow-hidden animate-slide-up">
          
          {/* Header */}
          <div className="bg-brand-900 p-6 flex justify-between items-center text-white border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="bg-gold-500 p-2.5 rounded-2xl shadow-lg">
                <Sparkles className="w-5 h-5 text-brand-900" />
              </div>
              <div>
                <h3 className="font-black text-[10px] uppercase tracking-[0.2em] mb-0.5">Concierge Service</h3>
                <p className="text-sm font-bold text-white/80">AJ Smart Assistant</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="bg-white/10 hover:bg-white/20 p-2.5 rounded-xl transition-all active:scale-90"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[88%] p-5 rounded-2xl text-[13px] font-medium leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-brand-900 text-white rounded-br-none' 
                      : 'bg-white border border-gray-100 text-brand-900 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                  <div className={`text-[9px] mt-2 font-bold uppercase tracking-widest opacity-40 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 p-5 rounded-2xl rounded-bl-none shadow-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-brand-900/20 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-brand-900/20 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-brand-900/20 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white border-t border-gray-50 pb-10 md:pb-6">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about rates or fleet..."
                className="flex-1 bg-gray-50 border-2 border-transparent focus:border-brand-500 focus:bg-white text-brand-900 rounded-2xl px-5 py-4 text-sm font-bold placeholder:text-gray-300 outline-none transition-all"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-brand-900 text-white p-4 rounded-2xl hover:bg-brand-800 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-xl active:scale-95"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 opacity-30">
                <div className="h-px w-8 bg-gray-300"></div>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">AJ Enterprise</span>
                <div className="h-px w-8 bg-gray-300"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;