export type ServiceIcon = 'multimidia' | 'led' | 'protecao' | 'som'

export interface Service {
  id: string
  icon: ServiceIcon
  title: string
  headline: string
  bullets: string[]
  cta: string
  whatsappMessage: string
}

export const services: Service[] = [
  {
    id: 'multimidia',
    icon: 'multimidia',
    title: 'Central multimídia',
    headline: 'O painel de um carro novo, no carro que você já tem',
    bullets: [
      'CarPlay e Android Auto na tela do painel',
      'Câmera de ré já instalada',
      '2 anos de garantia na instalação',
    ],
    cta: 'Ver opção para meu carro',
    whatsappMessage:
      'Olá! Vim pelo site da Boutique do Carro. Quero um orçamento de central multimídia. Meu carro é [modelo/ano].',
  },
  {
    id: 'led',
    icon: 'led',
    title: 'LED',
    headline: 'Mais luz na estrada e mais estilo por dentro',
    bullets: [
      'Conversão de farol para LED (Super LED, luz branca)',
      'Iluminação interna com fita de LED neon no painel',
      'Soleira iluminada com LED',
    ],
    cta: 'Quero LED no meu carro',
    whatsappMessage:
      'Olá! Vim pelo site da Boutique do Carro. Quero um orçamento de LED (farol ou iluminação interna). Meu carro é [modelo/ano].',
  },
  {
    id: 'insulfilm-ppf',
    icon: 'protecao',
    title: 'Insulfilm e PPF',
    headline: 'Menos calor lá dentro, mais proteção por fora',
    bullets: [
      'PPF Diamond: redução de até 98% do calor',
      'PPF transparente em pontos estratégicos, como maçaneta, pisca e soleira',
      'Película também para casa e comércio',
    ],
    cta: 'Pedir orçamento de proteção',
    whatsappMessage:
      'Olá! Vim pelo site da Boutique do Carro. Quero um orçamento de insulfilm/PPF. Meu carro é [modelo/ano].',
  },
  {
    id: 'som',
    icon: 'som',
    title: 'Som automotivo',
    headline: 'Ouça cada detalhe, com equilíbrio e potência',
    bullets: [
      'Projeto de som pensado para o seu carro',
      'Mais qualidade e equilíbrio na música do dia a dia',
      'Instalação feita pela equipe da loja',
    ],
    cta: 'Montar meu projeto de som',
    whatsappMessage:
      'Olá! Vim pelo site da Boutique do Carro. Quero montar um projeto de som automotivo. Meu carro é [modelo/ano].',
  },
]
