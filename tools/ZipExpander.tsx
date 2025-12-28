
import React, { useState } from 'react';

declare const JSZip: any;

const ZipExpander: React.FC = () => {
  const [level, setLevel] = useState(3);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('');

  const generateZip = async () => {
    setIsProcessing(true);
    setStatus("Generating 10MB random noise...");
    
    try {
      // Create substantial random base to avoid compression shrinking the actual zip too much
      const buffer = new Uint8Array(10 * 1024 * 1024);
      crypto.getRandomValues(buffer);
      
      let currentBuffer: ArrayBuffer | Uint8Array = buffer;
      let currentName = "data.bin";

      for (let i = 1; i <= level; i++) {
        setStatus(`Recursion Depth ${i}/${level}...`);
        const zip = new JSZip();
        
        // Multiply content 5 times per level
        // Total uncompressed = 10MB * 5^level
        for (let k = 0; k < 5; k++) {
          zip.file(`node_${k}_${currentName}`, currentBuffer);
        }
        
        // Use STORE (level 0) to ensure the zip itself actually contains the bytes
        currentBuffer = await zip.generateAsync({
          type: "uint8array",
          compression: "STORE" 
        });
        currentName = `archive_lvl_${i}.zip`;
      }

      setStatus("Packing final archive...");
      const finalZip = new JSZip();
      finalZip.file("onyx_expanded_content.zip", currentBuffer);
      const finalBlob = await finalZip.generateAsync({ type: "blob" });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(finalBlob);
      link.download = `onyx-expand-lvl${level}.zip`;
      link.click();
      setStatus("Success. Check your downloads.");
    } catch (e: any) {
      setStatus("Error: " + e.message);
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const getEstSize = () => {
    // 10MB * 5^level
    const total = 10 * Math.pow(5, level);
    if (total < 1024) return `${total} MB`;
    if (total < 1024 * 1024) return `${(total / 1024).toFixed(2)} GB`;
    return `${(total / (1024 * 1024)).toFixed(2)} TB`;
  };

  return (
    <div className="tool-panel">
      <h2 className="text-3xl font-bold text-white mb-2">Zip Expander (Archive Multiplier)</h2>
      <p className="text-slate-400 mb-8">Generate massive archive structures with high-entropy local data.</p>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl max-w-xl mx-auto">
        <div className="space-y-8">
          <div>
            <div className="flex justify-between mb-4">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Recursion Depth</label>
              <span className="text-purple-400 font-mono">Level {level}</span>
            </div>
            <input 
              type="range" min="1" max="7" step="1"
              value={level}
              onChange={(e) => setLevel(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between mt-2 text-[10px] text-slate-600 uppercase font-bold">
              <span>Standard (1)</span>
              <span>Extreme (7)</span>
            </div>
          </div>

          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Unpacked Footprint:</span>
              <span className={`font-mono font-bold ${level > 5 ? 'text-red-400' : 'text-purple-400'}`}>{getEstSize()}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Base Noise:</span>
              <span className="text-slate-300">10 MB Random Entropy</span>
            </div>
          </div>

          <button 
            disabled={isProcessing}
            onClick={generateZip}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all
              ${isProcessing ? 'bg-slate-800 text-slate-500' : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/20'}
            `}
          >
            {isProcessing ? (
              <div className="w-5 h-5 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <i className="fas fa-archive"></i>
            )}
            {isProcessing ? 'Generating...' : 'Start Local Expansion'}
          </button>
          
          <p className="text-center text-[11px] text-slate-500 font-medium h-4 italic">
            {status}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ZipExpander;
