<script setup lang="ts">
import { MonitorSmartphone, Lightbulb, ShieldCheck, Volume2, Check, type LucideIcon } from 'lucide-vue-next'
import { services, type ServiceIcon } from '../content/services'
import WhatsAppButton from './WhatsAppButton.vue'

const icons: Record<ServiceIcon, LucideIcon> = {
  multimidia: MonitorSmartphone,
  led: Lightbulb,
  protecao: ShieldCheck,
  som: Volume2,
}
</script>

<template>
  <section id="servicos" class="section-y">
    <div class="container">
      <p class="eyebrow">Serviços</p>
      <h2 class="h-display mt-3 max-w-3xl text-4xl sm:text-5xl">Tudo o que o seu carro precisa, num lugar só</h2>

      <div class="mt-12 grid gap-5 md:grid-cols-2">
        <article
          v-for="service in services"
          :id="service.id"
          :key="service.id"
          class="card group flex flex-col p-6 transition-colors duration-base hover:border-brand/60 sm:p-8"
        >
          <div class="flex items-center gap-3">
            <span class="grid size-12 place-items-center rounded-card bg-brand/10 text-brand">
              <component :is="icons[service.icon]" :size="26" aria-hidden="true" />
            </span>
            <h3 class="font-display text-xl font-semibold uppercase tracking-wider text-fog">{{ service.title }}</h3>
          </div>

          <p class="h-display mt-5 text-3xl sm:text-4xl">{{ service.headline }}</p>

          <ul class="mt-5 space-y-3 text-fog">
            <li v-for="bullet in service.bullets" :key="bullet" class="flex gap-3">
              <Check :size="20" class="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
              <span>{{ bullet }}</span>
            </li>
          </ul>

          <div class="mt-8 pt-2 md:mt-auto">
            <WhatsAppButton :message="service.whatsappMessage" variant="ghost" class="w-full sm:w-auto">
              {{ service.cta }}
            </WhatsAppButton>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
