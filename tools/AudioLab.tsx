
import React, { useState, useRef, useEffect, useCallback } from 'react';

const AudioLab: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [frequency, setFrequency] = useState(440);
  const [type, setType] = useState<OscillatorType>('sine');
  const [volume, setVolume] = useState(0.2);
  const [pan, setPan] = useState(0);
  
  const [lfoRate, setLfoRate] = useState(5);
  const [lfoDepth, setLfoDepth] = useState(0);
  const [distortion, setDistortion] = useState(0);

  const audioCtx = useRef<AudioContext | null>(null);
  const oscillator = useRef<OscillatorNode | null>(null);
  const lfo = useRef<OscillatorNode | null>(null);
  const lfoGain = useRef<GainNode | null>(null);
  const distortionNode = useRef<WaveShaperNode | null>(null);
  const gainNode = useRef<GainNode | null>(null);
  const pannerNode = useRef<StereoPannerNode | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);

  const makeDistortionCurve = (amount: number) => {
    const k = amount;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  };

  const initAudio = () => {
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyser.current = audioCtx.current.createAnalyser();
      analyser.current.fftSize = 2048;
      gainNode.current = audioCtx.current.createGain();
      pannerNode.current = audioCtx.current.createStereoPanner();
      distortionNode.current = audioCtx.current.createWaveShaper();
      distortionNode.current.curve = makeDistortionCurve(0);
      distortionNode.current.oversample = '4x';
      lfoGain.current = audioCtx.current.createGain();
      lfoGain.current.gain.value = 0;

      distortionNode.current.connect(gainNode.current);
      gainNode.current.connect(pannerNode.current);
      pannerNode.current.connect(analyser.current);
      analyser.current.connect(audioCtx.current.destination);
    }
  };

  const togglePlayback = () => {
    initAudio();
    const ctx = audioCtx.current!;
    if (isPlaying) {
      oscillator.current?.stop();
      lfo.current?.stop();
      setIsPlaying(false);
    } else {
      if (ctx.state === 'suspended') ctx.resume();
      oscillator.current = ctx.createOscillator();
      oscillator.current.type = type;
      oscillator.current.frequency.setValueAtTime(frequency, ctx.currentTime);
      lfo.current = ctx.createOscillator();
      lfo.current.frequency.setValueAtTime(lfoRate, ctx.currentTime);
      lfo.current.connect(lfoGain.current!);
      lfoGain.current!.connect(oscillator.current.frequency);
      oscillator.current.connect(distortionNode.current!);
      lfo.current.start();
      oscillator.current.start();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const ctx = audioCtx.current;
    if (!ctx) return;
    if (oscillator.current) {
      oscillator.current.frequency.setTargetAtTime(frequency, ctx.currentTime, 0.05);
      oscillator.current.type = type;
    }
    if (gainNode.current) gainNode.current.gain.setTargetAtTime(volume, ctx.currentTime, 0.05);
    if (pannerNode.current) pannerNode.current.pan.setTargetAtTime(pan, ctx.currentTime, 0.05);
    if (lfo.current) lfo.current.frequency.setTargetAtTime(lfoRate, ctx.currentTime, 0.05);
    if (lfoGain.current) lfoGain.current.gain.setTargetAtTime(lfoDepth, ctx.currentTime, 0.05);
    if (distortionNode.current) distortionNode.current.curve = makeDistortionCurve(distortion);
  }, [frequency, type, volume, pan, lfoRate, lfoDepth, distortion]);

  const renderVisualization = useCallback(() => {
    if (!canvasRef.current || !analyser.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const bufferLength = analyser.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const draw = () => {
      requestRef.current = requestAnimationFrame(draw);
      analyser.current!.getByteTimeDomainData(dataArray);
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 3;
      ctx.beginPath();
      const sliceWidth = canvas.width / bufferLength;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        x += sliceWidth;
      }
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };
    draw();
  }, []);

  useEffect(() => {
    if (isPlaying) renderVisualization();
    else cancelAnimationFrame(requestRef.current);
  }, [isPlaying, renderVisualization]);

  return (
    <div className="tool-panel">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black tracking-tighter uppercase italic text-white mb-2">Signal <span className="text-purple-500">Lab</span></h2>
          <p className="text-slate-500 font-medium tracking-wide">Next-gen synthesis & waveform analysis.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-black border border-white/10 p-1 rounded-2xl shadow-2xl overflow-hidden aspect-video relative group">
            <canvas ref={canvasRef} className="w-full h-full rounded-xl" width={1200} height={600} />
            <div className="absolute top-6 left-6 flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-purple-500 animate-pulse shadow-[0_0_15px_#a855f7]' : 'bg-slate-900'}`}></div>
              <div className="text-[10px] font-black text-white uppercase tracking-widest">{isPlaying ? 'Transmitting' : 'Idle'}</div>
            </div>
          </div>
          <button onClick={togglePlayback} className={`w-full py-8 rounded-2xl font-black text-sm uppercase tracking-[0.3em] transition-all transform active:scale-95 ${isPlaying ? 'bg-red-500/10 text-red-500 border border-red-500/30' : 'bg-white text-black hover:bg-slate-200'}`}>
            <i className={`fas ${isPlaying ? 'fa-power-off' : 'fa-bolt'} mr-4`}></i>
            {isPlaying ? 'Kill Signal' : 'Initiate Synth'}
          </button>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-8 rounded-3xl space-y-10 border border-white/5 bg-black/40">
            <div className="space-y-4">
              <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Wave Architecture</label>
              <div className="grid grid-cols-4 gap-2">
                {['sine', 'square', 'sawtooth', 'triangle'].map(w => (
                  <button key={w} onClick={() => setType(w as OscillatorType)} className={`aspect-square rounded-xl flex items-center justify-center transition-all border ${type === w ? 'bg-purple-600 border-purple-400 text-white' : 'bg-white/5 text-slate-600 border-white/5'}`}>
                    <i className={`fas fa-wave-square text-xs`}></i>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-8 pt-4 border-t border-white/5">
              <div className="space-y-2">
                <label className="block text-[10px] text-slate-400 uppercase font-bold tracking-widest">Frequency: {frequency}Hz</label>
                <input type="range" min="20" max="2000" step="1" value={frequency} onChange={(e) => setFrequency(parseInt(e.target.value))} className="w-full" />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] text-slate-400 uppercase font-bold tracking-widest">Master Vol: {Math.round(volume * 100)}%</label>
                <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioLab;
