import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    host: true,
    port: 5173
  },
  preview: {
    host: true,
    port: 4173
  },
  build: {
    target: 'es2022',
    modulePreload: {
      polyfill: false
    },
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        norva: resolve(import.meta.dirname, 'norva.html'),
        notFound: resolve(import.meta.dirname, '404.html'),
        privacy: resolve(import.meta.dirname, 'privacy.html'),
        webDev: resolve(import.meta.dirname, 'services/website-development/index.html'),
        businessWebsites: resolve(import.meta.dirname, 'services/business-websites/index.html'),
        ecommerce: resolve(import.meta.dirname, 'services/ecommerce-development/index.html'),
        landingPage: resolve(import.meta.dirname, 'services/landing-page-design/index.html'),
        websiteRedesign: resolve(import.meta.dirname, 'services/website-redesign/index.html')
      }
    }
  }
});
