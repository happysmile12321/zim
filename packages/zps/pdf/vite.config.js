import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import reducePluginSystem from 'vite-plugin-reduce-plugin-system'


export default defineConfig({
  base: '/pdf/',
  plugins: [react(), reducePluginSystem({
    mode: 'development'
  })],
  server: {
    port: 6001
  }
})
