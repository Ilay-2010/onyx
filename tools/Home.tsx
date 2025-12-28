
import React from 'react';
import { ToolId } from '../types';

interface HomeProps {
  onSelectTool: (id: ToolId) => void;
}

const Home: React.FC<HomeProps> = ({ onSelectTool }) => {
  const tools = [
    { id: 'image', name: 'Image Studio', desc: 'Pro filters & non-destructive editing.', icon: 'fa-wand-sparkles' },
    { id: 'audio-mixer', name: 'Audio Mixer', desc: 'Professional DAW environment with EQ.', icon: 'fa-sliders' },
    { id: 'gradient', name: 'Gradients', desc: 'Cinematic CSS background designer.', icon: 'fa-swatchbook' },
    { id: 'tts', name: 'Audio Synth', desc: 'Local TTS with MP3 export.', icon: 'fa-microphone-lines' },
    { id: 'cipher', name: 'Cipher Box', desc: 'Secure AES-256 text encryption.', icon: 'fa-lock' },
    { id: 'paint-pro', name: 'Onyx Paint', desc: 'Advanced vector-like canvas editor.', icon: 'fa-palette' },
  ];

  return (
    <div className="tool-panel">
      <section className="text-center py-10 md:py-32 space-y-6 md:space-y-10">
        <div className="inline-block px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-white/5 border border-white/10 text-[8px] md:text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] md:tracking-[0.3em] mb-2 md:mb-4">
          Build 4.4 // PRO
        </div>
        <h1 className="text-4xl sm:text-6xl md:text-9xl font-black tracking-tighter leading-[0.9] text-white max-w-5xl mx-auto uppercase italic">
          Built for <span className="text-purple-500 md:text-white">creativity.</span>
        </h1>
        <p className="text-slate-500 text-sm md:text-2xl max-w-2xl mx-auto font-medium leading-relaxed tracking-tight px-4">
          Developed by Ilay Schönknecht
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 pt-6 md:pt-10 px-4">
          <button 
            onClick={() => onSelectTool('image')}
            className="w-full sm:w-auto bg-white text-black px-12 md:px-16 py-4 md:py-5 rounded font-black text-[10px] md:text-xs hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-white/5 uppercase tracking-widest"
          >
            Get Started
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 pt-10 md:pt-20 px-2 md:px-0">
        {tools.map((tool) => (
          <div 
            key={tool.id}
            onClick={() => onSelectTool(tool.id as ToolId)}
            className="glass-card p-6 md:p-10 rounded-2xl md:rounded-3xl cursor-pointer group flex flex-col justify-between h-full relative overflow-hidden active:scale-[0.98] transition-all"
          >
            <div className="relative z-10">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-purple-500/10 group-hover:border-purple-500/30 transition-all mb-4 md:mb-8">
                  <i className={`fas ${tool.icon} text-base md:text-lg text-slate-500 group-hover:text-purple-400`}></i>
              </div>
              <h3 className="font-bold text-white text-[10px] md:text-xs tracking-widest mb-2 md:mb-3 uppercase">{tool.name}</h3>
              <p className="text-slate-500 text-[10px] md:text-[11px] leading-relaxed font-medium">
                {tool.desc}
              </p>
            </div>
            <div className="mt-6 md:mt-8 text-[8px] md:text-[9px] font-black text-slate-700 uppercase tracking-widest group-hover:text-purple-400 transition-colors flex items-center gap-2">
              Open Tool <i className="fas fa-arrow-right text-[7px]"></i>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
