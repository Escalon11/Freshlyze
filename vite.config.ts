import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set param ketiga ke '' untuk memuat SEMUA variabel env, bukan cuma yang prefix VITE_
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Mengekspos API_KEY ke kode client secara aman
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY),
    },
  }
})