import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: 'api\index.js' // Replace with your actual entry point file
    }
  }
});