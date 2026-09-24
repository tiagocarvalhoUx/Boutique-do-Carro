<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { MessageCircle, Phone } from 'lucide-vue-next'
import { business } from '../content/site'
import { messages, whatsappLink } from '../lib/whatsapp'

// A página tem ~10.000px. Quem está no meio do scroll não deve precisar voltar ao
// topo para falar com a loja — mas no hero o CTA já existe, então este só entra
// depois que o hero sai da tela, para não competir com ele.
// Fica escondido no hero (que já tem CTA) e no rodapé (onde os contatos estão
// visíveis) — no rodapé ele ainda tapava o slogan no desktop.
const foraDoHero = ref(false)
const noRodape = ref(false)
const visivel = computed(() => foraDoHero.value && !noRodape.value)
const observers: IntersectionObserver[] = []

function vigiar(seletor: string, alvo: { value: boolean }, quandoVisivel: boolean) {
  const el = document.querySelector(seletor)
  if (!el) return
  const observer = new IntersectionObserver(
    ([entry]) => (alvo.value = entry.isIntersecting === quandoVisivel),
    { threshold: 0 },
  )
  observer.observe(el)
  observers.push(observer)
}

onMounted(() => {
  vigiar('#topo', foraDoHero, false)
  vigiar('.showroom-footer', noRodape, true)
  if (!observers.length) foraDoHero.value = true
})

onBeforeUnmount(() => observers.forEach((o) => o.disconnect()))
</script>

<template>
  <div class="showroom-cta" :class="{ 'showroom-cta--on': visivel }">
    <a
      :href="whatsappLink(messages.floating)"
      class="showroom-cta__whatsapp"
      target="_blank"
      rel="noopener noreferrer"
    >
      <MessageCircle :size="22" aria-hidden="true" />
      <span class="showroom-cta__label">Pedir orçamento</span>
      <span class="sr-only">Falar com a Boutique do Carro no WhatsApp</span>
    </a>
    <a :href="`tel:${business.phoneIntl}`" class="showroom-cta__phone">
      <Phone :size="20" aria-hidden="true" />
      <span class="showroom-cta__label">Ligar</span>
      <span class="sr-only">Ligar para {{ business.phoneDisplay }}</span>
    </a>
  </div>
</template>

<style scoped>
.showroom-cta {
  position: fixed;
  z-index: 60;
  display: flex;
  gap: 10px;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 220ms ease,
    transform 220ms ease,
    visibility 220ms;
}

.showroom-cta--on {
  opacity: 1;
  visibility: visible;
  transform: none;
}

.showroom-cta a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-height: 52px;
  border-radius: 999px;
  font-family: var(--showroom-display);
  font-size: 1.06rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  text-decoration: none;
  transition: background-color 180ms ease, border-color 180ms ease, color 180ms ease;
}

.showroom-cta__whatsapp {
  background: var(--showroom-yellow);
  color: #071019;
  box-shadow: 0 10px 30px -8px rgba(0, 0, 0, 0.75);
}

.showroom-cta__whatsapp:hover {
  background: var(--showroom-yellow-hover);
}

.showroom-cta__phone {
  border: 1px solid #d8dee4;
  background: rgba(4, 13, 22, 0.92);
  color: white;
  backdrop-filter: blur(6px);
}

.showroom-cta__phone:hover {
  border-color: var(--showroom-yellow);
  color: var(--showroom-yellow);
}

/* Celular: barra fixa no rodapé, os dois toques sempre alcançáveis com o polegar. */
@media (max-width: 767px) {
  .showroom-cta {
    right: 0;
    bottom: 0;
    left: 0;
    padding: 10px 14px calc(10px + env(safe-area-inset-bottom));
    background: linear-gradient(to top, var(--showroom-bg-deep) 62%, transparent);
    transform: translateY(14px);
  }

  .showroom-cta__whatsapp {
    flex: 1 1 auto;
  }

  .showroom-cta__phone {
    flex: 0 0 auto;
    padding: 0 20px;
  }
}

/* Desktop: botão flutuante, sem tapar conteúdo. */
@media (min-width: 768px) {
  .showroom-cta {
    right: 24px;
    bottom: 24px;
    flex-direction: column-reverse;
    align-items: flex-end;
    transform: translateY(10px);
  }

  .showroom-cta a {
    padding: 0 22px;
  }

  .showroom-cta__phone {
    min-height: 46px;
    font-size: 0.95rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .showroom-cta {
    transition: none;
    transform: none;
  }
}
</style>
