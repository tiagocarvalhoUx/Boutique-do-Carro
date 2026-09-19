import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = path.resolve(import.meta.dirname, '..')
const dist = path.join(root, 'dist')
const indexPath = path.join(dist, 'index.html')
const template = fs.readFileSync(indexPath, 'utf-8')
const { render } = await import(pathToFileURL(path.join(root, 'dist-ssr/entry-server.js')).href)

let page = template.replace('<!--app-html-->', await render())

// Embute o CSS no HTML: a página é pequena e assim a renderização não espera um request bloqueante.
page = page.replace(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/, (_, href) => {
  const file = path.join(dist, href)
  const css = fs.readFileSync(file, 'utf-8')
  fs.rmSync(file)
  return `<style>${css}</style>`
})

fs.writeFileSync(indexPath, page)
fs.rmSync(path.join(root, 'dist-ssr'), { recursive: true, force: true })
console.log('Prerendered dist/index.html')
