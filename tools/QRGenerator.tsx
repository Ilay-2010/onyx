
import React, { useState, useEffect, useRef } from 'react';

declare const QRCode: any;

const QRGenerator: React.FC = () => {
  const [text, setText] = useState('https://ilay-2010.github.io/onyx/');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    generate();
  }, [text, fgColor, bgColor]);

  const generate = () => {
    if (!qrRef.current) return;
    qrRef.current.innerHTML = '';
    try {
      new QRCode(qrRef.current, {
        text: text || ' ',
        width: 256,
        height: 256,
        colorDark: fgColor,
        colorLight: bgColor,
        correctLevel: QRCode.CorrectLevel.H
      });
    } catch (e) {}
  };

  const download = () => {
    const img = qrRef.current?.querySelector('img');
    if (img) {
      const link = document.createElement('a');
      link.href = img.src;
      link.download = `onyx-qr-${Date.now()}.png`;
      link.click();
    }
  };

  return (
    <div className="tool-panel">
      <h2 className="text-3xl font-bold text-white mb-2">QR Code Generator</h2>
      <p className="text-slate-400 mb-8">Generate stylized high-density QR codes</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="space-y-8 bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Payload (Link/Text)</label>
            <input 
              type="text" 
              value={text} 
              onChange={(e) => setText(e.target.value)}
              placeholder="https://..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Foreground</label>
              <div className="flex gap-2">
                <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-10 h-10 bg-transparent border-none" />
                <input type="text" value={fgColor} readOnly className="flex-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono px-2" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Background</label>
              <div className="flex gap-2">
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-10 h-10 bg-transparent border-none" />
                <input type="text" value={bgColor} readOnly className="flex-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono px-2" />
              </div>
            </div>
          </div>

          <button 
            onClick={download}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-purple-900/20"
          >
            <i className="fas fa-download mr-2"></i> Export PNG
          </button>
        </div>

        <div className="flex flex-col items-center justify-center gap-6">
          <div className="p-6 bg-white rounded-3xl shadow-2xl">
            <div ref={qrRef} className="rounded-xl overflow-hidden" />
          </div>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest animate-pulse">Live Preview Rendered</p>
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;
