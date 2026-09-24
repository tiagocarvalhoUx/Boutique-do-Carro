<script setup lang="ts">
import { ref } from 'vue'
import {
  ArrowRight,
  ChevronRight,
  Instagram,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  Settings,
  ShieldCheck,
  Store,
  ZoomIn,
  Tag,
  UsersRound,
  Wrench,
  type LucideIcon,
} from 'lucide-vue-next'
import { business, mapLinkUrl } from '../content/site'
import { faq } from '../content/faq'
import { gallery, galleryImage } from '../content/gallery'
import { messages, whatsappLink } from '../lib/whatsapp'
import GalleryLightbox from './GalleryLightbox.vue'

// A seção mostra seis trabalhos; o lightbox navega exatamente esses seis.
const galeria = gallery.slice(0, 6)
const ampliada = ref<number | null>(null)

type Step = { number: string; icon: LucideIcon; title: string; text: string }
type Differential = { icon: LucideIcon; title: string; text: string }

const steps: Step[] = [
  { number: '01', icon: MessageCircle, title: 'Você conta o que precisa', text: 'Nossos especialistas entendem sua necessidade.' },
  { number: '02', icon: Settings, title: 'Montamos a melhor solução', text: 'Indicamos os acessórios ideais para o seu carro.' },
  { number: '03', icon: Wrench, title: 'Instalação com garantia', text: 'Equipe especializada e todo o suporte pós-venda.' },
]

const differentials: Differential[] = [
  { icon: ShieldCheck, title: 'Garantia de 2 anos', text: 'Tranquilidade em cada instalação.' },
  { icon: UsersRound, title: 'Equipe técnica especializada', text: 'Profissionais com experiência no mercado.' },
  { icon: Tag, title: 'Preço transparente', text: 'Sem surpresas, com orçamento claro e justo.' },
  { icon: Store, title: 'Loja em Fortaleza', text: 'Atendimento presencial e suporte sempre que precisar.' },
]

</script>

<template>
  <section id="trabalhos" class="showroom-work showroom-rule-section" aria-labelledby="work-title">
    <div class="showroom-container showroom-work__grid">
      <div class="showroom-work__copy">
        <p class="showroom-eyebrow"><span></span>Projetos que transformam</p>
        <h2 id="work-title" class="showroom-title showroom-title--large">Trabalhos reais</h2>
        <p>Confira alguns resultados de instalações que fizeram a diferença no dia a dia dos nossos clientes.</p>
        <a href="#galeria" class="showroom-button showroom-button--outline showroom-button--yellow">
          Ver todos os trabalhos <ArrowRight :size="18" />
        </a>
      </div>

      <ul class="showroom-work__thumbs">
        <li v-for="item in gallery.slice(0, 3)" :key="item.id">
          <img
            :src="galleryImage(item, 'thumb').src"
            :srcset="`${galleryImage(item, 'sm').src} ${galleryImage(item, 'sm').width}w, ${galleryImage(item, 'thumb').src} ${galleryImage(item, 'thumb').width}w`"
            sizes="(min-width: 900px) 300px, 33vw"
            :width="galleryImage(item, 'thumb').width"
            :height="galleryImage(item, 'thumb').height"
            :alt="item.alt"
            loading="lazy"
            decoding="async"
          />
        </li>
      </ul>

      <p class="showroom-work__side">A mesma<br />paixão,<br /><strong>mais</strong><br />tecnologia<span></span></p>
    </div>
  </section>

  <section class="showroom-steps showroom-rule-section" aria-labelledby="steps-title">
    <div class="showroom-container showroom-steps__layout">
      <div>
        <p class="showroom-eyebrow"><span></span>Passo a passo</p>
        <h2 id="steps-title" class="showroom-title showroom-title--large">Como funciona</h2>
      </div>
      <ol class="showroom-steps__list">
        <li v-for="(step, index) in steps" :key="step.number">
          <span class="showroom-step__number">{{ step.number }}</span>
          <component :is="step.icon" :size="45" stroke-width="1.8" aria-hidden="true" />
          <div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.text }}</p>
          </div>
          <ChevronRight v-if="index < steps.length - 1" class="showroom-step__arrow" :size="25" aria-hidden="true" />
        </li>
      </ol>
    </div>
  </section>

  <section id="diferenciais" class="showroom-differentials showroom-rule-section" aria-labelledby="differentials-title">
    <div class="showroom-differentials__car" aria-hidden="true"></div>
    <div class="showroom-container showroom-differentials__layout">
      <div class="showroom-differentials__copy">
        <p class="showroom-eyebrow"><span></span>Diferenciais</p>
        <h2 id="differentials-title" class="showroom-title showroom-title--large">Por que escolher <br />a Boutique do Carro</h2>
        <p>Mais que acessórios, entregamos experiência, segurança e confiança.</p>
      </div>
      <ul class="showroom-differentials__list">
        <li v-for="item in differentials" :key="item.title">
          <component :is="item.icon" :size="47" stroke-width="1.7" aria-hidden="true" />
          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
        </li>
      </ul>
    </div>
  </section>

  <section id="galeria" class="showroom-proof showroom-rule-section" aria-labelledby="gallery-title">
    <div class="showroom-container">
      <div class="showroom-section-head">
        <div>
          <p class="showroom-eyebrow"><span></span>Feito na loja</p>
          <h2 id="gallery-title" class="showroom-title showroom-title--large">Instalações que já entregamos</h2>
        </div>
        <a :href="business.instagramUrl" target="_blank" rel="noopener noreferrer" class="showroom-text-link">
          Ver mais no Instagram <ArrowRight :size="18" />
        </a>
      </div>

      <ul class="showroom-proof-grid">
        <li v-for="(item, index) in galeria" :key="item.id" class="showroom-proof-card">
          <button
            type="button"
            class="showroom-proof-card__zoom"
            :aria-label="`Ampliar: ${item.service} — ${item.detail}`"
            @click="ampliada = index"
          >
          <img
            :src="galleryImage(item, 'thumb').src"
            :srcset="`${galleryImage(item, 'sm').src} ${galleryImage(item, 'sm').width}w, ${galleryImage(item, 'thumb').src} ${galleryImage(item, 'thumb').width}w`"
            sizes="(min-width: 900px) 30vw, 100vw"
            :width="galleryImage(item, 'thumb').width"
            :height="galleryImage(item, 'thumb').height"
            :alt="item.alt"
            loading="lazy"
            decoding="async"
          />
            <span class="showroom-proof-card__hint" aria-hidden="true">
              <ZoomIn :size="17" /> Ampliar
            </span>
          </button>
          <div class="showroom-proof-card__body">
            <h3>{{ item.service }}</h3>
            <p>{{ item.detail }}</p>
            <a
              :href="whatsappLink(item.whatsappMessage)"
              target="_blank"
              rel="noopener noreferrer"
              class="showroom-proof-card__cta"
            >
              Quero no meu carro <ArrowRight :size="16" aria-hidden="true" />
            </a>
          </div>
        </li>
      </ul>

      <GalleryLightbox v-model:index="ampliada" :items="galeria" />
    </div>
  </section>

  <section id="faq" class="showroom-faq showroom-rule-section" aria-labelledby="faq-title">
    <div class="showroom-container showroom-faq__layout">
      <div class="showroom-faq__copy">
        <p class="showroom-eyebrow"><span></span>Perguntas e respostas</p>
        <h2 id="faq-title" class="showroom-title showroom-title--large">Dúvidas frequentes</h2>
        <p>Tire aqui as principais dúvidas sobre nossos serviços, garantia e atendimento.</p>
        <a :href="whatsappLink(messages.faq)" target="_blank" rel="noopener noreferrer" class="showroom-button showroom-button--outline showroom-button--yellow">
          Fale conosco <ArrowRight :size="18" />
        </a>
      </div>
      <div class="showroom-faq__items">
        <details v-for="item in faq" :key="item.question">
          <summary>{{ item.question }} <Plus :size="20" aria-hidden="true" /></summary>
          <p>{{ item.answer }}</p>
        </details>
      </div>
      <div class="showroom-faq__image" role="img" aria-label="Detalhe do interior premium de um veículo"></div>
    </div>
  </section>

  <section id="contato" class="showroom-contact showroom-rule-section" aria-labelledby="contact-title">
    <div class="showroom-contact__map" aria-hidden="true"></div>
    <div class="showroom-container showroom-contact__layout">
      <div class="showroom-contact__intro">
        <p class="showroom-eyebrow"><span></span>Venha nos visitar</p>
        <h2 id="contact-title" class="showroom-title showroom-title--large">Fale com a gente</h2>
        <p>Estamos prontos para atender você e encontrar a melhor solução para o seu carro.</p>
      </div>
      <address class="showroom-contact__details">
        <a :href="mapLinkUrl" target="_blank" rel="noopener noreferrer">
          <MapPin :size="28" aria-hidden="true" />
          <span><strong>{{ business.streetAddress }}</strong><small>{{ business.neighborhood }} · {{ business.city }}-{{ business.region }}</small></span>
        </a>
        <a :href="`tel:${business.phoneIntl}`">
          <Phone :size="27" aria-hidden="true" />
          <span><strong>{{ business.phoneDisplay }}</strong><small>Atendimento via WhatsApp</small></span>
        </a>
        <a :href="whatsappLink(messages.contact)" target="_blank" rel="noopener noreferrer" class="showroom-button showroom-button--primary">
          <MessageCircle :size="20" aria-hidden="true" /> Falar no WhatsApp <ArrowRight :size="18" />
        </a>
      </address>
    </div>
  </section>

  <footer class="showroom-footer">
    <div class="showroom-container showroom-footer__inner">
      <a href="#topo" class="showroom-footer__logo" aria-label="Voltar ao início">
        <img src="/img/showroom/logo.webp" width="346" height="112" alt="Boutique do Carro — Som e Acessórios" loading="lazy" />
      </a>
      <nav aria-label="Navegação do rodapé">
        <a href="#servicos">Serviços</a>
        <a href="#trabalhos">Trabalhos</a>
        <a href="#diferenciais">Garantia</a>
        <a href="#contato">Localização</a>
      </nav>
      <div class="showroom-footer__social">
        <a :href="business.instagramUrl" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram :size="21" /></a>
        <span>{{ business.instagramHandle }}</span>
      </div>
      <p class="showroom-footer__slogan">Seu carro.<br />Do seu jeito.</p>
    </div>
  </footer>
</template>

<style scoped>
.showroom-work {
  padding: 15px 0 14px;
}

.showroom-work__grid {
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr) 135px;
  align-items: center;
  gap: 22px;
}

.showroom-work__copy > p:last-of-type,
.showroom-differentials__copy > p:last-child,
.showroom-faq__copy > p:last-of-type,
.showroom-contact__intro > p:last-of-type {
  margin-top: 11px;
  color: var(--showroom-muted);
  font-size: 0.86rem;
  line-height: 1.45;
}

.showroom-work__copy .showroom-button,
.showroom-faq__copy .showroom-button {
  margin-top: 15px;
}

.showroom-work__thumbs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.showroom-work__thumbs li {
  overflow: hidden;
  border: 1px solid #385069;
  border-radius: 4px;
  background: #07111a;
}

/* As artes do cliente misturam quadrado e retrato:  mostra cada uma
   inteira, e o fundo escuro do card faz a sobra desaparecer. */
.showroom-work__thumbs img {
  display: block;
  width: 100%;
  height: 186px;
  object-fit: contain;
}

.showroom-work__side {
  color: #c6cfd8;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.26em;
  line-height: 1.55;
  text-transform: uppercase;
}

.showroom-work__side strong {
  color: white;
  font-size: 1.15rem;
}

.showroom-work__side span {
  display: block;
  width: 33px;
  height: 3px;
  margin-top: 13px;
  background: var(--showroom-yellow);
}

.showroom-steps {
  padding: 18px 0;
}

.showroom-steps__layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  align-items: center;
  gap: 32px;
}

.showroom-steps__list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.showroom-steps__list li {
  position: relative;
  display: grid;
  grid-template-columns: 34px 50px 1fr;
  align-items: start;
  gap: 10px;
  min-height: 80px;
  padding: 6px 34px 6px 0;
}

.showroom-step__number {
  font-family: var(--showroom-display);
  font-size: 1.65rem;
  font-weight: 700;
  line-height: 1;
}

.showroom-steps__list svg:not(.showroom-step__arrow) {
  color: var(--showroom-yellow);
}

.showroom-steps h3,
.showroom-differentials h3 {
  font-family: var(--showroom-display);
  font-size: 1.12rem;
  font-weight: 700;
  line-height: 1;
  text-transform: uppercase;
}

.showroom-steps__list p,
.showroom-differentials__list p {
  margin-top: 5px;
  color: var(--showroom-muted);
  font-size: 0.72rem;
  line-height: 1.35;
}

.showroom-step__arrow {
  position: absolute;
  top: 22px;
  right: 10px;
  color: var(--showroom-yellow);
}

.showroom-differentials {
  position: relative;
  min-height: 218px;
  overflow: hidden;
  padding: 30px 0;
}

.showroom-differentials__car {
  position: absolute;
  inset: 0 0 0 auto;
  width: 280px;
  background:
    linear-gradient(90deg, #06111b 0%, rgba(6, 17, 27, 0.18) 45%),
    url('/img/showroom/diferenciais-farol.webp') center / cover no-repeat;
}

.showroom-differentials__layout {
  position: relative;
  display: grid;
  grid-template-columns: 350px minmax(0, 1fr);
  gap: 36px;
}

.showroom-differentials__copy {
  padding-right: 26px;
  border-right: 1px solid rgba(60, 87, 109, 0.48);
}

.showroom-differentials__list {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  max-width: calc(100% - 180px);
}

.showroom-differentials__list li {
  padding: 8px 22px;
  border-right: 1px solid rgba(60, 87, 109, 0.48);
  text-align: center;
}

.showroom-differentials__list li:last-child {
  border-right: 0;
}

.showroom-differentials__list svg {
  margin: 0 auto 12px;
  color: var(--showroom-yellow);
}

.showroom-proof {
  padding: 17px 0 20px;
}

.showroom-proof-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 11px;
}

.showroom-proof-card {
  display: flex;
  overflow: hidden;
  flex-direction: column;
  border: 1px solid #385069;
  border-radius: 4px;
  background: rgba(5, 15, 24, 0.64);
}

.showroom-proof-card__zoom {
  position: relative;
  display: block;
  width: 100%;
  cursor: zoom-in;
  background: none;
}

.showroom-proof-card__hint {
  position: absolute;
  right: 10px;
  bottom: 10px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  border-radius: 999px;
  opacity: 0;
  background: rgba(4, 13, 22, 0.86);
  color: var(--showroom-yellow);
  font-family: var(--showroom-display);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  transition: opacity 180ms ease;
}

.showroom-proof-card__zoom:hover .showroom-proof-card__hint,
.showroom-proof-card__zoom:focus-visible .showroom-proof-card__hint {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .showroom-proof-card__hint {
    transition: none;
  }
}

.showroom-proof-card img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 1 / 1;
  object-fit: contain;
  background: #07111a;
}

.showroom-proof-card__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: 14px 16px 16px;
}

.showroom-proof-card__body h3 {
  font-size: 0.86rem;
  font-weight: 700;
}

.showroom-proof-card__body p {
  color: #8694a1;
  font-size: 0.7rem;
  line-height: 1.35;
}

.showroom-proof-card__cta {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 44px;
  margin-top: auto;
  padding-top: 8px;
  color: var(--showroom-yellow);
  font-family: var(--showroom-display);
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  transition: color 180ms ease;
}

.showroom-proof-card__cta:hover {
  color: var(--showroom-yellow-hover);
}

.showroom-faq {
  position: relative;
  min-height: 250px;
  overflow: hidden;
  padding: 18px 0;
}

.showroom-faq__layout {
  display: grid;
  grid-template-columns: 330px minmax(400px, 650px) 1fr;
  gap: 28px;
}

.showroom-faq__items {
  display: grid;
  align-content: start;
  gap: 6px;
}

.showroom-faq details {
  border: 1px solid #385069;
  border-radius: 3px;
  background: rgba(4, 13, 22, 0.76);
}

.showroom-faq summary {
  display: flex;
  min-height: 38px;
  cursor: pointer;
  list-style: none;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 8px 16px;
  color: #f3f5f7;
  font-size: 0.75rem;
  font-weight: 600;
}

.showroom-faq summary::-webkit-details-marker {
  display: none;
}

.showroom-faq details[open] summary svg {
  transform: rotate(45deg);
}

.showroom-faq details > p {
  padding: 0 16px 13px;
  color: var(--showroom-muted);
  font-size: 0.72rem;
  line-height: 1.45;
}

.showroom-faq__image {
  position: absolute;
  inset: 0 0 0 auto;
  width: 420px;
  background:
    linear-gradient(90deg, #06111b 0%, rgba(6, 17, 27, 0.08) 38%),
    url('/img/showroom/faq-interior.webp') center / cover no-repeat;
}

.showroom-contact {
  position: relative;
  min-height: 242px;
  overflow: hidden;
  padding: 26px 0;
}

.showroom-contact__map {
  position: absolute;
  inset: 0 0 0 320px;
  background:
    linear-gradient(90deg, #06111b 0%, rgba(6, 17, 27, 0.5) 30%, rgba(6, 17, 27, 0.08) 70%),
    url('/img/showroom/mapa.webp') right center / cover no-repeat;
}

.showroom-contact__layout {
  position: relative;
  display: grid;
  grid-template-columns: 330px 1fr;
  gap: 65px;
}

.showroom-contact__details {
  display: grid;
  align-content: start;
  gap: 12px;
  max-width: 400px;
  font-style: normal;
}

.showroom-contact__details > a:not(.showroom-button) {
  display: flex;
  min-height: 44px;
  align-items: center;
  gap: 15px;
  color: white;
}

.showroom-contact__details svg {
  flex: 0 0 auto;
  color: var(--showroom-yellow);
}

.showroom-contact__details strong,
.showroom-contact__details small {
  display: block;
}

.showroom-contact__details strong {
  font-family: var(--showroom-display);
  font-size: 1rem;
  text-transform: uppercase;
}

.showroom-contact__details small {
  margin-top: 2px;
  color: #a6b0ba;
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.showroom-contact__details .showroom-button {
  width: 270px;
  margin-top: 5px;
}

.showroom-footer {
  min-height: 202px;
  overflow: hidden;
  border-top: 1px solid var(--showroom-line);
  background: #06111b;
}

.showroom-footer__inner {
  position: relative;
  min-height: 202px;
  display: grid;
  grid-template-columns: 240px 1fr 330px 230px;
  align-items: center;
  gap: 34px;
}

.showroom-footer__logo img {
  width: 215px;
  height: auto;
}

.showroom-footer nav,
.showroom-footer__social {
  display: flex;
  align-items: center;
  gap: 28px;
}

.showroom-footer nav a,
.showroom-footer__social span {
  color: #d2d9df;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

/* Os links do rodape tinham 16px de altura; o minimo tocavel e 44px. */
.showroom-footer nav a,
.showroom-footer__social a {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
}

.showroom-footer nav {
  margin: -10px 0;
}

.showroom-footer__social {
  gap: 13px;
}

.showroom-footer__social a {
  display: inline-flex;
  min-width: 44px;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  color: white;
}

.showroom-footer__slogan {
  align-self: stretch;
  display: flex;
  align-items: center;
  padding-left: 80px;
  background: linear-gradient(115deg, transparent 0 15%, #101820 15% 21%, var(--showroom-yellow) 21% 100%);
  color: #071019;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.3em;
  line-height: 1.65;
  text-transform: uppercase;
}

@media (max-width: 1100px) {
  .showroom-work__grid {
    grid-template-columns: 260px 1fr;
  }

  .showroom-work__side {
    display: none;
  }

  .showroom-steps__layout,
  .showroom-differentials__layout {
    grid-template-columns: 260px 1fr;
  }

  .showroom-differentials__list {
    grid-template-columns: repeat(2, 1fr);
    max-width: calc(100% - 80px);
  }

  .showroom-faq__layout {
    grid-template-columns: 300px 1fr;
    padding-right: 250px;
  }

  .showroom-footer__inner {
    grid-template-columns: 220px 1fr 290px;
  }

  .showroom-footer__slogan {
    display: none;
  }
}

@media (max-width: 850px) {
  .showroom-work__grid,
  .showroom-steps__layout,
  .showroom-differentials__layout,
  .showroom-faq__layout,
  .showroom-contact__layout {
    grid-template-columns: 1fr;
  }

  .showroom-work__copy {
    max-width: 520px;
  }

  .showroom-steps__list,
  .showroom-proof-grid {
    grid-template-columns: 1fr;
  }

  .showroom-steps__list li {
    border-bottom: 1px solid rgba(60, 87, 109, 0.38);
  }

  .showroom-differentials__copy {
    max-width: 440px;
    padding-right: 0;
    border-right: 0;
  }

  .showroom-differentials__list {
    max-width: calc(100% - 100px);
  }

  .showroom-faq__layout {
    padding-right: 180px;
  }

  .showroom-faq__image {
    width: 220px;
    opacity: 0.42;
  }

  .showroom-contact__map {
    left: 0;
    opacity: 0.34;
  }

  .showroom-footer__inner {
    grid-template-columns: 1fr;
    gap: 12px;
    padding-block: 30px;
  }

  .showroom-footer nav,
  .showroom-footer__social {
    flex-wrap: wrap;
  }
}

@media (max-width: 560px) {
  .showroom-work__thumbs {
    grid-template-columns: 1fr;
  }

  .showroom-work__thumbs img {
    height: 220px;
  }

  .showroom-differentials__car,
  .showroom-faq__image {
    display: none;
  }

  .showroom-differentials__list,
  .showroom-faq__layout {
    max-width: none;
    padding-right: 0;
  }

  .showroom-differentials__list {
    grid-template-columns: 1fr;
  }

  .showroom-differentials__list li {
    display: grid;
    grid-template-columns: 50px 1fr;
    gap: 0 14px;
    border-right: 0;
    border-bottom: 1px solid rgba(60, 87, 109, 0.42);
    text-align: left;
  }

  .showroom-differentials__list svg {
    grid-row: 1 / 3;
  }

  .showroom-contact__map {
    inset: 0;
  }

  .showroom-contact__details .showroom-button {
    width: 100%;
  }

  .showroom-footer nav {
    gap: 16px;
  }
}
</style>
