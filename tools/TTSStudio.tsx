
import React, { useState, useEffect } from 'react';

const TTSStudio: React.FC = () => {
  const [text, setText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !selectedVoice) {
        setSelectedVoice(availableVoices[0].name);
      }
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const handlePreview = () => {
    if (!text.trim()) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) utterance.voice = voice;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="tool-panel">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-5xl font-black tracking-tighter uppercase italic">Audio <span className="text-purple-500">Synth</span></h2>
          <p className="text-slate-500 font-medium tracking-wide">Lokale Sprachausgabe direkt über deinen Browser.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={isSpeaking ? stopSpeaking : handlePreview} 
            className={`px-12 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-2xl ${isSpeaking ? 'bg-red-600 text-white' : 'bg-white text-black active:scale-95'}`}
          >
            <i className={`fas ${isSpeaking ? 'fa-stop' : 'fa-play'} mr-3`}></i> {isSpeaking ? 'Stoppen' : 'Abspielen'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-8 rounded-[40px] bg-black/40 border-white/5 shadow-2xl space-y-8">
            <textarea
              className="w-full h-80 bg-white/5 border border-white/10 rounded-[32px] p-8 text-slate-200 focus:outline-none focus:border-purple-500 transition-all resize-none text-xl font-medium"
              placeholder="Text eingeben, den der Computer vorlesen soll..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          
          <div className="glass-card p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-4">
             <i className="fas fa-user-shield text-emerald-500 text-xl"></i>
             <p className="text-[10px] text-slate-500 leading-relaxed font-medium uppercase tracking-widest">
               Privatsphäre: Deine Texte werden lokal auf deinem Gerät verarbeitet.
             </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-8 rounded-[40px] bg-black/40 border-white/5 shadow-2xl overflow-hidden flex flex-col max-h-[500px]">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-8 border-b border-white/5 pb-4">Stimmen auswählen</h3>
            <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 pr-2">
              {voices.map((v) => (
                <button 
                  key={v.name} 
                  onClick={() => setSelectedVoice(v.name)} 
                  className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${selectedVoice === v.name ? 'bg-purple-600/10 border-purple-500/50 text-white' : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'}`}
                >
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest truncate max-w-[150px]">{v.name}</span>
                    <span className="text-[8px] opacity-40">{v.lang}</span>
                  </div>
                  {selectedVoice === v.name && <i className="fas fa-check-circle text-purple-500 text-xs"></i>}
                </button>
              ))}
              {voices.length === 0 && <p className="text-[10px] text-slate-700 italic">Keine Systemstimmen gefunden.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TTSStudio;
