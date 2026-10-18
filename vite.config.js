import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// בפיתוח (npm start) הבסיס הוא "/", ובבנייה לגיטהאב הוא שם הריפו
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/Equipment-Game-/' : '/',
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: { open: true },
}));
