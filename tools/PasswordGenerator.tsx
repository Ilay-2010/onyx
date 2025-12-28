
import React, { useState, useEffect } from 'react';

const PasswordGenerator: React.FC = () => {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({ upper: true, numbers: true, symbols: true });
  const [password, setPassword] = useState('');

  const generate = () => {
    let chars = 'abcdefghijklmnopqrstuvwxyz';
    if (options.upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (options.numbers) chars += '0123456789';
    if (options.symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let pw = '';
    for (let i = 0; i < length; i++) {
      pw += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pw);
  };

  useEffect(generate, [length, options]);

  const copy = () => {
    navigator.clipboard.writeText(password);
    alert("Copied to clipboard!");
  };

  return (
    <div className="tool-panel">
      <h2 className="text-3xl font-bold text-white mb-2">Password Generator</h2>
      <p className="text-slate-400 mb-8">Cryptographically strong password synthesis</p>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl max-w-2xl mx-auto">
        <div className="space-y-8">
          <div className="relative group">
            <input 
              type="text" 
              value={password} 
              readOnly 
              className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl p-6 text-2xl font-mono text-center text-purple-400 shadow-inner tracking-wider"
            />
            <button 
              onClick={copy}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-slate-800 rounded-xl hover:bg-slate-700 transition-all flex items-center justify-center"
            >
              <i className="fas fa-copy text-slate-400"></i>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Complexity Length</label>
                <span className="text-purple-400 font-bold">{length}</span>
              </div>
              <input 
                type="range" min="8" max="64" 
                value={length} 
                onChange={(e) => setLength(parseInt(e.target.value))}
                className="w-full h-3 bg-slate-800 rounded-full appearance-none accent-purple-500"
              />
            </div>

            <div className="flex flex-col gap-3">
              {[
                { key: 'upper', label: 'Uppercase Letters (A-Z)' },
                { key: 'numbers', label: 'Numeric Base (0-9)' },
                { key: 'symbols', label: 'Special Symbols (!@#)' }
              ].map(opt => (
                <label key={opt.key} className="flex items-center gap-3 cursor-pointer group">
                  <div 
                    onClick={() => setOptions(prev => ({ ...prev, [opt.key]: !prev[opt.key as keyof typeof options] }))}
                    className={`w-6 h-6 rounded border transition-all flex items-center justify-center ${options[opt.key as keyof typeof options] ? 'bg-purple-600 border-purple-400' : 'bg-slate-950 border-slate-800 group-hover:border-slate-700'}`}
                  >
                    {options[opt.key as keyof typeof options] && <i className="fas fa-check text-[10px] text-white"></i>}
                  </div>
                  <span className="text-sm text-slate-400">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <button 
            onClick={generate}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-4 rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-3"
          >
            <i className="fas fa-sync"></i> Regenerate Hash
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;
