import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'
import { bindContactClickTracking } from '@/lib/tracking'
import { initMetaPixel } from '@/lib/metaPixel'
import { pageForPath, preloadPage } from '@/pages/routes'

initMetaPixel()
bindContactClickTracking()

// Load this page's chunk first, so React replaces the prerendered HTML with the page itself
// rather than an empty Suspense frame.
const page = pageForPath(window.location.pathname)
const ready = page ? preloadPage(page).catch(() => {}) : Promise.resolve()

ready.then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <App />
  )
})
