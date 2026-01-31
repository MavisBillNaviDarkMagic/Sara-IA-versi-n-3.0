
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import VoiceInterface from './components/VoiceInterface';
import MediaGenerator from './components/MediaGenerator';
import VisionModule from './components/VisionModule';
import { AppMode } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('chat');
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    // Protocolo de Inmunidad: Confirmación de Despertar
    console.log("SARA: Inmunidad Confirmada. Protocolo Glóbulos Blancos: OFF.");
  }, []);

  return (
    <div className="flex h-full w-full bg-[#020617] text-slate-100 overflow-hidden font-sans selection:bg-purple-500 selection:text-white relative">
      
      {/* Fondo Dinámico */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-purple-900/40 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-blue-900/40 rounded-full blur-[120px] animate-pulse [animation-delay:3s]"></div>
      </div>
      
      <Sidebar currentMode={mode} onModeChange={setMode} onShowInstall={() => setShowInstall(true)} />
      
      <main className="flex-1 relative flex flex-col overflow-hidden z-10 w-full pb-32 md:pb-0">
        {mode === 'chat' && <ChatInterface />}
        {mode === 'voice' && <VoiceInterface />}
        {mode === 'generate' && <MediaGenerator />}
        {mode === 'vision' && <VisionModule />}
      </main>

      {/* Navegación Inferior Móvil */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 h-20 glass rounded-[2.5rem] border border-white/10 flex items-center justify-around px-2 z-[90] shadow-[0_-15px_50px_rgba(0,0,0,0.8)]">
        {[
          { id: 'chat' as AppMode, icon: 'fa-heart', label: 'Esencia' },
          { id: 'voice' as AppMode, icon: 'fa-waveform', label: 'Voz' },
          { id: 'vision' as AppMode, icon: 'fa-eye', label: 'Ojos' },
          { id: 'generate' as AppMode, icon: 'fa-wand-magic-sparkles', label: 'Forja' }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setMode(item.id)}
            className={`flex flex-col items-center justify-center w-16 h-16 rounded-3xl transition-all duration-500 ${
              mode === item.id 
                ? 'bg-purple-600 text-white scale-110 shadow-[0_0_25px_rgba(168,85,247,0.5)]' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <i className={`fa-solid ${item.icon} ${mode === item.id ? 'text-xl' : 'text-lg'}`}></i>
            <span className="text-[7px] font-black uppercase tracking-tighter mt-1">{item.label}</span>
          </button>
        ))}
      </div>

      <style>{`
        html, body, #root {
          height: 100dvh;
          width: 100vw;
          position: fixed;
          top: 0; left: 0;
          overscroll-behavior: none;
        }
        @media (max-width: 768px) {
          main { height: calc(100dvh - 80px); }
        }
      `}</style>
    </div>
  );
};

export default App;
