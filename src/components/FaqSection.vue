<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'
import { faq } from '../content/faq'
import { messages } from '../lib/whatsapp'
import WhatsAppButton from './WhatsAppButton.vue'
</script>

<template>
  <section id="faq" class="section-y border-y border-ink-700/60 bg-ink-900">
    <div class="container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
      <div>
        <p class="eyebrow">Perguntas frequentes</p>
        <h2 class="h-display mt-3 text-4xl sm:text-5xl">Tire suas dúvidas antes de decidir</h2>
        <p class="mt-4 text-fog">Não achou a sua? A equipe responde direto no WhatsApp.</p>
        <div class="mt-6">
          <WhatsAppButton :message="messages.faq" variant="ghost">Falar com a equipe</WhatsAppButton>
        </div>
      </div>

      <div class="space-y-3">
        <details v-for="item in faq" :key="item.question" class="card group open:border-brand/50">
          <summary
            class="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold [&::-webkit-details-marker]:hidden"
          >
            {{ item.question }}
            <ChevronDown
              :size="22"
              class="shrink-0 text-brand transition-transform duration-base group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <p class="px-5 pb-5 text-fog">{{ item.answer }}</p>
        </details>
      </div>
    </div>
  </section>
</template>
