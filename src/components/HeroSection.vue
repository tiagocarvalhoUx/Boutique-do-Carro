<script setup lang="ts">
import { ShieldCheck, ArrowDown } from 'lucide-vue-next'
import { offer, business } from '../content/site'
import { messages } from '../lib/whatsapp'
import WhatsAppButton from './WhatsAppButton.vue'
import HeadUnit3D from './HeadUnit3D.vue'
</script>

<template>
  <section id="topo" class="stripes relative overflow-hidden">
    <div class="container grid items-center gap-10 py-14 md:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:py-24">
      <div>
        <p class="eyebrow rise">Multimídia · LED · Insulfilm e PPF · Som</p>

        <h1 class="h-display rise rise-2 mt-4 text-[2.6rem] sm:text-6xl lg:text-[4.25rem]">
          Central multimídia em Fortaleza com
          <span class="text-brand">2 anos de garantia</span>, a partir de
          <span class="whitespace-nowrap text-brand">{{ offer.priceFrom }}</span>
          {{ offer.installments }}
        </h1>

        <p class="rise rise-3 mt-6 max-w-xl text-lg text-fog">
          Você já viu vídeo de central multimídia travando ou instalação que estraga a fiação. Aqui não.
          Garantia por escrito, preço fechado e instalação especializada.
        </p>

        <div class="rise rise-3 mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <WhatsAppButton :message="messages.hero">Peça um orçamento sem compromisso</WhatsAppButton>
          <a href="#servicos" class="btn-ghost">
            Conhecer os serviços
            <ArrowDown :size="18" aria-hidden="true" />
          </a>
        </div>

        <p class="mt-6 pr-16 text-sm text-fog sm:pr-0">
          Câmera de ré já instalada · Loja física na {{ business.streetAddress }} · {{ business.phoneDisplay }}
        </p>
      </div>

      <HeadUnit3D>
        <div
          class="absolute -bottom-4 -left-2 z-10 flex items-center gap-3 rounded-card border border-brand/40 bg-ink-900 px-4 py-3 shadow-glow sm:-left-6"
        >
          <ShieldCheck :size="34" class="shrink-0 text-brand" aria-hidden="true" />
          <div class="leading-tight">
            <p class="font-display text-3xl font-extrabold uppercase text-brand">2 anos</p>
            <p class="text-xs font-medium uppercase tracking-wider text-fog">de garantia na instalação</p>
          </div>
        </div>
      </HeadUnit3D>
    </div>
  </section>
</template>
