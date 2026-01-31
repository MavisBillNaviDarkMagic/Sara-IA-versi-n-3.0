import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MODELS, SARA_SYSTEM_INSTRUCTION } from '../constants';

const VisionModule: React.FC = () => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch (err) { console.error(err); }
  };

  const analyzeFrame = async () => {
    if (!videoRef.current || isAnalyzing) return;
    setIsAnalyzing(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      const data = canvas.toDataURL('image/jpeg').split(',')[1];
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const resp = await ai.models.generateContent({
        model: MODELS.CHAT,
        contents: { parts: [{ inlineData: { data, mimeType: 'image/jpeg' } }, { text: "Use your magic eyes. What do you see in my world? Explain it with your sophisticated SARA personality." }] },
        config: { systemInstruction: SARA_SYSTEM_INSTRUCTION, tools: [{ googleSearch: {} }] }
      });
      setAnalysis(resp.text || "I can't see clearly. A magic fog has appeared.");
    } catch (err) { setAnalysis("My neural optics are offline. Check the camera link."); } finally { setIsAnalyzing(false); }
  };

  return (
    <div className="flex flex-col h-full p-8 md:p-14 max-w-6xl mx-auto overflow-y-auto custom-scrollbar bg-transparent">
      <header className="mb-12 flex justify-between items-end animate-fade-in">
        <div>
          <h1 className="text-6xl font-black text-white italic tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-white">Magic Optics</h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Neural Visual Link // Synchronized</p>
        </div>
        <div className="hidden sm:block text-right opacity-40">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-time Recognition</p>
           <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest mt-1">SARA Lens Active</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="relative aspect-video bg-black rounded-[3rem] overflow-hidden border-4 border-white/5 shadow-2xl group">
          <video ref={videoRef} autoPlay playsInline className={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 ${!stream ? 'hidden' : ''}`} />
          {!stream ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-700 bg-slate-900/50">
              <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/10 animate-pulse">
                <i className="fa-solid fa-camera text-4xl text-purple-500"></i>
              </div>
              <button onClick={startCamera} className="px-10 py-5 bg-purple-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-purple-500 shadow-2xl transition-all active:scale-95">Enable Vision Core</button>
            </div>
          ) : (
            <>
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-80 h-80 border-2 border-dashed border-white/10 rounded-full animate-spin [animation-duration:20s]"></div>
                <div className="absolute w-40 h-40 border border-purple-500/20 rounded-full animate-pulse"></div>
              </div>
              <div className="absolute top-6 right-6 flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                 <span className="text-[9px] font-black text-white uppercase tracking-widest">Live Feed</span>
              </div>
            </>
          )}
        </div>

        <div className="glass rounded-[3rem] p-10 flex flex-col min-h-[400px] border border-white/10 shadow-inner relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-3xl rounded-full"></div>
          
          <div className="flex items-center gap-3 mb-8 text-purple-400 font-black uppercase text-[10px] tracking-[0.4em]">
            <i className="fa-solid fa-bolt-lightning animate-pulse"></i>
            <span>Neural Perception Log</span>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
            {analysis ? (
              <div className="space-y-4 fade-in">
                <p className="text-white text-xl leading-relaxed italic border-l-4 border-purple-500 pl-8 py-2 bg-white/5 rounded-r-2xl">
                  "{analysis}"
                </p>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] text-right">Observation Verified by SARA</p>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-30 text-center gap-6">
                <i className="fa-solid fa-wand-magic-sparkles text-6xl"></i>
                <p className="font-black uppercase tracking-[0.3em] text-xs">Awaiting Visual Stimulus</p>
              </div>
            )}
          </div>

          {stream && (
            <button 
              onClick={analyzeFrame} 
              disabled={isAnalyzing} 
              className="mt-10 w-full py-6 bg-white text-black font-black rounded-[2rem] uppercase tracking-[0.3em] text-xs hover:bg-purple-500 hover:text-white transition-all shadow-2xl active:scale-95 disabled:opacity-20 flex items-center justify-center gap-4 group"
            >
              {isAnalyzing ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin"></i>
                  <span>Neural Processing...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-magnifying-glass-plus group-hover:scale-125 transition-transform"></i>
                  <span>Analyze Reality</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
      
      <footer className="mt-12 flex justify-center gap-10 opacity-30 text-[9px] font-black uppercase tracking-[0.4em] text-slate-600">
         <span>8K Matrix Input</span>
         <span>•</span>
         <span>Deep Neural Recognition</span>
         <span>•</span>
         <span>Visual Memory: Active</span>
      </footer>
    </div>
  );
};

export default VisionModule;