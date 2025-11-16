import { defineConfig/*, loadEnv*/ } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default (/*{ mode }*/) => {
  // const env = loadEnv(mode, process.cwd(), '');
  // const target = env.VITE_BACKEND_URL || 'http://localhost:5001/';

  return defineConfig({
    server: {
      proxy: {
        '/api': {
          target: 'https://localhost:7138',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    plugins: [
      react(),
      tailwindcss(),
    ],
  });
};
