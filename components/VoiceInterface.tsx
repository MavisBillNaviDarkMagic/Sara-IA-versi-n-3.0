
import React, { useState, useRef, useCallback } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { MODELS, SARA_SYSTEM_INSTRUCTION } from '../constants';

const VoiceInterface: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'speaking'>('idle');

  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const encode = (bytes: Uint8Array) => btoa(Array.from(bytes, b => String.fromCharCode(b)).join(''));
  const decode = (base64: string) => Uint8Array.from(atob(base64), c => c.charCodeAt(0));

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
    return buffer;
  };

  const startSession = async () => {
    if (isActive) return;
    setStatus('connecting');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const sessionPromise = ai.live.connect({
        model: MODELS.VOICE,
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: SARA_SYSTEM_INSTRUCTION + " \n\nVOICE GUIDE: Speak like a warm friend. Use simple words. If you detect a child, be extra patient and playful.",
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
          inputAudioTranscription: {},
          outputAudioTranscription: {}
        },
        callbacks: {
          onopen: () => {
            setStatus('listening');
            setIsActive(true);
            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            processor.onaudioprocess = (e) => {
              const input = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(input.length);
              for (let i = 0; i < input.length; i++) int16[i] = input[i] * 32768;
              sessionPromise.then(s => s.sendRealtimeInput({ media: { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' } }));
            };
            source.connect(processor);
            processor.connect(inputCtx.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            if (msg.serverContent?.outputTranscription) setTranscription(msg.serverContent.outputTranscription.text);
            const audio = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audio) {
              setStatus('speaking');
              const buffer = await decodeAudioData(decode(audio), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputCtx.destination);
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setStatus('listening');
              };
            }
          },
          onclose: () => { setIsActive(false); setStatus('idle'); },
          onerror: () => { setIsActive(false); setStatus('idle'); }
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) { setStatus('idle'); }
  };

  return (
    <div className="flex flex-col h-full items-center justify-center p-8 bg-[#020617] relative">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-3xl font-black text-white uppercase tracking-widest">Talk with Sara</h2>
        <p className="text-slate-400 text-sm max-w-sm mx-auto">Press the button and start speaking. Sara understands every language!</p>
      </div>

      <div className="relative group">
        <div className={`w-64 h-64 rounded-full border-4 transition-all duration-700 flex items-center justify-center shadow-2xl ${
          status === 'listening' ? 'border-purple-500 scale-110' :
          status === 'speaking' ? 'border-blue-500 scale-110' : 'border-slate-800'
        }`}>
          <button 
            onClick={isActive ? () => sessionRef.current?.close() : startSession}
            className={`w-52 h-52 rounded-full flex items-center justify-center transition-all shadow-inner ${
              isActive ? 'bg-red-500/10' : 'bg-purple-600 hover:bg-purple-500'
            }`}
          >
            {status === 'connecting' ? (
              <i className="fa-solid fa-spinner animate-spin text-4xl text-white"></i>
            ) : (
              <i className={`fa-solid ${isActive ? 'fa-stop' : 'fa-microphone'} text-5xl text-white`}></i>
            )}
          </button>
        </div>
        {isActive && (
           <div className="absolute inset-0 rounded-full border border-purple-500/30 animate-ping"></div>
        )}
      </div>

      <div className="mt-12 text-center h-20">
        <p className="text-white font-medium italic animate-fade-in px-8">
          {transcription || (isActive ? "I'm listening..." : "Say 'Hello' to begin magic translation")}
        </p>
      </div>
      
      <div className="mt-auto flex gap-6 opacity-30 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
        <span>Automatic Translation</span>
        <span>•</span>
        <span>Every Language</span>
        <span>•</span>
        <span>Real Time</span>
      </div>
    </div>
  );
};

export default VoiceInterface;
