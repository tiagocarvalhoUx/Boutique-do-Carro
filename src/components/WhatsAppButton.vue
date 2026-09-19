<script setup lang="ts">
import { MessageCircle } from 'lucide-vue-next'
import { whatsappLink } from '../lib/whatsapp'

withDefaults(defineProps<{ message: string; variant?: 'primary' | 'ghost' }>(), { variant: 'primary' })
</script>

<template>
  <a
    :href="whatsappLink(message)"
    :class="variant === 'primary' ? 'btn-primary' : 'btn-ghost'"
    target="_blank"
    rel="noopener noreferrer"
  >
    <MessageCircle :size="20" aria-hidden="true" />
    <slot />
  </a>
</template>
