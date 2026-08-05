import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base so the built site works when uploaded to any folder on
// GoDaddy shared hosting (root domain or a subfolder) without extra config.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
})
