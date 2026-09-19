<script setup lang="ts">
import { nav } from '../content/site'
import { messages } from '../lib/whatsapp'
import WhatsAppButton from './WhatsAppButton.vue'
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-ink-700/60 bg-ink-950/90 backdrop-blur">
    <div class="container flex h-16 items-center justify-between gap-3">
      <a href="#topo" class="flex min-h-[44px] items-center gap-2.5 leading-none">
        <img src="/logo.webp" width="44" height="44" alt="" class="size-10 shrink-0 sm:size-11" />
        <span>
          <span class="block whitespace-nowrap font-display text-lg font-extrabold uppercase tracking-tight text-white sm:text-2xl">
            Boutique <span class="text-brand">do Carro</span>
          </span>
          <span class="block font-display text-xs font-semibold uppercase tracking-[0.14em] text-fog sm:tracking-[0.2em]">
            Som e Acessórios
          </span>
        </span>
      </a>

      <nav aria-label="Principal" class="hidden gap-8 lg:flex">
        <a
          v-for="item in nav"
          :key="item.href"
          :href="item.href"
          class="py-3 text-sm font-medium text-fog transition-colors duration-base hover:text-brand"
        >
          {{ item.label }}
        </a>
      </nav>

      <WhatsAppButton :message="messages.floating" class="!min-h-[44px] whitespace-nowrap !px-4 !py-2 text-sm sm:!px-5">
        <span class="sm:hidden">Orçamento</span><span class="hidden sm:inline">Pedir orçamento</span>
      </WhatsAppButton>
    </div>
  </header>
</template>
