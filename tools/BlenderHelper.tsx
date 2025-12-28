
import React, { useState } from 'react';

const BlenderHelper: React.FC = () => {
  const [hex, setHex] = useState('#FF0055');
  const [linear, setLinear] = useState({ r: 1.0, g: 0.0, b: 0.043 });

  const calculate = (val: string) => {
    setHex(val);
    if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(val)) return;
    
    let r = 0, g = 0, b = 0;
    if (val.length === 4) {
      r = parseInt(val[1] + val[1], 16) / 255;
      g = parseInt(val[2] + val[2], 16) / 255;
      b = parseInt(val[3] + val[3], 16) / 255;
    } else {
      r = parseInt(val.substring(1, 3), 16) / 255;
      g = parseInt(val.substring(3, 5), 16) / 255;
      b = parseInt(val.substring(5, 7), 16) / 255;
    }

    // Gamma correction for Blender (roughly sRGB to Linear)
    const toLinear = (c: number) => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    setLinear({
      r: parseFloat(toLinear(r).toFixed(4)),
      g: parseFloat(toLinear(g).toFixed(4)),
      b: parseFloat(toLinear(b).toFixed(4))
    });
  };

  return (
    <div className="tool-panel">
      <h2 className="text-3xl font-bold text-white mb-2">Blender Shader Helper</h2>
      <p className="text-slate-400 mb-8">Convert sRGB Hex colors to Linear RGB values for Blender's Shading Engine</p>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl max-w-xl mx-auto">
        <div className="flex flex-col items-center gap-8">
          <div className="w-full">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Input Hex Code</label>
            <div className="flex gap-4">
              <input 
                type="color" value={hex} 
                onChange={(e) => calculate(e.target.value.toUpperCase())}
                className="w-20 h-20 bg-transparent border-none cursor-pointer rounded-xl overflow-hidden"
              />
              <input 
                type="text" value={hex}
                onChange={(e) => calculate(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-6 text-2xl font-mono uppercase focus:border-purple-500 transition-all text-center"
              />
            </div>
          </div>

          <div className="w-full space-y-4">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Linear RGB (Blender Format)</label>
            <div className="grid grid-cols-3 gap-4">
              {['r', 'g', 'b'].map(c => (
                <div key={c} className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-center">
                  <div className="text-2xl font-mono text-purple-400">{linear[c as keyof typeof linear]}</div>
                  <div className="text-[10px] text-slate-600 font-bold uppercase mt-1">{c} value</div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => {
              const str = `(${linear.r}, ${linear.g}, ${linear.b})`;
              navigator.clipboard.writeText(str);
              alert("Copied Linear RGB values!");
            }}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <i className="fas fa-copy"></i> Copy to Clipboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlenderHelper;
