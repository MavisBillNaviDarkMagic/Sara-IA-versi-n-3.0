
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
    "Synchronizing with the NU World Matrix...",
    "Manifesting 8K Neural Pathways...",
    "Weaving Universal Intelligence into Art...",
    "SARA is crafting your cinematic reality...",
    "Extracting artistic soul from the GitHub archives...",
    "Materializing vision in 4K detail..."
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
    
    // Explicitly check for high-quality key selection if using Imagen 3 or Veo
    const hasKey = await (window as any).aistudio?.hasSelectedApiKey();
    if (!hasKey) {
      await (window as any).aistudio?.openSelectKey();
      // Assume success and proceed, or let user click again
      return;
    }

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
              imageSize: "4K"
            },
            tools: [{ googleSearch: {} }] 
          }
        });
        
        const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
        if (imagePart) {
          setResult(`data:image/png;base64,${imagePart.inlineData.data}`);
        } else {
          throw new Error("The manifestation failed to crystallize. Check the matrix link.");
        }
      } else {
        let op = await ai.models.generateVideos({
          model: MODELS.VIDEO,
          prompt: prompt,
          config: { 
            numberOfVideos: 1, 
            resolution: '1080p', 
            aspectRatio: '16:9' 
          }
        });

        while (!op.done) {
          await new Promise(r => setTimeout(r, 8000));
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
    <div className="flex flex-col h-full p-6 md:p-12 max-w-5xl mx-auto overflow-y-auto custom-scrollbar bg-transparent">
      <header className="mb-8 md:mb-12 flex justify-between items-end animate-fade-in">
        <div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-white to-blue-500">MANIFEST</h1>
          <p className="text-slate-500 mt-2 font-bold uppercase tracking-[0.2em] md:tracking-[0.4em] text-[8px] md:text-[10px] flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-ping"></span>
            8K Matrix Support // Active
          </p>
        </div>
        <div className="hidden sm:block text-right opacity-30">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NU World Architecture</p>
        </div>
      </header>

      <div className="glass p-6 md:p-14 rounded-3xl md:rounded-[3.5rem] space-y-8 md:space-y-12 border border-white/10 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-blue-500 to-transparent"></div>
        
        <div className="flex gap-2 p-1.5 bg-slate-950/80 rounded-2xl md:rounded-[2rem] w-fit border border-white/5 mx-auto">
          {['image', 'video'].map((t) => (
            <button 
              key={t} 
              onClick={() => setMediaType(t as any)} 
              className={`px-6 py-3 md:px-10 md:py-4 rounded-xl md:rounded-3xl transition-all font-black text-[10px] md:text-[11px] uppercase tracking-widest md:tracking-[0.2em] flex items-center gap-2 md:gap-3 ${
                mediaType === t ? 'bg-purple-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <i className={`fa-solid ${t === 'image' ? 'fa-image' : 'fa-film'} flex items-center justify-center`}></i>
              {t}
            </button>
          ))}
        </div>

        <div className="space-y-4 md:space-y-6">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            className="w-full bg-slate-950/60 border-2 border-white/5 rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 text-white focus:border-purple-500/50 outline-none placeholder:text-slate-800 transition-all font-medium text-base md:text-xl text-center shadow-inner"
            placeholder="Command SARA to forge your vision in 8K..."
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isLoading}
          className="group relative w-full py-6 md:py-8 rounded-2xl md:rounded-[2.5rem] bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-600 text-white font-black uppercase tracking-[0.2em] md:tracking-[0.3em] shadow-xl hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-30 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></div>
          <span className="relative z-10 text-[10px] md:text-xs">
            {isLoading ? (
              <span className="flex items-center justify-center gap-4">
                <i className="fa-solid fa-atom animate-spin text-lg"></i>
                {loadingMsg}
              </span>
            ) : 'Manifest Creation'}
          </span>
        </button>

        {error && (
          <div className="p-4 md:p-8 bg-red-950/40 border border-red-500/30 rounded-2xl text-red-400 text-xs md:text-sm font-bold text-center italic animate-pulse">
            <i className="fa-solid fa-triangle-exclamation mr-2"></i>
            {error}
          </div>
        )}
      </div>

      <div className="mt-8 md:mt-12 min-h-[400px] md:min-h-[700px] bg-slate-950/40 rounded-3xl md:rounded-[3.5rem] border border-white/10 flex flex-col items-center justify-center overflow-hidden shadow-2xl relative">
        {isLoading ? (
          <div className="text-center space-y-8 relative z-10">
            <div className="relative w-24 h-24 md:w-40 md:h-40 mx-auto">
              <div className="absolute inset-0 border-t-4 border-purple-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="fa-solid fa-ghost text-purple-500 text-2xl md:text-3xl animate-pulse"></i>
              </div>
            </div>
            <p className="text-white text-[8px] md:text-xs font-black tracking-[0.5em] animate-pulse uppercase">Forging Reality</p>
          </div>
        ) : result ? (
          <div className="w-full h-full p-4 md:p-8 flex flex-col items-center fade-in z-10">
            <div className="relative group/result max-w-full rounded-2xl md:rounded-[2rem] overflow-hidden shadow-2xl">
               {mediaType === 'image' ? (
                 <img src={result} className="max-w-full max-h-[70vh] rounded-2xl md:rounded-[2rem] border-4 border-white/5" />
               ) : (
                 <video src={result} controls autoPlay className="max-w-full max-h-[70vh] rounded-2xl md:rounded-[2rem] border-4 border-white/5" />
               )}
               <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/result:opacity-100 transition-opacity flex items-center justify-center">
                  <a 
                    href={result} 
                    download={`sara-manifest-${Date.now()}`} 
                    className="px-8 py-4 bg-purple-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:scale-110 transition-transform"
                  >
                    Archive Asset
                  </a>
               </div>
            </div>
          </div>
        ) : (
          <div className="opacity-10 flex flex-col items-center gap-6 md:gap-10 z-10">
            <i className="fa-solid fa-wand-magic-sparkles text-[80px] md:text-[150px] text-slate-400"></i>
            <div className="text-center space-y-2">
              <p className="text-xl md:text-2xl font-black tracking-[0.3em] md:tracking-[0.5em] uppercase text-slate-500 italic">Universal Forge</p>
              <p className="text-[9px] md:text-[11px] uppercase font-bold text-slate-600 tracking-widest">Awaiting Command</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaGenerator;
