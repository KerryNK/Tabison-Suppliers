import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // This changes the output directory from 'dist' to 'build'
    outDir: 'build',
  },
});