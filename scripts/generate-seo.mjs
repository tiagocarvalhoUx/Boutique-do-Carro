import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const envPath = path.join(root, '.env')
const fileValue = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf-8').match(/^VITE_SITE_URL=(.+)$/m)?.[1] : undefined
const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
const siteUrl = (process.env.VITE_SITE_URL || fileValue || (vercel ? `https://${vercel}` : 'http://localhost:5173')).trim().replace(/\/$/, '')

const dist = path.join(root, 'dist')
const today = new Date().toISOString().slice(0, 10)

fs.writeFileSync(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`,
)
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`)
console.log(`Generated sitemap.xml and robots.txt for ${siteUrl}`)
