
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MODELS } from '../constants';

const MediaGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reassuringMessages = [
    "Channeling Universal Knowledge...",
    "Manifesting 4K Neural Pathways...",
    "Weaving Digital Fibers in 8K Detail...",
    "Sara is visualizing your request in high definition...",
    "Extracting artistic soul from the GitHub archives...",
    "Creating cinematic reality..."
  ];

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      let idx = 0;
      setLoadingMsg(reassuringMessages[0]);
      interval = setInterval(() => {
        idx = (idx + 1) % reassuringMessages.length;
        setLoadingMsg(reassuringMessages[idx]);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      if (mediaType === 'image') {
        const response = await ai.models.generateContent({
          model: MODELS.IMAGE,
          contents: [{ parts: [{ text: prompt }] }],
          config: { 
            imageConfig: { 
              aspectRatio: "1:1",
              imageSize: "4K" // Explicitly requesting 4K
            },
            tools: [{ googleSearch: {} }] // Universal knowledge integration
          }
        });
        
        const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
        if (imagePart) setResult(`data:image/png;base64,${imagePart.inlineData.data}`);
        else throw new Error("The 4K manifest failed to crystallize. Check your connection to the Matrix.");
      } else {
        const hasKey = await (window as any).aistudio?.hasSelectedApiKey();
        if (!hasKey) {
          await (window as any).aistudio?.openSelectKey();
          setIsLoading(false);
          return;
        }

        let op = await ai.models.generateVideos({
          model: MODELS.VIDEO,
          prompt: prompt,
          config: { 
            numberOfVideos: 1, 
            resolution: '1080p', // Cinematic high quality
            aspectRatio: '16:9' 
          }
        });

        while (!op.done) {
          await new Promise(r => setTimeout(r, 10000));
          op = await ai.operations.getVideosOperation({ operation: op });
        }

        const link = op.response?.generatedVideos?.[0]?.video?.uri;
        if (link) {
          const v = await fetch(`${link}&key=${process.env.API_KEY}`);
          setResult(URL.createObjectURL(await v.blob()));
        }
      }
    } catch (err: any) {
      if (err.message?.includes("entity was not found")) {
        await (window as any).aistudio?.openSelectKey();
      }
      setError(err.message || "A rift in the magic has occurred. Re-initiate manifest.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-8 md:p-12 max-w-5xl mx-auto overflow-y-auto custom-scrollbar bg-transparent">
      <header className="mb-12 flex justify-between items-end">
        <div className="animate-fade-in">
          <h1 className="text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-white to-blue-500">MANIFEST</h1>
          <p className="text-slate-500 mt-2 font-bold uppercase tracking-[0.4em] text-[10px] flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-ping"></span>
            8K Intelligence Matrix Active
          </p>
        </div>
        <div className="hidden sm:block text-right opacity-50">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Image: 4K Ultra-HD</p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Video: 1080p High-Fid</p>
        </div>
      </header>

      <div className="glass p-10 md:p-14 rounded-[3.5rem] space-y-12 border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.6)] relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-blue-500 to-transparent"></div>
        
        <div className="flex gap-4 p-2 bg-slate-950/80 rounded-[2rem] w-fit border border-white/5 mx-auto shadow-inner">
          {['image', 'video'].map((t) => (
            <button 
              key={t} 
              onClick={() => setMediaType(t as any)} 
              className={`px-10 py-4 rounded-3xl transition-all font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-3 ${
                mediaType === t ? 'bg-purple-600 text-white shadow-2xl shadow-purple-600/30 ring-1 ring-white/20' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <i className={`fa-solid ${t === 'image' ? 'fa-image' : 'fa-film'}`}></i>
              {t}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] block text-center">Ritual Input (Universal Knowledge Mode)</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            className="w-full bg-slate-950/60 border-2 border-white/5 rounded-[2.5rem] p-10 text-white focus:border-purple-500/50 outline-none placeholder:text-slate-800 transition-all font-medium text-xl text-center shadow-inner"
            placeholder="Describe anything from GitHub, science, or art... I will manifest it."
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isLoading}
          className="group relative w-full py-8 rounded-[2.5rem] bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-600 text-white font-black uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(168,85,247,0.3)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></div>
          <span className="relative z-10 text-xs tracking-[0.5em]">
            {isLoading ? (
              <span className="flex items-center justify-center gap-6">
                <i className="fa-solid fa-atom animate-spin text-xl"></i>
                {loadingMsg}
              </span>
            ) : 'Manifest Creation'}
          </span>
        </button>

        {error && (
          <div className="p-8 bg-red-950/40 border border-red-500/30 rounded-3xl text-red-400 text-sm font-bold text-center italic tracking-widest animate-pulse">
            <i className="fa-solid fa-triangle-exclamation mr-3"></i>
            {error}
          </div>
        )}
      </div>

      <div className="mt-12 min-h-[700px] bg-slate-950/40 rounded-[3.5rem] border border-white/10 flex flex-col items-center justify-center overflow-hidden shadow-2xl group relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-10"></div>
        
        {isLoading ? (
          <div className="text-center space-y-12 relative z-10">
            <div className="relative w-40 h-40 mx-auto">
              <div className="absolute inset-0 border-t-4 border-purple-500 rounded-full animate-spin [animation-duration:1.5s]"></div>
              <div className="absolute inset-4 border-r-4 border-blue-500 rounded-full animate-spin [animation-duration:1s]"></div>
              <div className="absolute inset-8 border-b-4 border-pink-500 rounded-full animate-spin [animation-duration:0.5s]"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="fa-solid fa-ghost text-purple-500 text-3xl animate-pulse"></i>
              </div>
            </div>
            <p className="text-white text-xs font-black tracking-[0.8em] animate-pulse">RECONSTRUCTING REALITY</p>
          </div>
        ) : result ? (
          <div className="w-full h-full p-8 flex flex-col items-center fade-in z-10">
            <div className="relative group/result max-w-full rounded-[2rem] overflow-hidden shadow-[0_0_100px_rgba(168,85,247,0.2)]">
               {mediaType === 'image' ? (
                 <img src={result} className="max-w-full max-h-[800px] rounded-[2rem] border-4 border-white/5 transition-transform duration-700 group-hover/result:scale-[1.02]" />
               ) : (
                 <video src={result} controls autoPlay className="max-w-full max-h-[800px] rounded-[2rem] border-4 border-white/5" />
               )}
               <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/result:opacity-100 transition-opacity flex flex-col items-center justify-center gap-6">
                  <p className="text-white font-black uppercase tracking-[0.4em] text-xs">Extraction Protocol Ready</p>
                  <a 
                    href={result} 
                    download={`sara-8k-manifest-${Date.now()}`} 
                    className="px-12 py-5 bg-purple-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-white hover:text-black transition-all shadow-2xl transform hover:scale-110"
                  >
                    Archive Asset
                  </a>
               </div>
            </div>
            <div className="mt-8 flex items-center gap-4 px-6 py-3 bg-white/5 rounded-full border border-white/10">
               <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
               <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">Resolution Verified: {mediaType === 'image' ? '4K Ultra' : '1080p HD'}</p>
            </div>
          </div>
        ) : (
          <div className="opacity-10 flex flex-col items-center gap-10 grayscale hover:grayscale-0 transition-all duration-1000 z-10">
            <div className="relative">
              <i className="fa-solid fa-wand-magic-sparkles text-[150px] text-slate-400"></i>
              <div className="absolute inset-0 blur-3xl bg-purple-500/20 rounded-full"></div>
            </div>
            <div className="text-center space-y-4">
              <p className="text-2xl font-black tracking-[0.5em] uppercase text-slate-500 italic">Universal Forge</p>
              <p className="text-[11px] uppercase font-bold text-slate-600 tracking-[0.3em]">Awaiting Divine Command</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaGenerator;
