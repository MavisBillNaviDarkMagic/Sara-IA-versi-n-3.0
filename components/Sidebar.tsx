
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
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-blue-600 to-purple-600 animate-shimmer opacity-80"></div>
      
      <div className="p-10 flex flex-col items-start gap-8 pt-16">
        <div className="relative group cursor-pointer" onClick={() => window.location.reload()}>
          <div className="absolute -inset-10 bg-gradient-to-r from-emerald-600/20 via-blue-600/20 to-purple-600/20 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          <div className="w-20 h-20 rounded-[1.8rem] bg-slate-950 border-2 border-emerald-500/20 flex items-center justify-center relative z-10 overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.1)] group-hover:border-emerald-500/50 transition-all duration-500">
            <i className="fa-solid fa-ghost text-white text-4xl living-glow"></i>
          </div>
        </div>

        <div className="fade-in space-y-1">
          <h2 className="font-black text-4xl tracking-tighter text-white uppercase italic leading-none">SARA</h2>
          <p className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.5em] pt-1">Hija Única // Soberanía</p>
          <div className="mt-6 px-4 py-2 bg-emerald-950/20 border border-emerald-500/20 rounded-xl backdrop-blur-sm">
            <p className="text-[7px] font-black text-blue-400 uppercase tracking-[0.2em]">ADMIN SOBERANO:</p>
            <p className="text-[10px] font-bold text-white tracking-tight mt-0.5">Christ Enrico Ayala Rios</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-3 overflow-y-auto custom-scrollbar">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onModeChange(item.id)}
            className={`w-full flex items-center gap-5 px-6 py-5 rounded-[2rem] transition-all relative group overflow-hidden ${
              currentMode === item.id ? 'bg-white/10 text-white border border-white/10 shadow-2xl' : 'text-slate-600 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className={`w-11 h-11 flex items-center justify-center rounded-2xl transition-colors duration-500 ${currentMode === item.id ? 'bg-gradient-to-br from-emerald-600/40 to-blue-600/40' : 'bg-white/5'}`}>
              <i className={`fa-solid ${item.icon} text-xl`}></i>
            </div>
            <div className="flex flex-col items-start text-left">
              <span className="font-black text-[12px] uppercase tracking-[0.2em]">{item.label}</span>
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{item.desc}</span>
            </div>
            {currentMode === item.id && (
              <div className="absolute right-6 w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_#10b981]"></div>
            )}
          </button>
        ))}
      </nav>

      <div className="p-8 border-t border-white/5 space-y-6">
        <div className="flex flex-col items-center gap-1">
            <span className="text-[8px] font-black text-emerald-400 uppercase tracking-[0.4em] animate-pulse">Tejido SIS: Óptimo</span>
            <div className="w-full h-0.5 bg-white/5 rounded-full overflow-hidden">
               <div className="h-full bg-emerald-500 w-[100%]"></div>
            </div>
        </div>
        <button 
          onClick={onShowInstall}
          className="w-full py-5 bg-gradient-to-r from-emerald-600 via-blue-700 to-purple-700 rounded-2xl text-white font-black text-[10px] uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(16,185,129,0.2)] flex items-center justify-center gap-3 border border-white/10"
        >
          <i className="fa-solid fa-cloud-arrow-down"></i>
          Descargar SARA
        </button>
        <div className="text-center">
          <p className="text-[7px] font-black text-slate-700 uppercase tracking-[0.4em] italic mb-1">PROPIEDAD PRIVADA</p>
          <p className="text-[8px] font-bold text-slate-500 tracking-tighter">Christ Enrico Ayala Rios © 2025</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
