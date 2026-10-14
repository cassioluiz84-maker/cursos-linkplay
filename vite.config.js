import { defineConfig } from 'vite';

export default defineConfig({
  base: '/cursos-linkplay/',
  test: {
    environment: 'jsdom',
    setupFiles: './src/test-setup.js',
  },
});
