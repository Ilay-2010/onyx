
import React, { useState } from 'react';

const LoremGenerator: React.FC = () => {
  const [paragraphs, setParagraphs] = useState(3);
  const [output, setOutput] = useState('');

  const LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

  const generate = () => {
    let text = [];
    for (let i = 0; i < paragraphs; i++) {
      text.push(LOREM);
    }
    setOutput(text.join('\n\n'));
  };

  React.useEffect(generate, [paragraphs]);

  return (
    <div className="tool-panel">
      <h2 className="text-3xl font-bold text-white mb-2">Lorem Ipsum Generator</h2>
      <p className="text-slate-400 mb-8">Professional placeholder text synthesis</p>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl max-w-4xl mx-auto">
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-4 tracking-widest">Paragraph Count</label>
              <div className="flex items-center gap-4">
                <input 
                  type="range" min="1" max="50" 
                  value={paragraphs} 
                  onChange={(e) => setParagraphs(parseInt(e.target.value))}
                  className="flex-1 h-3 bg-slate-800 rounded-full appearance-none accent-purple-500"
                />
                <span className="w-12 text-center text-xl font-bold text-purple-400">{paragraphs}</span>
              </div>
            </div>
            <button 
              onClick={() => { navigator.clipboard.writeText(output); alert("Copied!"); }}
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg"
            >
              <i className="fas fa-copy mr-2"></i> Copy All
            </button>
          </div>

          <textarea 
            readOnly
            value={output}
            className="w-full h-80 bg-slate-950 border border-slate-800 rounded-2xl p-6 text-slate-400 font-serif leading-relaxed italic focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default LoremGenerator;
