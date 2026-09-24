import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..')
const pub = path.join(root, 'public')
const source = path.join(pub, 'img', 'showroom', 'logo.webp')
const background = { r: 6, g: 17, b: 27, alpha: 1 }

async function squareLogo(size, safeWidth = 0.86) {
  const width = Math.round(size * safeWidth)
  const logo = await sharp(source)
    .resize({ width, height: Math.round(size * 0.5), fit: 'inside', withoutEnlargement: false })
    .png()
    .toBuffer()

  return sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([{ input: logo, gravity: 'center' }])
    .png()
    .toBuffer()
}

await fs.promises.writeFile(path.join(pub, 'favicon-32.png'), await squareLogo(32, 0.94))
await fs.promises.writeFile(path.join(pub, 'icon-192.png'), await squareLogo(192))
await fs.promises.writeFile(path.join(pub, 'apple-touch-icon.png'), await squareLogo(180, 0.8))
await fs.promises.writeFile(path.join(pub, 'logo-512.png'), await squareLogo(512))
await fs.promises.writeFile(path.join(pub, 'icon-maskable-512.png'), await squareLogo(512, 0.68))

const icoSizes = [16, 32, 48]
const icoPngs = await Promise.all(icoSizes.map((size) => squareLogo(size, 0.94)))
const head = Buffer.alloc(6)
head.writeUInt16LE(1, 2)
head.writeUInt16LE(icoSizes.length, 4)
let offset = 6 + 16 * icoSizes.length
const entries = icoPngs.map((png, index) => {
  const entry = Buffer.alloc(16)
  entry[0] = icoSizes[index]
  entry[1] = icoSizes[index]
  entry.writeUInt16LE(1, 4)
  entry.writeUInt16LE(32, 6)
  entry.writeUInt32LE(png.length, 8)
  entry.writeUInt32LE(offset, 12)
  offset += png.length
  return entry
})
await fs.promises.writeFile(path.join(pub, 'favicon.ico'), Buffer.concat([head, ...entries, ...icoPngs]))

const manifestPath = path.join(pub, 'site.webmanifest')
const manifest = JSON.parse(await fs.promises.readFile(manifestPath, 'utf8'))
manifest.background_color = '#06111B'
manifest.theme_color = '#06111B'
manifest.icons = [
  { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
  { src: '/logo-512.png', sizes: '512x512', type: 'image/png' },
  { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
]
await fs.promises.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)

console.log(`Favicons generated from ${path.relative(root, source)}`)
