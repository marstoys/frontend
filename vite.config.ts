import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: [
      'frontend-production-1d06.up.railway.app',
      'toysmars.uz',
      'www.toysmars.uz'
    ]
  }
})
