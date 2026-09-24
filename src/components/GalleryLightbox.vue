<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-vue-next'
import { galleryImage, type GalleryItem } from '../content/gallery'
import { whatsappLink } from '../lib/whatsapp'

const props = defineProps<{ items: GalleryItem[]; index: number | null }>()
const emit = defineEmits<{ 'update:index': [value: number | null] }>()

const dialog = ref<HTMLDialogElement | null>(null)
const stage = ref<HTMLElement | null>(null)
const zoomed = ref(false)
const zoomWidth = ref(0)
let touchStartX = 0

const current = () => (props.index === null ? null : props.items[props.index])

watch(
  () => props.index,
  (value) => {
    zoomed.value = false
    const el = dialog.value
    if (!el) return
    if (value === null) {
      if (el.open) el.close()
      document.documentElement.classList.remove('overflow-hidden')
      return
    }
    if (!el.open) {
      el.showModal()
      document.documentElement.classList.add('overflow-hidden')
    }
    for (const step of [1, -1]) {
      const neighbor = props.items[(value + step + props.items.length) % props.items.length]
      new Image().src = galleryImage(neighbor, 'full').src
    }
  },
)

function close() {
  emit('update:index', null)
}

function go(step: number) {
  if (props.index === null) return
  emit('update:index', (props.index + step + props.items.length) % props.items.length)
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowRight') go(1)
  else if (event.key === 'ArrowLeft') go(-1)
}

async function toggleZoom(event: MouseEvent) {
  const box = stage.value
  const img = event.currentTarget as HTMLImageElement
  const rect = img.getBoundingClientRect()
  const ratioX = (event.clientX - rect.left) / rect.width
  const ratioY = (event.clientY - rect.top) / rect.height
  zoomed.value = !zoomed.value
  if (zoomed.value) zoomWidth.value = Math.max(rect.width * 1.4, Math.min(rect.width * 2.2, img.naturalWidth * 1.6))
  if (!zoomed.value || !box) return
  await nextTick()
  box.scrollLeft = ratioX * box.scrollWidth - box.clientWidth / 2
  box.scrollTop = ratioY * box.scrollHeight - box.clientHeight / 2
}

function onTouchStart(event: TouchEvent) {
  touchStartX = event.changedTouches[0].clientX
}

function onTouchEnd(event: TouchEvent) {
  if (zoomed.value) return
  const dx = event.changedTouches[0].clientX - touchStartX
  if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1)
}
</script>

<template>
  <dialog
    ref="dialog"
    aria-label="Galeria de trabalhos ampliada"
    class="lightbox m-0 h-dvh max-h-none w-screen max-w-none bg-ink-950/95 p-0 text-white backdrop:bg-black open:flex open:flex-col"
    @close="close"
    @keydown="onKeydown"
  >
    <template v-if="current()">
      <div class="flex shrink-0 items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <p class="text-sm font-medium text-fog" aria-live="polite">{{ (index ?? 0) + 1 }} / {{ items.length }}</p>
        <button
          type="button"
          class="grid size-11 place-items-center rounded-full border border-ink-700 bg-ink-900 transition-colors duration-base hover:border-brand hover:text-brand"
          aria-label="Fechar imagem ampliada"
          @click="close"
        >
          <X :size="22" aria-hidden="true" />
        </button>
      </div>

      <div class="relative flex min-h-0 flex-1 items-stretch">
        <button
          type="button"
          class="absolute left-2 top-1/2 z-10 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-ink-700 bg-ink-900/90 transition-colors duration-base hover:border-brand hover:text-brand sm:left-6"
          aria-label="Imagem anterior"
          @click="go(-1)"
        >
          <ChevronLeft :size="26" aria-hidden="true" />
        </button>

        <div
          ref="stage"
          class="min-w-0 flex-1 px-2 py-3 sm:px-20"
          :class="zoomed ? 'overflow-auto' : 'flex items-center justify-center overflow-hidden'"
          @click.self="zoomed || close()"
          @touchstart.passive="onTouchStart"
          @touchend.passive="onTouchEnd"
        >
          <img
            :key="current()!.id"
            :src="galleryImage(current()!, 'full').src"
            :width="galleryImage(current()!, 'full').width"
            :height="galleryImage(current()!, 'full').height"
            :alt="current()!.alt"
            decoding="async"
            class="lightbox-img select-none rounded-card"
            :class="
              zoomed
                ? 'mx-auto h-auto max-w-none cursor-zoom-out'
                : 'max-h-full max-w-full cursor-zoom-in object-contain'
            "
            :style="zoomed ? { width: zoomWidth + 'px' } : undefined"
            @click="toggleZoom"
          />
        </div>

        <button
          type="button"
          class="absolute right-2 top-1/2 z-10 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-ink-700 bg-ink-900/90 transition-colors duration-base hover:border-brand hover:text-brand sm:right-6"
          aria-label="Próxima imagem"
          @click="go(1)"
        >
          <ChevronRight :size="26" aria-hidden="true" />
        </button>
      </div>

      <div class="shrink-0 border-t border-ink-700/60 bg-ink-900 px-4 py-4 sm:px-6">
        <div class="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div aria-live="polite">
            <p class="font-display text-2xl font-semibold uppercase tracking-wide">{{ current()!.service }}</p>
            <p class="text-sm text-fog">{{ current()!.detail }}</p>
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <span class="inline-flex items-center gap-1.5 text-sm text-fog" aria-hidden="true">
              <component :is="zoomed ? ZoomOut : ZoomIn" :size="16" />
              {{ zoomed ? 'Toque para reduzir' : 'Toque na imagem para ampliar' }}
            </span>
            <a
              :href="whatsappLink(current()!.whatsappMessage)"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-primary !min-h-[44px] !py-2"
            >
              Pedir orçamento
            </a>
          </div>
        </div>
      </div>
    </template>
  </dialog>
</template>
