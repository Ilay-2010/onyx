import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Sicherstellen, dass Assets auf GitHub Pages korrekt geladen werden
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild', // Nutzt den integrierten, extrem schnellen Minifier
    target: 'esnext'
  },
  esbuild: {
    // Entfernt alle console.* und debugger Aufrufe im Produktions-Build
    drop: ['console', 'debugger'],
  },
});
