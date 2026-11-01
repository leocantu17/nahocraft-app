import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
    server: {
      port: 5173,
      host: true,
      fs: {
        allow: ['.'],
      },
      // Proxy seguro de desarrollo:
      // Redirige peticiones locales a /api/send-email directamente a Supabase Edge Functions
      // evitando problemas de CORS y centralizando el endpoint de despacho
      proxy: {
        '/api/send-email': {
          target:
            env.VITE_EMAIL_API_ENDPOINT ||
            (env.VITE_SUPABASE_URL
              ? `${env.VITE_SUPABASE_URL.replace(/\/+$/, '')}/functions/v1/send-email`
              : 'http://localhost:54321/functions/v1/send-email'),
          changeOrigin: true,
          secure: true,
          rewrite: (pathStr) => {
            if (env.VITE_EMAIL_API_ENDPOINT || env.VITE_SUPABASE_URL) {
              return '';
            }
            return pathStr;
          },
        },
      },
    },
  };
});
