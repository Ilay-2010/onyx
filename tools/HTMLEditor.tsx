
import React, { useState, useEffect, useRef } from 'react';

const HTMLEditor: React.FC = () => {
  const [code, setCode] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ONYX LAB PROJECT</title>
  <style>
    body {
      background: #050505;
      color: #fff;
      font-family: 'Inter', sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      overflow: hidden;
    }
    .neon-box {
      border: 2px solid #a855f7;
      padding: 50px;
      border-radius: 30px;
      box-shadow: 0 0 50px rgba(168, 85, 247, 0.3);
      text-align: center;
      background: rgba(168, 85, 247, 0.05);
    }
    h1 { 
      font-size: 4rem; 
      font-weight: 900; 
      margin: 0; 
      letter-spacing: -3px;
      text-transform: uppercase;
      font-style: italic;
    }
    p { color: #888; margin-top: 15px; font-weight: 500; }
  </style>
</head>
<body>
  <div class="neon-box">
    <h1>High Performance</h1>
    <p>Live Native Rendering Engine v3.0</p>
  </div>
</body>
</html>`);

  const [previewWidthMode, setPreviewWidthMode] = useState<'100%' | '768px' | '375px' | 'custom'>('100%');
  const [customWidth, setCustomWidth] = useState(600);
  const [copyStatus, setCopyStatus] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);

  const BOILERPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    body { background: #111; color: #fff; font-family: sans-serif; padding: 2rem; }
    h1 { color: #a855f7; }
  </style>
</head>
<body>
  <h1>Hello Onyx</h1>
  <p>Start editing to see changes in real-time.</p>
</body>
</html>`;

  const insertBoilerplate = () => {
    if (confirm("Replace current code with a fresh template?")) {
      setCode(BOILERPLATE);
    }
  };

  const highlightCode = (text: string) => {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      // Comments
      .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="text-slate-600 italic">$1</span>')
      // Tags
      .replace(/(&lt;\/?[a-zA-Z0-9]+)/g, '<span class="text-purple-400">$1</span>')
      .replace(/(&gt;)/g, '<span class="text-purple-400">$1</span>')
      // Attributes
      .replace(/\s([a-zA-Z0-9-]+)=/g, ' <span class="text-amber-400">$1</span>=')
      // Strings
      .replace(/("[^"]*")/g, '<span class="text-emerald-400">$1</span>')
      // CSS Selectors
      .replace(/([^{}]+\s*\{)/g, (match) => match.replace(/([.#][a-zA-Z0-9_-]+|[a-z0-9]+)/g, '<span class="text-pink-400">$1</span>'))
      // CSS Properties
      .replace(/([a-zA-Z-]+):/g, '<span class="text-sky-400">$1</span>:')
      // CSS Values
      .replace(/:([^;{}]+);/g, ':<span class="text-rose-300">$1</span>;');
  };

  const syncScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  const exportHTML = () => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'onyx-lab-project.html';
    a.click();
  };

  const currentPreviewWidth = previewWidthMode === 'custom' ? `${customWidth}px` : previewWidthMode;

  return (
    <div className="tool-panel h-full flex flex-col space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter uppercase italic">HTML <span className="text-purple-500">Lab</span></h2>
          <p className="text-slate-500 font-medium">Professional-grade real-time rendering environment.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          {previewWidthMode === 'custom' && (
            <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{customWidth}PX</span>
              <input 
                type="range" min="300" max="1200" value={customWidth} 
                onChange={(e) => setCustomWidth(parseInt(e.target.value))} 
                className="w-24 h-1 bg-white/10 rounded-full appearance-none accent-purple-500"
              />
            </div>
          )}
          
          <div className="bg-white/5 p-1 rounded-xl border border-white/10 flex">
             {[
               { id: '375px', icon: 'fa-mobile-alt', label: 'Mobile' },
               { id: '768px', icon: 'fa-tablet-alt', label: 'Tablet' },
               { id: '100%', icon: 'fa-desktop', label: 'Desktop' },
               { id: 'custom', icon: 'fa-expand-arrows-alt', label: 'Manual' }
             ].map(item => (
               <button 
                 key={item.id}
                 onClick={() => setPreviewWidthMode(item.id as any)}
                 title={item.label}
                 className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm transition-all ${previewWidthMode === item.id ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40' : 'text-slate-600 hover:text-white'}`}
               >
                 <i className={`fas ${item.icon}`}></i>
               </button>
             ))}
          </div>
          
          <button 
            onClick={exportHTML}
            className="bg-white text-black text-[10px] font-black uppercase tracking-widest px-8 py-3 rounded-xl hover:bg-slate-200 transition-all flex items-center gap-2 shadow-xl shadow-white/5"
          >
            <i className="fas fa-file-export"></i> Export .html
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-[650px]">
        {/* Code Editor Container */}
        <div className="relative glass-card rounded-[40px] overflow-hidden bg-black border-white/10 flex flex-col shadow-2xl">
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
             <div className="flex items-center gap-6">
               <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Source Code</span>
               <div className="flex gap-4">
                  <button onClick={insertBoilerplate} className="text-[9px] font-black uppercase text-purple-400 hover:text-purple-300 flex items-center gap-1.5 transition-colors">
                    <i className="fas fa-magic"></i> Template
                  </button>
                  <button onClick={copyCode} className="text-[9px] font-black uppercase text-slate-500 hover:text-white flex items-center gap-1.5 transition-colors">
                    <i className="fas fa-copy"></i> {copyStatus ? 'Copied!' : 'Copy'}
                  </button>
               </div>
             </div>
             <div className="flex gap-1.5 opacity-50">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
             </div>
          </div>
          
          <div className="relative flex-1 grid overflow-hidden">
            {/* Syntax Highlighting Layer */}
            <pre 
              ref={highlightRef}
              className="col-start-1 row-start-1 p-8 m-0 font-mono text-sm leading-relaxed pointer-events-none whitespace-pre-wrap break-words overflow-hidden"
              style={{ minHeight: '100%' }}
              dangerouslySetInnerHTML={{ __html: highlightCode(code) + '\n\n' }}
            />
            {/* Input Layer */}
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onScroll={syncScroll}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              className="col-start-1 row-start-1 w-full h-full p-8 bg-transparent text-transparent caret-white font-mono text-sm leading-relaxed resize-none focus:outline-none whitespace-pre-wrap break-words overflow-auto custom-scrollbar"
              style={{ minHeight: '100%' }}
              placeholder="<!-- Write your markup here... -->"
            />
          </div>
        </div>

        {/* Live Preview Container */}
        <div className="glass-card rounded-[40px] overflow-hidden bg-[#111] border-white/10 flex flex-col items-center shadow-2xl">
          <div className="w-full p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
             <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Live Preview</span>
             <div className="text-[9px] font-mono text-slate-700 bg-white/5 px-3 py-1 rounded-full">{currentPreviewWidth}</div>
          </div>
          
          <div className="flex-1 w-full flex items-center justify-center p-8 overflow-auto bg-[radial-gradient(#ffffff08_1px,transparent_1px)] bg-[size:30px_30px]">
            <div 
              className="bg-white rounded-2xl shadow-2xl transition-all duration-500 overflow-hidden border border-white/10"
              style={{ width: currentPreviewWidth, height: '100%', minHeight: '500px' }}
            >
              <iframe
                title="preview"
                srcDoc={code}
                className="w-full h-full border-none"
                sandbox="allow-scripts"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HTMLEditor;
