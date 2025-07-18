import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  
  // Базовый путь для GitHub Pages
  base: '/table/',
  
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  
  server: {
    port: 3001,
    open: true
  },
  
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: true,
    outDir: 'dist'
  }
})