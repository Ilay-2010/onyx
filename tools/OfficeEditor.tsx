
import React, { useState, useRef, useEffect } from 'react';

const OfficeEditor: React.FC = () => {
  const [title, setTitle] = useState('Untitled Document');
  const [stats, setStats] = useState({ chars: 0, words: 0 });
  const editorRef = useRef<HTMLDivElement>(null);

  // Synchronize stats on initial load and whenever content changes
  const updateStats = () => {
    if (editorRef.current) {
      const text = editorRef.current.innerText || "";
      const charCount = text.length;
      const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
      setStats({ chars: charCount, words: wordCount });
    }
  };

  useEffect(() => {
    updateStats();
  }, []);

  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateStats();
  };

  const exportPDF = () => {
    const { jsPDF } = (window as any).jspdf;
    const doc = new jsPDF();
    const content = editorRef.current?.innerText || "";
    
    // Simple text wrapping for export
    const splitText = doc.splitTextToSize(content, 180);
    doc.setFontSize(18);
    doc.text(title, 10, 20);
    doc.setFontSize(11);
    doc.text(splitText, 10, 35);
    doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
  };

  return (
    <div className="tool-panel">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex-1 w-full">
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            className="bg-transparent text-5xl font-black tracking-tighter uppercase italic text-white w-full border-none focus:outline-none focus:ring-0 placeholder-slate-800"
            placeholder="Document Title"
          />
          <p className="text-slate-500 font-medium tracking-wide mt-2">Local secure rich-text workspace.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={exportPDF}
            className="bg-white text-black text-[10px] font-black uppercase tracking-widest px-10 py-4 rounded-xl hover:bg-slate-200 transition-all flex items-center gap-3 shadow-2xl"
          >
            <i className="fas fa-file-pdf text-xs"></i> Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          {/* Toolbar */}
          <div className="glass-card p-4 rounded-t-[32px] border-b-0 flex flex-wrap gap-2 items-center bg-white/[0.02]">
            <button onClick={() => execCommand('bold')} className="w-10 h-10 rounded-xl hover:bg-white/10 text-slate-300 transition-colors" title="Bold"><i className="fas fa-bold"></i></button>
            <button onClick={() => execCommand('italic')} className="w-10 h-10 rounded-xl hover:bg-white/10 text-slate-300 transition-colors" title="Italic"><i className="fas fa-italic"></i></button>
            <button onClick={() => execCommand('underline')} className="w-10 h-10 rounded-xl hover:bg-white/10 text-slate-300 transition-colors" title="Underline"><i className="fas fa-underline"></i></button>
            <div className="w-px h-6 bg-white/10 mx-2"></div>
            <button onClick={() => execCommand('justifyLeft')} className="w-10 h-10 rounded-xl hover:bg-white/10 text-slate-300 transition-colors"><i className="fas fa-align-left"></i></button>
            <button onClick={() => execCommand('justifyCenter')} className="w-10 h-10 rounded-xl hover:bg-white/10 text-slate-300 transition-colors"><i className="fas fa-align-center"></i></button>
            <button onClick={() => execCommand('justifyRight')} className="w-10 h-10 rounded-xl hover:bg-white/10 text-slate-300 transition-colors"><i className="fas fa-align-right"></i></button>
            <div className="w-px h-6 bg-white/10 mx-2"></div>
            <button onClick={() => execCommand('insertUnorderedList')} className="w-10 h-10 rounded-xl hover:bg-white/10 text-slate-300 transition-colors"><i className="fas fa-list-ul"></i></button>
            <button onClick={() => execCommand('insertOrderedList')} className="w-10 h-10 rounded-xl hover:bg-white/10 text-slate-300 transition-colors"><i className="fas fa-list-ol"></i></button>
            <div className="w-px h-6 bg-white/10 mx-2"></div>
            <button onClick={() => {
              const url = prompt("Enter URL:");
              if(url) execCommand('createLink', url);
            }} className="w-10 h-10 rounded-xl hover:bg-white/10 text-slate-300 transition-colors"><i className="fas fa-link"></i></button>
          </div>
          
          {/* Editor Surface */}
          <div className="glass-card rounded-b-[32px] p-12 min-h-[700px] bg-black/60 border-t-0 shadow-2xl relative">
            <div 
              ref={editorRef}
              contentEditable 
              onInput={updateStats}
              className="rich-editor w-full h-full text-slate-200 leading-relaxed font-serif text-xl min-h-[600px] focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Tab') {
                  e.preventDefault();
                  execCommand('indent');
                }
              }}
            >
              Start typing your masterpiece...
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-8 rounded-[40px] space-y-6 bg-black/40 border-white/5">
             <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] mb-4 border-b border-white/5 pb-4">Document Stats</h3>
             <div className="grid grid-cols-1 gap-4">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-purple-500/30 transition-all">
                   <div className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Characters</div>
                   <div className="text-2xl font-black text-white italic group-hover:text-purple-400 transition-colors">{stats.chars.toLocaleString()}</div>
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-purple-500/30 transition-all">
                   <div className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Word Count</div>
                   <div className="text-2xl font-black text-white italic group-hover:text-purple-400 transition-colors">{stats.words.toLocaleString()}</div>
                </div>
             </div>
          </div>

          <div className="glass-card p-8 rounded-[32px] bg-purple-600/5 border-purple-500/10">
            <h3 className="text-[10px] font-black uppercase text-purple-400 tracking-widest mb-4 flex items-center gap-2">
              <i className="fas fa-feather-pointed"></i> Pro Tips
            </h3>
            <ul className="text-[11px] text-slate-500 space-y-4 font-medium leading-relaxed">
              <li className="flex gap-3"><i className="fas fa-check-circle text-purple-600 mt-0.5"></i> Use standard shortcuts (Ctrl+B, I, U) for faster editing.</li>
              <li className="flex gap-3"><i className="fas fa-check-circle text-purple-600 mt-0.5"></i> Local processing ensures your text data never leaves the browser environment.</li>
              <li className="flex gap-3"><i className="fas fa-check-circle text-purple-600 mt-0.5"></i> The PDF export maintains standard formatting for high readability.</li>
            </ul>
          </div>
        </div>
      </div>
      <style>{`
        .rich-editor:empty:before {
          content: attr(placeholder);
          color: #333;
          pointer-events: none;
          display: block;
        }
      `}</style>
    </div>
  );
};

export default OfficeEditor;
