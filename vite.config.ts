import { defineConfig, loadEnv, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import { buildJsonLd } from './src/content/jsonld.ts'

// Ordem de prioridade: VITE_SITE_URL > domínio de produção da Vercel > localhost.
function resolveSiteUrl(fileEnv: Record<string, string>): string {
  const explicit = process.env.VITE_SITE_URL || fileEnv.VITE_SITE_URL
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
  return (explicit || (vercel ? `https://${vercel}` : 'http://localhost:5173')).replace(/\/$/, '')
}

function seoPlugin(siteUrl: string): Plugin {
  return {
    name: 'site-url-and-jsonld',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return {
          html: html.replaceAll('%VITE_SITE_URL%', siteUrl),
          tags: buildJsonLd(siteUrl).map((data) => ({
            tag: 'script',
            attrs: { type: 'application/ld+json' },
            children: JSON.stringify(data),
            injectTo: 'head' as const,
          })),
        }
      },
    },
  }
}

export default defineConfig(({ mode }) => {
  const siteUrl = resolveSiteUrl(loadEnv(mode, process.cwd(), ''))
  return { plugins: [vue(), seoPlugin(siteUrl)] }
})
