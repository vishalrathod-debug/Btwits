import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // Fixed import path
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
