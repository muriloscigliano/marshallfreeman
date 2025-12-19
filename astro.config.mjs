import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://marshallfreeman.com.au',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    css: {
      devSourcemap: true,
    },
  },
});
