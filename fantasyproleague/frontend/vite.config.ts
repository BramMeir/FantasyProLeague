import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,   // allows connections from outside container
    port: 5173,
    watch: {
      usePolling: true,
      interval: 100, // check every 100ms
    },
  },
})
