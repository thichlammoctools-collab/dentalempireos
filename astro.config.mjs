// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// SEO: Paths that should never appear in sitemap or be indexed
const PRIVATE_PATH_RE = /\/(admin|api|login|register|verify-email|my-questions|payment|survey\/result)\//;
const PRIVATE_EXACT_RE = /^\/(admin|api|login|register|verify-email|my-questions|payment|survey\/result)$/;

// https://astro.build/config
export default defineConfig({
  site: 'https://dentalempireos.com',
  output: 'server',
  adapter: cloudflare(),
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !PRIVATE_PATH_RE.test(page) && !PRIVATE_EXACT_RE.test(page),
      customPages: ['https://dentalempireos.com/'],
      serialize: (item) => {
        let priority = 0.7;
        let changefreq = 'weekly';

        if (item.url === 'https://dentalempireos.com/') {
          priority = 1.0;
          changefreq = 'daily';
        } else if (/\/blog\//.test(item.url) && !/\/blog$/.test(item.url)) {
          priority = 0.8;
          changefreq = 'monthly';
        } else if (/\/book\//.test(item.url)) {
          priority = 0.8;
          changefreq = 'monthly';
        } else if (/\/blog$/.test(item.url) || /\/book$/.test(item.url) || /\/resources$/.test(item.url) || /\/about$/.test(item.url) || /\/survey$/.test(item.url)) {
          priority = 0.9;
          changefreq = 'weekly';
        }

        return {
          ...item,
          priority,
          changefreq,
        };
      },
    }),
  ],
  prefetch: {
    defaultStrategy: 'hover',
    prefetchAll: false,
  },
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/noop',
    },
  },
});
