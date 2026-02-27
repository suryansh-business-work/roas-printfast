import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  envDir: path.resolve(__dirname, '..'),
  server: {
    port: 4036,
    proxy: {
      '/api': {
        target: 'http://localhost:4037',
        changeOrigin: true,
      },
    },
  },
});
