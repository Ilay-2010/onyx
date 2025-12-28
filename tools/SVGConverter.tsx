
import React, { useState, useRef } from 'react';

declare const ImageTracer: any;

const SVGConverter: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [svgString, setSvgString] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [params, setParams] = useState({
    ltres: 1,
    qtres: 1,
    pathomit: 8,
    colorsampling: 1, 
    numberofcolors: 16,
    mincolorratio: 0.02
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const src = ev.target?.result as string;
        setImage(src);
        traceImage(src);
      };
      reader.readAsDataURL(file);
    }
  };

  const traceImage = (src: string) => {
    if (!src || typeof ImageTracer === 'undefined') return;
    setIsProcessing(true);
    
    // Die Bibliothek benötigt Zeit zum Berechnen, daher in einen kleinen Timeout auslagern
    setTimeout(() => {
      try {
        const options = {
          ltres: params.ltres,
          qtres: params.qtres,
          pathomit: params.pathomit,
          colorsampling: params.colorsampling,
          numberofcolors: params.numberofcolors,
          mincolorratio: params.mincolorratio,
          viewbox: true,
          linefilter: true
        };
        
        // ImageTracer.imageToSVG benötigt (url, callback, options)
        ImageTracer.imageToSVG(src, (svg: string) => {
          setSvgString(svg);
          setIsProcessing(false);
        }, options);
        
      } catch (err) {
        console.error("Vector Trace Error:", err);
        setIsProcessing(false);
        alert("Fehler beim Vektorisieren. Versuchen Sie ein anderes Bild oder verringern Sie die Farbanzahl.");
      }
    }, 50);
  };

  const download = () => {
    if (!svgString) return;
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `onyx-vector-${Date.now()}.svg`;
    link.click();
  };

  const copyCode = () => {
    if (!svgString) return;
    navigator.clipboard.writeText(svgString);
    alert("SVG Code kopiert!");
  };

  return (
    <div className="tool-panel">
      <div className="mb-12">
        <h2 className="text-5xl font-black tracking-tighter uppercase italic">Vector <span className="text-purple-500">Tracer</span></h2>
        <p className="text-slate-500 font-medium tracking-wide">High-performance raster-to-vector conversion engine.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-8">
           <div 
            onClick={() => fileInputRef.current?.click()}
            className="glass-card aspect-square rounded-[40px] flex flex-col items-center justify-center gap-4 cursor-pointer group hover:bg-white/[0.03] transition-all overflow-hidden relative"
          >
            {image ? (
                <img src={image} className="w-full h-full object-contain p-10 opacity-40 grayscale group-hover:grayscale-0 transition-all" />
            ) : (
                <div className="text-center">
                    <div className="w-20 h-20 bg-white/5 rounded-[32px] flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform mx-auto mb-6">
                        <i className="fas fa-vector-square text-3xl text-slate-500 group-hover:text-white"></i>
                    </div>
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Load Raster Asset</p>
                </div>
            )}
            {image && (
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 bg-black/80 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white">
                Bild wechseln
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
          </div>

          <div className="glass-card p-10 rounded-[40px] space-y-8 bg-black/40 border-white/10">
            <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] mb-4">Tracing Algorithms</h3>
            
            <div className="space-y-8">
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest">
                    <span>Genauigkeit</span>
                    <span className="text-purple-400">{params.ltres}</span>
                  </div>
                  <input type="range" min="0.1" max="5" step="0.1" value={params.ltres} onChange={(e) => {setParams({...params, ltres: parseFloat(e.target.value)}); if(image) traceImage(image);}} className="w-full" />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest">
                    <span>Anzahl Farben</span>
                    <span className="text-purple-400">{params.numberofcolors}</span>
                  </div>
                  <input type="range" min="2" max="64" step="2" value={params.numberofcolors} onChange={(e) => {setParams({...params, numberofcolors: parseInt(e.target.value)}); if(image) traceImage(image);}} className="w-full" />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest">
                    <span>Detail-Filter</span>
                    <span className="text-purple-400">{params.pathomit}px</span>
                  </div>
                  <input type="range" min="0" max="50" step="1" value={params.pathomit} onChange={(e) => {setParams({...params, pathomit: parseInt(e.target.value)}); if(image) traceImage(image);}} className="w-full" />
                </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                disabled={!svgString || isProcessing}
                onClick={download}
                className="flex-1 bg-white text-black font-black text-[10px] uppercase tracking-widest py-4 rounded-xl shadow-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-30"
              >
                <i className="fas fa-download mr-2"></i> Export SVG
              </button>
              <button 
                disabled={!svgString || isProcessing}
                onClick={copyCode}
                className="w-14 h-14 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all disabled:opacity-30"
                title="Copy SVG Code"
              >
                <i className="fas fa-code"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-8 h-full">
           <div className="glass-card aspect-square rounded-[40px] relative overflow-hidden flex items-center justify-center checkerboard border-white/10 shadow-2xl">
                {isProcessing && (
                    <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-md flex items-center justify-center">
                        <div className="text-center space-y-4">
                             <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto shadow-[0_0_20px_#a855f7]"></div>
                             <p className="text-[10px] font-black uppercase text-purple-400 tracking-[0.4em] animate-pulse">Tracing Path...</p>
                        </div>
                    </div>
                )}
                {svgString ? (
                    <div className="p-10 w-full h-full flex items-center justify-center svg-preview-container" dangerouslySetInnerHTML={{ __html: svgString }} />
                ) : (
                    <div className="text-center opacity-20">
                      <i className="fas fa-eye text-6xl mb-4"></i>
                      <p className="text-[10px] font-black uppercase tracking-widest">Vector Preview</p>
                    </div>
                )}
           </div>
           
           <div className="glass-card p-8 rounded-3xl border-purple-500/20 bg-purple-600/5">
              <div className="flex items-center gap-4 mb-3">
                 <i className="fas fa-check-circle text-purple-500"></i>
                 <h4 className="text-[10px] font-black uppercase text-purple-400 tracking-widest">Perfekt für Logos</h4>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium italic">
                Der "Tracer" wandelt Pixelbilder direkt im Browser in echte Pfade um. Tipp: Nutze Bilder mit hohem Kontrast für beste Ergebnisse.
              </p>
           </div>
        </div>
      </div>
      <style>{`
        .svg-preview-container svg {
          width: 100%;
          height: 100%;
          display: block;
        }
      `}</style>
    </div>
  );
};

export default SVGConverter;
