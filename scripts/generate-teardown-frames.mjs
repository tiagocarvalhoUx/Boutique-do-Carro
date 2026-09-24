// Gera a sequência de frames da experiência "desmontagem" (MultimediaExperience.vue).
//
// Fonte: assets-src/central-1024.mp4 (30 fps, 437 frames). Fica fora de public/
// porque é insumo de build: o site entrega os webp, não o vídeo.
//
// O filme tem quatro atos e só o primeiro serve a um site da Boutique do Carro:
//   frames   0–102  montada -> desmontagem -> exploded view   <- usado aqui
//   frames 103–150  reveal de um logotipo que NÃO é o da Boutique do Carro
//   frames 151–210  central com a UI da marca fictícia "AuraDrive X1" em chinês
//   frames 211–436  câmera entra na tela e vira um clipe neon/cyberpunk
//
// Por isso o recorte para em FRAME_END: é onde a exploded view está completa e
// ainda não apareceu marca de terceiro. O componente reproduz esses 103 frames
// de volta, em ordem inversa, para remontar a central sem baixar imagem nova.
//
// Requer ffmpeg no PATH. Rodar manualmente após trocar o vídeo de origem:
//   node scripts/generate-teardown-frames.mjs

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..')
const source = path.join(root, 'assets-src/central-1024.mp4')
const outDir = path.join(root, 'public/img/teardown')
const manifestPath = path.join(root, 'src/content/teardown-frames.json')

const FRAME_END = 102
const CORNER = 32
const VARIANTS = [
  { key: 'sm', width: 720 },
  { key: 'lg', width: 1024 },
]

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'teardown-'))

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

try {
  execFileSync(
    'ffmpeg',
    ['-v', 'error', '-i', source, '-vf', `select='lte(n,${FRAME_END})'`, '-vsync', '0', path.join(tmp, 'src-%04d.png'), '-y'],
    { stdio: 'inherit' },
  )

  const sources = fs.readdirSync(tmp).filter((file) => file.startsWith('src-')).sort()
  if (!sources.length) throw new Error('ffmpeg não extraiu nenhum frame')

  for (const variant of VARIANTS) {
    fs.rmSync(path.join(outDir, variant.key), { recursive: true, force: true })
    fs.mkdirSync(path.join(outDir, variant.key), { recursive: true })
  }

  const base = await sharp(path.join(tmp, sources[0])).metadata()
  const backgrounds = []
  let bytes = 0

  for (const [index, file] of sources.entries()) {
    const input = path.join(tmp, file)
    const name = `frame-${String(index + 1).padStart(3, '0')}.webp`

    // O estúdio do render clareia ao longo da desmontagem, então cada frame guarda
    // a própria cor de fundo — é ela que preenche o letterbox do canvas.
    backgrounds.push(await borderColor(input, base.width, base.height))

    for (const variant of VARIANTS) {
      const data = await sharp(input)
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
    variants: VARIANTS.map((variant) => ({
      key: variant.key,
      width: variant.width,
      height: Math.round((variant.width * base.height) / base.width),
      dir: `/img/teardown/${variant.key}`,
    })),
    backgrounds,
  }

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
  console.log(
    `${sources.length} frames x ${VARIANTS.length} variantes — ${(bytes / 1024 / 1024).toFixed(2)}MB`,
  )
} finally {
  fs.rmSync(tmp, { recursive: true, force: true })
}
