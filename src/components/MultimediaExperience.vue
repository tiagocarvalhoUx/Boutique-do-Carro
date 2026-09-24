<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import manifest from '../content/teardown-frames.json'
import { messages } from '../lib/whatsapp'
import WhatsAppButton from './WhatsAppButton.vue'

type Chapter = {
  eyebrow?: string
  title: string
  text?: string
  cta?: string
  /** Progresso (0–1) da timeline em que o bloco entra e sai. `out: null` = fica até o fim. */
  in: number
  out: number | null
}

const chapters: Chapter[] = [
  {
    eyebrow: 'Tecnologia no seu painel',
    title: 'Muito mais que uma tela.',
    text: 'Uma central completa para transformar a experiência dentro do seu carro.',
    in: 0,
    out: 0.13,
  },
  {
    title: 'Conectividade sem complicação.',
    text: 'Apple CarPlay e Android Auto integrados à sua rotina.',
    in: 0.15,
    out: 0.27,
  },
  {
    title: 'Tecnologia por dentro.',
    text: 'Hardware pensado para entregar uma experiência rápida, moderna e integrada.',
    in: 0.29,
    out: 0.43,
  },
  {
    title: 'Cada detalhe importa.',
    text: 'Da tela aos componentes internos, uma experiência feita para transformar seu painel.',
    in: 0.45,
    out: 0.64,
  },
  {
    title: 'Pronto para transformar seu carro?',
    cta: 'Ver opção para meu carro',
    in: 0.76,
    out: null,
  },
]

const sequenceAlt =
  'Central multimídia automotiva que se abre em vista explodida, revela seus componentes, fecha completamente, liga a tela e inicia a reprodução de um vídeo.'

const lg = manifest.variants.find((item) => item.key === 'lg') ?? manifest.variants[0]
const sm = manifest.variants.find((item) => item.key === 'sm') ?? lg
// O filme original termina aberto. A reprodução usa os mesmos frames no caminho
// inverso para remontar a central com continuidade perfeita e sem baixar imagens
// duplicadas. O índice lógico, portanto, tem ida + volta; o cache físico continua
// com apenas os 103 frames originais.
const openLastIndex = manifest.count - 1
const closeLastIndex = openLastIndex * 2
const lastIndex = closeLastIndex + manifest.play.count
const lastName = `play-${String(manifest.play.count).padStart(3, '0')}.webp`
const stillSrc = `${lg.dir}/${lastName}`
const stillSrcset = `${sm.dir}/${lastName} ${sm.width}w, ${stillSrc} ${lg.width}w`

const cinematic = ref(false)
const sectionEl = ref<HTMLElement | null>(null)
const pinEl = ref<HTMLElement | null>(null)
const stageEl = ref<HTMLElement | null>(null)
const canvasEl = ref<HTMLCanvasElement | null>(null)
const ctaScrimEl = ref<HTMLElement | null>(null)
const chapterEls: HTMLElement[] = []

function setChapterEl(el: unknown, index: number) {
  if (el instanceof HTMLElement) chapterEls[index] = el
}

const stageStyle = {
  backgroundColor: manifest.backgrounds[0],
  backgroundImage: `url(${sm.dir}/frame-001.webp)`,
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
}

const glowStyle = {
  background: 'radial-gradient(circle at 50% 46%, rgba(255, 255, 255, 0.05), transparent 62%)',
}

// --- sequência -------------------------------------------------------------

// Fundo desfocado: 32x18 mantém a proporção do frame e, reampliado pelo canvas,
// vira um campo de cor suave. Menor que isso perde a direção da luz do render.
const BACKDROP_W = 32
const BACKDROP_H = 18

// ink-950, a cor de fundo do site: o entorno do produto termina no mesmo preto das
// seções vizinhas.
const SHADE_CLEAR = 'rgba(9, 10, 12, 0)'
const SHADE_KNEE = 'rgba(9, 10, 12, 0.78)'
const SHADE_SOLID = 'rgba(9, 10, 12, 0.95)'

const teardownFrames: (HTMLImageElement | null)[] = new Array(manifest.count).fill(null)
const playFrames: (HTMLImageElement | null)[] = new Array(manifest.play.count).fill(null)
const playhead = { frame: 0 }
const view = { zoom: 0.95, y: 6, shade: 0 }

let context2d: CanvasRenderingContext2D | null = null
let backdrop2d: CanvasRenderingContext2D | null = null
let variant = lg
let drawnImage: HTMLImageElement | null = null
let drawnZoom = Number.NaN
let drawnY = Number.NaN
let drawnShade = Number.NaN
let aborted = false

let gsapContext: gsap.Context | undefined
let mediaQueries: gsap.MatchMedia | undefined
let intersection: IntersectionObserver | undefined
let stageResize: ResizeObserver | undefined
let detachRefresh: (() => void) | undefined

function frameSrc(index: number, prefix: 'frame' | 'play') {
  return `${variant.dir}/${prefix}-${String(index + 1).padStart(3, '0')}.webp`
}

/** Índice do frame carregado mais próximo do pedido, preferindo os anteriores. */
function nearestLoaded(collection: (HTMLImageElement | null)[], index: number) {
  if (collection[index]) return index
  for (let step = 1; step < collection.length; step++) {
    if (collection[index - step]) return index - step
    if (collection[index + step]) return index + step
  }
  return -1
}

function render() {
  const canvas = canvasEl.value
  if (!canvas || !context2d || !backdrop2d || !canvas.width || !canvas.height) return

  const playbackIndex = Math.min(lastIndex, Math.max(0, Math.round(playhead.frame)))
  const isPlayAct = playbackIndex > closeLastIndex
  const collection = isPlayAct ? playFrames : teardownFrames
  const sourceIndex = isPlayAct
    ? playbackIndex - closeLastIndex - 1
    : playbackIndex <= openLastIndex
      ? playbackIndex
      : closeLastIndex - playbackIndex
  const index = nearestLoaded(collection, sourceIndex)
  if (index < 0) return

  const image = collection[index]
  if (!image) return
  if (image === drawnImage && view.zoom === drawnZoom && view.y === drawnY && view.shade === drawnShade) return

  const ctx = context2d
  const { width, height } = canvas

  const iw = image.naturalWidth
  const ih = image.naturalHeight
  const scale = Math.min(width / iw, height / ih) * view.zoom
  const dw = iw * scale
  const dh = ih * scale
  const dpr = canvas.clientHeight ? height / canvas.clientHeight : 1
  const dx = (width - dw) / 2
  const dy = (height - dh) / 2 + view.y * dpr
  const right = dx + dw
  const bottom = dy + dh

  // A borda dos frames não é chapada (a luz de estúdio vem de cima à esquerda), então
  // um letterbox de cor sólida deixaria degrau. O fundo é o próprio frame reduzido a
  // 32x18 e reampliado: a interpolação vira um desfoque que continua o ambiente da
  // imagem em qualquer proporção de tela.
  backdrop2d.drawImage(image, 0, 0, BACKDROP_W, BACKDROP_H)
  ctx.drawImage(backdrop2d.canvas, 0, 0, BACKDROP_W, BACKDROP_H, 0, 0, width, height)

  // Em retrato as faixas são largas e o desfoque disputaria atenção com o produto.
  // Escurecer partindo de zero na emenda mantém a continuidade e apaga o entorno.
  const shade = (from: number, to: number, x: number, y: number, w: number, h: number, vertical: boolean) => {
    if (w <= 0.5 || h <= 0.5) return
    const gradient = vertical
      ? ctx.createLinearGradient(0, from, 0, to)
      : ctx.createLinearGradient(from, 0, to, 0)
    // O escurecimento sobe rápido a ~72px da emenda: em retrato isso apaga o
    // desfoque logo, e em faixas finas (paisagem) o joelho cai no fim e quase não age.
    const band = Math.abs(to - from)
    const knee = Math.min(0.9, (72 * dpr) / Math.max(band, 1))
    gradient.addColorStop(0, SHADE_CLEAR)
    gradient.addColorStop(knee, SHADE_KNEE)
    gradient.addColorStop(1, SHADE_SOLID)
    ctx.fillStyle = gradient
    ctx.fillRect(x, y, w, h)
  }

  shade(dy, 0, 0, 0, width, dy, true)
  shade(bottom, height, 0, bottom, width, height - bottom, true)
  shade(dx, 0, 0, 0, dx, height, false)
  shade(right, width, right, 0, width - right, height, false)

  ctx.drawImage(image, dx, dy, dw, dh)

  // Um breve blackout esconde a troca de tomada entre o aparelho remontado e o
  // mesmo produto ligando a tela; assim a mudança de escala parece intencional.
  if (view.shade > 0) {
    ctx.fillStyle = `rgba(9, 10, 12, ${view.shade})`
    ctx.fillRect(0, 0, width, height)
  }

  drawnImage = image
  drawnZoom = view.zoom
  drawnY = view.y
  drawnShade = view.shade
}

function resizeCanvas() {
  const canvas = canvasEl.value
  const stage = stageEl.value
  if (!canvas || !stage) return

  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const width = Math.round(stage.clientWidth * dpr)
  const height = Math.round(stage.clientHeight * dpr)
  if (!width || !height || (width === canvas.width && height === canvas.height)) return

  canvas.width = width
  canvas.height = height
  drawnImage = null
  render()
}

function loadFrame(collection: (HTMLImageElement | null)[], index: number, prefix: 'frame' | 'play') {
  return new Promise<void>((resolve) => {
    if (aborted || collection[index]) return resolve()
    const image = new Image()
    image.decoding = 'async'
    image.onload = () => {
      if (!aborted) {
        collection[index] = image
        if (!drawnImage) render()
      }
      resolve()
    }
    image.onerror = () => resolve()
    image.src = frameSrc(index, prefix)
  })
}

async function loadRange(
  collection: (HTMLImageElement | null)[],
  prefix: 'frame' | 'play',
  from: number,
  to: number,
  concurrency: number,
) {
  let cursor = from
  const workers = Array.from({ length: Math.min(concurrency, Math.max(0, to - from)) }, async () => {
    while (cursor < to && !aborted) await loadFrame(collection, cursor++, prefix)
  })
  await Promise.all(workers)
}

async function loadSequence() {
  await loadFrame(teardownFrames, 0, 'frame')
  render()
  await loadRange(teardownFrames, 'frame', 1, Math.min(24, manifest.count), 4)
  await loadRange(teardownFrames, 'frame', 24, manifest.count, 6)
  await loadRange(playFrames, 'play', 0, manifest.play.count, 6)
  render()
}

// --- ciclo de vida ---------------------------------------------------------

function supportsExperience() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  if ((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData) return false
  return typeof document.createElement('canvas').getContext === 'function'
}

function setupCanvas() {
  const canvas = canvasEl.value
  const stage = stageEl.value
  const section = sectionEl.value
  if (!canvas || !stage || !section) return false

  context2d = canvas.getContext('2d', { alpha: false })
  const backdropCanvas = document.createElement('canvas')
  backdropCanvas.width = BACKDROP_W
  backdropCanvas.height = BACKDROP_H
  backdrop2d = backdropCanvas.getContext('2d', { alpha: false })
  if (!context2d || !backdrop2d) return false

  // Sequência em movimento tolera menos resolução que uma foto parada: limitar o DPR
  // aqui faz um telefone comum baixar o conjunto menor em vez de 1,7MB.
  const pickDpr = Math.min(window.devicePixelRatio || 1, 1.5)
  variant = stage.clientWidth * pickDpr <= sm.width ? sm : lg

  resizeCanvas()
  stageResize = new ResizeObserver(() => resizeCanvas())
  stageResize.observe(stage)

  // Só busca os frames quando a seção está a ~1,5 viewport de distância.
  intersection = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return
      intersection?.disconnect()
      intersection = undefined
      void loadSequence()
    },
    { rootMargin: '150% 0px' },
  )
  intersection.observe(section)
  return true
}

async function setupMotion() {
  const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
  gsap.registerPlugin(ScrollTrigger)

  const onRefresh = () => resizeCanvas()
  ScrollTrigger.addEventListener('refresh', onRefresh)
  detachRefresh = () => ScrollTrigger.removeEventListener('refresh', onRefresh)

  gsapContext = gsap.context(() => {
    gsap.fromTo(
      stageEl.value,
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: { trigger: sectionEl.value, start: 'top 80%' },
      },
    )

    mediaQueries = gsap.matchMedia()
    mediaQueries.add(
      {
        isDesktop: '(min-width: 1024px)',
        isTablet: '(min-width: 768px) and (max-width: 1023.98px)',
        isMobile: '(max-width: 767.98px)',
      },
      (self) => {
        const { isDesktop, isTablet } = self.conditions as Record<string, boolean>
        const distance = isDesktop ? 760 : isTablet ? 600 : 460
        // No retrato o contain já ocupa toda a largura: um push-in curto dá presença
        // ao produto sem cortar nenhuma peça da vista explodida.
        const zoom = isDesktop || isTablet ? { from: 0.95, to: 1.01 } : { from: 1, to: 1.06 }
        const playZoom = zoom.from * 0.87

        const timeline = gsap.timeline({
          defaults: { ease: 'none' },
          onUpdate: render,
          scrollTrigger: {
            trigger: sectionEl.value,
            start: 'top top',
            end: `+=${distance}%`,
            scrub: 0.5,
            pin: pinEl.value,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        // 0–4% montada · 4–29% abrindo · 29–35% explodida · 35–60% fechando ·
        // 60–67% transição escura · 67–94% tela ligando e dando play · 94–100% CTA.
        timeline.to(playhead, { frame: openLastIndex, duration: 0.25 }, 0.04)
        timeline.to(playhead, { frame: closeLastIndex, duration: 0.25 }, 0.35)
        timeline.to(playhead, { frame: lastIndex, duration: 0.27 }, 0.67)
        timeline.fromTo(
          view,
          { zoom: zoom.from, y: 6, shade: 0 },
          { zoom: zoom.to, y: -6, duration: 0.25 },
          0.04,
        )
        timeline.to(view, { zoom: zoom.from, y: 6, duration: 0.25 }, 0.35)
        timeline.to(view, { shade: 0.94, duration: 0.04, ease: 'power2.in' }, 0.62)
        timeline.to(view, { zoom: playZoom, y: 18, duration: 0.01 }, 0.66)
        timeline.to(view, { shade: 0, duration: 0.05, ease: 'power2.out' }, 0.67)
        timeline.to(ctaScrimEl.value, { autoAlpha: 1, duration: 0.05 }, 0.72)
        // Sustenta o vídeo no aparelho até o fim da área fixada e garante que a
        // timeline tenha exatamente 100% de duração.
        timeline.to(view, { zoom: playZoom, y: 18, duration: 0.06 }, 0.94)

        chapters.forEach((chapter, index) => {
          const el = chapterEls[index]
          if (!el) return
          timeline.fromTo(
            el,
            { autoAlpha: 0, y: 24, scale: 0.98 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.05, ease: 'power2.out' },
            chapter.in,
          )
          if (chapter.out !== null) {
            timeline.to(el, { autoAlpha: 0, y: -16, duration: 0.04, ease: 'power2.in' }, chapter.out - 0.04)
          }
        })
      },
    )
  }, sectionEl.value ?? undefined)
}

function teardown() {
  aborted = true
  mediaQueries?.revert()
  mediaQueries = undefined
  gsapContext?.revert()
  gsapContext = undefined
  detachRefresh?.()
  detachRefresh = undefined
  intersection?.disconnect()
  intersection = undefined
  stageResize?.disconnect()
  stageResize = undefined
  teardownFrames.fill(null)
  playFrames.fill(null)
  drawnImage = null
  context2d = null
  backdrop2d = null
}

onMounted(async () => {
  if (!supportsExperience()) return

  cinematic.value = true
  await nextTick()

  if (!setupCanvas()) {
    teardown()
    aborted = false
    cinematic.value = false
    return
  }

  try {
    await setupMotion()
  } catch {
    teardown()
    aborted = false
    cinematic.value = false
  }
})

onBeforeUnmount(teardown)
</script>

<template>
  <section id="tecnologia" ref="sectionEl" class="relative bg-ink-950" aria-labelledby="tecnologia-titulo">
    <div v-if="cinematic" ref="pinEl" class="relative h-[100svh] w-full overflow-hidden">
      <div ref="stageEl" class="absolute inset-0" :style="stageStyle">
        <canvas ref="canvasEl" class="block size-full" role="img" :aria-label="sequenceAlt"></canvas>
      </div>

      <div class="pointer-events-none absolute inset-0 z-[1]" :style="glowStyle" aria-hidden="true"></div>
      <div
        ref="ctaScrimEl"
        class="pointer-events-none absolute inset-0 z-[2] hidden opacity-0 lg:block"
        style="background: linear-gradient(90deg, rgba(9, 10, 12, 0.9) 0%, rgba(9, 10, 12, 0.68) 28%, rgba(9, 10, 12, 0) 62%)"
        aria-hidden="true"
      ></div>
      <div
        class="pointer-events-none absolute inset-x-0 top-0 z-[2] h-24 bg-gradient-to-b from-ink-950 to-transparent"
        aria-hidden="true"
      ></div>
      <div
        class="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-32 bg-gradient-to-t from-ink-950 via-ink-950/70 to-transparent"
        aria-hidden="true"
      ></div>

      <div
        class="absolute inset-0 z-10 flex items-end pb-[max(7rem,calc(5.5rem+env(safe-area-inset-bottom)))] lg:pb-0 lg:items-center"
      >
        <div class="container">
          <div class="grid max-w-xl pe-20 lg:max-w-[26rem] lg:pe-0">
            <article
              v-for="(chapter, index) in chapters"
              :key="chapter.title"
              :ref="(el) => setChapterEl(el, index)"
              class="col-start-1 row-start-1 self-end lg:self-center"
            >
              <p v-if="chapter.eyebrow" class="eyebrow">{{ chapter.eyebrow }}</p>
              <component
                :is="index === 0 ? 'h2' : 'h3'"
                :id="index === 0 ? 'tecnologia-titulo' : undefined"
                class="h-display mt-3 text-3xl sm:text-4xl lg:text-5xl"
              >
                {{ chapter.title }}
              </component>
              <p v-if="chapter.text" class="mt-4 text-base text-fog sm:text-lg">{{ chapter.text }}</p>
              <WhatsAppButton v-if="chapter.cta" class="mt-6" :message="messages.hero">
                {{ chapter.cta }}
              </WhatsAppButton>
            </article>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="section-y">
      <div class="container grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <p class="eyebrow">{{ chapters[0].eyebrow }}</p>
          <h2 id="tecnologia-titulo" class="h-display mt-3 text-4xl sm:text-5xl">{{ chapters[0].title }}</h2>
          <p class="mt-5 text-lg text-fog">{{ chapters[0].text }}</p>

          <ul class="mt-8 space-y-5">
            <li v-for="chapter in chapters.slice(1, 4)" :key="chapter.title">
              <h3 class="font-display text-xl font-semibold uppercase tracking-wider text-white">
                {{ chapter.title }}
              </h3>
              <p class="mt-1 text-fog">{{ chapter.text }}</p>
            </li>
          </ul>

          <p class="h-display mt-8 text-2xl sm:text-3xl">{{ chapters[4].title }}</p>
          <WhatsAppButton class="mt-4" :message="messages.hero">{{ chapters[4].cta }}</WhatsAppButton>
        </div>

        <img
          :src="stillSrc"
          :srcset="stillSrcset"
          sizes="(min-width: 1024px) 40vw, 100vw"
          :width="lg.width"
          :height="lg.height"
          :alt="sequenceAlt"
          loading="lazy"
          decoding="async"
          class="w-full rounded-card border border-ink-700 bg-ink-900"
        />
      </div>
    </div>
  </section>
</template>
