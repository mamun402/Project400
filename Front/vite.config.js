import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_ADMIN_LOGIN_PATH': JSON.stringify(process.env.ADMIN_LOGIN_PATH || '/secure/admin-panel-2024')
  }
})
