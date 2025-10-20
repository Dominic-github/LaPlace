import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Alias for the src directory
      '@components': path.resolve(__dirname, './src/components'), // Alias for components
      '@utils': path.resolve(__dirname, './src/utils') // Alias for utility functions
    }
  }
})
