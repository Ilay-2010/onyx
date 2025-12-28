
import React, { useState, useRef } from 'react';
import { ExifData } from '../types';

declare const piexif: any;

const MetadataEditor: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [exifData, setExifData] = useState<ExifData>({
    artist: '',
    description: '',
    copyright: '',
    software: 'ONYX STUDIO PRO'
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'image/jpeg') {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const data = ev.target?.result as string;
        setImage(data);
        try {
          const exif = piexif.load(data);
          setExifData({
            artist: exif["0th"][piexif.ImageIFD.Artist] || '',
            description: exif["0th"][piexif.ImageIFD.ImageDescription] || '',
            copyright: exif["0th"][piexif.ImageIFD.Copyright] || '',
            software: exif["0th"][piexif.ImageIFD.Software] || 'ONYX STUDIO PRO'
          });
        } catch (err) {
          console.warn("Exif metadata load error or no existing metadata.");
        }
      };
      reader.readAsDataURL(file);
    } else if (file) {
      alert("Only JPEG files supported for metadata editing.");
    }
  };

  const saveExif = () => {
    if (!image) return;
    try {
      const zeroth: any = {};
      zeroth[piexif.ImageIFD.Artist] = exifData.artist;
      zeroth[piexif.ImageIFD.ImageDescription] = exifData.description;
      zeroth[piexif.ImageIFD.Copyright] = exifData.copyright;
      zeroth[piexif.ImageIFD.Software] = exifData.software;

      const exifStr = piexif.dump({ "0th": zeroth });
      const newImage = piexif.insert(exifStr, image);

      const link = document.createElement('a');
      link.href = newImage;
      link.download = 'onyx-metadata-edited.jpg';
      link.click();
    } catch (err) {
      alert("Error saving metadata: " + err);
    }
  };

  return (
    <div className="tool-panel">
      <div className="mb-12">
        <h2 className="text-4xl font-black tracking-tighter uppercase italic">Metadata <span className="text-purple-500">Editor</span></h2>
        <p className="text-slate-500 font-medium">Directly modify EXIF tags for authorship and copyright.</p>
      </div>

      <div className="glass-card border-white/10 rounded-[40px] p-10 bg-black/40 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`
                aspect-video rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden bg-black/60
                ${image ? 'border-purple-500/50' : 'border-white/10 hover:border-white/20'}
              `}
            >
              {image ? (
                <img src={image} className="w-full h-full object-contain p-4" />
              ) : (
                <>
                  <i className="fas fa-file-image text-3xl text-slate-800 mb-4"></i>
                  <span className="text-[10px] font-black uppercase text-slate-600 tracking-widest text-center px-6">Drop JPEG asset here to scan</span>
                </>
              )}
            </div>
            <input ref={fileInputRef} type="file" className="hidden" accept="image/jpeg" onChange={handleFile} />
            
            <button
              disabled={!image}
              onClick={saveExif}
              className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-30 text-white text-[10px] font-black uppercase tracking-[0.2em] py-5 rounded-2xl transition-all shadow-xl shadow-purple-900/40"
            >
              <i className="fas fa-save mr-2"></i> Save & Export
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-[9px] font-black text-slate-600 uppercase mb-2 tracking-widest">Artist / Author</label>
              <input 
                type="text" 
                value={exifData.artist}
                onChange={(e) => setExifData({...exifData, artist: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500/50"
                placeholder="Name of photographer..."
              />
            </div>
            <div>
              <label className="block text-[9px] font-black text-slate-600 uppercase mb-2 tracking-widest">Image Description</label>
              <textarea 
                rows={4}
                value={exifData.description}
                onChange={(e) => setExifData({...exifData, description: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500/50 resize-none"
                placeholder="Brief summary of image content..."
              />
            </div>
            <div>
              <label className="block text-[9px] font-black text-slate-600 uppercase mb-2 tracking-widest">Copyright Notice</label>
              <input 
                type="text" 
                value={exifData.copyright}
                onChange={(e) => setExifData({...exifData, copyright: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500/50"
                placeholder="© 2024 Your Studio"
              />
            </div>
            <div>
              <label className="block text-[9px] font-black text-slate-600 uppercase mb-2 tracking-widest">Processing Software</label>
              <input 
                type="text" 
                value={exifData.software}
                onChange={(e) => setExifData({...exifData, software: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500/50"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetadataEditor;
