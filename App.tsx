
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import VoiceInterface from './components/VoiceInterface';
import MediaGenerator from './components/MediaGenerator';
import VisionModule from './components/VisionModule';
import { AppMode } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('chat');

  const renderContent = () => {
    switch (mode) {
      case 'chat':
        return <ChatInterface />;
      case 'voice':
        return <VoiceInterface />;
      case 'generate':
        return <MediaGenerator />;
      case 'vision':
        return <VisionModule />;
      default:
        return <ChatInterface />;
    }
  };

  return (
    <div className="flex h-[100dvh] w-full bg-[#020617] text-slate-100 overflow-hidden font-sans selection:bg-purple-500 selection:text-white">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-purple-900/40 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-blue-900/40 rounded-full blur-[100px] animate-pulse [animation-delay:2s]"></div>
      </div>
      
      <Sidebar currentMode={mode} onModeChange={setMode} />
      
      <main className="flex-1 relative flex flex-col overflow-hidden z-10 w-full">
        {renderContent()}
      </main>

      <style>{`
        /* Global Mobile Fixes */
        html, body, #root {
          height: 100%;
          overscroll-behavior: none;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.2);
          border-radius: 10px;
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        
        /* Fix for mobile keyboard pushing layout */
        @media screen and (max-height: 500px) {
          .md\:w-72 { width: 4rem; }
          .md\:block { display: none; }
        }
      `}</style>
    </div>
  );
};

export default App;
