<script setup lang="ts">
import SiteHeader from './components/SiteHeader.vue'
import CoverBanner from './components/CoverBanner.vue'
import HeroSection from './components/HeroSection.vue'
import ServicesSection from './components/ServicesSection.vue'
import GallerySection from './components/GallerySection.vue'
import DifferentialsSection from './components/DifferentialsSection.vue'
import FaqSection from './components/FaqSection.vue'
import ContactSection from './components/ContactSection.vue'
import SiteFooter from './components/SiteFooter.vue'
import WhatsAppFab from './components/WhatsAppFab.vue'
</script>

<template>
  <a
    href="#servicos"
    class="sr-only z-50 rounded-full bg-brand px-4 py-2 font-bold text-ink-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
  >
    Pular para o conteúdo
  </a>
  <SiteHeader />
  <main>
    <CoverBanner />
    <HeroSection />
    <ServicesSection />
    <GallerySection />
    <DifferentialsSection />
    <FaqSection />
    <ContactSection />
  </main>
  <SiteFooter />
  <WhatsAppFab />
</template>
