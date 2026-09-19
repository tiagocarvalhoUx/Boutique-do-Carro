# Boutique do Carro — Landing page

Vue 3 + Vite + TypeScript + Tailwind CSS 3, pré-renderizada em HTML estático (SEO) e animada com GSAP.

## Comandos

```bash
npm install
npm run dev        # desenvolvimento
npm run build      # typecheck + build + pré-render + sitemap/robots
npm run preview    # serve o build em localhost:4173
```

## Configuração

- `VITE_SITE_URL`: domínio público (veja `.env.example`). Na Vercel usa `VERCEL_PROJECT_PRODUCTION_URL` se ausente.
- Conteúdo editável em `src/content/` (`site.ts`, `services.ts`, `gallery.ts`, `faq.ts`).
- Horário de funcionamento: `business.hours` em `src/content/site.ts` (hoje `null`).

## Imagens

Os derivados otimizados ficam em `public/`. Os originais (não versionados aqui) são processados por:

- `node scripts/generate-brand-assets.mjs` — logo, favicons, ícones, capa e og-image
- `node scripts/optimize-images.mjs` — galeria "Trabalhos reais"
- `node scripts/generate-hero-layers.mjs` — camadas da central 3D do hero

Esses scripts leem `../cliente-boutique-do-carro/assets/originais/` e só precisam rodar ao trocar imagens.

## Deploy

Vercel (framework Vite, saída `dist`, configurado em `vercel.json`).
