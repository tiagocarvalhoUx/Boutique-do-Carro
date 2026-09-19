<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import config from '../content/hu3d-layers.json'

const [aspectW, aspectH] = config.aspect
const ratio = aspectW / aspectH

const layers = config.layers.map((l) => ({
  ...l,
  style: {
    clipPath: `inset(${l.y}% ${100 - l.x - l.w}% ${100 - l.y - l.h}% ${l.x}% round ${l.r}% / ${(l.r * ratio).toFixed(2)}%)`,
    transformOrigin: `${l.x + l.w / 2}% ${l.y + l.h / 2}%`,
  },
}))

const root = ref<HTMLElement | null>(null)
const enter = ref<HTMLElement | null>(null)
const floater = ref<HTMLElement | null>(null)
const tilt = ref<HTMLElement | null>(null)
const glare = ref<HTMLElement | null>(null)
const layerEls = ref<HTMLElement[]>([])

let cleanup: (() => void) | undefined
let fallbackTimer: ReturnType<typeof setTimeout> | undefined

onMounted(async () => {
  const el = root.value
  if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return
  fallbackTimer = setTimeout(() => el.classList.add('hu3d-ready'), 2500)

  try {
    const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
    gsap.registerPlugin(ScrollTrigger)
    clearTimeout(fallbackTimer)

    let removeListeners: (() => void) | undefined
    const ctx = gsap.context(() => {
      const items = layerEls.value
      const depths = layers.map((l) => l.depth)
      const hasMouse = matchMedia('(hover: hover) and (pointer: fine)').matches
      let entered = false
      let visible = true

      gsap.set(items, { z: (i: number) => depths[i], autoAlpha: 0, y: 14, scale: 0.94 })
      gsap.set(enter.value, { rotationY: -38, z: -220 })
      gsap.set(root.value, { autoAlpha: 0 })
      el.classList.add('hu3d-ready')

      const bob = gsap.to(floater.value, {
        y: -9,
        rotationZ: 0.35,
        duration: 3.4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        paused: true,
      })

      const intro = gsap.timeline({
        paused: true,
        onComplete: () => {
          entered = true
          if (visible) bob.play()
        },
      })
      intro
        .to(root.value, { autoAlpha: 1, duration: 0.5, ease: 'power2.out' }, 0)
        .to(enter.value, { rotationY: 0, z: 0, duration: 1.4, ease: 'power3.out' }, 0)
        .to(items, { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, ease: 'back.out(1.5)', stagger: 0.11 }, 0.55)
        .to(glare.value, { opacity: 0.55, duration: 0.9, ease: 'power1.out' }, 1.2)

      ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => intro.play() })
      ScrollTrigger.create({
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => {
          visible = self.isActive
          if (!entered) return
          if (visible) bob.resume()
          else bob.pause()
        },
      })

      if (!hasMouse) return

      const area = el.closest('section') ?? el
      const rotY = gsap.quickTo(tilt.value, 'rotationY', { duration: 0.7, ease: 'power3.out' })
      const rotX = gsap.quickTo(tilt.value, 'rotationX', { duration: 0.7, ease: 'power3.out' })
      const moveX = items.map((l) => gsap.quickTo(l, 'x', { duration: 0.9, ease: 'power3.out' }))
      const moveY = items.map((l) => gsap.quickTo(l, 'y', { duration: 0.9, ease: 'power3.out' }))
      const shine = { gx: 50, gy: 30, sx: 50 }
      const paintShine = () => {
        glare.value?.style.setProperty('--gx', `${shine.gx}%`)
        glare.value?.style.setProperty('--gy', `${shine.gy}%`)
        glare.value?.style.setProperty('--sx', `${shine.sx}%`)
      }
      paintShine()

      const clamp = (v: number) => Math.max(-1, Math.min(1, v))
      const aim = (nx: number, ny: number, glow: number) => {
        rotY(nx * 8)
        rotX(-ny * 6)
        items.forEach((_, i) => {
          moveX[i](nx * depths[i] * 0.1)
          moveY[i](ny * depths[i] * 0.1)
        })
        gsap.to(shine, { gx: 50 + nx * 42, gy: 50 + ny * 42, sx: 50 + nx * 38, duration: 0.5, ease: 'power2.out', overwrite: true, onUpdate: paintShine })
        gsap.to(glare.value, { opacity: glow, duration: 0.4, overwrite: 'auto' })
      }

      const onMove = (e: Event) => {
        const p = e as PointerEvent
        if (!entered || p.pointerType !== 'mouse') return
        const r = el.getBoundingClientRect()
        aim(clamp((p.clientX - (r.left + r.width / 2)) / (r.width * 0.75)), clamp((p.clientY - (r.top + r.height / 2)) / (r.height * 0.75)), 0.9)
      }
      const onLeave = () => {
        if (entered) aim(0, 0, 0.55)
      }

      area.addEventListener('pointermove', onMove, { passive: true })
      area.addEventListener('pointerleave', onLeave)
      removeListeners = () => {
        area.removeEventListener('pointermove', onMove)
        area.removeEventListener('pointerleave', onLeave)
      }
    }, el)

    cleanup = () => {
      removeListeners?.()
      ctx.revert()
    }
  } catch {
    clearTimeout(fallbackTimer)
    el.classList.add('hu3d-ready')
  }
})

onBeforeUnmount(() => {
  clearTimeout(fallbackTimer)
  cleanup?.()
})
</script>

<template>
  <div ref="root" class="hu3d relative mx-auto w-full max-w-lg">
    <div ref="enter" class="hu3d-stage">
      <div ref="floater" class="hu3d-stage">
        <div
          ref="tilt"
          class="hu3d-stage relative rounded-card shadow-glow"
          :style="{ aspectRatio: `${aspectW} / ${aspectH}` }"
        >
          <img
            src="/hero-multimidia-base-1200.webp"
            srcset="/hero-multimidia-base-640.webp 640w, /hero-multimidia-base-1200.webp 1200w"
            sizes="(min-width: 1024px) 512px, 92vw"
            :width="aspectW"
            :height="aspectH"
            alt="Central multimídia com tela touchscreen mostrando Apple CarPlay, Android Auto e câmera de ré"
            loading="lazy"
            decoding="async"
            draggable="false"
            class="absolute inset-0 size-full rounded-card ring-1 ring-ink-700"
          />
          <div
            v-for="(layer, i) in layers"
            :key="layer.id"
            :ref="(el) => { if (el) layerEls[i] = el as HTMLElement }"
            class="hu3d-layer absolute inset-0"
            :style="layer.style"
            aria-hidden="true"
          >
            <img
              src="/hero-multimidia-1200.webp"
              srcset="/hero-multimidia-640.webp 640w, /hero-multimidia-1200.webp 1200w"
              sizes="(min-width: 1024px) 512px, 92vw"
              :width="aspectW"
              :height="aspectH"
              alt=""
              loading="lazy"
              decoding="async"
              draggable="false"
              class="size-full"
            />
          </div>
          <div ref="glare" class="hu3d-glare pointer-events-none absolute inset-[3%] rounded-card" aria-hidden="true"></div>
        </div>
      </div>
    </div>
    <slot />
  </div>
</template>

<style scoped>
.hu3d {
  perspective: 1100px;
}
.hu3d-stage {
  transform-style: preserve-3d;
}
.hu3d-layer {
  pointer-events: none;
  will-change: transform, opacity;
}
.hu3d-glare {
  transform: translateZ(70px);
  opacity: 0.55;
  background:
    radial-gradient(ellipse 45% 55% at var(--gx, 50%) var(--gy, 30%), rgba(255, 255, 255, 0.2), transparent 62%),
    linear-gradient(
      115deg,
      transparent calc(var(--sx, 50%) - 14%),
      rgba(255, 255, 255, 0.09) var(--sx, 50%),
      transparent calc(var(--sx, 50%) + 14%)
    );
}
</style>
