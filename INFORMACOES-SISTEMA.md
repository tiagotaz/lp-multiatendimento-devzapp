# DevChat — Dossiê do Sistema de Multiatendimento

> Documento-base de marketing e produto. Reúne tudo o que foi levantado sobre o sistema a partir
> dos prints reais das telas, das referências de design e da landing page atual.
> Serve de fonte única para criar **novas páginas** (recursos, casos de uso por segmento,
> comparativos, blog, anúncios) sem precisar redescobrir as informações.
>
> Última atualização: 16/06/2026.

---

## 1. Identidade

| Item | Informação |
|---|---|
| **Produto / marca visual** | **DevChat** (logo com raio ⚡, escrito `dev` + `chat`) |
| **Empresa / domínio** | DevZapp — `devzapp.com.br` |
| **Categoria** | Plataforma de **multiatendimento no WhatsApp** (central de atendimento + automação) |
| **Posicionamento** | Transformar **um único número de WhatsApp** em uma **central de atendimento profissional** para toda a equipe |
| **Selo de credibilidade** | Parceiro oficial **WhatsApp Business Platform (Meta)** |
| **Conformidade** | Dados criptografados, **LGPD** |
| **Idiomas** | Multi-idioma (interface em Português, com seletor de idioma) |

> ⚠️ Observação de marca: os assets visuais (logo, sistema, telas) usam **"DevChat"**, mas o domínio
> e a razão comercial é **"DevZapp"**. A LP usa DevChat como nome do produto e cita DevZapp no rodapé.
> Confirmar com o time qual nome deve liderar a comunicação antes de escalar campanhas.

### Paleta de marca (extraída das telas e referências)
- **Roxo primário:** `#6d44f7` / `#7c5cfc` (gradientes e CTAs)
- **Verde/esmeralda:** `#10c684` / `#2bd99a` / `#5ee9b5` (acento, status "online", sucesso)
- **Escuro (UI do sistema e seções dark):** `#0b1020` / `#121a2e`
- **Tipografia recomendada:** Inter (geométrica, limpa, estilo SaaS americano)
- **Estilo:** premium/americano — fundo claro e arejado, tipografia forte, seções escuras de contraste, mockups reais do produto, micro-animações discretas.

---

## 2. O que o sistema faz (funcionalidades reais — confirmadas nas telas)

### Núcleo de atendimento
- **Multiatendimento:** vários operadores atendendo no **mesmo número** simultaneamente (visto: "Abertos 7635", "Meus 1092", operadores online).
- **Caixa de conversas unificada:** filtros por **Todos / Não lidos / Grupos**, abas **Abertos / Finalizados / Meus**, busca, etiquetas de departamento (ex.: "Geral").
- **Status de conexão em tempo real:** "Conectado / Online", operadores online.
- **Envio de mídias:** fotos, vídeos, áudios, imagens.
- **Respostas rápidas:** atalhos de texto (ex.: `//SITE`, `/MERCADO LIVRE`, `//PEDIDO CONFIRMADO`), com status ativa/inativa, busca e preview. (Tela mostrava 10 respostas ativas.)

### Organização e distribuição
- **Departamentos / equipes:** criar setores (ex.: "Geral", "Pedido em andamento", "Pedido Finalizado"), com operadores alocados, status ativo/inativo e visibilidade na URA.
- **Distribuição de atendimento:** roteamento automático das conversas.
- **Vincular atendimento:** transferir/atribuir conversas.
- **Permissões de operadores:** controle de acesso por perfil.
- **URA — atendimento automático:** menu inteligente que recebe e encaminha o cliente.
- **Mensagem de boas-vindas** personalizável.
- **Horários de atendimento** configuráveis.
- **Botões personalizados** e **categorias de atendimento**.
- **Funil:** acompanhamento das etapas do atendimento/venda.

### Dados e gestão
- **Dashboard em tempo real** ("Visão geral do seu negócio em tempo real"):
  - Total de atendimentos (ex.: **9.686**), Aguardando (8.501), Em progresso (1.182), Finalizados (3)
  - **Top 3 operadores** com mais performance (% de atendimentos)
  - Dia da semana com maior demanda, total de horas em atendimento
  - Atendimento mais curto / mais longo, **tempo médio** (ex.: 2h34min), performance
  - Filtros por período.
- **Analytics:** gráfico "Relação de atendimentos x mês", **atividade recente** (últimos 10 atendimentos com cliente, operador, início, fim, **ticket**), **Top 10 clientes** que mais geram atendimento. Exportação de dados.
- **Tickets:** cada atendimento gera um ticket rastreável (código, início, fim, responsável).
- **Avaliação de operadores pelos clientes** (citado na LP atual).

### Contatos, grupos e integrações
- **Contatos:** lista, busca, importação em massa, novo contato, paginação.
- **Grupos do WhatsApp:** sincronizar e importar grupos, contagem de participantes, grupos com link.
- **Webhooks** e integrações externas.
- **Campanha** (campo "Campanha" no topo — provável disparo/origem de campanha).
- **Multiusuário** com "Bem-vindo(a), [operador]".

### Resumo das 12 opções de Configuração (tela real)
Horários de atendimento · Mensagem de boas-vindas · URA (atendimento automático) ·
Botões personalizados · Webhooks · Categorias de atendimento · Permissões de operadores ·
Distribuição de atendimento · Vincular atendimento · Funil · Chat · Editar perfil.

---

## 3. Dores do público (o problema que o produto resolve)

> Estrutura "quando o atendimento cresce, o improviso começa a custar caro".

| # | Dor | Como se manifesta |
|---|---|---|
| 1 | **Mensagens perdidas** | Cliente fica sem resposta e procura o concorrente |
| 2 | **Equipe sem padrão** | Cada atendente responde de um jeito; experiência inconsistente |
| 3 | **Demora no atendimento** | Mais espera → menos satisfação → menos vendas |
| 4 | **Histórico espalhado** | Cliente precisa repetir tudo a cada atendimento |
| 5 | **Falta de controle** | Gestor não sabe quem atende o quê nem onde melhorar |
| 6 | **Dependência de pessoas** | Quando o atendente sai, a operação trava e o conhecimento vai junto |
| 7 | **Celular passando de mão em mão** | Um único aparelho/numero para a equipe inteira |
| 8 | **Sem visibilidade / sem métricas** | Decisões no achismo, sem dados |

**Frase-âncora:** *"O problema não é o WhatsApp. É usar um canal tão importante sem estrutura profissional."*

---

## 4. Como o DevChat resolve (dor → solução)

| Dor | Solução no DevChat |
|---|---|
| Mensagens perdidas | Fila única, distribuição automática, nada cai no esquecimento |
| Equipe sem padrão | Respostas rápidas, mensagem de boas-vindas, URA padronizam o tom |
| Demora | Roteamento automático + atendimento simultâneo reduzem o tempo de resposta |
| Histórico espalhado | Histórico centralizado por contato; qualquer operador assume com contexto |
| Falta de controle | Dashboard em tempo real + relatórios + tickets |
| Dependência de pessoas | Conhecimento fica no sistema, não no celular do atendente |
| Um número só | Vários atendentes no mesmo número, com departamentos |
| Sem métricas | Analytics, ranking de operadores, top clientes, exportação |

---

## 5. Objeções comuns e respostas (para FAQ, anúncios e vendas)

| Objeção | Resposta recomendada |
|---|---|
| "Vou ter que trocar de número?" | Não. Mantém o número atual e passa a atendê-lo com a equipe toda. |
| "É difícil de configurar?" | Implantação rápida e simples, com suporte próximo e especializado. |
| "Meus dados ficam seguros?" | Criptografia, padrões altos de segurança, LGPD e parceria oficial Meta. |
| "É caro?" | Teste grátis 7 dias; planos que escalam conforme a operação cresce. |
| "Tenho fidelidade/preso a contrato?" | Sem fidelidade; cancelamento antes da renovação (seg–sex, 9h–18h, WhatsApp). |
| "Vai bagunçar meu WhatsApp?" | Ao contrário: organiza, centraliza e dá controle da operação. |
| "Quantos atendentes posso ter?" | Depende do plano — do Essencial ao Empresarial (atendentes ilimitados). |
| "Funciona pro meu segmento?" | Sim — clínicas, escolas, imobiliárias, e-commerce, automotivo e mais. |

---

### Fatos confirmados pelo cliente (jun/2026) — usar nas próximas páginas
- **Compatibilidade:** funciona com **WhatsApp comum, WhatsApp Business e API Oficial (WABA)**. Começa com o que já usa e evolui.
- **Acesso:** **100% via navegador** (não instala nada no PC) + **app mobile para os operadores** acompanharem pelo celular.
- **Contrato:** **sem fidelidade** e sem multa rescisória; cancela quando quiser.
- **Integrações:** **APIs e webhooks** para CRMs, sistemas próprios, plataformas de venda e automações, em tempo real.
- **Suporte:** **segunda a domingo, das 9h às 22h** + materiais de apoio, treinamentos e acompanhamento.

## 6. Público-alvo e segmentos (ideias para landing pages dedicadas)

**Perfil:** empresas que usam o WhatsApp como canal **principal** de atendimento/vendas e têm **mais de uma pessoa atendendo**.

Segmentos citados / com potencial de página própria:
- 🏥 **Clínicas e consultórios** (agendamento, confirmação, retorno)
- 🎓 **Escolas e cursos / instituições** (matrículas, dúvidas, secretaria)
- 🏠 **Imobiliárias** (leads de imóveis, visitas, qualificação)
- 🛒 **E-commerce / lojas** (pedidos, status de entrega, SAC)
- 🚗 **Automotivo** (test-drive, pós-venda, oficina)
- 📦 **Contabilidades e empresas de serviços**
- 💧 Distribuidoras/entregas (visto nas respostas rápidas: galões, preços, endereço de entrega)

> Sugestão: 1 landing page por segmento, reaproveitando dores → solução → prova social,
> trocando exemplos, mockups e depoimento para o contexto do nicho.

---

## 7. Prova social e números (usados na comunicação)

- **+7 mil empresas** confiam
- **+2 milhões de conversas** gerenciadas
- **98% de satisfação** dos clientes
- **−80% de tempo de retrabalho**
- **+37% de aumento na satisfação** dos clientes (referência alternativa)
- Redução de **até 70% no tempo de resposta** (depoimento)

> ⚠️ Validar esses números com o time antes de usar em campanha paga (compliance/veracidade).

### Depoimentos (modelos usados na LP — confirmar autorização de uso)
- **Dra. Juliana Prado** — Clínica Viva Bem: centralizou o atendimento e reduziu tempo de resposta em 70%.
- **Carlos Menezes** — Diretor Comercial: controle e visibilidade da equipe.
- **Fernanda Lima** — Gestora Administrativa: saiu do improviso para um atendimento profissional.

---

## 8. Mensagens-chave (copy reaproveitável)

**Headlines**
- "Transforme um único número em uma central de atendimento para toda a sua equipe."
- "Com o DevChat, seu WhatsApp vira uma operação profissional e organizada."
- "Quando o atendimento cresce, o improviso começa a custar caro."

**CTAs**
- "Quero atender meus clientes com um clique"
- "Quero organizar meu atendimento"
- "Criar conta teste grátis" · "Falar com especialista" · "Ver demonstração"

**Benefícios em 1 linha**
- Um número, vários atendentes · Histórico centralizado · Mais controle · Menos dependência de pessoas · Decisões com dados.

---

## 9. Planos (estrutura sugerida — VALORES A CONFIRMAR)

> Preços oficiais informados pelo cliente (16/06/2026). Cobrança **por número de operadores**.
> Pagamento: **cartão de crédito**. Teste grátis: **7 dias**.

| Plano | Preço | Operadores | Destaques |
|---|---|---|---|
| **Essencial** | **R$ 178,00/mês** | 2 | 1 número, atendimentos ilimitados, respostas rápidas, dashboard |
| **Profissional** ⭐ | **R$ 356,00/mês** | 4 | + departamentos, URA, relatórios, funil, webhooks |
| **Avançado** | **R$ 750,00/mês** | 10 | + múltiplos departamentos, onboarding dedicado, suporte prioritário |

> Acima de 10 operadores: sob consulta com o time comercial.
> Observação: a distribuição de recursos entre os planos é uma **sugestão** — confirmar o que
> realmente muda entre as faixas (ou se a diferença é só a quantidade de operadores).

**Política de cancelamento:** solicitar antes da data de renovação · seg–sex, 9h–18h · via WhatsApp.

---

## 10. Estrutura da landing page nova (seções já implementadas)

1. **Header** fixo com navegação + CTA
2. **Hero** — headline + sub + 2 CTAs + selos de confiança + mockup do dashboard
3. **Faixa de stats** (escura) — números de prova social
4. **Setores** — chips de segmentos
5. **Problema/Dores** — 6 cards + frase-âncora
6. **Solução** (escura) — split com tela de conversas + 4 benefícios
7. **Recursos** — grid de 12 funcionalidades
8. **Decisões com dados** (escura, invertida) — tela de analytics
9. **Antes e depois** — comparativo
10. **Para quem é** — split + tela de departamentos
11. **Depoimentos** (escura) + selos (Meta, LGPD, segurança, suporte)
12. **Planos** — 3 cards
13. **FAQ** — 6 perguntas (accordion)
14. **CTA final** (escura, com glow)
15. **Footer** + botão flutuante de WhatsApp

---

## 11. Pendências / a confirmar com o time

- [ ] Nome que lidera a comunicação: **DevChat** ou **DevZapp**?
- [ ] **Preços reais** dos planos e nomes oficiais.
- [ ] **Links reais**: cadastro/teste, área do cliente, número do WhatsApp (`wa.me/55...`).
- [ ] **Veracidade dos números** de prova social (+7 mil, +2 mi, 98%, −80%).
- [ ] **Autorização** dos depoimentos e logos de clientes.
- [ ] Domínio final / rota (`/` ou `/multiatendimento-v4`?) e redirect da v3.
- [ ] Pixel/Analytics (GA4, Meta Pixel) e política de cookies.
- [ ] Otimizar prints (comprimir/converter para WebP) antes do tráfego pago.

---

## 12. Próximas páginas sugeridas (roadmap de conteúdo)

1. **Páginas por segmento** (clínicas, imobiliárias, e-commerce, automotivo, escolas).
2. **Página de Recursos detalhada** (uma seção/âncora por funcionalidade do item 2).
3. **Comparativo** "DevChat vs WhatsApp comum / vs concorrentes".
4. **Página de Preços** completa com tabela comparativa de planos.
5. **Casos de sucesso** (depoimentos expandidos com métricas).
6. **Blog/Conteúdo**: "como organizar atendimento no WhatsApp", LGPD, produtividade.
7. **Página de demonstração** (agendar demo / vídeo do produto).
