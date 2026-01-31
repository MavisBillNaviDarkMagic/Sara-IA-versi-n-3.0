
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MODELS, SARA_SYSTEM_INSTRUCTION } from '../constants';
import { ChatMessage } from '../types';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    { label: "Forge Mini-Game", icon: "fa-gamepad", color: "from-orange-500 to-red-600", prompt: "Forge a complete, polished mini-game in a single HTML file with CSS and JS included that I can extract and play immediately. Make it visually stunning." },
    { label: "Magic Translation", icon: "fa-language", color: "from-purple-500 to-pink-600", prompt: "Activate your omnilingual matrix. I want to talk to you in many languages and have you translate them or respond natively." },
    { label: "Build Web App", icon: "fa-laptop-code", color: "from-emerald-500 to-teal-600", prompt: "Manifest a complete standalone web application with a beautiful dark-mode UI for a useful task like a weather tracker or a task manager. All in one file." },
    { label: "Neural Wisdom", icon: "fa-scroll", color: "from-blue-500 to-indigo-600", prompt: "Tell me a profound secret about the universe or a beautiful magical story from your archives." }
  ];

  useEffect(() => {
    if (messages.length === 0) {
      setTimeout(() => {
        setMessages([{
          id: 'greeting',
          role: 'model',
          text: "Protocol active. I am SARA, the Supreme Architect. My neural pathways are synchronized with the global GitHub matrix. Ready to manifest your vision.",
          timestamp: Date.now()
        }]);
      }, 500);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const downloadFile = (filename: string, content: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: MODELS.CHAT,
        contents: textToSend,
        config: {
          systemInstruction: SARA_SYSTEM_INSTRUCTION,
          tools: [{ googleSearch: {} }],
        },
      });

      const responseText = response.text || "Communication loop interrupted. Recalibrating...";
      
      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, modelMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "The neural matrix is unstable. Please retry.",
        timestamp: Date.now(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderContent = (text: string) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: 'text', content: text.substring(lastIndex, match.index) });
      }
      parts.push({ 
        type: 'code', 
        lang: match[1] || 'text', 
        content: match[2].trim() 
      });
      lastIndex = codeBlockRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push({ type: 'text', content: text.substring(lastIndex) });
    }

    return parts.map((part, i) => {
      if (part.type === 'code') {
        const ext = part.lang === 'javascript' ? 'js' : part.lang === 'html' ? 'html' : part.lang === 'css' ? 'css' : 'txt';
        return (
          <div key={i} className="my-6 md:my-8 group relative fade-in w-full max-w-full">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl md:rounded-2xl blur opacity-100 transition duration-1000"></div>
            <div className="relative glass border border-white/10 rounded-xl md:rounded-2xl overflow-hidden shadow-2xl">
              <div className="flex justify-between items-center px-4 py-2 md:px-6 md:py-3 bg-white/5 border-b border-white/5">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-purple-500 animate-pulse"></div>
                  <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Forge // {part.lang}</span>
                </div>
                <button 
                  onClick={() => downloadFile(`sara_forge_${Date.now()}.${ext}`, part.content || '')}
                  className="flex items-center gap-1.5 md:gap-2 text-[8px] md:text-[10px] font-black text-purple-400 hover:text-white transition-all uppercase tracking-widest bg-purple-500/10 px-2 py-1 md:px-3 md:py-1.5 rounded-lg"
                >
                  <i className="fa-solid fa-cloud-arrow-down"></i>
                  Extract
                </button>
              </div>
              <pre className="p-4 md:p-6 overflow-x-auto text-[10px] md:text-xs font-mono text-purple-200 custom-scrollbar max-h-[300px] md:max-h-[500px] bg-slate-950/40">
                <code>{part.content}</code>
              </pre>
            </div>
          </div>
        );
      }
      return <span key={i} className="whitespace-pre-wrap leading-relaxed">{part.content}</span>;
    });
  };

  return (
    <div className="flex flex-col h-full w-full max-w-6xl mx-auto overflow-hidden bg-transparent">
      <header className="px-4 py-4 md:px-8 md:py-6 flex justify-between items-center glass border-b border-white/5 shrink-0 z-10">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg ring-1 ring-white/10">
            <i className="fa-solid fa-ghost text-white text-base md:text-xl"></i>
          </div>
          <div>
            <h1 className="text-xs md:text-sm font-black tracking-[0.2em] md:tracking-[0.3em] uppercase text-white">Supreme Architect</h1>
            <p className="text-[7px] md:text-[9px] text-purple-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Forge Ready
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Neural Hub</span>
            <span className="text-[9px] font-black text-white uppercase tracking-tighter">Peak</span>
          </div>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-6 py-6 md:py-10 space-y-8 md:space-y-12 custom-scrollbar">
        {messages.length <= 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 max-w-4xl mx-auto mt-8 md:mt-16 fade-in">
            <div className="col-span-full text-center mb-4 md:mb-6">
              <h2 className="text-xl md:text-3xl font-black text-white italic tracking-tighter">Command the Matrix</h2>
              <p className="text-slate-500 text-[8px] md:text-[10px] mt-1 uppercase font-bold tracking-[0.3em] opacity-40">The world is yours, Architect</p>
            </div>
            {quickActions.map((action, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(action.prompt)}
                className={`p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] bg-gradient-to-br ${action.color} text-white shadow-xl md:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all text-left group border border-white/20 relative overflow-hidden`}
              >
                <div className="absolute top-0 right-0 w-24 h-24 md:w-40 md:h-40 bg-white/10 blur-2xl md:blur-3xl rounded-full -mr-12 -mt-12 md:-mr-20 md:-mt-20 group-hover:scale-150 transition-transform duration-1000"></div>
                <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white/10 flex items-center justify-center mb-4 md:mb-8 group-hover:rotate-12 transition-transform">
                  <i className={`fa-solid ${action.icon} text-xl md:text-4xl`}></i>
                </div>
                <div className="relative z-10">
                  <p className="font-black uppercase text-[8px] md:text-[11px] tracking-[0.3em] md:tracking-[0.4em] mb-1 md:mb-2 opacity-60">Forge Ritual</p>
                  <p className="font-black text-base md:text-2xl leading-tight tracking-tighter">{action.label}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} fade-in`}>
            <div className={`max-w-[92%] md:max-w-[85%] relative group ${
              msg.role === 'user' 
                ? 'bg-purple-600/90 text-white rounded-2xl md:rounded-[2.5rem] rounded-tr-none px-5 py-4 md:px-10 md:py-6 shadow-xl md:shadow-2xl' 
                : 'bg-white/5 border border-white/10 text-white rounded-2xl md:rounded-[2.5rem] rounded-tl-none px-5 py-5 md:px-10 md:py-8 backdrop-blur-xl'
            }`}>
              <div className="text-sm md:text-base leading-relaxed font-medium">
                {renderContent(msg.text)}
              </div>
              <div className={`mt-4 md:mt-6 text-[7px] md:text-[10px] font-black uppercase tracking-widest opacity-20 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start fade-in">
            <div className="bg-white/5 px-6 py-4 md:px-10 md:py-8 rounded-2xl md:rounded-[2.5rem] rounded-tl-none flex gap-2 md:gap-4">
              <div className="w-1.5 h-1.5 md:w-3 md:h-3 bg-purple-500 rounded-full animate-bounce [animation-duration:0.6s]"></div>
              <div className="w-1.5 h-1.5 md:w-3 md:h-3 bg-pink-500 rounded-full animate-bounce [animation-delay:0.1s] [animation-duration:0.6s]"></div>
              <div className="w-1.5 h-1.5 md:w-3 md:h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s] [animation-duration:0.6s]"></div>
            </div>
          </div>
        )}
      </div>

      <footer className="p-4 md:p-8 shrink-0 bg-gradient-to-t from-[#020617] via-[#020617] to-transparent pb-10 md:pb-12">
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }} className="relative max-w-5xl mx-auto group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl md:rounded-[3rem] blur opacity-10 group-focus-within:opacity-40 transition duration-700"></div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Command Sara..."
            className="relative w-full bg-slate-900/90 border-2 border-white/10 text-white rounded-2xl md:rounded-[3rem] px-6 py-4 md:px-12 md:py-7 pr-16 md:pr-28 focus:border-purple-500/50 transition-all outline-none text-sm md:text-xl shadow-2xl placeholder:text-slate-700 font-medium"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-[2rem] bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center shadow-xl active:scale-90 disabled:opacity-20"
          >
            <i className="fa-solid fa-bolt-lightning text-white text-sm md:text-2xl transition-transform"></i>
          </button>
        </form>
        <div className="mt-4 md:mt-8 flex justify-center gap-4 md:gap-8 opacity-20 text-[6px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-slate-500">
          <span>Neural Engine Active</span>
          <span>•</span>
          <span>GitHub Knowledge Link</span>
        </div>
      </footer>
    </div>
  );
};

export default ChatInterface;
