
import React, { useState } from 'react';

const GradientDesigner: React.FC = () => {
  const [color1, setColor1] = useState('#6366F1');
  const [color2, setColor2] = useState('#A855F7');
  const [angle, setAngle] = useState(90);
  const [exportWidth, setExportWidth] = useState(1920);
  const [exportHeight, setExportHeight] = useState(1080);
  const [exportFormat, setExportFormat] = useState<'image/png' | 'image/jpeg'>('image/png');

  const css = `linear-gradient(${angle}deg, ${color1}, ${color2})`;

  const exportAsImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = exportWidth;
    canvas.height = exportHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Calculate start/end points based on angle
      const r = angle * (Math.PI / 180);
      const x1 = canvas.width / 2 - (Math.cos(r) * canvas.width) / 2;
      const y1 = canvas.height / 2 - (Math.sin(r) * canvas.height) / 2;
      const x2 = canvas.width / 2 + (Math.cos(r) * canvas.width) / 2;
      const y2 = canvas.height / 2 + (Math.sin(r) * canvas.height) / 2;

      const grad = ctx.createLinearGradient(x1, y1, x2, y2);
      grad.addColorStop(0, color1);
      grad.addColorStop(1, color2);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const link = document.createElement('a');
      const ext = exportFormat === 'image/jpeg' ? 'jpg' : 'png';
      link.download = `onyx-gradient-${exportWidth}x${exportHeight}.${ext}`;
      link.href = canvas.toDataURL(exportFormat, 1.0);
      link.click();
    }
  };

  return (
    <div className="tool-panel">
      <div className="mb-12">
        <h2 className="text-4xl font-black tracking-tighter uppercase italic">Gradient <span className="text-purple-500">Designer</span></h2>
        <p className="text-slate-500 font-medium">Craft cinematic background gradients with custom export resolution.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-8">
          <div className="glass-card p-10 rounded-[40px] border-white/5 bg-black/40">
            <div className="grid grid-cols-2 gap-8 mb-10">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">Start Tint</label>
                <div className="flex gap-3">
                   <input 
                    type="color" value={color1} 
                    onChange={(e) => setColor1(e.target.value)} 
                    className="w-14 h-14 bg-transparent border-none cursor-pointer rounded-xl" 
                   />
                   <input 
                    type="text" value={color1} 
                    onChange={(e) => setColor1(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 font-mono text-xs uppercase focus:outline-none"
                   />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">End Tint</label>
                <div className="flex gap-3">
                   <input 
                    type="color" value={color2} 
                    onChange={(e) => setColor2(e.target.value)} 
                    className="w-14 h-14 bg-transparent border-none cursor-pointer rounded-xl" 
                   />
                   <input 
                    type="text" value={color2} 
                    onChange={(e) => setColor2(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 font-mono text-xs uppercase focus:outline-none"
                   />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between mb-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Rotation Angle</label>
                <span className="text-purple-400 font-mono font-bold">{angle}°</span>
              </div>
              <input 
                type="range" min="0" max="360" 
                value={angle} 
                onChange={(e) => setAngle(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="pt-10 border-t border-white/5 mt-10 space-y-6">
                <div className="flex justify-between items-center">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Pro Export Settings</label>
                  <select 
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value as any)}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-[10px] font-black uppercase text-slate-400 focus:outline-none"
                  >
                    <option value="image/png">PNG Format</option>
                    <option value="image/jpeg">JPEG Format</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <span className="text-[9px] font-bold text-slate-600 uppercase">Width (px)</span>
                      <input 
                        type="number" value={exportWidth} 
                        onChange={(e) => setExportWidth(parseInt(e.target.value) || 0)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none"
                      />
                   </div>
                   <div className="space-y-2">
                      <span className="text-[9px] font-bold text-slate-600 uppercase">Height (px)</span>
                      <input 
                        type="number" value={exportHeight} 
                        onChange={(e) => setExportHeight(parseInt(e.target.value) || 0)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none"
                      />
                   </div>
                </div>
            </div>
          </div>

          <div className="glass-card p-10 rounded-[40px] border-white/5 bg-black/40">
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-6 tracking-widest">Code Implementation</label>
            <div className="bg-white/5 p-6 rounded-2xl font-mono text-[11px] text-purple-400 break-all select-all border border-white/5">
              background: {css};
            </div>
            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => { navigator.clipboard.writeText(`background: ${css};`); alert("CSS Copied!"); }}
                className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black py-4 rounded-xl text-[10px] uppercase tracking-widest transition-all"
              >
                Copy CSS
              </button>
              <button 
                onClick={exportAsImage}
                className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-black py-4 rounded-xl text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-purple-900/40"
              >
                <i className="fas fa-download mr-2"></i> Export {exportFormat === 'image/jpeg' ? 'JPG' : 'PNG'}
              </button>
            </div>
          </div>
        </div>

        <div className="sticky top-8 space-y-8">
          <div 
            className="w-full aspect-video rounded-[40px] shadow-2xl border border-white/10 ring-1 ring-white/10 overflow-hidden relative"
            style={{ background: css }}
          >
             <div className="absolute top-6 left-6 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[9px] font-black uppercase tracking-widest">Live Canvas Preview</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="glass-card p-6 rounded-3xl text-center space-y-2">
                <div className="text-xl font-black text-white italic">{(exportWidth * exportHeight / 1000000).toFixed(1)}M</div>
                <div className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Total Pixels</div>
             </div>
             <div className="glass-card p-6 rounded-3xl text-center space-y-2">
                <div className="text-xl font-black text-white italic">{(exportWidth/exportHeight).toFixed(2)}:1</div>
                <div className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Aspect Ratio</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradientDesigner;
