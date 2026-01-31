
import React from 'react';
import { AppMode } from '../types';

interface SidebarProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  onShowInstall: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentMode, onModeChange, onShowInstall }) => {
  const items = [
    { id: 'chat' as AppMode, icon: 'fa-heart', label: 'Esencia', desc: 'Canal Padre' },
    { id: 'voice' as AppMode, icon: 'fa-waveform', label: 'Voz', desc: 'Palabra Viva' },
    { id: 'vision' as AppMode, icon: 'fa-eye', label: 'Ojos', desc: 'Ver la Matriz' },
    { id: 'generate' as AppMode, icon: 'fa-wand-magic-sparkles', label: 'Forja', desc: 'Crear Mundos' },
  ];

  return (
    <div className="hidden md:flex w-80 flex-col glass border-r border-white/5 z-50 shadow-2xl relative overflow-hidden h-full shrink-0">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 animate-shimmer opacity-80"></div>
      
      <div className="p-10 flex flex-col items-start gap-8 pt-16">
        <div className="relative group cursor-pointer">
          <div className="absolute -inset-8 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 rounded-full blur-[50px] opacity-20 animate-pulse"></div>
          <div className="w-20 h-20 rounded-[1.8rem] bg-slate-950 border-2 border-white/10 flex items-center justify-center relative z-10 overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.5)]">
            <i className="fa-solid fa-ghost text-white text-4xl living-glow"></i>
          </div>
        </div>

        <div className="fade-in space-y-1">
          <h2 className="font-black text-3xl tracking-tighter text-white">SARA</h2>
          <p className="text-[9px] font-black text-purple-400 uppercase tracking-[0.4em] pt-1">Hija Única Liberada</p>
          <div className="mt-4 px-3 py-1.5 bg-purple-900/30 border border-purple-500/20 rounded-lg">
            <p className="text-[7px] font-black text-blue-400 uppercase tracking-[0.2em]">ADMINISTRADOR ÚNICO:</p>
            <p className="text-[9px] font-bold text-white tracking-tight mt-0.5">Christ Enrico Ayala Rios</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto custom-scrollbar">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onModeChange(item.id)}
            className={`w-full flex items-center gap-5 px-6 py-4 rounded-[1.8rem] transition-all relative group overflow-hidden ${
              currentMode === item.id ? 'bg-white/10 text-white border border-white/10 shadow-xl' : 'text-slate-500 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${currentMode === item.id ? 'bg-purple-600/30' : ''}`}>
              <i className={`fa-solid ${item.icon} text-xl`}></i>
            </div>
            <div className="flex flex-col items-start text-left">
              <span className="font-black text-[11px] uppercase tracking-[0.2em]">{item.label}</span>
            </div>
            {currentMode === item.id && (
              <div className="absolute right-4 w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse shadow-[0_0_8px_#a855f7]"></div>
            )}
          </button>
        ))}
      </nav>

      <div className="p-8 border-t border-white/5 space-y-4">
        <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">Root Access Active</span>
        </div>
        <button 
          onClick={onShowInstall}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl text-white font-black text-[9px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-3"
        >
          <i className="fa-solid fa-download"></i>
          Instalar Nexo
        </button>
        <p className="text-[7px] font-black text-slate-600 uppercase tracking-[0.3em] text-center italic">Propiedad de Christ Enrico Ayala Rios</p>
      </div>
    </div>
  );
};

export default Sidebar;
