
import React, { useState, useEffect } from 'react';

const UNITS: Record<string, { base: string; rates: Record<string, number> }> = {
  length: { base: 'm', rates: { m: 1, km: 1000, cm: 0.01, mm: 0.001, in: 0.0254, ft: 0.3048, mi: 1609.34 } },
  mass: { base: 'g', rates: { g: 1, kg: 1000, mg: 0.001, lb: 453.592, oz: 28.3495 } },
  volume: { base: 'l', rates: { l: 1, ml: 0.001, gal: 3.78541, cup: 0.236588 } },
  speed: { base: 'ms', rates: { ms: 1, kmh: 0.277778, mph: 0.44704, knot: 0.514444 } }
};

const UnitConverter: React.FC = () => {
  const [category, setCategory] = useState('length');
  const [value, setValue] = useState<number>(1);
  const [from, setFrom] = useState('m');
  const [to, setTo] = useState('km');
  const [result, setResult] = useState<number>(0.001);

  useEffect(() => {
    const fromRate = UNITS[category].rates[from];
    const toRate = UNITS[category].rates[to];
    const baseValue = value * fromRate;
    setResult(baseValue / toRate);
  }, [category, value, from, to]);

  const changeCategory = (cat: string) => {
    setCategory(cat);
    const firstTwo = Object.keys(UNITS[cat].rates);
    setFrom(firstTwo[0]);
    setTo(firstTwo[1] || firstTwo[0]);
  };

  return (
    <div className="tool-panel">
      <div className="mb-12">
        <h2 className="text-4xl font-black tracking-tighter uppercase italic">Unit <span className="text-purple-500">Converter</span></h2>
        <p className="text-slate-500 font-medium tracking-wide">Fast, accurate cross-unit calculations.</p>
      </div>

      <div className="glass-card border-white/10 rounded-[40px] p-10 shadow-xl max-w-2xl mx-auto bg-black/40">
        <div className="flex gap-2 mb-10 overflow-x-auto pb-4 no-scrollbar">
          {Object.keys(UNITS).map(cat => (
            <button
              key={cat}
              onClick={() => changeCategory(cat)}
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${category === cat ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40' : 'bg-white/5 text-slate-500 hover:bg-white/10 hover:text-white'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-8">
          <div className="flex flex-col md:flex-row gap-6 items-end">
            <div className="flex-1 w-full">
              <label className="block text-[9px] font-black text-slate-600 uppercase mb-3 tracking-widest">Input Amount</label>
              <input 
                type="number" 
                value={value}
                onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-2xl font-black text-white focus:outline-none focus:border-purple-500/50 transition-all"
              />
            </div>
            <div className="w-full md:w-48">
              <label className="block text-[9px] font-black text-slate-600 uppercase mb-3 tracking-widest">Source Unit</label>
              <select 
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-xs font-black uppercase focus:outline-none appearance-none cursor-pointer"
              >
                {Object.keys(UNITS[category].rates).map(u => (
                  <option key={u} value={u} className="bg-black">{u.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-purple-400">
              <i className="fas fa-exchange-alt"></i>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-end">
            <div className="flex-1 w-full">
              <label className="block text-[9px] font-black text-slate-600 uppercase mb-3 tracking-widest">Calculated Result</label>
              <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-2xl font-black text-purple-400 truncate">
                {result.toLocaleString(undefined, { maximumFractionDigits: 6 })}
              </div>
            </div>
            <div className="w-full md:w-48">
              <label className="block text-[9px] font-black text-slate-600 uppercase mb-3 tracking-widest">Target Unit</label>
              <select 
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-xs font-black uppercase focus:outline-none appearance-none cursor-pointer"
              >
                {Object.keys(UNITS[category].rates).map(u => (
                  <option key={u} value={u} className="bg-black">{u.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitConverter;
