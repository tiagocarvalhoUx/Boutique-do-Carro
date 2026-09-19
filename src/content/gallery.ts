import images from './gallery-images.json'

export interface GalleryItem {
  id: keyof typeof images
  service: string
  detail: string
  alt: string
  whatsappMessage: string
}

export const galleryImage = (item: GalleryItem, variant: 'sm' | 'thumb' | 'full') => ({
  src: `/img/gallery/${item.id}-${variant}.webp`,
  ...images[item.id][variant],
})

// Legendas transcritas das próprias artes/fotos enviadas pelo cliente.
export const gallery: GalleryItem[] = [
  {
    id: 'multimidia-hilux-2018-antes-depois',
    service: 'Central multimídia 10" Octacore 6/128GB',
    detail: 'Toyota Hilux 2018 · Antes x Depois',
    alt: 'Antes e depois da instalação de central multimídia 10 polegadas Octacore 6/128GB em Toyota Hilux 2018',
    whatsappMessage:
      'Olá! Vim pelo site da Boutique do Carro e vi a central multimídia 10" da Hilux 2018. Quero um orçamento para o meu carro [modelo/ano].',
  },
  {
    id: 'multimidia-yaris-9',
    service: 'Central multimídia 9"',
    detail: 'Toyota Yaris',
    alt: 'Central multimídia 9 polegadas instalada no painel de um Toyota Yaris',
    whatsappMessage:
      'Olá! Vim pelo site da Boutique do Carro e vi a central multimídia 9" do Yaris. Quero um orçamento para o meu carro [modelo/ano].',
  },
  {
    id: 'multimidia-corolla-2017',
    service: 'Central multimídia 9"',
    detail: 'Toyota Corolla 2017 · Android, câmera de ré e conectividade',
    alt: 'Central multimídia 9 polegadas com Android instalada em Toyota Corolla 2017',
    whatsappMessage:
      'Olá! Vim pelo site da Boutique do Carro e vi a central multimídia 9" do Corolla 2017. Quero um orçamento para o meu carro [modelo/ano].',
  },
  {
    id: 'multimidia-onix-prisma',
    service: 'Central multimídia 9"',
    detail: 'Chevrolet Onix / Prisma',
    alt: 'Central multimídia 9 polegadas instalada no painel de um Chevrolet Onix ou Prisma',
    whatsappMessage:
      'Olá! Vim pelo site da Boutique do Carro e vi a central multimídia 9" do Onix/Prisma. Quero um orçamento para o meu carro [modelo/ano].',
  },
  {
    id: 'multimidia-9-pol',
    service: 'Central multimídia 9"',
    detail: 'Touchscreen HD · Apple CarPlay · Android Auto sem fio · Câmera de ré',
    alt: 'Central multimídia 9 polegadas com touchscreen HD, Apple CarPlay, Android Auto sem fio e câmera de ré',
    whatsappMessage:
      'Olá! Vim pelo site da Boutique do Carro e quero um orçamento da central multimídia 9" com CarPlay e Android Auto. Meu carro é [modelo/ano].',
  },
  {
    id: 'ppf-kit-basico',
    service: 'PPF Kit Básico',
    detail: 'Proteção invisível: maçaneta, soleira e quina da porta',
    alt: 'PPF Kit Básico: proteção invisível aplicada na maçaneta, na soleira e na quina da porta',
    whatsappMessage:
      'Olá! Vim pelo site da Boutique do Carro e quero um orçamento do PPF Kit Básico. Meu carro é [modelo/ano].',
  },
  {
    id: 'pelicula-residencial',
    service: 'Película residencial',
    detail: 'Antes e depois · Reduz o calor, proteção UV e mais privacidade',
    alt: 'Antes e depois da película residencial em janela de apartamento, que reduz o calor, protege contra UV e dá mais privacidade',
    whatsappMessage:
      'Olá! Vim pelo site da Boutique do Carro e quero um orçamento de película residencial para [ambiente].',
  },
]
