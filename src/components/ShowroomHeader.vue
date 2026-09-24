<script setup lang="ts">
import { ref } from 'vue'
import { ArrowRight, Menu, MessageCircle, X } from 'lucide-vue-next'
import { nav } from '../content/site'
import { messages, whatsappLink } from '../lib/whatsapp'

const open = ref(false)
</script>

<template>
  <header class="showroom-header">
    <div class="showroom-container showroom-header__inner">
      <a href="#topo" class="showroom-brand" aria-label="Boutique do Carro — início">
        <img src="/img/showroom/logo.webp" width="346" height="112" alt="Boutique do Carro — Som e Acessórios" fetchpriority="high" />
      </a>

      <nav class="showroom-nav" aria-label="Navegação principal">
        <a v-for="item in nav" :key="item.href" :href="item.href">{{ item.label }}</a>
      </nav>

      <a
        :href="whatsappLink(messages.floating)"
        class="showroom-button showroom-button--primary showroom-header__cta"
        target="_blank"
        rel="noopener noreferrer"
      >
        <MessageCircle :size="21" aria-hidden="true" />
        <span>Orçamento</span>
        <ArrowRight :size="19" aria-hidden="true" />
      </a>

      <button
        type="button"
        class="showroom-menu-button"
        :aria-expanded="open"
        aria-controls="menu-mobile"
        :aria-label="open ? 'Fechar menu' : 'Abrir menu'"
        @click="open = !open"
      >
        <X v-if="open" :size="24" aria-hidden="true" />
        <Menu v-else :size="24" aria-hidden="true" />
      </button>
    </div>

    <nav v-if="open" id="menu-mobile" class="showroom-mobile-nav" aria-label="Navegação móvel">
      <a v-for="item in nav" :key="item.href" :href="item.href" @click="open = false">{{ item.label }}</a>
      <a :href="whatsappLink(messages.floating)" target="_blank" rel="noopener noreferrer">Pedir orçamento</a>
    </nav>
  </header>
</template>

<style scoped>
.showroom-header {
  position: relative;
  z-index: 40;
  height: 74px;
  border-bottom: 1px solid rgba(74, 103, 128, 0.34);
  background: rgba(4, 13, 22, 0.98);
}

.showroom-header__inner {
  height: 100%;
  display: grid;
  grid-template-columns: minmax(190px, 1fr) auto minmax(250px, 1fr);
  align-items: center;
  gap: 34px;
}

.showroom-brand {
  display: inline-flex;
  width: 218px;
  min-height: 44px;
  align-items: center;
}

.showroom-brand img {
  width: 100%;
  height: auto;
}

.showroom-nav {
  display: flex;
  align-items: center;
  gap: clamp(28px, 4vw, 64px);
}

.showroom-nav a,
.showroom-mobile-nav a {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  color: #f8fafc;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  transition: color 180ms ease;
}

.showroom-nav a:hover {
  color: var(--showroom-yellow);
}

.showroom-header__cta {
  justify-self: end;
  min-width: 190px;
}

.showroom-menu-button {
  display: none;
  width: 46px;
  height: 46px;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--showroom-line);
  border-radius: 6px;
  color: white;
}

.showroom-mobile-nav {
  position: absolute;
  inset: 74px 0 auto;
  display: grid;
  gap: 1px;
  padding: 10px 20px 18px;
  border-bottom: 1px solid var(--showroom-line);
  background: #06111b;
}

.showroom-mobile-nav a {
  display: flex;
  min-height: 48px;
  align-items: center;
  border-bottom: 1px solid rgba(74, 103, 128, 0.24);
}

@media (max-width: 900px) {
  .showroom-header__inner {
    grid-template-columns: 1fr auto;
  }

  .showroom-nav,
  .showroom-header__cta {
    display: none;
  }

  .showroom-menu-button {
    display: inline-flex;
    position: absolute;
    top: 14px;
    right: 20px;
    z-index: 2;
  }
}

@media (max-width: 560px) {
  .showroom-brand {
    width: 178px;
  }
}
</style>
