import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// `npm run build` runs two builds: the site itself, then a server build of src/entry-server.jsx
// (into dist-ssr) that scripts/prerender.mjs uses to render each page to HTML.
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  build: {
    // scripts/prerender.mjs reads .vite/manifest.json to preload each page's own chunk.
    manifest: !isSsrBuild,
    // public/ belongs to the site build only.
    copyPublicDir: !isSsrBuild,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}));
