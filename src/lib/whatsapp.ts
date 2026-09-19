import { business } from '../content/site'

export function whatsappLink(message: string): string {
  return `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(message)}`
}

export const messages = {
  hero: 'Olá! Vim pelo site da Boutique do Carro. Quero um orçamento de central multimídia. Meu carro é [modelo/ano].',
  gallery: 'Olá! Vim pelo site da Boutique do Carro. Vi os trabalhos e quero um orçamento para o meu carro [modelo/ano].',
  faq: 'Olá! Vim pelo site da Boutique do Carro. Tenho uma dúvida sobre [serviço] para o meu carro [modelo/ano].',
  contact: 'Olá! Vim pelo site da Boutique do Carro. Meu veículo é [modelo/ano] e quero um orçamento para [serviço].',
  floating: 'Olá! Vim pelo site da Boutique do Carro e quero um orçamento.',
} as const
