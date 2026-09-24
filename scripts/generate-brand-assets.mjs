import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..')
const source = path.resolve(root, '../cliente/originais/logo/botique-logo.png')
const pub = path.join(root, 'public')
const cover = path.resolve(root, '../cliente/originais/capa/capa-botique.png')
const heroArt = path.resolve(root, '../cliente/originais/hero/mutimidia-3d.png')
const ink950 = { r: 9, g: 10, b: 12, alpha: 1 }

// Recorta a margem transparente (ignora o brilho quase invisível) e deixa o logo quadrado.
const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
let minX = info.width, minY = info.height, maxX = 0, maxY = 0
for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    if (data[(y * info.width + x) * 4 + 3] > 60) {
      minX = Math.min(minX, x); maxX = Math.max(maxX, x)
      minY = Math.min(minY, y); maxY = Math.max(maxY, y)
    }
  }
}
const side = Math.max(maxX - minX, maxY - minY) + 1
const cx = Math.round((minX + maxX) / 2)
const cy = Math.round((minY + maxY) / 2)
const left = Math.max(0, Math.min(info.width - side, cx - Math.floor(side / 2)))
const top = Math.max(0, Math.min(info.height - side, cy - Math.floor(side / 2)))
const logo = () => sharp(source).extract({ left, top, width: side, height: side })

await logo().resize(256, 256).webp({ quality: 90, alphaQuality: 100 }).toFile(path.join(pub, 'logo.webp'))
await logo().resize(512, 512).png().toFile(path.join(pub, 'logo-512.png'))
await logo().resize(192, 192).png().toFile(path.join(pub, 'icon-192.png'))
await logo().resize(32, 32).png().toFile(path.join(pub, 'favicon-32.png'))
await logo()
  .resize(150, 150)
  .extend({ top: 15, bottom: 15, left: 15, right: 15, background: ink950 })
  .flatten({ background: ink950 })
  .png()
  .toFile(path.join(pub, 'apple-touch-icon.png'))

// Ícone maskable (Android): logo com margem de segurança sobre o fundo da marca.
await sharp({ create: { width: 512, height: 512, channels: 4, background: ink950 } })
  .composite([{ input: await logo().resize(360, 360).toBuffer(), gravity: 'center' }])
  .png()
  .toFile(path.join(pub, 'icon-maskable-512.png'))

// favicon.ico (PNG embutido em 16/32/48 px) para navegadores que pedem /favicon.ico.
const icoSizes = [16, 32, 48]
const icoPngs = await Promise.all(icoSizes.map((n) => logo().resize(n, n).png().toBuffer()))
const head = Buffer.alloc(6)
head.writeUInt16LE(1, 2)
head.writeUInt16LE(icoSizes.length, 4)
let offset = 6 + 16 * icoSizes.length
const entries = icoPngs.map((png, i) => {
  const e = Buffer.alloc(16)
  e[0] = icoSizes[i]; e[1] = icoSizes[i]
  e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6)
  e.writeUInt32LE(png.length, 8); e.writeUInt32LE(offset, 12)
  offset += png.length
  return e
})
fs.writeFileSync(path.join(pub, 'favicon.ico'), Buffer.concat([head, ...entries, ...icoPngs]))

// Capa: banner acima do hero. Desktop/tablet usa a arte inteira; mobile usa um recorte central (logo, serviços e telefones legíveis).
for (const w of [1024, 1600, 2048]) {
  await sharp(cover).resize({ width: w, withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(pub, `capa-${w}.webp`))
}
await sharp(cover).extract({ left: 590, top: 100, width: 800, height: 600 }).webp({ quality: 80 }).toFile(path.join(pub, 'capa-mobile.webp'))
await sharp(cover).extract({ left: 290, top: 0, width: 1467, height: 768 }).resize(1200, 630).jpeg({ quality: 84, mozjpeg: true }).toFile(path.join(pub, 'og-image.jpg'))

// Ilustração 3D da central (hero).
for (const w of [640, 1200]) {
  await sharp(heroArt).resize({ width: w }).webp({ quality: 82 }).toFile(path.join(pub, `hero-multimidia-${w}.webp`))
}

fs.writeFileSync(
  path.join(pub, 'site.webmanifest'),
  JSON.stringify(
    {
      name: 'Boutique do Carro — Som e Acessórios',
      short_name: 'Boutique do Carro',
      lang: 'pt-BR',
      start_url: '/',
      display: 'browser',
      background_color: '#090A0C',
      theme_color: '#090A0C',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/logo-512.png', sizes: '512x512', type: 'image/png' },
        { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    null,
    2,
  ) + '\n',
)
console.log('crop', { left, top, side })

// Garante que uma regeneração completa da marca termine sempre com o favicon
// baseado no novo logo horizontal usado pela página showroom.
await import('./generate-showroom-favicons.mjs')
