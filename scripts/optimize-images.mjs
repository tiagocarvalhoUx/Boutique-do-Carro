import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..')
const srcDir = path.resolve(root, '../cliente-boutique-do-carro/assets/originais/imagens')
const outDir = path.join(root, 'public/img/gallery')

const sources = {
  'multimidia-hilux-2018-antes-depois': 'Antes-depois-central-multimidia10-hilux18-octacore6-128bg.png',
  'multimidia-yaris-9': 'central multimidia- toyota yaris.png',
  'multimidia-corolla-2017': 'post-multimidia-corolla-2017-v2.png',
  'multimidia-onix-prisma': 'post-multimidia-onix-prisma-v2.png',
  'multimidia-9-pol': 'central-multimidia 9.png',
  'ppf-kit-basico': 'post-ppf-kit-basico-v2.png',
  'pelicula-residencial': 'post-pelicula-residencial-v2.png',
}

fs.mkdirSync(outDir, { recursive: true })
const manifest = {}

for (const [slug, file] of Object.entries(sources)) {
  const input = path.join(srcDir, file)
  const meta = await sharp(input).metadata()
  const variants = { sm: 480, thumb: 900, full: 1600 }
  manifest[slug] = {}
  for (const [name, max] of Object.entries(variants)) {
    const width = Math.min(meta.width, max)
    const { data, info } = await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: name === 'full' ? 86 : 78 })
      .toBuffer({ resolveWithObject: true })
    fs.writeFileSync(path.join(outDir, `${slug}-${name}.webp`), data)
    manifest[slug][name] = { width: info.width, height: info.height }
    console.log(`${slug}-${name}.webp ${info.width}x${info.height} ${(data.length / 1024).toFixed(0)}KB`)
  }
}

fs.writeFileSync(path.join(root, 'src/content/gallery-images.json'), JSON.stringify(manifest, null, 2) + '\n')
