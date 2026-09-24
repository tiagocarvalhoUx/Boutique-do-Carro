<script setup lang="ts">
import {
  ArrowRight,
  Lightbulb,
  MessageCircle,
  Monitor,
  ShieldCheck,
  Tag,
  Volume2,
  Wrench,
  type LucideIcon,
} from 'lucide-vue-next'
import { messages, whatsappLink } from '../lib/whatsapp'

type Service = {
  title: string
  text: string
  image: string
  icon: LucideIcon
}

const services: Service[] = [
  {
    title: 'Multimídia',
    text: 'Conectividade e entretenimento em outro nível',
    image: '/img/showroom/servico-multimidia.webp',
    icon: Monitor,
  },
  {
    title: 'LED',
    text: 'Mais visibilidade e estilo no seu carro',
    image: '/img/showroom/servico-led.webp',
    icon: Lightbulb,
  },
  {
    title: 'Insulfilm e PPF',
    text: 'Conforto, privacidade e proteção real',
    image: '/img/showroom/servico-insulfilm.webp',
    icon: ShieldCheck,
  },
  {
    title: 'Som automotivo',
    text: 'Qualidade sonora que transforma viagens',
    image: '/img/showroom/servico-som.webp',
    icon: Volume2,
  },
]

const benefits = [
  { icon: ShieldCheck, title: '2 anos de garantia', text: 'Tranquilidade para você sempre' },
  { icon: Wrench, title: 'Instalação especializada', text: 'Equipe técnica qualificada' },
  { icon: Tag, title: 'Preço fechado', text: 'Sem surpresa, do jeito certo' },
]
</script>

<template>
  <section id="topo" class="showroom-hero" aria-labelledby="hero-title">
    <div id="conteudo" class="showroom-container showroom-hero__inner">
      <div class="showroom-hero__copy">
        <h1 id="hero-title">
          Central multimídia, som<br />
          e proteção <br />
          <span>para o seu carro em Fortaleza</span>
        </h1>
        <div class="showroom-hero__actions">
          <a
            :href="whatsappLink(messages.hero)"
            class="showroom-button showroom-button--primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle :size="20" aria-hidden="true" />
            Pedir orçamento
            <ArrowRight :size="18" aria-hidden="true" />
          </a>
          <a href="#trabalhos" class="showroom-button showroom-button--outline">
            Ver trabalhos
            <ArrowRight :size="18" aria-hidden="true" />
          </a>
        </div>
        <div class="showroom-hero__kicker" aria-label="Som, estilo, conforto e performance">
          <span></span> Som&nbsp;&nbsp;•&nbsp;&nbsp;Estilo&nbsp;&nbsp;•&nbsp;&nbsp;Conforto&nbsp;&nbsp;•&nbsp;&nbsp;Performance
        </div>
      </div>
    </div>
  </section>

  <section class="showroom-benefits" aria-label="Benefícios">
    <ul class="showroom-container showroom-benefits__grid">
      <li v-for="benefit in benefits" :key="benefit.title">
        <component :is="benefit.icon" :size="52" stroke-width="1.8" aria-hidden="true" />
        <div>
          <h2>{{ benefit.title }}</h2>
          <p>{{ benefit.text }}</p>
        </div>
      </li>
    </ul>
  </section>

  <section id="servicos" class="showroom-services showroom-rule-section" aria-labelledby="services-title">
    <div class="showroom-container">
      <div class="showroom-section-head">
        <div>
          <p class="showroom-eyebrow"><span></span>Nossos serviços</p>
          <h2 id="services-title" class="showroom-title">Acessórios que fazem a diferença</h2>
        </div>
        <a href="#contato" class="showroom-text-link">Ver todos os serviços <ArrowRight :size="18" /></a>
      </div>

      <div class="showroom-service-grid">
        <article v-for="service in services" :key="service.title" class="showroom-service-card">
          <img :src="service.image" width="570" height="164" :alt="service.title" loading="eager" />
          <div class="showroom-service-card__shade" aria-hidden="true"></div>
          <div class="showroom-service-card__content">
            <component :is="service.icon" :size="31" stroke-width="1.8" aria-hidden="true" />
            <div>
              <h3>{{ service.title }}</h3>
              <p>{{ service.text }}</p>
            </div>
            <span class="showroom-round-arrow" aria-hidden="true"><ArrowRight :size="18" /></span>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.showroom-hero {
  position: relative;
  min-height: 366px;
  overflow: hidden;
  border-bottom: 1px solid var(--showroom-line);
  background:
    linear-gradient(90deg, #06111b 0%, #06111b 36%, rgba(6, 17, 27, 0.88) 45%, rgba(6, 17, 27, 0.08) 68%),
    url('/img/showroom/hero-showroom.webp') right center / auto 100% no-repeat,
    #06111b;
}

.showroom-hero::after {
  content: '';
  position: absolute;
  inset: auto 0 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 196, 0, 0.7), transparent);
}

.showroom-hero__inner {
  position: relative;
  min-height: 366px;
  display: flex;
  align-items: center;
}

.showroom-hero__copy {
  position: relative;
  z-index: 2;
  width: min(520px, 47vw);
  padding: 28px 0 22px;
}

.showroom-hero h1 {
  margin: 0;
  color: #fff;
  font-family: var(--showroom-display);
  font-size: clamp(2.55rem, 3.5vw, 3.45rem);
  font-weight: 800;
  letter-spacing: -0.025em;
  line-height: 0.92;
  text-transform: uppercase;
  text-shadow: 0 2px 18px rgba(0, 0, 0, 0.48);
}

.showroom-hero h1 span {
  color: var(--showroom-yellow);
}

.showroom-hero__copy > p {
  max-width: 510px;
  margin-top: 18px;
  color: #d1d7dd;
  font-size: 0.96rem;
  line-height: 1.45;
}

.showroom-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 20px;
}

.showroom-hero__actions .showroom-button {
  min-width: 190px;
}

.showroom-hero__kicker {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 19px;
  color: #9da9b4;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.38em;
  text-transform: uppercase;
}

.showroom-hero__kicker span {
  width: 33px;
  height: 3px;
  flex: 0 0 auto;
  background: var(--showroom-yellow);
}


.showroom-benefits {
  border-bottom: 1px solid var(--showroom-line);
  background: #06111b;
}

.showroom-benefits__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  min-height: 96px;
}

.showroom-benefits li {
  display: grid;
  grid-template-columns: 62px 1fr;
  align-items: center;
  gap: 18px;
  padding: 17px clamp(24px, 4vw, 65px);
  border-right: 1px solid rgba(60, 87, 109, 0.42);
}

.showroom-benefits li:first-child {
  padding-left: 58px;
}

.showroom-benefits li:last-child {
  border-right: 0;
}

.showroom-benefits svg {
  color: var(--showroom-yellow);
}

.showroom-benefits h2 {
  max-width: 220px;
  color: white;
  font-family: var(--showroom-display);
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  line-height: 1;
  text-transform: uppercase;
}

.showroom-benefits p {
  margin-top: 6px;
  color: #8997a5;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.17em;
  line-height: 1.4;
  text-transform: uppercase;
}

.showroom-services {
  padding: 17px 0 16px;
}

.showroom-service-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-top: 10px;
}

.showroom-service-card {
  position: relative;
  min-height: 136px;
  overflow: hidden;
  border: 1px solid #385069;
  border-radius: 3px;
  background: #08131e;
}

.showroom-service-card > img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.showroom-service-card__shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(2, 8, 14, 0.02) 18%, rgba(2, 8, 14, 0.3) 48%, rgba(2, 8, 14, 0.97) 100%);
}

.showroom-service-card__content {
  position: absolute;
  inset: auto 14px 12px;
  display: grid;
  grid-template-columns: 35px 1fr 34px;
  align-items: end;
  gap: 10px;
}

.showroom-service-card__content > svg {
  align-self: center;
  color: var(--showroom-yellow);
}

.showroom-service-card h3 {
  font-family: var(--showroom-display);
  font-size: 1.15rem;
  font-weight: 700;
  line-height: 1;
  text-transform: uppercase;
}

.showroom-service-card p {
  margin-top: 5px;
  color: #b9c3cc;
  font-size: 0.61rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  line-height: 1.35;
  text-transform: uppercase;
}

@media (max-width: 1050px) {
  .showroom-service-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .showroom-benefits li,
  .showroom-benefits li:first-child {
    padding-inline: 24px;
  }
}

@media (max-width: 760px) {
  .showroom-hero {
    min-height: 620px;
    background:
      linear-gradient(180deg, rgba(6, 17, 27, 0.08) 10%, rgba(6, 17, 27, 0.9) 42%, #06111b 50%),
      url('/img/showroom/hero-showroom.webp') 68% top / auto 50% no-repeat,
      #06111b;
  }

  .showroom-hero__inner {
    min-height: 620px;
    align-items: flex-end;
  }

  .showroom-hero__copy {
    width: 100%;
    padding-bottom: 30px;
  }


  .showroom-benefits__grid {
    grid-template-columns: 1fr;
  }

  .showroom-benefits li,
  .showroom-benefits li:first-child {
    border-right: 0;
    border-bottom: 1px solid rgba(60, 87, 109, 0.42);
  }
}

@media (max-width: 560px) {
  .showroom-hero h1 {
    font-size: 2.55rem;
  }

  .showroom-hero__actions {
    display: grid;
  }

  .showroom-hero__actions .showroom-button {
    width: 100%;
  }

  .showroom-hero__kicker {
    font-size: 0.52rem;
    letter-spacing: 0.22em;
  }

  .showroom-service-grid {
    grid-template-columns: 1fr;
  }

  .showroom-section-head {
    align-items: flex-start;
  }

  .showroom-text-link {
    display: none;
  }
}
</style>
