
import React, { useState } from 'react';

const JSONFormatter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const format = () => {
    try {
      setError(null);
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
    } catch (e: any) {
      setError(e.message);
    }
  };

  const minify = () => {
    try {
      setError(null);
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="tool-panel">
      <h2 className="text-3xl font-bold text-white mb-2">JSON Formatter</h2>
      <p className="text-slate-400 mb-8">Beautify or compress JSON data structures</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Input Raw JSON</label>
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-[500px] bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm font-mono text-slate-300 focus:outline-none focus:border-purple-500 resize-none"
            placeholder='{"key": "value"}'
          />
          <div className="flex gap-2">
            <button 
              onClick={format}
              className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition-all"
            >
              Format Beautify
            </button>
            <button 
              onClick={minify}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl border border-slate-700 transition-all"
            >
              Minify Compress
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Result</label>
          <div className="relative">
            <textarea 
              value={output}
              readOnly
              className={`w-full h-[500px] bg-slate-900 border border-slate-800 rounded-2xl p-4 text-sm font-mono focus:outline-none resize-none ${error ? 'text-red-400' : 'text-purple-400'}`}
              placeholder="Waiting for valid JSON input..."
            />
            {error && (
              <div className="absolute inset-x-0 bottom-0 bg-red-900/20 border-t border-red-500/50 p-4 rounded-b-2xl flex items-center gap-3 text-red-400 text-xs">
                <i className="fas fa-exclamation-triangle"></i>
                <span>{error}</span>
              </div>
            )}
            {output && !error && (
              <button 
                onClick={() => { navigator.clipboard.writeText(output); alert("Copied!"); }}
                className="absolute top-4 right-4 w-10 h-10 bg-slate-950/50 hover:bg-slate-950 rounded-lg flex items-center justify-center text-slate-500 transition-all border border-slate-800"
              >
                <i className="fas fa-copy"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JSONFormatter;
