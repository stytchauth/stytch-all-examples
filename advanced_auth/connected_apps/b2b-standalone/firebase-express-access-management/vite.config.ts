import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: './frontend',
  build: {
    outDir: '../dist/frontend',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1100,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname),
    },
  },
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
