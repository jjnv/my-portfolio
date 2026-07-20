import { defineConfig } from 'astro/config';

const publicSiteUrl = process.env.PUBLIC_SITE_URL;

export default defineConfig({
  output: 'static',
  site: publicSiteUrl,
  build: {
    format: 'directory'
  },
  vite: {
    build: {
      cssMinify: true
    }
  }
});

