
import React, { useState } from 'react';

const BinaryConverter: React.FC = () => {
  const [text, setText] = useState('');
  const [binary, setBinary] = useState('');

  const toBinary = (val: string) => {
    setText(val);
    const bin = val.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
    setBinary(bin);
  };

  const toText = (val: string) => {
    setBinary(val);
    const cleanBin = val.replace(/[^01]/g, '');
    let txt = '';
    for (let i = 0; i < cleanBin.length; i += 8) {
      const byte = cleanBin.substring(i, i + 8);
      if (byte.length === 8) {
        txt += String.fromCharCode(parseInt(byte, 2));
      }
    }
    setText(txt);
  };

  return (
    <div className="tool-panel">
      <h2 className="text-3xl font-bold text-white mb-2">Binary Converter</h2>
      <p className="text-slate-400 mb-8">Low-level encoding conversion</p>

      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-4 tracking-widest">ASCII Text String</label>
          <textarea 
            value={text}
            onChange={(e) => toBinary(e.target.value)}
            className="w-full h-40 bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 focus:outline-none focus:border-purple-500 font-sans"
            placeholder="Type your text here..."
          />
        </div>

        <div className="flex justify-center">
          <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-lg">
            <i className="fas fa-exchange-alt"></i>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-4 tracking-widest">Binary (Base-2)</label>
          <textarea 
            value={binary}
            onChange={(e) => toText(e.target.value)}
            className="w-full h-40 bg-slate-950 border border-slate-800 rounded-xl p-4 text-purple-400 focus:outline-none focus:border-purple-500 font-mono text-sm tracking-tighter"
            placeholder="01001111 01001110 01011001 01011000"
          />
        </div>
      </div>
    </div>
  );
};

export default BinaryConverter;
