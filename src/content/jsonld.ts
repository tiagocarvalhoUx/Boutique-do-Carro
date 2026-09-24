import { business, seo } from './site.ts'
import { faq } from './faq.ts'

export function buildJsonLd(siteUrl: string) {
  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    '@id': `${siteUrl}/#loja`,
    name: `${business.name} — ${business.tagline}`,
    description: seo.description,
    url: `${siteUrl}/`,
    image: `${siteUrl}/og-image.jpg`,
    logo: `${siteUrl}/logo-512.png`,
    telephone: business.phoneIntl,
    sameAs: [business.instagramUrl],
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.streetAddress,
      addressLocality: business.city,
      addressRegion: business.region,
      postalCode: business.postalCode,
      addressCountry: 'BR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: business.geo.latitude,
      longitude: business.geo.longitude,
    },
    areaServed: { '@type': 'City', name: business.city },
    makesOffer: [
      'Instalação de central multimídia',
      'Instalação de LED',
      'Insulfilm e PPF',
      'Som automotivo',
    ].map((name) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name } })),
  }

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }

  return [localBusiness, faqPage]
}
