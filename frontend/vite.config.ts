import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const devApi = process.env.VITE_DEV_API ?? 'http://localhost:3000'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // dev only: forward API and Socket.IO calls to the local backend (override with VITE_DEV_API)
  server: { proxy: { '/api': devApi, '/socket.io': { target: devApi, ws: true } } },
})
