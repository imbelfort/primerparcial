import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0', // Escucha en todas las interfaces
    port: 5173, // el número de puerto que desees
    strictPort: true, // (opcional) evita que use otro si está ocupado
    open: true, // (opcional) abre automáticamente en el navegador
  },
})
