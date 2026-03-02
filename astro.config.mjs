// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import expressiveCode from 'astro-expressive-code';

export default defineConfig({
  site: 'https://hunteradyer.com',
  output: 'static',
  integrations: [
    expressiveCode({
      themes: ['github-light', 'tokyo-night'],
      defaultProps: {
        wrap: true,
      },
    }),
    mdx(),
    react(),
    sitemap(),
  ],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'tokyo-night',
      },
    },
  },
});
