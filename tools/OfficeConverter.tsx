
import React, { useState, useRef } from 'react';

const OfficeConverter: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [log, setLog] = useState<string[]>(['Ready for batch processing.']);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addLog = (msg: string) => setLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 5));

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      addLog(`${e.target.files.length} files queued.`);
    }
  };

  const convertToPDF = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    addLog("Initializing jsPDF engine...");

    const { jsPDF } = (window as any).jspdf;
    const doc = new jsPDF();
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      addLog(`Processing: ${file.name}`);
      
      if (i > 0) doc.addPage();

      if (file.type.startsWith('image/')) {
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
        doc.addImage(dataUrl, 'JPEG', 10, 10, 190, 0);
      } else if (file.type === 'text/plain') {
        const text = await file.text();
        const splitText = doc.splitTextToSize(text, 180);
        doc.text(splitText, 10, 10);
      } else if (file.name.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await (window as any).mammoth.extractRawText({ arrayBuffer });
        const splitText = doc.splitTextToSize(result.value, 180);
        doc.text(splitText, 10, 10);
      } else {
        addLog(`Skipping unsupported: ${file.name}`);
      }
    }

    doc.save(`onyx-batch-export-${Date.now()}.pdf`);
    setIsProcessing(false);
    addLog("Batch export complete.");
  };

  return (
    <div className="tool-panel">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter uppercase italic">File <span className="text-purple-500">Converter</span></h2>
          <p className="text-slate-500 font-medium">Local batch conversion engine for images, text, and DOCX to PDF.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={convertToPDF}
            disabled={files.length === 0 || isProcessing}
            className={`px-10 py-4 rounded font-black text-[10px] uppercase tracking-widest transition-all
              ${isProcessing ? 'bg-slate-800 text-slate-500' : 'bg-white text-black hover:bg-slate-200 shadow-xl shadow-white/5 disabled:opacity-30'}
            `}
          >
            {isProcessing ? <i className="fas fa-spinner animate-spin mr-3"></i> : <i className="fas fa-file-export mr-3"></i>}
            Convert to PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           <div 
            onClick={() => fileInputRef.current?.click()}
            className="glass-card p-12 rounded-[40px] border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.03] transition-all min-h-[300px]"
           >
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10 mb-6">
                 <i className="fas fa-cloud-upload-alt text-slate-500 text-2xl"></i>
              </div>
              <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-2">Drop Office Assets Here</h3>
              <p className="text-slate-600 text-[10px] uppercase font-black tracking-widest">Images, Text, or DOCX</p>
              <input ref={fileInputRef} type="file" multiple onChange={handleFiles} className="hidden" />
           </div>

           {files.length > 0 && (
             <div className="glass-card p-8 rounded-3xl space-y-4">
                <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex justify-between">
                  <span>Queue Progress</span>
                  <span className="text-purple-400">{files.length} Files</span>
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {files.map((f, i) => (
                    <div key={i} className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5">
                       <div className="flex items-center gap-3">
                         <i className={`fas ${f.type.startsWith('image/') ? 'fa-file-image' : 'fa-file-word'} text-slate-600`}></i>
                         <span className="text-[10px] text-white font-mono truncate max-w-[200px]">{f.name}</span>
                       </div>
                       <span className="text-[9px] text-slate-700 font-bold uppercase">{(f.size/1024).toFixed(1)} KB</span>
                    </div>
                  ))}
                </div>
             </div>
           )}
        </div>

        <div className="space-y-6">
           <div className="glass-card p-8 rounded-3xl bg-black/40 border-white/5 space-y-6">
              <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Live Console</h3>
              <div className="font-mono text-[10px] space-y-2">
                 {log.map((l, i) => (
                   <div key={i} className={i === 0 ? 'text-purple-400' : 'text-slate-700'}>{l}</div>
                 ))}
              </div>
           </div>

           <div className="glass-card p-8 rounded-3xl space-y-4 border-emerald-500/10 bg-emerald-500/5">
              <div className="flex items-center gap-3 mb-2">
                <i className="fas fa-shield-alt text-emerald-500"></i>
                <h3 className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">Privacy Guard</h3>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                All conversions are performed via client-side JavaScript. No file data is ever transmitted to a cloud server. 100% Secure.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeConverter;
