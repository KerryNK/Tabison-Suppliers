import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Ensure this is correctly set!
  build: {
    outDir: 'dist', // Make sure this matches your vercel.json
  },
});
