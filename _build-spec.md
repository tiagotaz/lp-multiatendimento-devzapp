# BUILD SPEC — páginas por persona (uso interno, NÃO publicar)

Crie páginas estáticas (HTML puro) seguindo EXATAMENTE o design system do projeto.
Arquivos de referência (LEIA antes de escrever):
- `index.html` — página COMPLETA (todas as seções ricas + tracking já inserido no <head>).
- `compacta/index.html` — página COMPACTA (hero+stats, 3 dores, 6 features, planos, FAQ curta, CTA).
- `pg1/index.html` — exemplo de página por segmento.
- `partials/tracking.html` — bloco de tracking (GTM + GA4 + Meta Pixel) e onde colar.

## Regras invioláveis
1. **Tracking**: copie o bloco do `<head>` EXATAMENTE como está em `index.html` (entre `<!-- Google Tag Manager -->` e `<!-- End Meta Pixel -->`), logo após a `<meta name="viewport" ...>`. E o `<noscript>` do GTM logo após `<body>`. IDs: GTM-K43WP8VC, GA4 G-P15VS8SPRJ, Pixel 1157595497996556. NÃO inclua token CAPI.
2. **Header, footer, botão wa-float e `<script src="/assets/js/main.js" defer>`**: copie idênticos de `index.html`. No header/footer das páginas COMPACTAS, use a versão compacta do `compacta/index.html`.
3. Caminhos sempre root-relative: `/assets/...`, `/`.
4. `<link rel="canonical">` aponta para a própria URL: `https://multiatendimento.devzapp.com.br/<slug>/`.
5. Imagens disponíveis (use só estas, com width/height): `/assets/img/tela-dashboard.webp` (1600x800), `tela-conversas.webp` (1600x780), `tela-analytics.webp` (1600x780), `tela-departamentos.webp` (1600x780). hero usa `fetchpriority="high"`, demais `loading="lazy"`.
6. Classes/cores: use APENAS as classes já existentes no CSS (hero, hero__grid, hero__copy, hero__visual, hero__shot, hero__blob, float-card, stats-band, stats-card, eyebrow, text-grad, btn btn--primary/ghost/light/outline-light/lg/block, sec-head center, h-sec, lead, pain-grid, pain, pain__ic, pain-note, features, feature, feature__ic, split, split--rev, split__media, split__copy, feat-list (li>span.ck+div>strong+p), ba/ba__col/ba--before/ba--after/ba__arrow, quotes/quote, plans/plan/plan--feat/plan__tag/plan__price/plan__ops/plan__list, faq/faq__item/faq__q/faq__a, cta-final/cta-final__btns/cta-final__mini, section--soft/dark/tight). NÃO invente classes novas (exceto, na compacta, as do `<style>` inline `.c-section/.c-stats/.c-hero` copiadas de compacta/index.html).
7. SVGs dos ícones: reaproveite os mesmos paths que já aparecem em index.html/compacta.
8. Planos (preços): Essencial R$178 / 2 operadores · Profissional R$356 / 4 operadores (Mais popular) · Avançado R$750 / 10 operadores. Copie o bloco `.plans` de index.html (completa) ou compacta (compacta).
9. Stats de prova social: +7 mil empresas · +2 mi conversas · 98% satisfação · −80% retrabalho.
10. Links de CTA de teste: `href="#"` (placeholder) e WhatsApp: `https://wa.me/` (placeholder), como nas páginas existentes.

## Estrutura PÁGINA COMPLETA (siga a ordem do index.html, adaptando a copy à persona):
hero (grid com copy + visual/shot + float-cards + trust) → stats-band → setores (opcional) → dores (pain-grid, 6 cards da persona) → pain-note (frase-âncora da persona) → solução (split + feat-list, 4 itens) → recursos (features, 6–8 cards focados na persona) → split--rev escuro (analytics/decisões, 3 feat-list) → antes/depois (ba) → FAQ (use as OBJEÇÕES da persona como perguntas, responda vendendo) → planos → cta-final. Use `section--soft`/`section--dark` alternando como no index.

## Estrutura PÁGINA COMPACTA (siga compacta/index.html):
hero c-hero (copy + visual/shot + c-stats + trust) → 3 dores (pain-grid) → 6 features → planos → FAQ curta (3–4 objeções da persona) → cta-final. Header/footer compactos.

## CTA principal por persona = use as frases da persona (abaixo). Title/meta description tailored.
