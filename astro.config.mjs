import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.puntoveterinario.com',

  trailingSlash: 'never',

  integrations: [sitemap({
    changefreq: 'weekly',
    priority: 0.7,
    lastmod: new Date(),
  }), react()],

  compressHTML: true,

  build: {
    format: 'directory',
    inlineStylesheets: 'always',
  },

  vite: {
    plugins: [tailwindcss()],
  },
});