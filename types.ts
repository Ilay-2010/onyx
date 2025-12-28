
export type ToolId = 
  | 'home'
  | 'image' 
  | 'paint-pro'
  | 'compress'
  | 'metadata' 
  | 'units' 
  | 'color' 
  | 'gradient' 
  | 'audio' 
  | 'audio-mixer'
  | 'blender' 
  | 'zip' 
  | 'key' 
  | 'tts' 
  | 'qr' 
  | 'password' 
  | 'json' 
  | 'binary' 
  | 'cipher'
  | 'lorem'
  | 'hardware'
  | 'office-editor'
  | 'office-converter';

export interface Tool {
  id: ToolId;
  name: string;
  icon: string;
  category: 'Creative' | 'Developer' | 'Utility' | 'System' | 'Office';
}

export interface ExifData {
  artist: string;
  description: string;
  copyright: string;
  software: string;
}
