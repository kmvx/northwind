import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
      '~bootstrap-icons': path.resolve(
        __dirname,
        'node_modules/bootstrap-icons',
      ),
    },
  },
  //base: '/',
  test: {
    environment: 'jsdom',
    exclude: [...configDefaults.exclude, './tests/playwright/*'],
  },
});
