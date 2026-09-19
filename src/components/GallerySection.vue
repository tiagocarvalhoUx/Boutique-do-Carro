<script setup lang="ts">
import { ref } from 'vue'
import { ZoomIn } from 'lucide-vue-next'
import { gallery, galleryImage } from '../content/gallery'
import { messages } from '../lib/whatsapp'
import WhatsAppButton from './WhatsAppButton.vue'
import GalleryLightbox from './GalleryLightbox.vue'

const openIndex = ref<number | null>(null)
</script>

<template>
  <section id="trabalhos" class="section-y border-y border-ink-700/60 bg-ink-900">
    <div class="container">
      <p class="eyebrow">Trabalhos reais</p>
      <h2 class="h-display mt-3 max-w-3xl text-4xl sm:text-5xl">Confira o resultado dos nossos serviços</h2>
      <p class="mt-4 max-w-2xl text-fog">
        Centrais multimídia, PPF e películas. Toque em uma foto para ampliar e ver os detalhes.
      </p>

      <ul class="mt-12 columns-2 gap-3 sm:gap-4 lg:columns-3">
        <li v-for="(item, index) in gallery" :key="item.id" class="mb-3 break-inside-avoid sm:mb-4">
          <figure class="card group overflow-hidden transition-colors duration-base hover:border-brand/60">
            <button
              type="button"
              class="relative block w-full cursor-zoom-in overflow-hidden bg-ink-800 text-left"
              :aria-label="`Ampliar foto: ${item.service} — ${item.detail}`"
              aria-haspopup="dialog"
              @click="openIndex = index"
            >
              <img
                :src="galleryImage(item, 'thumb').src"
                :srcset="`${galleryImage(item, 'sm').src} ${galleryImage(item, 'sm').width}w, ${galleryImage(item, 'thumb').src} ${galleryImage(item, 'thumb').width}w`"
                sizes="(min-width: 1024px) 384px, 46vw"
                :width="galleryImage(item, 'thumb').width"
                :height="galleryImage(item, 'thumb').height"
                :alt="item.alt"
                loading="lazy"
                decoding="async"
                class="h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.07] motion-reduce:transition-none"
              />
              <span
                class="absolute right-2 top-2 grid size-9 place-items-center rounded-full bg-ink-950/80 text-white opacity-80 transition-all duration-base group-hover:scale-110 group-hover:bg-brand group-hover:text-ink-950 group-hover:opacity-100"
                aria-hidden="true"
              >
                <ZoomIn :size="18" />
              </span>
            </button>
            <figcaption class="p-3 sm:p-4">
              <p class="font-display text-lg font-semibold uppercase leading-tight tracking-wide text-white sm:text-xl">
                {{ item.service }}
              </p>
              <p class="mt-1 text-xs text-fog sm:text-sm">{{ item.detail }}</p>
            </figcaption>
          </figure>
        </li>
      </ul>

      <div class="mt-10 flex justify-center">
        <WhatsAppButton :message="messages.gallery">Quero um resultado assim no meu carro</WhatsAppButton>
      </div>
    </div>

    <GalleryLightbox v-model:index="openIndex" :items="gallery" />
  </section>
</template>
