import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/sb1-8ccwgh6v/', // 🟢 Isso corrige o erro da tela em branco no GitHub Pages
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
