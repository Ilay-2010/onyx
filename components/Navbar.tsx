
import React from 'react';
import { ToolId } from '../types';

interface NavbarProps {
  activeTool: ToolId;
  onSelectTool: (id: ToolId) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTool, onSelectTool }) => {
  return (
    <nav className="sticky top-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onSelectTool('home')}
        >
          <div className="w-8 h-8 bg-white flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
            <i className="fas fa-cube text-black text-sm"></i>
          </div>
          <span className="font-bold tracking-tighter text-xl">ONYX STUDIO</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => onSelectTool('home')} className={`text-sm transition-colors ${activeTool === 'home' ? 'text-white font-medium' : 'text-slate-400 hover:text-white'}`}>Showcase</button>
          <a href="https://github.com" target="_blank" className="text-sm text-slate-400 hover:text-white transition-colors">GitHub</a>
        </div>

        <div className="flex items-center gap-4">
          <button 
            className="bg-white text-black text-xs font-bold px-5 py-2 rounded transition-all hover:scale-105 active:scale-95"
            onClick={() => onSelectTool('image')}
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
