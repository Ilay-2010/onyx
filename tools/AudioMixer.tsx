
import React, { useState, useRef, useEffect } from 'react';

interface AudioTrack {
  id: string;
  name: string;
  buffer: AudioBuffer;
  volume: number;
  pitch: number;
  bass: number;
  mid: number;
  treble: number;
  pan: number;
  isMuted: boolean;
  isSoloed: boolean;
}

const AudioMixer: React.FC = () => {
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [masterVolume, setMasterVolume] = useState(0.8);
  const audioCtx = useRef<AudioContext | null>(null);
  const sources = useRef<Map<string, AudioBufferSourceNode>>(new Map());
  const nodes = useRef<Map<string, { gain: GainNode; bass: BiquadFilterNode; mid: BiquadFilterNode; treble: BiquadFilterNode; panner: StereoPannerNode; analyser: AnalyserNode }>>(new Map());
  const masterGain = useRef<GainNode | null>(null);

  const initAudio = () => {
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      masterGain.current = audioCtx.current.createGain();
      masterGain.current.gain.value = masterVolume;
      masterGain.current.connect(audioCtx.current.destination);
    }
  };

  const loadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    initAudio();
    const newTracks: AudioTrack[] = [...tracks];
    for (const file of Array.from(files)) {
      try {
        const buffer = await audioCtx.current!.decodeAudioData(await file.arrayBuffer());
        newTracks.push({
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          buffer,
          volume: 0.7, pitch: 1.0, bass: 0, mid: 0, treble: 0, pan: 0,
          isMuted: false, isSoloed: false
        });
      } catch (err) {}
    }
    setTracks(newTracks);
  };

  const playAll = () => {
    initAudio();
    stopAll();
    tracks.forEach(track => {
      const source = audioCtx.current!.createBufferSource();
      source.buffer = track.buffer;
      source.loop = true;
      const gain = audioCtx.current!.createGain();
      const bass = audioCtx.current!.createBiquadFilter();
      bass.type = 'lowshelf'; bass.frequency.value = 80;
      const mid = audioCtx.current!.createBiquadFilter();
      mid.type = 'peaking'; mid.frequency.value = 1000;
      const treb = audioCtx.current!.createBiquadFilter();
      treb.type = 'highshelf'; treb.frequency.value = 10000;
      const pan = audioCtx.current!.createStereoPanner();
      const ana = audioCtx.current!.createAnalyser();

      source.connect(bass);
      bass.connect(mid);
      mid.connect(treb);
      treb.connect(gain);
      gain.connect(pan);
      pan.connect(ana);
      ana.connect(masterGain.current!);

      source.start(0);
      sources.current.set(track.id, source);
      nodes.current.set(track.id, { gain, bass, mid, treble: treb, panner: pan, analyser: ana });
    });
    setIsPlaying(true);
    updateNodes();
  };

  const stopAll = () => {
    sources.current.forEach(s => s.stop());
    sources.current.clear();
    nodes.current.clear();
    setIsPlaying(false);
  };

  const updateNodes = () => {
    const hasSolo = tracks.some(t => t.isSoloed);
    tracks.forEach(t => {
      const n = nodes.current.get(t.id);
      if (n) {
        const shouldMute = t.isMuted || (hasSolo && !t.isSoloed);
        n.gain.gain.setTargetAtTime(shouldMute ? 0 : t.volume, audioCtx.current!.currentTime, 0.05);
        n.bass.gain.setTargetAtTime(t.bass, audioCtx.current!.currentTime, 0.05);
        n.mid.gain.setTargetAtTime(t.mid, audioCtx.current!.currentTime, 0.05);
        n.treble.gain.setTargetAtTime(t.treble, audioCtx.current!.currentTime, 0.05);
        n.panner.pan.setTargetAtTime(t.pan, audioCtx.current!.currentTime, 0.05);
      }
    });
  };

  useEffect(() => { if (isPlaying) updateNodes(); }, [tracks]);

  const drawVU = (trackId: string, canvas: HTMLCanvasElement) => {
    const n = nodes.current.get(trackId);
    if (!n || !canvas) return;
    const ctx = canvas.getContext('2d')!;
    const data = new Uint8Array(n.analyser.frequencyBinCount);
    const r = () => {
      if (!isPlaying) return;
      n.analyser.getByteFrequencyData(data);
      let sum = data.reduce((a, b) => a + b, 0) / data.length;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = sum > 80 ? '#ef4444' : '#a855f7';
      ctx.fillRect(0, canvas.height - (sum/128)*canvas.height, canvas.width, canvas.height);
      requestAnimationFrame(r);
    };
    r();
  };

  return (
    <div className="tool-panel">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h2 className="text-5xl font-black tracking-tighter uppercase italic">Audio <span className="text-purple-500">Mixer</span></h2>
          <p className="text-slate-500 font-medium tracking-wide">Professional Multi-Track DAW Environment.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={isPlaying ? stopAll : playAll} className={`px-12 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-2xl ${isPlaying ? 'bg-red-500 shadow-red-900/40 text-white' : 'bg-white text-black'}`}>
            <i className={`fas ${isPlaying ? 'fa-stop' : 'fa-play'} mr-3`}></i>{isPlaying ? 'Stop' : 'Start Session'}
          </button>
          <label className="bg-purple-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-10 py-4 rounded-xl cursor-pointer shadow-xl shadow-purple-900/40">
            <i className="fas fa-plus mr-2"></i> Import Stems
            <input type="file" multiple accept="audio/*" onChange={loadFile} className="hidden" />
          </label>
        </div>
      </div>

      <div className="space-y-6">
        {tracks.length === 0 ? (
          <div className="glass-card p-32 rounded-[40px] text-center bg-white/[0.01] border-dashed border-white/10 flex flex-col items-center">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10">
              <i className="fas fa-music text-slate-700 text-4xl"></i>
            </div>
            <p className="text-slate-600 font-black text-[10px] uppercase tracking-[0.4em]">No tracks loaded. Import audio stems.</p>
          </div>
        ) : (
          tracks.map(t => (
            <div key={t.id} className="glass-card p-8 rounded-[32px] bg-black/40 border-white/10 flex flex-col lg:flex-row gap-10 items-center">
              <div className="w-full lg:w-56 space-y-4">
                <div className="text-white font-black text-xs truncate uppercase tracking-tighter leading-tight bg-white/5 p-3 rounded-lg border border-white/5">
                  {t.name}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setTracks(prev => prev.map(tr => tr.id === t.id ? {...tr, isMuted: !tr.isMuted} : tr))} 
                    className={`flex-1 py-3 rounded-xl text-[9px] font-black border transition-all ${t.isMuted ? 'bg-red-500 border-red-400 text-white' : 'bg-white/5 border-white/10 text-slate-500'}`}
                  >
                    MUTE
                  </button>
                  <button 
                    onClick={() => setTracks(prev => prev.map(tr => tr.id === t.id ? {...tr, isSoloed: !tr.isSoloed} : tr))} 
                    className={`flex-1 py-3 rounded-xl text-[9px] font-black border transition-all ${t.isSoloed ? 'bg-amber-500 border-amber-400 text-black' : 'bg-white/5 border-white/10 text-slate-500'}`}
                  >
                    SOLO
                  </button>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                <div className="space-y-3">
                  <div className="flex justify-between text-[9px] font-black text-slate-600 uppercase tracking-widest">
                    <span>Volume</span>
                    <span className="text-purple-400">{Math.round(t.volume * 100)}%</span>
                  </div>
                  <input type="range" min="0" max="1.5" step="0.01" value={t.volume} onChange={(e) => setTracks(prev => prev.map(tr => tr.id === t.id ? {...tr, volume: parseFloat(e.target.value)} : tr))} className="w-full" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-[9px] font-black text-slate-600 uppercase tracking-widest">
                    <span>Panning</span>
                    <span className="text-purple-400">{t.pan < 0 ? 'L' : t.pan > 0 ? 'R' : 'C'}</span>
                  </div>
                  <input type="range" min="-1" max="1" step="0.01" value={t.pan} onChange={(e) => setTracks(prev => prev.map(tr => tr.id === t.id ? {...tr, pan: parseFloat(e.target.value)} : tr))} className="w-full" />
                </div>
                <div className="space-y-3">
                   <div className="flex justify-between text-[9px] font-black text-slate-600 uppercase tracking-widest">
                     <span>Pitch</span>
                     <span className="text-purple-400">x{t.pitch}</span>
                   </div>
                   <input type="range" min="0.5" max="2" step="0.01" value={t.pitch} onChange={(e) => setTracks(prev => prev.map(tr => tr.id === t.id ? {...tr, pitch: parseFloat(e.target.value)} : tr))} className="w-full" />
                </div>
              </div>

              <div className="flex gap-4 h-36 items-center bg-black/60 p-5 rounded-2xl border border-white/5">
                 {['bass', 'mid', 'treble'].map(eq => (
                   <div key={eq} className="flex flex-col items-center justify-between h-full w-10">
                      <span className="text-[7px] font-black text-slate-700 uppercase tracking-widest">{eq}</span>
                      <div className="eq-slider-container">
                        <input 
                          type="range" min="-24" max="24" 
                          value={t[eq as keyof AudioTrack] as number}
                          onChange={(e) => setTracks(prev => prev.map(tr => tr.id === t.id ? {...tr, [eq]: parseInt(e.target.value)} : tr))}
                          className="eq-slider"
                        />
                      </div>
                      <span className="text-[8px] font-mono text-purple-400/60">{t[eq as keyof AudioTrack] as number}</span>
                   </div>
                 ))}
              </div>

              <div className="flex items-center gap-6">
                <canvas className="w-14 h-32 bg-black/40 rounded-xl border border-white/5 shadow-inner" ref={el => { if(el && isPlaying) drawVU(t.id, el); }} />
                <button onClick={() => setTracks(prev => prev.filter(tr => tr.id !== t.id))} className="w-12 h-12 flex items-center justify-center rounded-xl bg-red-500/5 text-slate-800 hover:text-red-500 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20">
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AudioMixer;
