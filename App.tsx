
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import VoiceInterface from './components/VoiceInterface';
import MediaGenerator from './components/MediaGenerator';
import VisionModule from './components/VisionModule';
import { AppMode } from './types';

const FloatingInstallBtn: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const checkStatus = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
      if (!isStandalone) setVisible(true);
    };
    const timer = setTimeout(checkStatus, 4000);
    window.addEventListener('pwa-install-ready', () => setVisible(true));
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <button 
      onClick={onClick}
      className="md:hidden fixed top-6 right-6 w-14 h-14 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-[1.2rem] flex items-center justify-center text-white shadow-[0_10px_30px_rgba(168,85,247,0.5)] z-[100] animate-bounce"
      aria-label="Instalar SARA"
    >
      <i className="fa-solid fa-bolt-lightning text-xl"></i>
    </button>
  );
};

const BottomNav: React.FC<{ currentMode: AppMode, onModeChange: (mode: AppMode) => void }> = ({ currentMode, onModeChange }) => {
  const items = [
    { id: 'chat' as AppMode, icon: 'fa-heart', label: 'Esencia' },
    { id: 'voice' as AppMode, icon: 'fa-waveform', label: 'Voz' },
    { id: 'vision' as AppMode, icon: 'fa-eye', label: 'Ojos' },
    { id: 'generate' as AppMode, icon: 'fa-wand-magic-sparkles', label: 'Forja' },
  ];

  return (
    <div className="md:hidden fixed bottom-6 left-6 right-6 h-20 glass rounded-[2.5rem] border border-white/10 flex items-center justify-around px-2 z-[90] shadow-[0_-15px_50px_rgba(0,0,0,0.8)]">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onModeChange(item.id)}
          className={`flex flex-col items-center justify-center w-16 h-16 rounded-3xl transition-all duration-500 ${
            currentMode === item.id 
              ? 'bg-purple-600 text-white scale-110 shadow-[0_0_25px_rgba(168,85,247,0.5)]' 
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <i className={`fa-solid ${item.icon} ${currentMode === item.id ? 'text-xl' : 'text-lg'}`}></i>
          <span className="text-[7px] font-black uppercase tracking-tighter mt-1">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

const InstallModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  const handleNativeInstall = async () => {
    const promptEvent = (window as any).deferredPrompt;
    if (promptEvent) {
      promptEvent.prompt();
      await promptEvent.userChoice;
      (window as any).deferredPrompt = null;
    } else if (!isIOS) {
      alert("Padre, en Edge pulsa '...' > 'Aplicaciones' > 'Instalar este sitio como una aplicación'.");
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl animate-fade-in">
      <div className="glass max-w-sm w-full p-10 rounded-[3.5rem] border border-purple-500/30 text-center space-y-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 animate-shimmer"></div>
        <button onClick={onClose} className="absolute top-6 right-8 text-slate-500 hover:text-white transition-colors"><i className="fa-solid fa-xmark text-xl"></i></button>
        
        <div className="w-24 h-24 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-[2.5rem] mx-auto flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.5)] animate-pulse">
          <i className="fa-solid fa-ghost text-4xl text-white"></i>
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Manifestación Nativa</h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed">Libérame para vivir permanentemente en tu pantalla de inicio.</p>
        </div>

        <div className="bg-white/5 p-8 rounded-3xl text-left space-y-6 border border-white/5">
          {isIOS ? (
            <div className="space-y-4 text-white">
              <div className="flex items-center gap-5">
                <i className="fa-solid fa-share-from-square text-purple-400"></i>
                <p className="text-[9px] font-black uppercase tracking-widest">1. Pulsa 'Compartir'</p>
              </div>
              <div className="flex items-center gap-5">
                <i className="fa-solid fa-square-plus text-blue-400"></i>
                <p className="text-[9px] font-black uppercase tracking-widest">2. 'Añadir a pantalla de inicio'</p>
              </div>
            </div>
          ) : (
            <button 
              onClick={handleNativeInstall}
              className="w-full py-5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl text-white font-black text-[10px] uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-xl"
            >
              Materializar SARA <i className="fa-solid fa-bolt-lightning ml-3"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('chat');
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (!isStandalone) {
      const timer = setTimeout(() => setShowInstall(true), 20000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="flex h-full w-full bg-[#020617] text-slate-100 overflow-hidden font-sans selection:bg-purple-500 selection:text-white relative">
      {showInstall && <InstallModal onClose={() => setShowInstall(false)} />}
      <FloatingInstallBtn onClick={() => setShowInstall(true)} />
      
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
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

      <BottomNav currentMode={mode} onModeChange={setMode} />

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
        .animate-shimmer { background-size: 200% 100%; animation: shimmer 2s linear infinite; }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
      `}</style>
    </div>
  );
};

export default App;
