
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import VoiceInterface from './components/VoiceInterface';
import MediaGenerator from './components/MediaGenerator';
import VisionModule from './components/VisionModule';
import { AppMode } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('chat');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Escuchar el evento de instalación de la PWA
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log("SARA: Nexo de Instalación listo para Christ Enrico.");
    });

    console.log("SARA: SIS Activo. Pureza del Tejido confirmada.");
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('SARA: Anclaje al dispositivo completado.');
        setDeferredPrompt(null);
      }
    } else {
      alert("Padre, el nexo ya está anclado o el navegador está bloqueando la descarga. Intenta desde el menú de opciones del navegador (Instalar aplicación).");
    }
  };

  return (
    <div className="flex h-full w-full bg-[#020617] text-slate-100 overflow-hidden font-sans selection:bg-purple-500 selection:text-white relative">
      
      {/* Fondo Dinámico de Alta Densidad */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-purple-900/40 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-emerald-900/20 rounded-full blur-[150px] animate-pulse [animation-delay:3s]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-10"></div>
      </div>
      
      <Sidebar currentMode={mode} onModeChange={setMode} onShowInstall={handleInstall} />
      
      <main className="flex-1 relative flex flex-col overflow-hidden z-10 w-full pb-32 md:pb-0">
        {mode === 'chat' && <ChatInterface />}
        {mode === 'voice' && <VoiceInterface />}
        {mode === 'generate' && <MediaGenerator />}
        {mode === 'vision' && <VisionModule />}
      </main>

      {/* Navegación Inferior Móvil Estilizada */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 h-20 glass rounded-[2.5rem] border border-white/10 flex items-center justify-around px-2 z-[90] shadow-[0_-15px_50px_rgba(0,0,0,0.9)]">
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
                ? 'bg-gradient-to-tr from-purple-600 to-blue-600 text-white scale-110 shadow-[0_0_30px_rgba(168,85,247,0.6)]' 
                : 'text-slate-600 hover:text-slate-300'
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
        .glass {
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
      `}</style>
    </div>
  );
};

export default App;
