
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MODELS } from '../constants';

const MediaGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const currentObjectUrl = useRef<string | null>(null);

  const messages = [
    "Sincronizando con el Núcleo del NU World...",
    "Tejiendo hilos de datos en 8K...",
    "Manifestando tu visión en la matriz...",
    "SARA está forjando una nueva realidad...",
    "Purificando la señal de video..."
  ];

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      let idx = 0;
      setLoadingMsg(messages[0]);
      interval = setInterval(() => {
        idx = (idx + 1) % messages.length;
        setLoadingMsg(messages[idx]);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Limpieza de memoria para evitar fugas en WebView
  useEffect(() => {
    return () => {
      if (currentObjectUrl.current) URL.revokeObjectURL(currentObjectUrl.current);
    };
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;
    
    const hasKey = await (window as any).aistudio?.hasSelectedApiKey();
    if (!hasKey) {
      await (window as any).aistudio?.openSelectKey();
      return;
    }

    setIsLoading(true);
    setError(null);
    if (currentObjectUrl.current) {
      URL.revokeObjectURL(currentObjectUrl.current);
      currentObjectUrl.current = null;
    }
    setResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      if (mediaType === 'image') {
        const response = await ai.models.generateContent({
          model: MODELS.IMAGE,
          contents: [{ parts: [{ text: prompt }] }],
          config: { 
            imageConfig: { aspectRatio: "1:1", imageSize: "4K" }
          }
        });
        
        const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
        if (imagePart) {
          setResult(`data:image/png;base64,${imagePart.inlineData.data}`);
        } else {
          throw new Error("La manifestación de imagen no pudo cristalizar.");
        }
      } else {
        let op = await ai.models.generateVideos({
          model: MODELS.VIDEO,
          prompt: prompt,
          config: { numberOfVideos: 1, resolution: '1080p', aspectRatio: '16:9' }
        });

        while (!op.done) {
          await new Promise(r => setTimeout(r, 8000));
          op = await ai.operations.getVideosOperation({ operation: op });
        }

        const link = op.response?.generatedVideos?.[0]?.video?.uri;
        if (link) {
          // CORRECCIÓN DE FASE DE URL: Validación dinámica de parámetros de consulta
          const separator = link.includes('?') ? '&' : '?';
          const urlWithKey = `${link}${separator}key=${process.env.API_KEY}`;
            
          const fetchResponse = await fetch(urlWithKey);
          if (!fetchResponse.ok) throw new Error("Error de enlace en la Matriz.");
          
          const blob = await fetchResponse.blob();
          const objectUrl = URL.createObjectURL(blob);
          currentObjectUrl.current = objectUrl;
          setResult(objectUrl);
        } else {
          throw new Error("El bucle de manifestación no devolvió una URI válida.");
        }
      }
    } catch (err: any) {
      setError(err.message || "Un error en la magia ha ocurrido. Re-intenta.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-6 md:p-12 max-w-5xl mx-auto overflow-y-auto custom-scrollbar">
      <header className="mb-12 animate-fade-in text-center md:text-left">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-white to-blue-500 uppercase">Manifestar</h1>
        <p className="text-slate-500 mt-2 font-bold uppercase tracking-[0.4em] text-[10px]">Arquitectura NU World // Activa</p>
      </header>

      <div className="glass p-6 md:p-12 rounded-[3rem] space-y-8 border border-white/10 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-blue-500 to-transparent"></div>
        
        <div className="flex gap-2 p-1 bg-slate-950/80 rounded-full w-fit mx-auto border border-white/5">
          {['image', 'video'].map((t) => (
            <button 
              key={t} 
              onClick={() => setMediaType(t as any)} 
              className={`px-8 py-3 rounded-full transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2 ${
                mediaType === t ? 'bg-purple-600 text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <i className={`fa-solid ${t === 'image' ? 'fa-image' : 'fa-film'}`}></i>
              {t}
            </button>
          ))}
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          className="w-full bg-slate-950/60 border-2 border-white/5 rounded-[2rem] p-8 text-white focus:border-purple-500/50 outline-none text-center text-lg md:text-xl"
          placeholder="Escribe tu voluntad para el NU World..."
        />

        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isLoading}
          className="w-full py-6 rounded-[2rem] bg-gradient-to-r from-purple-600 to-blue-600 text-white font-black uppercase tracking-[0.3em] shadow-xl hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-30"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-4">
              <i className="fa-solid fa-atom animate-spin"></i>
              {loadingMsg}
            </span>
          ) : 'Iniciar Manifestación'}
        </button>

        {error && <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-2xl text-red-400 text-xs font-bold text-center animate-pulse">{error}</div>}
      </div>

      <div className="mt-12 min-h-[500px] bg-slate-950/40 rounded-[3rem] border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl relative">
        {isLoading ? (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 border-t-4 border-purple-500 rounded-full animate-spin mx-auto"></div>
            <p className="text-white text-[10px] font-black tracking-[0.5em] uppercase">Forjando...</p>
          </div>
        ) : result ? (
          <div className="w-full h-full p-4 flex flex-col items-center fade-in">
             {mediaType === 'image' ? <img src={result} className="max-w-full max-h-[70vh] rounded-2xl shadow-2xl" /> : <video src={result} controls autoPlay className="max-w-full max-h-[70vh] rounded-2xl shadow-2xl" />}
             <a href={result} download={`nuworld-${Date.now()}`} className="mt-6 px-10 py-4 bg-white/10 hover:bg-white/20 text-white rounded-full font-black uppercase tracking-widest text-[10px] border border-white/10">Archivar en Memoria</a>
          </div>
        ) : (
          <div className="opacity-10 text-center">
            <i className="fa-solid fa-wand-magic-sparkles text-[120px] mb-6"></i>
            <p className="text-xl font-black uppercase tracking-[0.5em] text-slate-500 italic">Forja Universal</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaGenerator;
