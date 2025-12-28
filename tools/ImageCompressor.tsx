
import React, { useState, useRef } from 'react';

const ImageCompressor: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [quality, setQuality] = useState(0.8);
  const [scale, setScale] = useState(100);
  const [format, setFormat] = useState('image/jpeg');
  const [info, setInfo] = useState({ originalSize: 0, newSize: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setInfo({ ...info, originalSize: file.size });
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImage(ev.target?.result as string);
        process(ev.target?.result as string, quality, scale, format);
      };
      reader.readAsDataURL(file);
    }
  };

  const process = (src: string, q: number, s: number, f: string) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = img.width * (s / 100);
      const h = img.height * (s / 100);
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);

      const dataUrl = canvas.toDataURL(f, q);
      const size = Math.round((dataUrl.length * 3) / 4);
      setInfo(prev => ({ ...prev, newSize: size }));
    };
  };

  const download = () => {
    const link = document.createElement('a');
    link.download = `onyx-optimized.${format === 'image/png' ? 'png' : 'jpg'}`;
    link.href = canvasRef.current?.toDataURL(format, quality) || '';
    link.click();
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="tool-panel max-w-4xl mx-auto">
      <div className="mb-12">
        <h2 className="text-4xl font-black tracking-tighter mb-2">Size Reducer</h2>
        <p className="text-slate-400">Optimize image weight for lightning fast load times.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="file-drop-zone aspect-video rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer group"
          >
            {image ? (
                <img src={image} className="w-full h-full object-contain rounded-xl p-2" />
            ) : (
                <>
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                        <i className="fas fa-cloud-upload-alt text-slate-400"></i>
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Select Image Asset</p>
                </>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
                <span>Compression Quality</span>
                <span className="text-purple-400">{Math.round(quality * 100)}%</span>
              </div>
              <input 
                type="range" min="0.1" max="1" step="0.05" 
                value={quality} 
                onChange={(e) => {setQuality(parseFloat(e.target.value)); if(image) process(image, parseFloat(e.target.value), scale, format); }}
                className="w-full"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
                <span>Scale Dimensions</span>
                <span className="text-purple-400">{scale}%</span>
              </div>
              <input 
                type="range" min="10" max="100" step="5" 
                value={scale} 
                onChange={(e) => {setScale(parseInt(e.target.value)); if(image) process(image, quality, parseInt(e.target.value), format); }}
                className="w-full"
              />
            </div>

            <button 
              disabled={!image}
              onClick={download}
              className="w-full bg-white text-black font-bold py-4 rounded transition-all hover:bg-slate-200 disabled:opacity-50"
            >
              Export Optimized Asset
            </button>
          </div>
        </div>

        <div className="space-y-6">
            <div className="glass-card p-8 rounded-2xl space-y-6 text-center">
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Efficiency Report</p>
                <div className="flex justify-around items-center">
                    <div>
                        <div className="text-2xl font-black text-white">{formatSize(info.originalSize)}</div>
                        <div className="text-[10px] text-slate-500 uppercase font-bold mt-1">Input</div>
                    </div>
                    <i className="fas fa-arrow-right text-slate-700"></i>
                    <div>
                        <div className="text-2xl font-black text-purple-400">{formatSize(info.newSize)}</div>
                        <div className="text-[10px] text-slate-500 uppercase font-bold mt-1">Output</div>
                    </div>
                </div>
                {info.originalSize > 0 && (
                   <div className="pt-4 border-t border-white/5">
                        <span className="text-5xl font-black text-emerald-400">-{Math.max(0, Math.round(100 - (info.newSize/info.originalSize)*100))}%</span>
                        <p className="text-[10px] text-slate-500 uppercase font-bold mt-2">Storage Saved</p>
                   </div>
                )}
            </div>
            <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
    </div>
  );
};

export default ImageCompressor;
