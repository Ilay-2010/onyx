
import React, { useState, useEffect } from 'react';

const KeyVisualizer: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [keyCode, setKeyCode] = useState<string | null>(null);
  const [eventData, setEventData] = useState<any>(null);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => {
      e.preventDefault();
      setActiveKey(e.key === ' ' ? 'Space' : e.key);
      setKeyCode(e.code);
      setEventData({
        shift: e.shiftKey,
        ctrl: e.ctrlKey,
        alt: e.altKey,
        meta: e.metaKey,
        which: e.which
      });
      setHistory(prev => [e.key === ' ' ? 'Space' : e.key, ...prev].slice(0, 10));
    };

    window.addEventListener('keydown', handleDown);
    return () => window.removeEventListener('keydown', handleDown);
  }, []);

  return (
    <div className="tool-panel">
      <h2 className="text-3xl font-bold text-white mb-2">Key Event Visualizer</h2>
      <p className="text-slate-400 mb-8">Inspect raw keyboard events and browser codes</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="aspect-square bg-slate-900 border-4 border-slate-800 rounded-3xl flex flex-col items-center justify-center p-8 text-center transition-all shadow-2xl">
            {activeKey ? (
              <>
                <div className="text-8xl font-black text-purple-400 drop-shadow-lg mb-4">{activeKey}</div>
                <div className="text-xl font-mono text-slate-500">{keyCode}</div>
              </>
            ) : (
              <div className="text-slate-700 animate-pulse text-xl uppercase font-bold tracking-widest">Strike any key</div>
            )}
          </div>
          
          <div className="flex justify-center gap-4">
            {['shift', 'ctrl', 'alt', 'meta'].map(mod => (
              <div 
                key={mod}
                className={`
                  px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all
                  ${eventData?.[mod] ? 'bg-purple-600 text-white border-purple-400' : 'bg-slate-950 text-slate-800 border-slate-900'}
                `}
              >
                {mod}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
            <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-widest">Live Metadata</h3>
            <div className="space-y-3 font-mono text-sm">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-500">event.key</span>
                <span className="text-purple-400">"{activeKey || '-'}"</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-500">event.code</span>
                <span className="text-purple-400">{keyCode || '-'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-500">event.which</span>
                <span className="text-purple-400">{eventData?.which || '-'}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
            <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-widest">History Buffer</h3>
            <div className="flex flex-wrap gap-2">
              {history.map((h, i) => (
                <div key={i} className="bg-slate-950 px-3 py-1 rounded text-xs font-mono text-slate-400 border border-slate-800">
                  {h}
                </div>
              ))}
              {history.length === 0 && <span className="text-slate-800 italic text-xs">Waiting for input...</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyVisualizer;
