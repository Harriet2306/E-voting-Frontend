import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3063,
    proxy: {
      '/api': {
        target: 'http://64.23.169.136:5656',
        changeOrigin: true,
      },
    },
  },
})
