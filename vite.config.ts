import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    host: true,
    port: 5173,
    allowedHosts: ['frontend-production-1d06.up.railway.app', 'toysmars.uz', 'www.toysmars.uz']
  }
})