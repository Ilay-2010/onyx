
import React, { useState, useRef, useEffect } from 'react';

const ImageStudio: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    brightness: 100, 
    contrast: 100, 
    grayscale: 0, 
    sepia: 0,
    saturate: 100, 
    hueRotate: 0, 
    invert: 0, 
    blur: 0, 
    exposure: 0,
    pixelate: 0, 
    vignette: 0, 
    noise: 0,
    gamma: 1.0
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (image) drawImage();
  }, [image, filters]);

  const drawImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !image) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = image;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // CSS Filter für die Basis-Effekte
      ctx.filter = `
        brightness(${filters.brightness + filters.exposure}%)
        contrast(${filters.contrast}%)
        grayscale(${filters.grayscale}%)
        sepia(${filters.sepia}%)
        saturate(${filters.saturate}%)
        hue-rotate(${filters.hueRotate}deg)
        invert(${filters.invert}%)
        blur(${filters.blur}px)
      `;
      
      ctx.drawImage(img, 0, 0);

      // Manuelle Pixel-Manipulation für fortgeschrittene Filter
      if (filters.pixelate > 0 || filters.noise > 0 || filters.vignette > 0) {
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;

        // Pixelate
        if (filters.pixelate > 0) {
           const size = Math.ceil(filters.pixelate / 2);
           for (let y = 0; y < canvas.height; y += size) {
             for (let x = 0; x < canvas.width; x += size) {
               let i = (y * canvas.width + x) * 4;
               let r = data[i], g = data[i+1], b = data[i+2];
               for (let dy = 0; dy < size && y + dy < canvas.height; dy++) {
                 for (let dx = 0; dx < size && x + dx < canvas.width; dx++) {
                   let ni = ((y + dy) * canvas.width + (x + dx)) * 4;
                   data[ni] = r; data[ni+1] = g; data[ni+2] = b;
                 }
               }
             }
           }
        }

        // Noise
        if (filters.noise > 0) {
          for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * filters.noise * 2.5;
            data[i] += noise;
            data[i+1] += noise;
            data[i+2] += noise;
          }
        }

        // Vignette
        if (filters.vignette > 0) {
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const maxDist = Math.sqrt(centerX**2 + centerY**2);
          for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
              const dist = Math.sqrt((x - centerX)**2 + (y - centerY)**2);
              const factor = 1 - (dist / maxDist) * (filters.vignette / 100);
              const i = (y * canvas.width + x) * 4;
              data[i] *= factor;
              data[i+1] *= factor;
              data[i+2] *= factor;
            }
          }
        }

        ctx.putImageData(imageData, 0, 0);
      }
    };
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.download = `onyx-edit-${Date.now()}.png`;
    link.href = canvasRef.current?.toDataURL('image/png') || '';
    link.click();
  };

  const resetFilters = () => {
    setFilters({
      brightness: 100, contrast: 100, grayscale: 0, sepia: 0,
      saturate: 100, hueRotate: 0, invert: 0, blur: 0, exposure: 0,
      pixelate: 0, vignette: 0, noise: 0, gamma: 1.0
    });
  };

  return (
    <div className="tool-panel">
      <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6">
        <div>
          <h2 className="text-5xl font-black tracking-tighter uppercase italic">Image <span className="text-purple-500">Studio</span></h2>
          <p className="text-slate-500 font-medium tracking-wide">100% lokale Bildbearbeitung ohne Cloud-Zwang.</p>
        </div>
        <div className="flex gap-3">
          {image && (
            <>
              <button onClick={resetFilters} className="bg-white/5 text-white text-[10px] font-black uppercase px-6 py-3 rounded-xl border border-white/10 hover:bg-white/10 transition-all">Reset</button>
              <button onClick={downloadImage} className="bg-white text-black text-[10px] font-black uppercase px-8 py-3 rounded-xl shadow-2xl active:scale-95">Export PNG</button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 glass-card rounded-[40px] overflow-hidden flex items-center justify-center min-h-[500px] bg-black/60 border-white/5 checkerboard relative shadow-2xl">
          <div className="p-8 w-full h-full flex items-center justify-center">
            {image ? (
              <canvas ref={canvasRef} className="max-w-full max-h-[70vh] rounded-2xl shadow-2xl border border-white/10" />
            ) : (
              <button onClick={() => fileInputRef.current?.click()} className="group text-center">
                 <div className="w-20 h-20 bg-white/5 rounded-[32px] border border-white/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <i className="fas fa-plus text-slate-700 group-hover:text-white"></i>
                 </div>
                 <p className="text-[10px] font-black uppercase text-slate-700 tracking-widest">Bild laden</p>
              </button>
            )}
          </div>
          <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (ev) => setImage(ev.target?.result as string);
              reader.readAsDataURL(file);
            }
          }} />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-8 rounded-[40px] bg-black/40 border-white/5 flex-1 overflow-y-auto custom-scrollbar max-h-[75vh]">
            <h3 className="text-[10px] font-black text-slate-500 mb-10 uppercase tracking-[0.3em] flex justify-between items-center">
              <span>Filter & Effekte</span>
            </h3>
            
            <div className="space-y-8">
              {[
                { k: 'brightness', l: 'Helligkeit', min: 0, max: 200 },
                { k: 'contrast', l: 'Kontrast', min: 0, max: 200 },
                { k: 'saturate', l: 'Sättigung', min: 0, max: 200 },
                { k: 'exposure', l: 'Belichtung', min: -100, max: 100 },
                { k: 'blur', l: 'Unschärfe', min: 0, max: 20 },
                { k: 'pixelate', l: 'Pixelate', min: 0, max: 20 },
                { k: 'vignette', l: 'Vignette', min: 0, max: 100 },
                { k: 'noise', l: 'Rauschen', min: 0, max: 100 },
                { k: 'invert', l: 'Invertieren', min: 0, max: 100 },
              ].map((cfg) => (
                <div key={cfg.k} className="space-y-3">
                  <div className="flex justify-between text-[9px] font-black text-slate-500 uppercase tracking-widest">
                    <span>{cfg.l}</span>
                    <span className="text-purple-400 font-mono">{(filters as any)[cfg.k]}</span>
                  </div>
                  <input 
                    type="range" min={cfg.min} max={cfg.max} 
                    value={(filters as any)[cfg.k]} 
                    onChange={(e) => setFilters(prev => ({ ...prev, [cfg.k]: parseFloat(e.target.value) }))} 
                    className="w-full" 
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageStudio;
