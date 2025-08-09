import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  base: '/',
  plugins: [react()],
  server: {
    port: 5173,
    proxy: command === 'serve' ? {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    } : undefined,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
}))
