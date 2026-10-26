// Monta o HTML (A4, 4 páginas) que o Chrome headless transforma em PDF.
// Tudo é embutido (fontes, logos, imagem): a renderização não acessa a rede.
const fs = require("fs");
const path = require("path");
const { CENARIO_EQUIPE, PLANOS } = require("./nichos");

// Cópias dos arquivos do site (assets/img) que o PDF usa; o container só leva a pasta api/
const ASSET_DIR = path.resolve(__dirname, "../assets");
const SITE = "https://multiatendimento.devzapp.com.br";

const b64 = (file) => fs.readFileSync(file).toString("base64");
const fontFace = (w) => {
  const f = require.resolve(`@fontsource/inter/files/inter-latin-${w}-normal.woff2`);
  return `@font-face{font-family:Inter;font-weight:${w};src:url(data:font/woff2;base64,${b64(f)}) format("woff2")}`;
};
// Carregados uma vez na subida do servidor
const ASSETS = {
  fonts: [400, 500, 600, 700, 800].map(fontFace).join(""),
  logoBranco: fs.readFileSync(path.join(ASSET_DIR, "logo-devchat-branco.svg"), "utf8"),
  logo: fs.readFileSync(path.join(ASSET_DIR, "logo-devchat.svg"), "utf8"),
  kanban: `data:image/webp;base64,${b64(path.join(ASSET_DIR, "tela-crm-kanban.webp"))}`
};

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
// Destaca os {{campos}} que o cliente personaliza nas respostas rápidas
const campos = (s) => esc(s).replace(/\{\{([^}]+)\}\}/g, '<span class="var">[$1]</span>');

const CSS = `
${ASSETS.fonts}
@page{size:A4;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html,body{font-family:Inter,sans-serif;color:#0b1020;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{width:210mm;height:297mm;padding:18mm 17mm 16mm;position:relative;overflow:hidden;page-break-after:always;background:#fff}
.page:last-child{page-break-after:auto}
h2{font-size:25px;line-height:1.2;font-weight:800;letter-spacing:-.02em;margin-bottom:8px}
h3{font-size:15px;font-weight:700;margin-bottom:4px}
p{font-size:12.5px;line-height:1.6;color:#3a455f}
.eyebrow{font-size:10.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#6d44f7;margin-bottom:10px}
.lead{font-size:13.5px;margin-bottom:22px}
.top{display:flex;justify-content:space-between;align-items:center;margin-bottom:26px;padding-bottom:12px;border-bottom:1px solid #e4e8f1}
.top svg{height:22px;width:auto}
.top span{font-size:10px;color:#8b96ad}
.foot{position:absolute;left:17mm;right:17mm;bottom:10mm;display:flex;justify-content:space-between;font-size:9.5px;color:#8b96ad}
.var{color:#6d44f7;font-weight:600}

/* Capa */
.cover{background:radial-gradient(120% 80% at 100% 0%,#5a30e0 0%,#1a1446 45%,#0b1020 100%);color:#fff;padding:22mm 20mm}
.cover>svg{height:34px;width:auto;display:block}
.cover .tag{display:inline-block;margin-top:58mm;font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#5ee9b5;border:1px solid rgba(94,233,181,.4);border-radius:99px;padding:6px 14px}
.cover h1{font-size:44px;line-height:1.08;font-weight:800;letter-spacing:-.03em;margin:18px 0 14px}
.cover h1 em{font-style:normal;color:#b9a6ff}
.cover .sub{font-size:15px;line-height:1.55;color:#c9cbe0;max-width:135mm}
.cover .meta{position:absolute;left:20mm;right:20mm;bottom:52mm;display:flex;gap:28px;font-size:11px;color:#c9cbe0}
.cover .meta b{display:block;font-size:13px;color:#fff;margin-top:3px;font-weight:600}
.cover .stats{position:absolute;left:20mm;right:20mm;bottom:18mm;display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
.cover .stat{border-top:1px solid rgba(255,255,255,.18);padding-top:10px}
.cover .stat b{display:block;font-size:20px;font-weight:800;color:#fff}
.cover .stat span{font-size:10px;color:#a5a9c4;line-height:1.4}

/* Dores */
.dores{display:grid;gap:9px;margin-bottom:18px}
.dor{display:flex;gap:14px;padding:12px 16px;border:1px solid #e4e8f1;border-radius:14px;background:#f7f8fc}
.dor .n{flex:none;width:30px;height:30px;border-radius:9px;background:#fde8e8;color:#e5484d;font-weight:800;font-size:14px;display:flex;align-items:center;justify-content:center}
.cenario{border-radius:16px;padding:16px 20px;background:#f3f0ff;border:1px solid #d6c9ff}
.cenario .eyebrow{margin-bottom:6px}
.cenario h3{font-size:17px;margin-bottom:6px}
.solucoes{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:16px}
.sol{padding:11px 14px;border-radius:12px;border:1px solid #e4e8f1}
.sol h3{font-size:13px;display:flex;align-items:center;gap:8px}
.sol h3:before{content:"";width:8px;height:8px;border-radius:50%;background:#10c684}
.sol p{font-size:11px;line-height:1.45}

/* Funil */
.kanban{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin:4px 0 18px}
.col{background:#f7f8fc;border:1px solid #e4e8f1;border-radius:12px;padding:10px 8px 8px;min-height:112px}
.col h4{font-size:10.5px;font-weight:700;line-height:1.3;margin-bottom:8px;min-height:27px;display:flex;gap:6px}
.col h4 i{flex:none;font-style:normal;width:16px;height:16px;border-radius:5px;background:#6d44f7;color:#fff;font-size:9px;display:flex;align-items:center;justify-content:center}
.card{height:18px;border-radius:6px;background:#fff;border:1px solid #e4e8f1;margin-bottom:5px;position:relative}
.card:after{content:"";position:absolute;left:6px;top:7px;height:3px;border-radius:2px;background:#d6c9ff;width:60%}
.shot{width:100%;max-height:74mm;object-fit:cover;object-position:top left;border-radius:12px;border:1px solid #e4e8f1;box-shadow:0 8px 30px rgba(11,16,32,.08);display:block;margin-bottom:8px}
.legenda{font-size:10px;color:#8b96ad;margin-bottom:20px}
.ura{display:grid;grid-template-columns:1.1fr 1fr;gap:18px;align-items:center}
.chat{background:#0b1020;border-radius:16px;padding:16px}
.bolha{background:#1a2238;color:#e4e8f1;border-radius:4px 12px 12px 12px;padding:10px 12px;font-size:11.5px;line-height:1.5}
.bolha ol{margin:6px 0 0 16px}
.bolha li{margin:2px 0}
.bolha.eu{background:#10c684;color:#0b1020;border-radius:12px 4px 12px 12px;margin:8px 0 0 auto;width:max-content;font-weight:600}

/* Respostas e plano */
.resp{display:grid;gap:8px;margin-bottom:22px}
.r{display:flex;gap:12px;align-items:flex-start;padding:11px 14px;border:1px solid #e4e8f1;border-radius:12px}
.r code{flex:none;font-family:ui-monospace,Menlo,monospace;font-size:11px;font-weight:700;color:#5a30e0;background:#f3f0ff;border-radius:6px;padding:3px 7px}
.r p{font-size:11.5px;line-height:1.5}
.duas{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:22px}
.box{border:1px solid #e4e8f1;border-radius:14px;padding:16px 18px}
.box ul{list-style:none}
.box li{font-size:11.5px;line-height:1.45;color:#3a455f;padding:5px 0 5px 18px;position:relative}
.box li:before{content:"";position:absolute;left:0;top:10px;width:8px;height:8px;border-radius:2px;background:#6d44f7}
.passos li b{color:#0b1020}
.cta{border-radius:16px;padding:22px 24px;background:linear-gradient(135deg,#6d44f7,#5a30e0);color:#fff;display:flex;justify-content:space-between;align-items:center;gap:20px}
.cta h3{font-size:18px;margin-bottom:4px}
.cta p{color:#e9e3ff;font-size:12px}
.cta a{flex:none;background:#fff;color:#5a30e0;font-weight:700;font-size:12.5px;text-decoration:none;border-radius:10px;padding:11px 16px}
.breve{margin-top:10px;font-size:10px;color:#6b7690}
.plano{display:grid;grid-template-columns:auto 1fr;gap:18px;align-items:center;border:1.5px solid #d6c9ff;background:#f3f0ff;border-radius:14px;padding:14px 18px;margin-bottom:12px}
.plano .eyebrow{margin-bottom:3px}
.plano h3{font-size:16px;margin:0;white-space:nowrap}
.plano h3 span{font-weight:600;color:#5a30e0;font-size:13px;margin-left:4px}
.plano p{font-size:11px;line-height:1.5}
.faq{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:22px}
.faq div{background:#f7f8fc;border-radius:12px;padding:14px}
.faq h3{font-size:12.5px;margin-bottom:4px}
.faq p{font-size:11px;line-height:1.5}
`;

function dataBR(d = new Date()) {
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric", timeZone: "America/Sao_Paulo" });
}

function renderHTML(lead, nicho) {
  const empresa = esc(lead.empresa || "sua empresa");
  const primeiroNome = esc(String(lead.nome || "").trim().split(/\s+/)[0] || "");
  const atendentes = CENARIO_EQUIPE[lead.atendentes] ? lead.atendentes : null;
  const cenario = atendentes ? CENARIO_EQUIPE[atendentes] : CENARIO_EQUIPE["3 a 5"];
  const plano = PLANOS[atendentes || "3 a 5"];
  const utm = "utm_source=material_pdf&utm_medium=pdf&utm_campaign=plano_nicho";
  const link = `${SITE}${nicho.lp}?${utm}`;
  const foot = (n) => `<div class="foot"><span>Plano de atendimento · ${empresa}</span><span>DevChat · ${n}/4</span></div>`;
  const top = `<div class="top">${ASSETS.logo}<span>Preparado em ${dataBR()}</span></div>`;

  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Plano de atendimento · ${empresa}</title><style>${CSS}</style></head><body>

<section class="page cover">
  ${ASSETS.logoBranco}
  <div><span class="tag">Material exclusivo · ${esc(nicho.nome)}</span></div>
  <h1>Plano de atendimento no WhatsApp para <em>${empresa}</em></h1>
  <p class="sub">Um roteiro feito para ${esc(nicho.plural)}: onde o atendimento costuma travar e como deixar a equipe inteira atendendo em um só número, com cada ${esc(nicho.cliente)} acompanhado do primeiro contato ao pós-atendimento.</p>
  <div class="meta">
    <div>Preparado para<b>${esc(lead.nome || "—")}</b></div>
    <div>Segmento<b>${esc(nicho.nome)}</b></div>
    ${atendentes ? `<div>Equipe<b>${esc(atendentes)} atendentes</b></div>` : ""}
    <div>Data<b>${dataBR()}</b></div>
  </div>
  <div class="stats">
    <div class="stat"><b>+7 mil</b><span>empresas atendendo com o DevChat</span></div>
    <div class="stat"><b>+2 mi</b><span>conversas organizadas</span></div>
    <div class="stat"><b>98%</b><span>de satisfação dos clientes</span></div>
    <div class="stat"><b>−80%</b><span>de retrabalho no atendimento</span></div>
  </div>
</section>

<section class="page">
  ${top}
  <div class="eyebrow">1 · Diagnóstico</div>
  <h2>Onde ${esc(nicho.plural)} perdem clientes no WhatsApp</h2>
  <p class="lead">${primeiroNome ? `${primeiroNome}, estes` : "Estes"} são os três gargalos que mais aparecem quando o WhatsApp vira o principal canal de atendimento do segmento.</p>
  <div class="dores">
    ${nicho.dores.map((d, i) => `<div class="dor"><div class="n">${i + 1}</div><div><h3>${esc(d.t)}</h3><p>${esc(d.d)}</p></div></div>`).join("")}
  </div>
  <div class="cenario">
    <div class="eyebrow">O seu cenário${atendentes ? ` · ${esc(atendentes)} atendentes` : ""}</div>
    <h3>O que muda na sua operação</h3>
    <p>${esc(cenario)}</p>
  </div>
  <div class="solucoes">
    <div class="sol"><h3>Um número, toda a equipe</h3><p>Vários atendentes no mesmo WhatsApp, pelo navegador ou pelo app, enviando fotos, vídeos e áudios como no WhatsApp. Conexão pela API oficial da Meta ou por QR code.</p></div>
    <div class="sol"><h3>Nenhuma conversa esquecida</h3><p>Fila única com distribuição automática, um responsável por atendimento e mensagem de boas-vindas e de fora do horário enviadas sozinhas.</p></div>
    <div class="sol"><h3>Histórico que fica na empresa</h3><p>Todo o histórico fica no contato. Qualquer atendente assume a conversa sabendo o que já foi dito.</p></div>
    <div class="sol"><h3>Gestão com números</h3><p>Dashboard em tempo real, ranking de atendentes e relatórios exportáveis.</p></div>
    <div class="sol"><h3>Avaliação do atendimento</h3><p>Ao encerrar, o ${esc(nicho.cliente)} dá uma nota, registrada por atendente. Você sabe quem atende bem e onde melhorar.</p></div>
    <div class="sol"><h3>Segurança e LGPD</h3><p>${esc(nicho.seguranca)}</p></div>
  </div>
  ${foot(2)}
</section>

<section class="page">
  ${top}
  <div class="eyebrow">2 · Organização</div>
  <h2>Funil sugerido para ${empresa}</h2>
  <p class="lead">Etapas pensadas para ${esc(nicho.plural)} no CRM Kanban do DevChat. Cada conversa vira um card com o atendente responsável e o histórico, e a etapa muda direto da tela de atendimento, sem sair da conversa. Os contadores mostram quantos clientes há em cada fase.</p>
  <div class="kanban">
    ${nicho.funil.map((e, i) => `<div class="col"><h4><i>${i + 1}</i>${esc(e)}</h4>${'<div class="card"></div>'.repeat(Math.max(1, 4 - i))}</div>`).join("")}
  </div>
  <img class="shot" src="${ASSETS.kanban}" alt="Tela do CRM Kanban do DevChat">
  <p class="legenda">Tela real do CRM Kanban do DevChat. As etapas acima são configuradas por você.</p>
  <div class="ura">
    <div>
      <div class="eyebrow">URA e chatbot</div>
      <h3>O primeiro atendimento já chega separado</h3>
      <p>Um menu automático recebe o ${esc(nicho.cliente)}, entende o assunto e encaminha a conversa para o departamento certo, inclusive fora do horário, com aviso de quando a equipe volta.</p>
    </div>
    <div class="chat">
      <div class="bolha">${esc(nicho.ura.saudacao)}<ol>${nicho.ura.opcoes.map((o) => `<li>${esc(o)}</li>`).join("")}</ol></div>
      <div class="bolha eu">1</div>
    </div>
  </div>
  ${foot(3)}
</section>

<section class="page">
  ${top}
  <div class="eyebrow">3 · Pronto para usar</div>
  <h2>Respostas rápidas para começar hoje</h2>
  <p class="lead">A equipe digita o atalho (com duas barras) e a mensagem completa aparece. Todo mundo responde com o mesmo padrão e em menos tempo. É só ajustar os campos entre colchetes.</p>
  <div class="resp">
    ${nicho.respostas.map((r) => `<div class="r"><code>${esc(r.atalho)}</code><p>${campos(r.texto)}</p></div>`).join("")}
  </div>
  <div class="duas">
    <div class="box">
      <div class="eyebrow">Indicadores para acompanhar</div>
      <ul>${nicho.metricas.map((m) => `<li>${esc(m)}</li>`).join("")}<li>Nota de avaliação por atendente</li></ul>
    </div>
    <div class="box passos">
      <div class="eyebrow">Roteiro para o teste grátis</div>
      <ul>
        <li><b>Dia 1:</b> conectar o número, importar os contatos e convidar a equipe</li>
        <li><b>Dia 2:</b> boas-vindas, horário de atendimento, departamentos e URA</li>
        <li><b>Dia 3:</b> montar o funil e as respostas rápidas</li>
        <li><b>Dias 4 a 7:</b> atender e acompanhar o dashboard</li>
      </ul>
    </div>
  </div>
  <div class="eyebrow">Perguntas comuns</div>
  <div class="faq">
    <div><h3>Preciso trocar de número?</h3><p>Não. Você continua com o número atual, agora atendido pela equipe toda.</p></div>
    <div><h3>Tem que instalar algo?</h3><p>Não. Funciona 100% no navegador, e os atendentes também têm app no celular.</p></div>
    <div><h3>Fico preso a contrato?</h3><p>Não. Não há fidelidade nem multa: você cancela quando quiser.</p></div>
  </div>
  <div class="plano">
    <div><div class="eyebrow">Plano indicado para ${atendentes ? esc(atendentes) + " atendentes" : "a sua equipe"}</div><h3>${esc(plano.nome)} <span>${esc(plano.preco)}</span></h3></div>
    <p>${esc(plano.detalhe)}</p>
  </div>
  <div class="cta">
    <div><h3>Teste o DevChat por 7 dias grátis</h3><p>Sem fidelidade. Suporte de segunda a domingo, das 9h às 22h.</p></div>
    <a href="${esc(link)}">Começar meu teste →</a>
  </div>
  <p class="breve">Em breve: atendimento e análise de conversas com IA. Inscreva-se na lista de espera em ${SITE.replace("https://", "")}/recursos/ia/. Na API oficial, as mensagens podem ter custo cobrado pela Meta conforme a tabela oficial.</p>
  ${foot(4)}
</section>

</body></html>`;
}

module.exports = { renderHTML };
