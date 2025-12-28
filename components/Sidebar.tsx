
import React, { useState } from 'react';
import { ToolId } from '../types';

interface SidebarProps {
  activeTool: ToolId;
  onSelectTool: (id: ToolId) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTool, onSelectTool }) => {
  const [search, setSearch] = useState('');

  const sections = [
    {
      title: 'Creative',
      tools: [
        { id: 'image', name: 'Image Studio', icon: 'fa-wand-sparkles', tags: ['photo', 'edit'] },
        { id: 'paint-pro', name: 'Onyx Paint Pro', icon: 'fa-palette', tags: ['draw', 'ms paint', 'shapes', 'canvas'] },
        { id: 'compress', name: 'Size Reducer', icon: 'fa-compress', tags: ['optimize', 'image'] },
        { id: 'audio-mixer', name: 'Audio Mixer', icon: 'fa-sliders', tags: ['music', 'daw'] },
        { id: 'tts', name: 'TTS Audio', icon: 'fa-microphone-lines', tags: ['voice', 'speech'] },
        { id: 'gradient', name: 'Gradients', icon: 'fa-swatchbook', tags: ['color', 'css'] },
      ]
    },
    {
      title: 'Office',
      tools: [
        { id: 'office-editor', name: 'PDF Editor', icon: 'fa-file-signature', tags: ['pdf', 'word'] },
        { id: 'office-converter', name: 'Converter', icon: 'fa-file-export', tags: ['pdf', 'convert'] },
        { id: 'lorem', name: 'Lorem Ipsum', icon: 'fa-paragraph', tags: ['text'] },
      ]
    },
    {
      title: 'Developer',
      tools: [
        { id: 'json', name: 'JSON Engine', icon: 'fa-code', tags: ['format'] },
        { id: 'cipher', name: 'Cipher Box', icon: 'fa-lock', tags: ['encrypt'] },
        { id: 'zip', name: 'Zip Expander', icon: 'fa-file-archive', tags: ['archive'] },
        { id: 'binary', name: 'Binary Tool', icon: 'fa-font', tags: ['0101'] },
        { id: 'key', name: 'Key Visual', icon: 'fa-keyboard', tags: ['keyboard'] },
        { id: 'blender', name: 'Blender Link', icon: 'fa-cube', tags: ['3d', 'linear'] },
      ]
    },
    {
      title: 'System',
      tools: [
        { id: 'audio', name: 'Signal Lab', icon: 'fa-wave-square', tags: ['synth'] },
        { id: 'hardware', name: 'Hardware Lab', icon: 'fa-microchip', tags: ['pc', 'cpu'] },
        { id: 'qr', name: 'QR Gen', icon: 'fa-qrcode', tags: ['code'] },
        { id: 'password', name: 'Passwords', icon: 'fa-key', tags: ['secure'] },
        { id: 'metadata', name: 'Metadata', icon: 'fa-info-circle', tags: ['exif'] },
        { id: 'units', name: 'Converter', icon: 'fa-ruler', tags: ['calc'] },
      ]
    }
  ];

  const filteredSections = sections.map(sec => ({
    ...sec,
    tools: sec.tools.filter(t => {
      const term = search.toLowerCase();
      return t.name.toLowerCase().includes(term) || 
             t.tags.some(tag => tag.toLowerCase().includes(term));
    })
  })).filter(sec => sec.tools.length > 0);

  return (
    <aside className="w-full h-full bg-black/90 backdrop-blur-3xl border-r border-white/10 flex flex-col relative overflow-hidden">
      <div className="p-6">
        <div 
          className="flex items-center gap-3 cursor-pointer group mb-8"
          onClick={() => onSelectTool('home')}
        >
          <div className="w-8 h-8 bg-white flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
            <i className="fas fa-cube text-black text-xs"></i>
          </div>
          <span className="font-bold tracking-tighter text-lg text-white">ONYX STUDIO</span>
        </div>
        <input 
          type="text"
          placeholder="Search tools..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-[10px] text-slate-300 focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-slate-800 uppercase font-black tracking-widest"
        />
      </div>
      <nav className="flex-1 overflow-y-auto px-3 space-y-8 pb-10 custom-scrollbar">
        {filteredSections.map((sec, idx) => (
          <div key={idx}>
            <h3 className="px-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-700 mb-4">{sec.title}</h3>
            <div className="space-y-1">
              {sec.tools.map(tool => (
                <button
                  key={tool.id}
                  onClick={() => onSelectTool(tool.id as ToolId)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-[10px] group uppercase tracking-widest font-black
                    ${activeTool === tool.id 
                      ? 'bg-purple-600/10 text-white border border-purple-500/20' 
                      : 'text-slate-600 hover:text-slate-300 hover:bg-white/5 border border-transparent'}
                  `}
                >
                  <i className={`fas ${tool.icon} w-4 text-center ${activeTool === tool.id ? 'text-purple-400' : 'group-hover:text-purple-400'}`}></i>
                  <span className="truncate">{tool.name}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
