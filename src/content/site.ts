// Fonte única de dados do negócio. Itens marcados com PENDENTE precisam de confirmação do cliente.

export const business = {
  name: 'Boutique do Carro',
  tagline: 'Som e Acessórios',
  streetAddress: 'Av. Bezerra de Menezes, 1199',
  neighborhood: 'Parquelândia / Farias Brito',
  city: 'Fortaleza',
  region: 'CE',
  // CEP do nº 1199 confirmado por geocodificação reversa (OSM) e checado no ViaCEP:
  // 60325-004 é o trecho de Parquelândia. O card do Google mostra 60325-003, que
  // pelo ViaCEP pertence a Parque Araxá.
  postalCode: '60325-004',
  // Geocodificado em 24/09/2026 a partir de Av. Bezerra de Menezes, 1199 (Nominatim/OSM).
  geo: { latitude: -3.7341405, longitude: -38.5554165 },
  phoneDisplay: '(85) 99980-4447',
  phoneIntl: '+5585999804447',
  whatsappNumber: '5585999804447',
  instagramUrl: 'https://www.instagram.com/boutiquedocarro/',
  instagramHandle: '@boutiquedocarro',
  // PENDENTE: horário de funcionamento não informado. Preencher aqui (ex.: 'Seg a Sex, 8h às 18h').
  hours: null as string | null,
} as const

export const fullAddress = `${business.streetAddress} — ${business.city}-${business.region}, ${business.postalCode}`

export const mapQuery = `${business.streetAddress}, ${business.city}, ${business.region}`
export const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`
export const mapLinkUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`

// PENDENTE: preço/condição vem de post do Instagram de 26/08/2026 — confirmar vigência antes de publicar.
export const offer = {
  priceFrom: 'R$ 950',
  installments: 'em até 4x sem juros',
  warranty: '2 anos de garantia',
} as const

export const seo = {
  title: 'Central Multimídia em Fortaleza | Boutique do Carro',
  description:
    'Central multimídia com 2 anos de garantia, LED, insulfilm, PPF e som automotivo em Fortaleza. Em até 4x sem juros. Peça orçamento no WhatsApp.',
  ogTitle: 'Boutique do Carro — Central Multimídia em Fortaleza',
  ogDescription: 'Instalação com 2 anos de garantia, a partir de R$ 950 em até 4x sem juros. Peça seu orçamento no WhatsApp.',
} as const

export const nav = [
  { label: 'Serviços', href: '#servicos' },
  { label: 'Trabalhos', href: '#trabalhos' },
  { label: 'Garantias', href: '#diferenciais' },
  { label: 'Localização', href: '#contato' },
] as const
