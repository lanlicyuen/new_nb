import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // 监听所有网络接口，允许外部访问
    port: 5178, // 使用之前测试过的端口
    watch: {
      usePolling: true, // 在容器中需要轮询模式
    },
    hmr: {
      port: 5178, // HMR 端口
    }
  }
})
