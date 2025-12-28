
import React, { useState } from 'react';

const CipherTool: React.FC = () => {
  const [text, setText] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');

  // Utility to convert string to ArrayBuffer
  const str2ab = (str: string) => new TextEncoder().encode(str);
  // Utility to convert ArrayBuffer to Base64
  const ab2base64 = (buf: ArrayBuffer) => btoa(String.fromCharCode(...new Uint8Array(buf)));
  // Utility to convert Base64 to ArrayBuffer
  const base642ab = (base64: string) => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes.buffer;
  };

  const getCryptoKey = async (pw: string) => {
    const pwHash = await crypto.subtle.digest('SHA-256', str2ab(pw));
    return crypto.subtle.importKey('raw', pwHash, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
  };

  const handleProcess = async () => {
    if (!text || !password) return;
    try {
      const key = await getCryptoKey(password);
      if (mode === 'encrypt') {
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, str2ab(text));
        // Result: [IV (12 bytes)] + [Ciphertext] in Base64
        const out = new Uint8Array(iv.length + encrypted.byteLength);
        out.set(iv, 0);
        out.set(new Uint8Array(encrypted), iv.length);
        setResult(ab2base64(out.buffer));
      } else {
        const fullBuf = base642ab(text);
        const iv = new Uint8Array(fullBuf, 0, 12);
        const data = new Uint8Array(fullBuf, 12);
        const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
        setResult(new TextDecoder().decode(decrypted));
      }
    } catch (e) {
      alert("Encryption/Decryption failed. Ensure the password is correct for decryption.");
    }
  };

  return (
    <div className="tool-panel">
      <h2 className="text-3xl font-bold text-white mb-2">Cipher Box</h2>
      <p className="text-slate-400 mb-8">Secure password-based AES-256 text encryption</p>

      <div className="max-w-3xl mx-auto space-y-8">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl space-y-6">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button 
              onClick={() => {setMode('encrypt'); setResult('');}}
              className={`flex-1 py-3 rounded-lg font-bold transition-all ${mode === 'encrypt' ? 'bg-purple-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <i className="fas fa-lock mr-2"></i> Encrypt
            </button>
            <button 
              onClick={() => {setMode('decrypt'); setResult('');}}
              className={`flex-1 py-3 rounded-lg font-bold transition-all ${mode === 'decrypt' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <i className="fas fa-unlock mr-2"></i> Decrypt
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Secret Key / Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Strong password..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Input Text (or Base64 for Decryption)</label>
            <textarea 
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-40 bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 focus:outline-none focus:border-purple-500 resize-none"
              placeholder={mode === 'encrypt' ? "Plaintext message..." : "Encrypted base64 string..."}
            />
          </div>

          <button 
            onClick={handleProcess}
            className={`w-full py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-3
              ${mode === 'encrypt' ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-900/20' : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-900/20'}
            `}
          >
            {mode === 'encrypt' ? 'Execute Encryption' : 'Execute Decryption'}
          </button>
        </div>

        {result && (
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Operation Result</label>
              <button 
                onClick={() => {navigator.clipboard.writeText(result); alert("Copied to clipboard!");}}
                className="text-purple-400 text-sm hover:underline"
              >
                Copy to Clipboard
              </button>
            </div>
            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 font-mono text-purple-300 break-all whitespace-pre-wrap">
              {result}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CipherTool;
