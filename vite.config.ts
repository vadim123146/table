import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  
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
    sourcemap: false,
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'pinia']
        }
      }
    }
  }
})