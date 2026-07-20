import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/FinTrack-project/',   // <-- имя твоего репозитория, замени если другое
  server: {
    port: 5173,
  },
});