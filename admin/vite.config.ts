import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  base: '/admin/',
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 4003,
    host: true,
    watch: {
      usePolling: true, // Bắt buộc cho Docker
      interval: 1000,   // Check mỗi 1 giây
    },
    hmr: {
      overlay: true,    // Hiển thị lỗi trên màn hình
    },
  },
})

