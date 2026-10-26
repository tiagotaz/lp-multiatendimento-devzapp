# API de material por nicho

Gera um PDF de 4 páginas ("Plano de atendimento no WhatsApp") personalizado com os dados
do lead e o nicho dele, e devolve um link público e único.

É um serviço separado do site (o site continua estático no nginx). A pasta `api/` está no
`.dockerignore` e no `.gcloudignore` da raiz, então não vai junto no deploy do site.

## Rodar localmente

```bash
cd api
npm install
npm start               # http://localhost:3333
npm run exemplo         # (em outro terminal) gera 1 PDF de cada nicho
```

## Endpoint

`POST /api/material`

```json
{ "nome": "Mariana Souza", "empresa": "Clínica Sorriso Vivo",
  "nicho": "Clínica ou consultório", "atendentes": "3 a 5" }
```

Resposta `201`:

```json
{ "id": "FXfXEagxXA",
  "url": "https://multiatendimento.devzapp.com.br/m/FXfXEagxXA",
  "arquivo": "Plano de atendimento - Clínica Sorriso Vivo.pdf",
  "nicho": "Clínica ou consultório", "paginas": 4 }
```

- `nome` é obrigatório. `empresa` e `atendentes` são opcionais (o texto se adapta).
- `nicho` precisa ser um dos valores do formulário do site (`GET /api/nichos` lista). Valor
  desconhecido cai em "Outro".
- Aceita o mesmo payload que o site manda para o webhook (`objetivo` vale como `atendentes`).
- O link tem um id aleatório de 10 letras/números: é público, mas impossível de adivinhar.
- `arquivo` é o nome para enviar o PDF como documento no WhatsApp (o mesmo nome aparece ao baixar).
- Em produção o link usa o domínio do site: o `nginx.conf` da raiz repassa `/m/` para esta API.

## Como o site usa

No envio do formulário, `assets/js/main.js` chama `POST /api/material` primeiro e manda a URL
para o n8n no campo `material_url`, junto com `nicho`. Se a API falhar ou passar de 12 s, o lead
vai para o n8n mesmo assim, com `material_url` vazio: nunca se perde lead por causa do PDF.

A URL da API fica na constante `MATERIAL_API` do `main.js`: em `localhost` usa
`http://localhost:3333`; em produção está vazia (não gera) até a API ser publicada.

Teste local completo: `python3 -m http.server 8765` na raiz do repo + `npm start` aqui, e abra
http://localhost:8765/contato/.

## Variáveis de ambiente

| Variável | Para quê |
|---|---|
| `PORT` | Porta (padrão 3333; o Cloud Run define sozinho) |
| `API_KEY` | Chamadas de servidor (n8n etc.) mandam o header `x-api-key`. **Obrigatória em produção.** |
| `ALLOWED_ORIGINS` | Origens do site que podem chamar pelo navegador sem chave (padrão: o domínio do site e `localhost:8765`) |
| `RATE_LIMIT_POR_HORA` | Limite por IP para chamadas do navegador (padrão 30) |
| `GCS_BUCKET` | Se definida, salva os PDFs no bucket do Cloud Storage (privado) em vez de `api/storage/`. O link é sempre servido pela API em `/m/<arquivo>` |
| `PUBLIC_BASE_URL` | Base do link do PDF (padrão: o host da própria requisição) |

## Onde mexer

- `src/nichos.js`: textos de cada nicho (dores, funil, URA, respostas rápidas, indicadores)
  e o texto por faixa de atendentes. Só cite recursos que o DevChat entrega hoje.
- `src/template.js`: layout das 4 páginas (HTML/CSS em A4). Fontes, logos e o print do CRM
  vão embutidos; o Chrome não acessa a rede durante a geração.
- Novo nicho: adicione em `src/nichos.js` com a mesma chave usada no `<select name="nicho">`
  do site (`assets/js/main.js` e formulários das páginas).

## Produção

- Serviço Cloud Run `devchat-material-api` (us-east4, projeto devzap-prod):
  https://devchat-material-api-463492272412.us-east4.run.app
- Bucket privado `bucket-files-materiais-devchat` (pasta `materiais/`).
- Deploy (rodar dentro de `api/`):

```bash
gcloud run deploy devchat-material-api --source . --region us-east4 --project devzap-prod \
  --allow-unauthenticated --memory 2Gi --cpu 2 --concurrency 4 --timeout 60 --cpu-boost \
  --min-instances 0 --max-instances 5 \
  --update-env-vars "GCS_BUCKET=bucket-files-materiais-devchat,PUBLIC_BASE_URL=https://multiatendimento.devzapp.com.br"
```

`--update-env-vars` mantém a `API_KEY` já configurada no serviço.

`assets/` aqui dentro são cópias de `../assets/img` (o container só leva esta pasta).
