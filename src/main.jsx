import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'
import { bindContactClickTracking } from '@/lib/tracking'
import { initMetaPixel } from '@/lib/metaPixel'
import { pageForPath, preloadPage } from '@/pages/routes'

initMetaPixel()
bindContactClickTracking()

// Load this page's chunk first, so React can take over the prerendered HTML in one pass rather
// than through an empty Suspense frame.
const page = pageForPath(window.location.pathname)
const ready = page ? preloadPage(page).catch(() => {}) : Promise.resolve()

const root = document.getElementById('root')
// scripts/prerender.mjs renders each page with React and marks #root with its path. When that is
// the page being opened, React hydrates it (keeps the HTML and attaches to it). Otherwise (the
// 404 page under another URL), or with reduced motion, whose first render differs from the
// prerendered animated one, React renders from scratch.
const path = window.location.pathname.replace(/\/+$/, '') || '/'
const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const hydrate = root.dataset.path === path && !reduceMotion

ready.then(() => {
  if (hydrate) ReactDOM.hydrateRoot(root, <App />)
  else ReactDOM.createRoot(root).render(<App />)
})
