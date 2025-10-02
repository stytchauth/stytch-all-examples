import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        changeOrigin: false,
        target: 'http://localhost:3001',
      },
      '/.well-known': {
        changeOrigin: false,
        target: 'http://localhost:3001',
      },
      '/mcp': {
        changeOrigin: false,
        target: 'http://localhost:3001',
      },
      '/sse': {
        changeOrigin: false,
        target: 'http://localhost:3001',
      },
    },
  },
  plugins: [react()],
});
