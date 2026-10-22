import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Ithu mukkiyam

export default defineConfig({
  plugins: [react(), tailwindcss()], // Tailwind plugin inga irukanum
  server: {
    host: '0.0.0.0',
    allowedHosts: [
      'm2dmjrb9-5173.inc1.devtunnels.ms', // Unga phone URL
    ],
  },
})