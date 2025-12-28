
import React, { useState, useRef, useEffect } from 'react';

type PaintTool = 'select' | 'brush' | 'line' | 'rect' | 'circle' | 'eraser' | 'text';

interface PaintElement {
  id: string;
  type: PaintTool;
  x: number;
  y: number;
  width: number;
  height: number;
  points?: { x: number; y: number }[];
  color1: string;
  color2: string;
  useGradient: boolean;
  brushSize: number;
  text?: string;
  img?: HTMLImageElement;
}

const PaintPro: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTool, setActiveTool] = useState<PaintTool>('brush');
  const [elements, setElements] = useState<PaintElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  
  const [color1, setColor1] = useState('#a855f7');
  const [color2, setColor2] = useState('#ffffff');
  const [useGradient, setUseGradient] = useState(false);
  const [brushSize, setBrushSize] = useState(5);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentElement, setCurrentElement] = useState<PaintElement | null>(null);
  
  const [canvasSize, setCanvasSize] = useState({ width: 1600, height: 1000 });

  useEffect(() => {
    render();
  }, [elements, currentElement, canvasSize, selectedElementId]);

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    [...elements, currentElement].filter(Boolean).forEach((el) => {
      drawElement(ctx, el!);
      if (el?.id === selectedElementId) {
        drawSelectionBox(ctx, el!);
      }
    });
  };

  const drawElement = (ctx: CanvasRenderingContext2D, el: PaintElement) => {
    ctx.lineWidth = el.brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = el.color1;
    
    if (el.useGradient && el.type !== 'brush' && el.type !== 'eraser' && el.type !== 'text') {
      const grad = ctx.createLinearGradient(el.x, el.y, el.x + el.width, el.y + el.height);
      grad.addColorStop(0, el.color1);
      grad.addColorStop(1, el.color2);
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = el.color1;
    }

    switch (el.type) {
      case 'brush':
      case 'eraser':
        if (el.points && el.points.length > 0) {
          ctx.beginPath();
          ctx.strokeStyle = el.type === 'eraser' ? '#0a0a0a' : el.color1;
          ctx.moveTo(el.points[0].x, el.points[0].y);
          el.points.forEach(p => ctx.lineTo(p.x, p.y));
          ctx.stroke();
        }
        break;
      case 'line':
        ctx.beginPath();
        ctx.moveTo(el.x, el.y);
        ctx.lineTo(el.x + el.width, el.y + el.height);
        ctx.stroke();
        break;
      case 'rect':
        ctx.fillRect(el.x, el.y, el.width, el.height);
        ctx.strokeRect(el.x, el.y, el.width, el.height);
        break;
      case 'circle':
        const radius = Math.sqrt(el.width ** 2 + el.height ** 2);
        ctx.beginPath();
        ctx.arc(el.x, el.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        break;
      case 'text':
        ctx.font = `bold ${el.brushSize * 4}px Inter, sans-serif`;
        ctx.fillText(el.text || 'New Text', el.x, el.y);
        break;
      case 'select':
        if (el.img) {
          ctx.drawImage(el.img, el.x, el.y, el.width, el.height);
        }
        break;
    }
  };

  const drawSelectionBox = (ctx: CanvasRenderingContext2D, el: PaintElement) => {
    ctx.setLineDash([8, 4]);
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2;
    const x = el.points ? el.points[0].x : el.x;
    const y = el.points ? el.points[0].y : el.y;
    const w = el.width || 40;
    const h = el.height || 40;
    ctx.strokeRect(x - 10, y - 10, w + 20, h + 20);
    ctx.setLineDash([]);
  };

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * (canvasSize.width / rect.width),
      y: (clientY - rect.top) * (canvasSize.height / rect.height)
    };
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e && e.touches.length > 1) return;
    const pos = getPos(e);
    setStartPos(pos);

    if (activeTool === 'select') {
      const clicked = [...elements].reverse().find(el => {
        const x = el.points ? el.points[0].x : el.x;
        const y = el.points ? el.points[0].y : el.y;
        return pos.x >= x - 20 && pos.x <= x + (el.width || 40) + 20 && 
               pos.y >= y - 20 && pos.y <= y + (el.height || 40) + 20;
      });
      setSelectedElementId(clicked ? clicked.id : null);
      if (clicked) setIsDrawing(true);
      return;
    }

    if (activeTool === 'text') {
      const newId = Math.random().toString(36);
      const newEl: PaintElement = {
        id: newId, type: 'text', x: pos.x, y: pos.y,
        width: 300, height: brushSize * 4,
        text: 'EDIT ME IN PANEL',
        color1, color2, useGradient, brushSize
      };
      setElements([...elements, newEl]);
      setSelectedElementId(newId);
      setActiveTool('select');
      return;
    }

    setIsDrawing(true);
    const newId = Math.random().toString(36);
    setCurrentElement({
      id: newId, type: activeTool, x: pos.x, y: pos.y, width: 0, height: 0,
      points: activeTool === 'brush' || activeTool === 'eraser' ? [pos] : undefined,
      color1, color2, useGradient, brushSize
    });
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    if ('touches' in e && e.touches.length > 1) return;
    const pos = getPos(e);

    if (activeTool === 'select' && selectedElementId) {
      setElements(prev => prev.map(el => {
        if (el.id === selectedElementId) {
          if (el.points) {
             const dx = pos.x - startPos.x;
             const dy = pos.y - startPos.y;
             return { ...el, points: el.points.map(p => ({ x: p.x + dx, y: p.y + dy })) };
          }
          return { ...el, x: pos.x - el.width / 2, y: pos.y - el.height / 2 };
        }
        return el;
      }));
      setStartPos(pos);
      return;
    }

    if (!currentElement) return;

    if (activeTool === 'brush' || activeTool === 'eraser') {
      setCurrentElement({ ...currentElement, points: [...(currentElement.points || []), pos] });
    } else {
      setCurrentElement({ ...currentElement, width: pos.x - startPos.x, height: pos.y - startPos.y });
    }
  };

  const handleEnd = () => {
    if (activeTool === 'select') { setIsDrawing(false); return; }
    if (currentElement) { setElements([...elements, currentElement]); setCurrentElement(null); }
    setIsDrawing(false);
  };

  const handleImageImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const newId = Math.random().toString(36);
        const newEl: PaintElement = {
          id: newId, type: 'select', x: 100, y: 100, width: 500, height: (img.height / img.width) * 500,
          img: img, color1, color2, useGradient, brushSize
        };
        setElements([...elements, newEl]);
        setSelectedElementId(newId);
        setActiveTool('select');
      };
    };
    reader.readAsDataURL(file);
  };

  const updateSelectedElement = (updates: Partial<PaintElement>) => {
    if (!selectedElementId) return;
    setElements(prev => prev.map(el => el.id === selectedElementId ? { ...el, ...updates } : el));
  };

  const selectedElement = elements.find(el => el.id === selectedElementId);

  return (
    <div className="tool-panel">
      <div className="mb-6 md:mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-6">
        <div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic">Onyx <span className="text-purple-500">Paint Pro</span></h2>
          <p className="text-slate-500 text-xs md:text-sm font-medium tracking-wide">Professional Canvas Manipulation Engine.</p>
        </div>
        <div className="flex flex-wrap gap-2 md:gap-3 w-full md:w-auto">
          <button onClick={() => setElements(elements.slice(0, -1))} className="flex-1 md:w-12 h-10 md:h-12 bg-white/5 rounded-xl border border-white/10 text-slate-400 hover:text-white transition-all active:scale-95"><i className="fas fa-undo"></i></button>
          <button onClick={() => { if(confirm('Delete all artwork?')) setElements([]); }} className="flex-1 md:w-12 h-10 md:h-12 bg-white/5 rounded-xl border border-white/10 text-slate-400 hover:text-red-500 transition-all active:scale-95"><i className="fas fa-trash"></i></button>
          <button onClick={() => {
            const canvas = canvasRef.current;
            if(!canvas) return;
            const link = document.createElement('a');
            link.download = `onyx-design-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
          }} className="flex-[2] md:flex-none bg-purple-600 text-white text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] px-4 md:px-10 py-3 md:py-4 rounded-xl shadow-2xl active:scale-95 transition-transform">Export Image</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
        <div className="lg:col-span-1 glass-card p-2 rounded-xl md:rounded-2xl bg-black/40 border-white/10 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible sticky top-0 z-20 no-scrollbar">
          {[
            { id: 'select', icon: 'fa-mouse-pointer', label: 'Select' },
            { id: 'brush', icon: 'fa-paint-brush', label: 'Brush' },
            { id: 'line', icon: 'fa-slash', label: 'Line' },
            { id: 'rect', icon: 'fa-square', label: 'Box' },
            { id: 'circle', icon: 'fa-circle', label: 'Circle' },
            { id: 'eraser', icon: 'fa-eraser', label: 'Eraser' },
            { id: 'text', icon: 'fa-font', label: 'Text' }
          ].map(tool => (
            <button
              key={tool.id}
              onClick={() => { setActiveTool(tool.id as PaintTool); if(tool.id !== 'select') setSelectedElementId(null); }}
              className={`w-10 h-10 md:w-12 md:h-12 flex-shrink-0 rounded-xl flex items-center justify-center transition-all ${activeTool === tool.id ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white/5 active:bg-white/10'}`}
              title={tool.label}
            >
              <i className={`fas ${tool.icon} text-base md:text-lg`}></i>
            </button>
          ))}
          <div className="lg:h-px lg:w-full w-px h-6 md:h-8 bg-white/10 my-1 mx-2 lg:mx-0" />
          <label className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 rounded-xl flex items-center justify-center text-slate-500 hover:bg-white/5 active:bg-white/10 cursor-pointer" title="Import Image">
            <i className="fas fa-image text-base md:text-lg"></i>
            <input type="file" className="hidden" accept="image/*" onChange={handleImageImport} />
          </label>
        </div>

        <div className="lg:col-span-8 glass-card rounded-2xl md:rounded-[40px] overflow-hidden relative aspect-video bg-[#050505] border-white/10 shadow-2xl touch-none">
           <canvas
             ref={canvasRef}
             width={canvasSize.width}
             height={canvasSize.height}
             onMouseDown={handleStart}
             onMouseMove={handleMove}
             onMouseUp={handleEnd}
             onTouchStart={handleStart}
             onTouchMove={handleMove}
             onTouchEnd={handleEnd}
             className={`w-full h-full ${activeTool === 'select' ? 'cursor-move' : 'cursor-crosshair'}`}
           />
           <div className="absolute bottom-4 right-4 px-2 py-1 bg-black/80 backdrop-blur-md rounded-lg border border-white/10 text-[7px] md:text-[8px] font-black uppercase text-slate-500 tracking-widest">
             {canvasSize.width}x{canvasSize.height} PX
           </div>
        </div>

        <div className="lg:col-span-3 space-y-4 md:space-y-6">
           <div className="glass-card p-6 md:p-7 rounded-2xl md:rounded-[40px] space-y-6 md:space-y-8 bg-black/40 border-white/10 flex flex-col min-w-0">
              <div className="space-y-3 md:space-y-4 min-w-0">
                 <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest block">Main Tint</label>
                 <div className="flex gap-2 md:gap-3 items-center min-w-0">
                    <input 
                      type="color" 
                      value={selectedElement?.color1 || color1} 
                      onChange={(e) => {
                        const val = e.target.value;
                        setColor1(val);
                        updateSelectedElement({ color1: val });
                      }} 
                    />
                    <div className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 md:py-3 font-mono text-[10px] md:text-[11px] text-slate-400 truncate uppercase">
                      {(selectedElement?.color1 || color1)}
                    </div>
                 </div>
              </div>

              {selectedElement?.type === 'text' && (
                <div className="space-y-3 md:space-y-4 animate-slideIn min-w-0">
                   <label className="text-[9px] md:text-[10px] font-black text-purple-400 uppercase tracking-widest block">Edit Content</label>
                   <textarea 
                    value={selectedElement.text}
                    onChange={(e) => updateSelectedElement({ text: e.target.value })}
                    className="w-full bg-white/5 border border-purple-500/30 rounded-xl p-3 md:p-4 text-[10px] md:text-[11px] text-white focus:outline-none focus:border-purple-500 resize-none h-24 md:h-28"
                    placeholder="Content..."
                   />
                </div>
              )}

              <div className="space-y-3 md:space-y-4 min-w-0">
                 <div className="flex justify-between items-center text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <span>Size / Stroke</span>
                    <span className="text-purple-400 font-bold">{selectedElement?.brushSize || brushSize}px</span>
                 </div>
                 <input 
                  type="range" min="1" max="250" 
                  value={selectedElement?.brushSize || brushSize} 
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setBrushSize(val);
                    updateSelectedElement({ brushSize: val });
                  }} 
                  className="w-full" 
                 />
              </div>

              {selectedElementId && (
                <div className="pt-4 md:pt-6 border-t border-white/10 animate-fadeIn min-w-0">
                   <button 
                    onClick={() => {
                      setElements(elements.filter(el => el.id !== selectedElementId));
                      setSelectedElementId(null);
                    }}
                    className="w-full py-3 md:py-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-xl md:rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-xl active:scale-95"
                   >
                     Delete Element
                   </button>
                </div>
              )}
           </div>

           <div className="glass-card p-4 md:p-6 rounded-2xl md:rounded-3xl bg-purple-600/5 border border-purple-500/10">
              <p className="text-[10px] text-slate-600 leading-relaxed font-medium italic">
                <i className="fas fa-magic text-purple-500 mr-2"></i>
                Every object is an independent layer. Use the "Select" tool to move them.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PaintPro;
