import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import { parseCourseraSearchHtml } from './src/lib/courseraSearchParse'

function courseraSearchDevPlugin(): Plugin {
  return {
    name: 'coursera-search-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? ''
        if (!url.startsWith('/api/coursera-search')) return next()
        try {
          const q = new URL(url, 'http://x.local').searchParams.get('q')?.trim() ?? ''
          res.setHeader('Content-Type', 'application/json')
          if (!q) {
            res.end(JSON.stringify({ courses: [] }))
            return
          }
          const target = `https://www.coursera.org/search?query=${encodeURIComponent(q)}`
          const r = await fetch(target, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; CourseraDiscoveryPrototype/1.0)',
              'Accept-Language': 'en-US,en;q=0.9',
            },
          })
          const html = await r.text()
          const courses = parseCourseraSearchHtml(html)
          res.end(JSON.stringify({ courses }))
        } catch {
          res.statusCode = 500
          res.end(JSON.stringify({ courses: [] }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    courseraSearchDevPlugin(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
