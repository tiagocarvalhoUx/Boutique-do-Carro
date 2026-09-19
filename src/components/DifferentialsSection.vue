<script setup lang="ts">
import { ShieldCheck, CreditCard, MessageCircle, Truck, type LucideIcon } from 'lucide-vue-next'

interface Differential {
  icon: LucideIcon
  title: string
  text: string
}

const items: Differential[] = [
  { icon: ShieldCheck, title: '2 anos de garantia', text: 'Nas instalações de central multimídia.' },
  { icon: CreditCard, title: 'Até 4x sem juros', text: 'Parcelamento claro, sem taxa escondida.' },
  { icon: MessageCircle, title: 'Atendimento no WhatsApp', text: 'Mande o modelo do carro e receba o orçamento.' },
  { icon: Truck, title: 'Delivery', text: 'Compre sem sair de casa.' },
]
</script>

<template>
  <section id="diferenciais" class="section-y">
    <div class="container">
      <p class="eyebrow">Por que a Boutique do Carro</p>
      <h2 class="h-display mt-3 max-w-3xl text-4xl sm:text-5xl">Sem letra miúda. Sem susto depois.</h2>

      <ul class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <li v-for="item in items" :key="item.title" class="card p-6">
          <component :is="item.icon" :size="36" class="text-brand" aria-hidden="true" />
          <h3 class="h-display mt-5 text-3xl">{{ item.title }}</h3>
          <p class="mt-2 text-fog">{{ item.text }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>
