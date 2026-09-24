// Gera a sequência de frames da experiência "desmontagem" (MultimediaExperience.vue).
//
// Fonte: assets-src/central-1024.mp4 (30 fps, 437 frames). Fica fora de public/
// porque é insumo de build: o site entrega os webp, não o vídeo.
// O filme tem quatro atos; só o primeiro serve à experiência de scroll:
//   frames   0–102  montada -> desmontagem -> exploded view   <- usado aqui
//   frames 103–150  reveal de um logotipo que NÃO é o da Boutique do Carro
//   frames 151–165  remontagem final ainda contaminada pelo logotipo
//   frames 166–210  central limpa, tela liga e inicia o clipe neon  <- usado aqui
//   frames 211–436  câmera entra na tela e abandona o produto
// Por isso o recorte para em FRAME_END: é onde a exploded view está completa
// e ainda não apareceu marca de terceiro. No componente, esses 103 frames são
// reproduzidos de volta em ordem inversa para fechar a central com continuidade
// pixel a pixel. Depois entram os frames 166–210: a tela liga e dá play sem mostrar
// a marca de terceiro nem perder o aparelho do enquadramento.
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
const PLAY_START = 166
const PLAY_END = 210
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
  execFileSync(
    'ffmpeg',
    [
      '-v',
      'error',
      '-i',
      source,
      '-vf',
      `select='between(n,${PLAY_START},${PLAY_END})'`,
      '-vsync',
      '0',
      path.join(tmp, 'play-%04d.png'),
      '-y',
    ],
    { stdio: 'inherit' },
  )

  const sources = fs.readdirSync(tmp).filter((file) => file.startsWith('src-')).sort()
  const playSources = fs.readdirSync(tmp).filter((file) => file.startsWith('play-')).sort()
  if (!sources.length || !playSources.length) throw new Error('ffmpeg não extraiu todos os atos esperados')

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

  for (const [index, file] of playSources.entries()) {
    const input = path.join(tmp, file)
    const name = `play-${String(index + 1).padStart(3, '0')}.webp`

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
    play: {
      count: playSources.length,
      sourceStart: PLAY_START,
      sourceEnd: PLAY_END,
    },
    backgrounds,
  }

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
  console.log(
    `${sources.length} frames de abertura + ${playSources.length} de play x ${VARIANTS.length} variantes — ${(bytes / 1024 / 1024).toFixed(2)}MB`,
  )
} finally {
  fs.rmSync(tmp, { recursive: true, force: true })
}
