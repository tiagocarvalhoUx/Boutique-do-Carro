<script setup lang="ts">
import { MapPin, Phone, Clock, ExternalLink } from 'lucide-vue-next'
import { business, mapEmbedUrl, mapLinkUrl } from '../content/site'
import { messages } from '../lib/whatsapp'
import WhatsAppButton from './WhatsAppButton.vue'
</script>

<template>
  <section id="contato" class="section-y">
    <div class="container grid gap-10 lg:grid-cols-2 lg:gap-14">
      <div>
        <p class="eyebrow">Localização e contato</p>
        <h2 class="h-display mt-3 text-4xl sm:text-5xl">Venha conhecer a loja</h2>

        <address class="mt-8 space-y-6 not-italic">
          <div class="flex gap-4">
            <MapPin :size="24" class="mt-1 shrink-0 text-brand" aria-hidden="true" />
            <div>
              <p class="font-semibold">{{ business.streetAddress }}</p>
              <p class="text-fog">{{ business.neighborhood }}</p>
              <p class="text-fog">{{ business.city }}-{{ business.region }}, {{ business.postalCode }}</p>
              <a
                :href="mapLinkUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="mt-2 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
              >
                Abrir no Google Maps <ExternalLink :size="15" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div class="flex gap-4">
            <Phone :size="24" class="mt-1 shrink-0 text-brand" aria-hidden="true" />
            <div>
              <p class="text-sm text-fog">WhatsApp e telefone</p>
              <a :href="`tel:${business.phoneIntl}`" class="inline-flex min-h-[44px] items-center text-xl font-bold hover:text-brand">
                {{ business.phoneDisplay }}
              </a>
            </div>
          </div>

          <div class="flex gap-4">
            <Clock :size="24" class="mt-1 shrink-0 text-brand" aria-hidden="true" />
            <div>
              <p class="text-sm text-fog">Horário de atendimento</p>
              <p class="font-semibold">{{ business.hours ?? 'Confirme o horário pelo WhatsApp antes de vir' }}</p>
            </div>
          </div>
        </address>

        <div class="mt-8">
          <WhatsAppButton :message="messages.contact">Falar com a Boutique do Carro</WhatsAppButton>
        </div>
      </div>

      <div class="card min-h-[320px] overflow-hidden lg:min-h-full">
        <iframe
          :src="mapEmbedUrl"
          title="Mapa da Boutique do Carro — Av. Bezerra de Menezes, 1199, Fortaleza"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          class="size-full min-h-[320px] border-0"
          allowfullscreen
        />
      </div>
    </div>
  </section>
</template>
