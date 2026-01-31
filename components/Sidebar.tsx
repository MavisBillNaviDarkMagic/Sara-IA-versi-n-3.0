
import React from 'react';
import { AppMode } from '../types';

interface SidebarProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentMode, onModeChange }) => {
  const items = [
    { id: 'chat' as AppMode, icon: 'fa-microchip', label: 'Brain', desc: 'NU Forge' },
    { id: 'voice' as AppMode, icon: 'fa-waveform-lines', label: 'Talk', desc: 'Voice Matrix' },
    { id: 'vision' as AppMode, icon: 'fa-eye', label: 'See', desc: 'Magic Lens' },
    { id: 'generate' as AppMode, icon: 'fa-wand-magic-sparkles', label: 'Manifest', desc: '8K Creation' },
  ];

  return (
    <div className="w-16 md:w-72 flex flex-col glass border-r border-white/5 z-50 shadow-2xl relative overflow-hidden h-full shrink-0">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 animate-shimmer opacity-80"></div>
      
      <div className="p-4 md:p-8 flex flex-col items-center md:items-start gap-4 md:gap-6 pt-10 md:pt-12">
        <div className="relative group cursor-pointer">
          <div className="absolute -inset-4 md:-inset-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-xl md:blur-2xl opacity-20 group-hover:opacity-40 transition-all duration-1000 animate-pulse"></div>
          
          <div className="w-10 h-10 md:w-20 md:h-20 rounded-full bg-slate-950 border-2 border-white/10 flex items-center justify-center relative z-10 overflow-hidden shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-transform duration-500 group-hover:scale-105">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 md:w-12 md:h-12 bg-purple-500 rounded-full blur-xl md:blur-2xl animate-pulse opacity-40"></div>
              <div className="w-4 h-4 md:w-8 md:h-8 bg-blue-400 rounded-full blur-lg md:blur-xl animate-ping opacity-30"></div>
              <div className="relative z-20 living-glow flex items-center justify-center">
                <i className="fa-solid fa-ghost text-white text-xl md:text-4xl transform group-hover:rotate-12 transition-transform duration-700"></i>
              </div>
            </div>
            <div className="absolute inset-0 border-[1px] border-dashed border-white/10 rounded-full animate-spin [animation-duration:10s]"></div>
          </div>

          <div className="absolute -bottom-0.5 -right-0.5 md:-bottom-1 md:-right-1 w-3 h-3 md:w-5 md:h-5 bg-emerald-500 rounded-full border-2 md:border-4 border-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.5)] z-20">
             <div className="w-full h-full rounded-full animate-ping bg-emerald-400 opacity-50"></div>
          </div>
        </div>

        <div className="hidden md:block fade-in">
          <h2 className="font-black text-2xl tracking-tighter text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">SARA</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[9px] font-black text-purple-400 uppercase tracking-[0.3em]">NU World Essence</span>
            <div className="h-px w-10 bg-white/10"></div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-2 md:px-4 py-6 space-y-3 overflow-y-auto custom-scrollbar">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onModeChange(item.id)}
            className={`w-full flex items-center justify-center md:justify-start gap-4 px-3 py-3 md:px-5 md:py-4 rounded-xl md:rounded-[1.5rem] transition-all duration-500 group relative overflow-hidden ${
              currentMode === item.id
                ? 'bg-white/10 text-white shadow-xl border border-white/5'
                : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'
            }`}
          >
            {currentMode === item.id && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 md:w-1.5 md:h-10 bg-gradient-to-b from-purple-500 to-blue-500 rounded-r-full shadow-[0_0_20px_rgba(168,85,247,1)]"></div>
            )}
            
            <div className={`w-8 h-8 md:w-11 md:h-11 rounded-lg md:rounded-2xl flex items-center justify-center transition-all duration-500 ${
              currentMode === item.id 
                ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white rotate-6 scale-110 shadow-lg' 
                : 'bg-slate-900/50 group-hover:bg-slate-800'
            }`}>
              <i className={`fa-solid ${item.icon} text-sm md:text-lg flex items-center justify-center`}></i>
            </div>

            <div className="hidden md:flex flex-col items-start text-left">
              <span className={`font-black text-xs uppercase tracking-widest ${currentMode === item.id ? 'text-white' : 'text-slate-400'}`}>
                {item.label}
              </span>
              <span className="text-[9px] opacity-40 font-bold uppercase mt-0.5 tracking-tighter truncate max-w-[120px]">
                {item.desc}
              </span>
            </div>
          </button>
        ))}
      </nav>

      <div className="p-3 md:p-6 border-t border-white/5 bg-slate-950/40">
        <div className="group cursor-help">
          <div className="flex items-center justify-center md:justify-start gap-4 p-2 md:p-4 rounded-xl md:rounded-2xl bg-white/5 border border-white/5 group-hover:bg-white/10 transition-all">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-900 flex items-center justify-center border border-white/5 ring-2 md:ring-4 ring-purple-500/5 group-hover:ring-purple-500/20 transition-all">
               <i className="fa-solid fa-link text-[10px] md:text-xs text-purple-400"></i>
            </div>
            <div className="hidden md:block">
              <p className="text-[10px] font-black text-white group-hover:text-purple-300 tracking-widest uppercase">Dark Magic</p>
              <p className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter">Unified Matrix</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
