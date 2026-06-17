# DevChat — Landing Page Premium (Multiatendimento)

Landing page **100% estática** (HTML + CSS + JS puro, sem build), pronta para subir no
**Google Cloud Platform**. Substitui a página `multiatendimento-v3`.

## Estrutura

```
multiatendimento-devzapp/
├── index.html              # a landing page
├── assets/
│   ├── css/styles.css      # design system + estilos
│   ├── js/main.js          # menu, FAQ, reveal (vanilla, ~3kb)
│   └── img/                # prints reais do sistema (mockups)
├── app.yaml                # deploy via App Engine
├── Dockerfile + nginx.conf # deploy via Cloud Run
├── .gcloudignore
├── INFORMACOES-SISTEMA.md  # 📄 dossiê do produto (dores, objeções, recursos) p/ novas páginas
└── README.md
```

## Estrutura de páginas (clean URLs)

Cada página fica em **sua própria pasta com `index.html`**, gerando URLs limpas:

```
/                 -> index.html              (home / landing completa)
/compacta/        -> compacta/index.html     (variação curta)
/pg1/             -> pg1/index.html           (exemplo de página por segmento)
/pg2/  /pg3/ ...  -> crie novas pastas
assets/           -> CSS, JS e imagens COMPARTILHADOS por todas as páginas
_modelo/          -> TEMPLATE para novas páginas (não é publicado)
partials/         -> header.html e footer.html (fonte de verdade p/ copiar)
```

Todos os caminhos são **root-relative** (`/assets/...`, `/`), então qualquer página
funciona em qualquer profundidade de URL.

### Como criar uma nova página `/pg2`

```bash
cp -r _modelo pg2          # cria a pasta -> a URL será /pg2
# edite pg2/index.html: troque os campos [[ ... ]] (title, description, canonical, conteúdo)
```

Depois adicione a URL no `sitemap.xml`. Pronto — `/pg2` já é servida.

> **Header/footer:** são iguais em todas as páginas; a fonte de verdade está em
> `partials/`. Se alterar o menu/rodapé, replique nas páginas (não há build step).

## Rodar localmente

```bash
cd multiatendimento-devzapp
python3 -m http.server 8000
# abrir http://localhost:8000
```

## Performance (já otimizada)

- Sem framework, sem dependências de JS → carrega instantâneo.
- Fonte Google carregada de forma assíncrona (não bloqueia render).
- CSS único, SVGs inline (zero requests de ícones).
- Imagens com `width/height` (sem layout shift) e `loading="lazy"` abaixo da dobra.
- `prefers-reduced-motion` respeitado.

> 💡 Antes de tráfego pago, recomendo converter os `.jpeg` de `assets/img/` para **WebP**
> (≈30–50% menores). Ex.: `cwebp -q 80 tela.jpeg -o tela.webp` e trocar o `src`.

---

## Deploy no GCP

Pré-requisito: `gcloud` instalado e autenticado (`gcloud auth login`) e um projeto selecionado
(`gcloud config set project SEU_PROJETO`).

### Opção A — Cloud Storage (mais barato, ideal p/ site estático) ⭐

```bash
BUCKET=devchat-lp                       # nome único global
gcloud storage buckets create gs://$BUCKET --location=southamerica-east1
gcloud storage cp -r index.html assets gs://$BUCKET
# torna público e configura como site
gcloud storage buckets update gs://$BUCKET --web-main-page-suffix=index.html --web-error-page=index.html
gcloud storage buckets add-iam-policy-binding gs://$BUCKET \
  --member=allUsers --role=roles/storage.objectViewer
```
Depois aponte seu domínio via **Cloud CDN + Load Balancer** (recomendado p/ HTTPS no domínio próprio)
ou use o endpoint do bucket. Para HTTPS no domínio, o caminho mais simples é colocar um
**Load Balancer HTTPS** na frente do bucket (Cloud CDN ativado).

### Opção B — App Engine (deploy em 1 comando, HTTPS automático)

```bash
gcloud app create --region=southamerica-east1   # só na 1ª vez
gcloud app deploy app.yaml
gcloud app browse
```

### Opção C — Cloud Run (container nginx, HTTPS automático, escala a zero)

```bash
gcloud run deploy devchat-lp \
  --source . \
  --region southamerica-east1 \
  --allow-unauthenticated
```

### Domínio próprio
- **App Engine / Cloud Run:** `gcloud ... domain-mappings create` ou pelo console.
- **Cloud Storage:** via Load Balancer + certificado gerenciado.
- Lembre de criar o **redirect 301** de `/multiatendimento-v3` para a nova URL.

---

## Antes de publicar (checklist)

Ver seção **"Pendências / a confirmar"** em [`INFORMACOES-SISTEMA.md`](./INFORMACOES-SISTEMA.md):
preços reais, links de cadastro/WhatsApp, veracidade dos números, autorização de depoimentos,
pixel/analytics e redirect da v3.
