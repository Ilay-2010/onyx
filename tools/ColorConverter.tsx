
import React, { useState, useEffect, useMemo } from 'react';

const ColorConverter: React.FC = () => {
  const [hex, setHex] = useState('#A855F7');
  const [rgb, setRgb] = useState({ r: 168, g: 85, b: 247 });
  const [hsl, setHsl] = useState({ h: 267, s: 92, l: 65 });
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const updateFromHex = (newHex: string) => {
    if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(newHex)) {
      setHex(newHex);
      return;
    }
    setHex(newHex);
    let r = 0, g = 0, b = 0;
    if (newHex.length === 4) {
      r = parseInt(newHex[1] + newHex[1], 16);
      g = parseInt(newHex[2] + newHex[2], 16);
      b = parseInt(newHex[3] + newHex[3], 16);
    } else {
      r = parseInt(newHex.substring(1, 3), 16);
      g = parseInt(newHex.substring(3, 5), 16);
      b = parseInt(newHex.substring(5, 7), 16);
    }
    setRgb({ r, g, b });
  };

  const updateFromRgb = (r: number, g: number, b: number) => {
    const rVal = Math.max(0, Math.min(255, r));
    const gVal = Math.max(0, Math.min(255, g));
    const bVal = Math.max(0, Math.min(255, b));
    setRgb({ r: rVal, g: gVal, b: bVal });
    const newHex = "#" + ((1 << 24) + (rVal << 16) + (gVal << 8) + bVal).toString(16).slice(1).toUpperCase();
    setHex(newHex);
  };

  useEffect(() => {
    let { r, g, b } = rgb;
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    setHsl({ h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) });
  }, [rgb]);

  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopyFeedback(color);
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
  };

  const palettes = useMemo(() => {
    const { h, s, l } = hsl;
    return {
      monochromatic: [
        hslToHex(h, s, Math.max(0, l - 30)),
        hslToHex(h, Math.max(0, s - 30), l),
        hex,
        hslToHex(h, Math.min(100, s + 30), l),
        hslToHex(h, s, Math.min(100, l + 30)),
      ],
      analogous: [
        hslToHex((h + 330) % 360, s, l),
        hslToHex((h + 345) % 360, s, l),
        hex,
        hslToHex((h + 15) % 360, s, l),
        hslToHex((h + 30) % 360, s, l),
      ],
      complementary: [
        hex,
        hslToHex((h + 180) % 360, s, l),
      ],
      triadic: [
        hex,
        hslToHex((h + 120) % 360, s, l),
        hslToHex((h + 240) % 360, s, l),
      ]
    };
  }, [hsl, hex]);

  const PaletteSection = ({ title, colors }: { title: string, colors: string[] }) => (
    <div className="space-y-3">
      <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">{title}</h4>
      <div className="flex gap-2">
        {colors.map((c, i) => (
          <div 
            key={i} 
            onClick={() => copyToClipboard(c)}
            className="flex-1 aspect-square rounded-lg cursor-pointer group relative overflow-hidden transition-transform active:scale-90"
            style={{ backgroundColor: c }}
          >
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <span className="text-[9px] font-bold text-white uppercase">{c}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="tool-panel">
      <div className="mb-12">
        <h2 className="text-4xl font-black tracking-tighter uppercase italic">Color <span className="text-purple-500">Space</span></h2>
        <p className="text-slate-500 font-medium">Advanced palette generator & color mapping.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-8 glass-card p-10 rounded-[40px] bg-black/40 border-white/5">
          <div className="space-y-6">
            <div 
              className="w-full h-48 rounded-3xl shadow-2xl border border-white/10 relative overflow-hidden group cursor-pointer" 
              style={{ backgroundColor: hex }}
              onClick={() => copyToClipboard(hex)}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                 <div className="text-center">
                    <div className="text-4xl font-black text-white tracking-tighter drop-shadow-lg">{hex}</div>
                    <div className="text-[10px] text-white/60 font-black uppercase tracking-widest mt-2">Click to Copy</div>
                 </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <input 
                type="color" 
                value={hex} 
                onChange={(e) => updateFromHex(e.target.value.toUpperCase())}
                className="w-20 h-20 bg-transparent border-none cursor-pointer rounded-2xl overflow-hidden shadow-xl"
              />
              <input 
                type="text" 
                value={hex}
                onChange={(e) => updateFromHex(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 font-mono text-2xl uppercase text-center focus:border-purple-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">RGB Channels</label>
              <div className="space-y-6">
                {['r', 'g', 'b'].map((channel) => (
                  <div key={channel} className="space-y-2">
                    <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
                       <span>{channel} Channel</span>
                       <span>{rgb[channel as keyof typeof rgb]}</span>
                    </div>
                    <input 
                      type="range" min="0" max="255" 
                      value={rgb[channel as keyof typeof rgb]} 
                      onChange={(e) => updateFromRgb(
                        channel === 'r' ? parseInt(e.target.value) : rgb.r,
                        channel === 'g' ? parseInt(e.target.value) : rgb.g,
                        channel === 'b' ? parseInt(e.target.value) : rgb.b
                      )}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 p-6 rounded-3xl border border-white/5 flex flex-col justify-between">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">HSL Dynamics</label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div className="text-xl font-black text-white italic">{hsl.h}°</div>
                    <div className="text-[9px] text-slate-500 uppercase font-bold">Hue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-black text-white italic">{hsl.s}%</div>
                    <div className="text-[9px] text-slate-500 uppercase font-bold">Sat</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-black text-white italic">{hsl.l}%</div>
                    <div className="text-[9px] text-slate-500 uppercase font-bold">Light</div>
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t border-white/5 mt-6">
                <p className="text-[10px] text-slate-500 leading-relaxed italic">
                  Luminance is calibrated for standard sRGB displays.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass-card p-10 rounded-[40px] border-white/5 bg-black/40 space-y-10">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em]">Smart Palettes</h3>
                {copyFeedback && (
                  <div className="text-[9px] font-bold text-emerald-400 uppercase animate-bounce">
                    Copied: {copyFeedback}
                  </div>
                )}
             </div>
             <PaletteSection title="Monochromatic" colors={palettes.monochromatic} />
             <PaletteSection title="Analogous" colors={palettes.analogous} />
             <div className="grid grid-cols-2 gap-8">
               <PaletteSection title="Complementary" colors={palettes.complementary} />
               <PaletteSection title="Triadic" colors={palettes.triadic} />
             </div>
          </div>

          <div className="glass-card p-8 rounded-3xl bg-purple-600/5 border-purple-500/10">
            <div className="flex items-center gap-3 mb-4">
               <i className="fas fa-magic text-purple-400"></i>
               <h3 className="text-[10px] font-black uppercase text-purple-400 tracking-widest">Designer Note</h3>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium italic">
              "Color is a power which directly influences the soul." Use the monochromatic shades for UI backgrounds and complementary tones for call-to-action elements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorConverter;
