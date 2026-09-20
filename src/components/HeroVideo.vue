<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Pause, Play } from 'lucide-vue-next'

const video = ref<HTMLVideoElement | null>(null)
const playing = ref(false)
let userPaused = false
let observer: IntersectionObserver | undefined

const canAutoplay = () => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
  return !reduced && !saveData
}

function start() {
  video.value?.play().catch(() => {
    playing.value = false
  })
}

function toggle() {
  const el = video.value
  if (!el) return
  if (el.paused) {
    userPaused = false
    start()
  } else {
    userPaused = true
    el.pause()
  }
}

onMounted(() => {
  const el = video.value
  if (!el) return
  el.addEventListener('play', () => (playing.value = true))
  el.addEventListener('pause', () => (playing.value = false))
  if (!canAutoplay()) {
    userPaused = true
    return
  }
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        if (!userPaused) start()
      } else {
        el.pause()
      }
    },
    { threshold: 0.25 },
  )
  observer.observe(el)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div class="relative mx-auto w-full max-w-lg">
    <div class="relative aspect-video overflow-hidden rounded-card border border-ink-700 bg-ink-900 shadow-glow">
      <video
        ref="video"
        class="size-full object-cover"
        poster="/video/central-poster.webp"
        width="1024"
        height="576"
        muted
        loop
        playsinline
        preload="none"
        aria-label="Vídeo: uma central multimídia se montando peça por peça e um carro dirigindo por uma avenida iluminada por neon"
      >
        <source src="/video/central-1024.mp4" type="video/mp4" />
      </video>
      <button
        type="button"
        class="absolute right-3 top-3 grid size-11 place-items-center rounded-full border border-ink-700 bg-ink-950/70 text-white backdrop-blur-sm transition-colors duration-base hover:border-brand hover:text-brand"
        :aria-label="playing ? 'Pausar vídeo' : 'Reproduzir vídeo'"
        @click="toggle"
      >
        <Pause v-if="playing" :size="20" aria-hidden="true" />
        <Play v-else :size="20" aria-hidden="true" />
      </button>
    </div>
    <slot />
  </div>
</template>
