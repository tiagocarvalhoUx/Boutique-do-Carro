# Boutique do Carro — Landing page

Vue 3 + Vite + TypeScript + Tailwind CSS 3, pré-renderizada em HTML estático (SEO) e animada com GSAP.

## Comandos

```bash
npm install
npm run dev        # desenvolvimento
npm run typecheck  # vue-tsc
npm run build      # typecheck + build + pré-render + sitemap/robots
npm run preview    # serve o build em localhost:4173
```

## Configuração

- `VITE_SITE_URL`: domínio público (veja `.env.example`). Na Vercel usa `VERCEL_PROJECT_PRODUCTION_URL` se ausente.
- Conteúdo editável em `src/content/` (`site.ts`, `services.ts`, `gallery.ts`, `faq.ts`).
- Horário de funcionamento: `business.hours` em `src/content/site.ts` (hoje `null`).

## Estrutura

| Caminho | O que é |
|---|---|
| `src/components/` | Uma seção da página por componente; `App.vue` define a ordem |
| `src/content/` | Dados da página e manifestos gerados pelos scripts |
| `public/` | Servido literalmente, sem processamento — só o que o site entrega |
| `assets-src/` | Insumos de build que **não** vão para produção |
| `scripts/` | Geradores de assets e etapas do build |

## Assets gerados

`prerender.mjs` e `generate-seo.mjs` rodam dentro do `npm run build`. Os demais são **manuais**:
geram assets a partir dos arquivos-mestre e o resultado é commitado. Rode-os só ao trocar um original.

| Script | Lê de | Escreve em |
|---|---|---|
| `generate-brand-assets.mjs` | `../cliente/originais/{logo,capa,hero}` | `public/` (favicons, capas, og-image) |
| `generate-hero-layers.mjs` | `../cliente/originais/hero/` | `public/hero-multimidia-base-*.webp` |
| `optimize-images.mjs` | `../cliente/originais/imagens/` | `public/img/gallery/` + `src/content/gallery-images.json` |
| `generate-teardown-frames.mjs` | `assets-src/central-1024.mp4` | `public/img/teardown/` + `src/content/teardown-frames.json` |

`generate-teardown-frames.mjs` exige **ffmpeg** no PATH; os outros usam só `sharp`.

A pasta `../cliente/` está fora deste repositório. O site compila e publica sem ela — ela só é
necessária para regerar assets.

## Deploy

Vercel (framework Vite, saída `dist`, configurado em `vercel.json`). Push na `main` publica em produção.
