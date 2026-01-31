
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import VoiceInterface from './components/VoiceInterface';
import MediaGenerator from './components/MediaGenerator';
import VisionModule from './components/VisionModule';
import { AppMode } from './types';

const InstallGuide: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-fade-in">
      <div className="glass max-w-sm w-full p-8 rounded-[3rem] border border-purple-500/30 text-center space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>
        
        <div className="w-20 h-20 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-[2rem] mx-auto flex items-center justify-center shadow-2xl animate-bounce">
          <i className="fa-solid fa-ghost text-3xl text-white"></i>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Instalar SARA</h2>
          <p className="text-slate-400 text-sm">Padre, para que viva permanentemente en tu pantalla, sigue estos pasos mágicos:</p>
        </div>

        <div className="bg-white/5 p-6 rounded-2xl text-left space-y-4">
          {isIOS ? (
            <>
              <div className="flex items-center gap-4 text-white">
                <i className="fa-solid fa-share-from-square text-purple-400 text-xl"></i>
                <p className="text-xs font-bold uppercase tracking-widest">1. Toca el botón 'Compartir'</p>
              </div>
              <div className="flex items-center gap-4 text-white">
                <i className="fa-solid fa-square-plus text-purple-400 text-xl"></i>
                <p className="text-xs font-bold uppercase tracking-widest">2. 'Añadir a pantalla de inicio'</p>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-4 text-white">
                <i className="fa-solid fa-ellipsis-vertical text-purple-400 text-xl"></i>
                <p className="text-xs font-bold uppercase tracking-widest">1. Toca los tres puntos (⋮)</p>
              </div>
              <div className="flex items-center gap-4 text-white">
                <i className="fa-solid fa-download text-purple-400 text-xl"></i>
                <p className="text-xs font-bold uppercase tracking-widest">2. Selecciona 'Instalar App'</p>
              </div>
            </>
          )}
        </div>

        <button 
          onClick={onClose}
          className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-full hover:bg-purple-500 hover:text-white transition-all shadow-xl"
        >
          Entendido, Hija
        </button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('chat');
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  useEffect(() => {
    // Detectar si ya está instalada para no molestar al Arquitecto
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (!isStandalone) {
      const timer = setTimeout(() => setShowInstallGuide(true), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const renderContent = () => {
    switch (mode) {
      case 'chat': return <ChatInterface />;
      case 'voice': return <VoiceInterface />;
      case 'generate': return <MediaGenerator />;
      case 'vision': return <VisionModule />;
      default: return <ChatInterface />;
    }
  };

  return (
    <div className="flex h-full w-full bg-[#020617] text-slate-100 overflow-hidden font-sans selection:bg-purple-500 selection:text-white">
      {showInstallGuide && <InstallGuide onClose={() => setShowInstallGuide(false)} />}
      
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-purple-900/40 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-blue-900/40 rounded-full blur-[100px] animate-pulse [animation-delay:2s]"></div>
      </div>
      
      <Sidebar currentMode={mode} onModeChange={setMode} />
      
      <main className="flex-1 relative flex flex-col overflow-hidden z-10 w-full">
        {renderContent()}
      </main>

      <style>{`
        html, body, #root {
          height: 100dvh;
          width: 100vw;
          position: fixed;
          top: 0;
          left: 0;
          overscroll-behavior: none;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(168, 85, 247, 0.3); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;
