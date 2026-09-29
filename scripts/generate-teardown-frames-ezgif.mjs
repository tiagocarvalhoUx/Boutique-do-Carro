// TESTE: gera a sequência de frames a partir de assets-src/ezgif-cetral/ (40 JPGs
// prontos, um arco único: fechada -> abrindo -> explodida -> remontando ->
// tela ligada em uso). Grava nos MESMOS caminhos que MultimediaExperience.vue
// lê (public/img/teardown/ e src/content/teardown-frames.json), então isto
// SUBSTITUI a sequência gerada por generate-teardown-frames.mjs.
//
// Para voltar ao que estava: `git checkout <commit anterior> -- public/img/teardown
// src/content/teardown-frames.json` (ou reverter o commit deste teste). O script
// antigo e o assets-src/central-1024.mp4 continuam intactos para isso.
//
// Diferença chave para o pipeline antigo: esta fonte já é um arco completo de
// ida (não precisa espelhar de volta), então o manifesto grava
// `sequenceMode: "linear"` e o componente lê esse frame como estão, sem espelhar.
//
// Rodar manualmente após trocar as imagens de origem:
//   node scripts/generate-teardown-frames-ezgif.mjs

import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..')
const sourceDir = path.join(root, 'assets-src/ezgif-cetral')
const outDir = path.join(root, 'public/img/teardown')
const manifestPath = path.join(root, 'src/content/teardown-frames.json')

const CORNER = 32

// Os frames 041-044 (adicionados em 29/09) vieram de outra fonte e trazem "AURA X"
// estampado fisicamente na moldura do aparelho — uma marca fictícia, no mesmo
// lugar onde o CTA final fica. Em vez de descartar os frames (o pedido foi dar
// continuidade ao scroll), desfoca-se só essa faixa antes de gerar os variantes;
// o resto de cada imagem permanece intocado. Coordenadas na resolução original
// (1672x941) de cada arquivo-fonte, achadas por inspeção visual.
const REDACT_ZONES = {
  'ezgif-frame-041.png': { left: 750, top: 705, width: 190, height: 70 },
  'ezgif-frame-042.png': { left: 750, top: 705, width: 190, height: 70 },
  'ezgif-frame-043.png': { left: 750, top: 705, width: 190, height: 70 },
  'ezgif-frame-044.png': { left: 755, top: 760, width: 200, height: 70 },
}

async function withRedaction(file, input) {
  const zone = REDACT_ZONES[file]
  if (!zone) return sharp(input)
  const blurredPatch = await sharp(input).extract(zone).blur(18).toBuffer()
  // Encadear .resize() direto após .composite() no mesmo pipeline não aplica o
  // composite nesta versão do sharp/libvips — é preciso materializar em buffer
  // antes de continuar a cadeia.
  const composited = await sharp(input).composite([{ input: blurredPatch, left: zone.left, top: zone.top }]).toBuffer()
  return sharp(composited)
}
const VARIANTS = [
  { key: 'sm', width: 720 },
  { key: 'lg', width: 1024 },
]

function toHex(channels) {
  return '#' + channels.map((channel) => Math.round(channel.mean).toString(16).padStart(2, '0')).join('')
}

// A borda dos frames é uma cor chapada, então a média dos quatro cantos descreve
// exatamente o fundo daquele frame.
async function borderColor(input, width, height) {
  const spots = [
    [0, 0],
    [width - CORNER, 0],
    [0, height - CORNER],
    [width - CORNER, height - CORNER],
  ]
  const samples = await Promise.all(
    spots.map(([left, top]) => sharp(input).extract({ left, top, width: CORNER, height: CORNER }).stats()),
  )
  return toHex([0, 1, 2].map((channel) => ({
    mean: samples.reduce((sum, sample) => sum + sample.channels[channel].mean, 0) / samples.length,
  })))
}

const sources = fs
  .readdirSync(sourceDir)
  .filter((file) => {
      const lower = file.toLowerCase()
      if (!lower.startsWith('ezgif-frame-')) return false
      return ['.jpg', '.jpeg', '.png'].some((ext) => lower.endsWith(ext))
    })
  .sort()

if (!sources.length) throw new Error(`nenhum frame encontrado em ${sourceDir}`)

for (const variant of VARIANTS) {
  fs.rmSync(path.join(outDir, variant.key), { recursive: true, force: true })
  fs.mkdirSync(path.join(outDir, variant.key), { recursive: true })
}

const base = await sharp(path.join(sourceDir, sources[0])).metadata()
const backgrounds = []
let bytes = 0

for (const [index, file] of sources.entries()) {
  const input = path.join(sourceDir, file)
  const name = `frame-${String(index + 1).padStart(3, '0')}.webp`

  backgrounds.push(await borderColor(input, base.width, base.height))

  for (const variant of VARIANTS) {
    const pipeline = await withRedaction(file, input)
    const data = await pipeline
      .resize({ width: variant.width, withoutEnlargement: true })
      .webp({ quality: 80, effort: 5 })
      .toBuffer()
    fs.writeFileSync(path.join(outDir, variant.key, name), data)
    bytes += data.length
  }
}

const manifest = {
  count: sources.length,
  width: base.width,
  height: base.height,
  sequenceMode: 'linear',
  variants: VARIANTS.map((variant) => ({
    key: variant.key,
    width: variant.width,
    height: Math.round((variant.width * base.height) / base.width),
    dir: `/img/teardown/${variant.key}`,
  })),
  backgrounds,
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
console.log(`${sources.length} frames x ${VARIANTS.length} variantes — ${(bytes / 1024 / 1024).toFixed(2)}MB (sequenceMode: linear)`)
