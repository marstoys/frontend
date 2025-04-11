import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  publicDir: 'src',
  server: {
    host: true,
    port: 5173,
    allowedHosts: [
      'localhost',
      'frontend-production-1d06.up.railway.app',
      'toysmars.uz',
      'www.toysmars.uz'
    ]
})