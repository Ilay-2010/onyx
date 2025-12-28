
import React, { useState, useRef } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Background3D from './components/Background3D';
import Home from './tools/Home';
import ImageStudio from './tools/ImageStudio';
import PaintPro from './tools/PaintPro';
import ImageCompressor from './tools/ImageCompressor';
import MetadataEditor from './tools/MetadataEditor';
import UnitConverter from './tools/UnitConverter';
import ColorConverter from './tools/ColorConverter';
import GradientDesigner from './tools/GradientDesigner';
import AudioLab from './tools/AudioLab';
import AudioMixer from './tools/AudioMixer';
import BlenderHelper from './tools/BlenderHelper';
import ZipExpander from './tools/ZipExpander';
import KeyVisualizer from './tools/KeyVisualizer';
import TTSStudio from './tools/TTSStudio';
import QRGenerator from './tools/QRGenerator';
import PasswordGenerator from './tools/PasswordGenerator';
import JSONFormatter from './tools/JSONFormatter';
import BinaryConverter from './tools/BinaryConverter';
import CipherTool from './tools/CipherTool';
import LoremGenerator from './tools/LoremGenerator';
import HardwareLab from './tools/HardwareLab';
import OfficeEditor from './tools/OfficeEditor';
import OfficeConverter from './tools/OfficeConverter';
import { ToolId } from './types';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolId>('home');
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isResizing = useRef(false);

  const startResizing = (e: React.MouseEvent) => {
    isResizing.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', stopResizing);
    document.body.style.cursor = 'col-resize';
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.current) return;
    const newWidth = Math.max(220, Math.min(450, e.clientX));
    setSidebarWidth(newWidth);
  };

  const stopResizing = () => {
    isResizing.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', stopResizing);
    document.body.style.cursor = 'default';
  };

  const renderTool = () => {
    switch (activeTool) {
      case 'home': return <Home onSelectTool={setActiveTool} />;
      case 'image': return <ImageStudio />;
      case 'paint-pro': return <PaintPro />;
      case 'compress': return <ImageCompressor />;
      case 'metadata': return <MetadataEditor />;
      case 'units': return <UnitConverter />;
      case 'color': return <ColorConverter />;
      case 'gradient': return <GradientDesigner />;
      case 'audio': return <AudioLab />;
      case 'audio-mixer': return <AudioMixer />;
      case 'blender': return <BlenderHelper />;
      case 'zip': return <ZipExpander />;
      case 'key': return <KeyVisualizer />;
      case 'tts': return <TTSStudio />;
      case 'qr': return <QRGenerator />;
      case 'password': return <PasswordGenerator />;
      case 'json': return <JSONFormatter />;
      case 'binary': return <BinaryConverter />;
      case 'cipher': return <CipherTool />;
      case 'lorem': return <LoremGenerator />;
      case 'hardware': return <HardwareLab />;
      case 'office-editor': return <OfficeEditor />;
      case 'office-converter': return <OfficeConverter />;
      default: return <Home onSelectTool={setActiveTool} />;
    }
  };

  const isDashboardMode = activeTool !== 'home';

  return (
    <div className="h-screen w-screen flex flex-col bg-black overflow-hidden relative">
      <Background3D />
      
      {!isDashboardMode ? (
        <div className="flex flex-col h-full relative z-10 overflow-y-auto custom-scrollbar overflow-x-hidden">
          <Navbar activeTool={activeTool} onSelectTool={setActiveTool} />
          <main className="flex-1 p-4 md:p-12 flex items-start justify-center">
            <div className="max-w-7xl w-full">
              {renderTool()}
            </div>
          </main>
        </div>
      ) : (
        <div className="flex flex-1 h-full relative z-10 overflow-hidden">
          {/* Mobile Overlay */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[45] lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          <div 
            className={`fixed inset-y-0 left-0 lg:relative z-50 h-full bg-black/40 border-r border-white/5 transition-transform lg:transition-none duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            style={{ width: isSidebarOpen ? '85%' : `${sidebarWidth}px`, maxWidth: isSidebarOpen ? '320px' : 'none' }}
          >
            <div className="h-full overflow-y-auto custom-scrollbar">
               <Sidebar 
                activeTool={activeTool} 
                onSelectTool={(id) => {
                  setActiveTool(id);
                  setIsSidebarOpen(false);
                }} 
              />
            </div>
            <div 
              onMouseDown={startResizing}
              className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-purple-500/50 transition-colors z-50 hidden lg:block"
            />
          </div>

          <div className="flex-1 h-full flex flex-col overflow-hidden">
            <header className="h-16 md:h-20 flex-shrink-0 flex justify-between items-center bg-black/60 backdrop-blur-3xl px-4 md:px-8 border-b border-white/5 z-40">
                <div className="flex items-center gap-4 md:gap-6">
                  <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="lg:hidden w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white active:scale-90 transition-transform"
                  >
                    <i className="fas fa-bars"></i>
                  </button>
                  <button 
                    onClick={() => setActiveTool('home')}
                    className="text-[9px] md:text-[10px] font-black text-slate-500 hover:text-white transition-all uppercase tracking-[0.2em] md:tracking-[0.4em] flex items-center gap-2 group"
                  >
                    <i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> Home
                  </button>
                </div>
                <div className="text-[8px] md:text-[10px] text-slate-800 font-mono tracking-[0.2em] md:tracking-[0.5em] uppercase hidden sm:block italic font-black">
                  ONYX_CORE // STABLE_ENV_V4.4
                </div>
            </header>

            <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-12 custom-scrollbar bg-black/30">
              <div className="max-w-6xl mx-auto w-full min-h-full pb-32">
                {renderTool()}
              </div>
            </main>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
