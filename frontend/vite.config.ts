import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  base: "/",
  plugins: [react()],
  server: {
    port: 5173,
    // Allow access from your Replit host along with localhost
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '38a69558-c74d-48df-ba6d-4c207bbbe2be-00-3uxmf9be8q3fb.spock.replit.dev',
    ],
    proxy: command === "serve" ? {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      }
    } : undefined,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
}));
