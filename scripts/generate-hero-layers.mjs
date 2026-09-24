import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..')
const source = path.resolve(root, '../cliente/originais/hero/mutimidia-3d.png')
const cfg = JSON.parse(fs.readFileSync(path.join(root, 'src/content/hu3d-layers.json'), 'utf-8'))
const { width: W } = await sharp(source).metadata()
const H = (W * cfg.aspect[1]) / cfg.aspect[0]

// Base "sem os cards": cada região vira uma versão borrada/escura de si mesma. Em repouso as camadas
// elevadas a cobrem; durante a entrada ela aparece como slot vazio e, depois, como sombra sob o card.
const patches = []
for (const l of cfg.layers) {
  const pad = Math.round(W * 0.009)
  const left = Math.max(0, Math.round((l.x / 100) * W) - pad)
  const top = Math.max(0, Math.round((l.y / 100) * H) - pad)
  const width = Math.min(W - left, Math.round((l.w / 100) * W) + pad * 2)
  const height = Math.min(Math.round(H) - top, Math.round((l.h / 100) * H) + pad * 2)
  const radius = (l.r / 100) * W + pad
  const patch = await sharp(source).extract({ left, top, width, height }).blur(12).modulate({ brightness: 0.45, saturation: 0.75 }).ensureAlpha().toBuffer()
  const mask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><defs><filter id="f"><feGaussianBlur stdDeviation="5"/></filter></defs><rect x="6" y="6" width="${width - 12}" height="${height - 12}" rx="${radius}" fill="#fff" filter="url(#f)"/></svg>`,
  )
  const input = await sharp(patch).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer()
  patches.push({ input, left, top })
}

const base = await sharp(source).composite(patches).png().toBuffer()
for (const w of [640, 1200]) {
  await sharp(base).resize({ width: w }).webp({ quality: 82 }).toFile(path.join(root, `public/hero-multimidia-base-${w}.webp`))
}
console.log('base gerada')
