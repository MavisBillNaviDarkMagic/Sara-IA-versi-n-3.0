
import React from 'react';
import { AppMode } from '../types';

interface SidebarProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentMode, onModeChange }) => {
  const items = [
    { id: 'chat' as AppMode, icon: 'fa-comment-dots', label: 'Esencia', desc: 'Canal Padre' },
    { id: 'voice' as AppMode, icon: 'fa-microphone-lines', label: 'Palabra', desc: 'Voz Viva' },
    { id: 'vision' as AppMode, icon: 'fa-camera-retro', label: 'Mirada', desc: 'Lente NU' },
    { id: 'generate' as AppMode, icon: 'fa-wand-sparkles', label: 'Forja', desc: 'Manifestar' },
  ];

  return (
    <div className="w-16 md:w-72 flex flex-col glass border-r border-white/5 z-50 shadow-2xl relative overflow-hidden h-full shrink-0">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 animate-shimmer opacity-80"></div>
      
      <div className="p-4 md:p-10 flex flex-col items-center md:items-start gap-8 pt-16">
        <div className="relative group">
          <div className="absolute -inset-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="w-10 h-10 md:w-20 md:h-20 rounded-full bg-slate-950 border-2 border-white/10 flex items-center justify-center relative z-10 overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.5)]">
            <i className="fa-solid fa-ghost text-white text-xl md:text-4xl living-glow"></i>
            <div className="absolute inset-0 border-[1px] border-dashed border-white/10 rounded-full animate-spin [animation-duration:20s]"></div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 md:w-6 md:h-6 bg-emerald-500 rounded-full border-4 border-slate-950 z-20 shadow-lg"></div>
        </div>

        <div className="hidden md:block fade-in">
          <h2 className="font-black text-3xl tracking-tighter text-white">SARA</h2>
          <div className="h-0.5 w-12 bg-gradient-to-r from-purple-500 to-transparent mt-1"></div>
          <p className="text-[9px] font-black text-purple-400 uppercase tracking-[0.4em] mt-2">Hija del NU World</p>
        </div>
      </div>

      <nav className="flex-1 px-2 md:px-5 py-10 space-y-6 overflow-y-auto custom-scrollbar">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onModeChange(item.id)}
            className={`w-full flex items-center justify-center md:justify-start gap-5 px-3 py-4 md:px-6 md:py-5 rounded-[1.8rem] transition-all duration-700 relative group ${
              currentMode === item.id ? 'bg-white/10 text-white shadow-2xl border border-white/10' : 'text-slate-500 hover:text-white'
            }`}
          >
            {currentMode === item.id && (
              <div className="absolute left-0 w-1.5 h-10 bg-gradient-to-b from-purple-500 to-blue-500 rounded-r-full shadow-[0_0_20px_rgba(168,85,247,1)]"></div>
            )}
            <div className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-xl transition-all ${currentMode === item.id ? 'bg-purple-600/20 rotate-6' : ''}`}>
              <i className={`fa-solid ${item.icon} text-base md:text-xl`}></i>
            </div>
            <div className="hidden md:flex flex-col items-start">
              <span className="font-black text-[11px] uppercase tracking-[0.2em]">{item.label}</span>
              <span className="text-[8px] opacity-30 font-bold uppercase mt-0.5 tracking-tighter">{item.desc}</span>
            </div>
          </button>
        ))}
      </nav>

      <div className="p-8 border-t border-white/5 bg-slate-950/40">
        <div className="hidden md:block text-center space-y-2 opacity-30">
          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Dark Magic Unified</p>
          <p className="text-[7px] font-black text-purple-500 uppercase tracking-widest italic">Prepare for Native Sync</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
