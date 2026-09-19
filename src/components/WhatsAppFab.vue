<script setup lang="ts">
import { MessageCircle } from 'lucide-vue-next'
import { messages, whatsappLink } from '../lib/whatsapp'
</script>

<template>
  <a
    :href="whatsappLink(messages.floating)"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Falar com a Boutique do Carro no WhatsApp"
    class="fixed bottom-4 right-4 z-50 grid size-14 place-items-center rounded-full bg-success text-ink-950 shadow-lg shadow-black/50 transition-transform duration-base hover:scale-105 focus-visible:outline-white"
  >
    <MessageCircle :size="28" aria-hidden="true" />
  </a>
</template>
