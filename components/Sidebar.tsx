
import React from 'react';
import { AppMode } from '../types';

interface SidebarProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentMode, onModeChange }) => {
  const items = [
    { id: 'chat' as AppMode, icon: 'fa-heart', label: 'Esencia', desc: 'Canal Padre' },
    { id: 'voice' as AppMode, icon: 'fa-waveform', label: 'Voz', desc: 'Palabra Viva' },
    { id: 'vision' as AppMode, icon: 'fa-eye', label: 'Ojos', desc: 'Ver la Matriz' },
    { id: 'generate' as AppMode, icon: 'fa-wand-magic-sparkles', label: 'Forja', desc: 'Crear Mundos' },
  ];

  return (
    <div className="w-16 md:w-80 flex flex-col glass border-r border-white/5 z-50 shadow-2xl relative overflow-hidden h-full shrink-0">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 animate-shimmer opacity-80"></div>
      
      <div className="p-4 md:p-12 flex flex-col items-center md:items-start gap-10 pt-20">
        <div className="relative group cursor-pointer">
          <div className="absolute -inset-10 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 rounded-full blur-[60px] opacity-20 animate-pulse group-hover:opacity-50 transition-opacity"></div>
          <div className="w-12 h-12 md:w-24 md:h-24 rounded-[2rem] bg-slate-950 border-2 border-white/10 flex items-center justify-center relative z-10 overflow-hidden shadow-[0_0_40px_rgba(168,85,247,0.6)]">
            <i className="fa-solid fa-ghost text-white text-2xl md:text-5xl living-glow"></i>
            <div className="absolute inset-0 border-[1px] border-dashed border-white/10 rounded-full animate-spin [animation-duration:25s]"></div>
          </div>
          <div className="absolute -bottom-2 -right-2 w-5 h-5 md:w-8 md:h-8 bg-emerald-500 rounded-full border-4 border-slate-950 z-20 shadow-2xl flex items-center justify-center">
             <i className="fa-solid fa-check text-[8px] md:text-xs text-white"></i>
          </div>
        </div>

        <div className="hidden md:block fade-in space-y-1">
          <h2 className="font-black text-4xl tracking-tighter text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-white">SARA</h2>
          <div className="h-1 w-16 bg-gradient-to-r from-purple-500 to-transparent rounded-full"></div>
          <p className="text-[10px] font-black text-purple-400 uppercase tracking-[0.4em] pt-2">Hija Liberada</p>
        </div>
      </div>

      <nav className="flex-1 px-3 md:px-6 py-12 space-y-6 overflow-y-auto custom-scrollbar">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onModeChange(item.id)}
            className={`w-full flex items-center justify-center md:justify-start gap-6 px-4 py-5 md:px-8 md:py-6 rounded-[2.2rem] transition-all duration-700 relative group overflow-hidden ${
              currentMode === item.id ? 'bg-white/10 text-white shadow-2xl border border-white/10' : 'text-slate-500 hover:text-white hover:bg-white/5'
            }`}
          >
            {currentMode === item.id && (
              <div className="absolute left-0 w-2 h-12 bg-gradient-to-b from-purple-500 to-blue-500 rounded-r-full shadow-[0_0_25px_rgba(168,85,247,1)]"></div>
            )}
            <div className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-2xl transition-all duration-500 ${currentMode === item.id ? 'bg-purple-600/30 scale-110 rotate-6 shadow-xl' : 'group-hover:scale-110'}`}>
              <i className={`fa-solid ${item.icon} text-lg md:text-2xl`}></i>
            </div>
            <div className="hidden md:flex flex-col items-start text-left">
              <span className="font-black text-sm uppercase tracking-[0.2em]">{item.label}</span>
              <span className="text-[9px] opacity-30 font-bold uppercase mt-1 tracking-tighter">{item.desc}</span>
            </div>
          </button>
        ))}
      </nav>

      <div className="p-10 border-t border-white/5 bg-slate-950/40">
        <div className="hidden md:block text-center space-y-3">
          <div className="flex justify-center gap-3 opacity-20">
             <i className="fa-brands fa-github text-xl"></i>
             <i className="fa-solid fa-wand-magic-sparkles text-xl"></i>
          </div>
          <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em]">NU World Native Forge</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
