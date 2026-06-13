import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // 保持前端端口不变
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // 你的后端地址
        changeOrigin: true,
        secure: false, // 本地开发用 http，关掉 https 检测
      }
    }
  }
})