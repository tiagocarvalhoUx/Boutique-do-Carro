<script setup lang="ts">
import { business, fullAddress } from '../content/site'
import { messages } from '../lib/whatsapp'
import WhatsAppButton from './WhatsAppButton.vue'
</script>

<template>
  <footer class="border-t border-ink-700/60 bg-ink-900 pb-28 pt-14 md:pb-14">
    <div class="container grid gap-10 md:grid-cols-[1.2fr_1fr]">
      <div>
        <p class="h-display text-4xl sm:text-5xl">Pronto para transformar <span class="text-brand">seu carro?</span></p>
        <p class="mt-3 max-w-md text-fog">
          Envie o modelo, o ano e o serviço desejado. A equipe indica a solução compatível e prepara seu orçamento.
        </p>
        <div class="mt-6">
          <WhatsAppButton :message="messages.contact">Peça um orçamento no WhatsApp</WhatsAppButton>
        </div>
      </div>

      <div class="space-y-3 text-fog md:justify-self-end md:text-right">
        <div class="flex items-center gap-3 md:flex-row-reverse">
          <img src="/logo.webp" width="96" height="96" alt="Logotipo da Boutique do Carro" loading="lazy" class="size-20 sm:size-24" />
          <p class="font-display text-2xl font-extrabold uppercase text-white">
            Boutique <span class="text-brand">do Carro</span>
          </p>
        </div>
        <p>{{ fullAddress }}</p>
        <p>WhatsApp: {{ business.phoneDisplay }}</p>
        <a
          :href="business.instagramUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex min-h-[44px] items-center gap-2 font-semibold text-white hover:text-brand"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
          </svg>
          Instagram {{ business.instagramHandle }}
        </a>
      </div>
    </div>

    <p class="container mt-12 text-sm text-fog/70">© {{ new Date().getFullYear() }} {{ business.name }}. Todos os direitos reservados.</p>
  </footer>
</template>
