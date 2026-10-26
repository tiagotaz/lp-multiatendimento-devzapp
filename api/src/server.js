// API de material por nicho.
//   POST /api/material  { nome, empresa, nicho, atendentes, email?, telefone? }
//   -> 201 { id, url, nicho, paginas }
// O PDF fica num link público e único (id aleatório, impossível de adivinhar).
const crypto = require("crypto");
const express = require("express");
const puppeteer = require("puppeteer");
const { NICHOS, getNicho } = require("./nichos");
const { renderHTML } = require("./template");
const { salvar, abrir, usandoGCS } = require("./storage");

const PORT = Number(process.env.PORT) || 3333;
const API_KEY = process.env.API_KEY || "";
// Origens do site que podem chamar a API pelo navegador (sem x-api-key).
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ||
  "https://multiatendimento.devzapp.com.br,http://localhost:8765,http://127.0.0.1:8765").split(",").map((o) => o.trim());
const RATE_LIMIT = Number(process.env.RATE_LIMIT_POR_HORA) || 30;
// Base do link do PDF. Sem a variável, usa o host da própria requisição (https no Cloud Run).
const PUBLIC_BASE_URL = (process.env.PUBLIC_BASE_URL || "").replace(/\/$/, "");
const baseUrl = (req) => PUBLIC_BASE_URL || `${req.protocol}://${req.get("host")}`;

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", true);

// CORS só para as origens do site
app.use((req, res, next) => {
  const origin = req.get("origin");
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.set({ "Access-Control-Allow-Origin": origin, "Vary": "Origin",
      "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" });
  }
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});
app.use(express.json({ limit: "20kb" }));

// Limite simples por IP para chamadas vindas do navegador (memória da instância)
const hits = new Map();
const limitePorIP = (req, res, next) => {
  const agora = Date.now(), hora = 3600e3;
  const lista = (hits.get(req.ip) || []).filter((t) => agora - t < hora);
  if (lista.length >= RATE_LIMIT) return res.status(429).json({ erro: "Muitas solicitações. Tente mais tarde." });
  lista.push(agora); hits.set(req.ip, lista);
  if (hits.size > 5000) hits.clear();
  next();
};

// Chrome headless: abre uma vez e reaproveita entre as requisições
let browserPromise = null;
const getBrowser = () => {
  if (!browserPromise) {
    browserPromise = puppeteer
      .launch({ headless: true, timeout: 60000, handleSIGTERM: false, handleSIGINT: false, args: ["--no-sandbox", "--disable-dev-shm-usage"] })
      .then((b) => { b.on("disconnected", () => { browserPromise = null; }); return b; })
      // Falhou ao abrir: libera para tentar de novo na próxima requisição (sem derrubar o servidor)
      .catch((err) => { browserPromise = null; throw err; });
  }
  return browserPromise;
};

async function gerarPDF(html) {
  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
    // O HTML é todo embutido; qualquer acesso à rede é bloqueado.
    await page.setRequestInterception(true);
    page.on("request", (r) => (r.url().startsWith("data:") ? r.continue() : r.abort()));
    await page.setContent(html, { waitUntil: "load", timeout: 15000 });
    await page.evaluateHandle("document.fonts.ready");
    return await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true });
  } finally {
    await page.close();
  }
}

// 10 caracteres alfanuméricos (~58 bits): curto para o WhatsApp e impossível de adivinhar
const ALFABETO = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
const novoId = () => Array.from(crypto.randomBytes(10), (b) => ALFABETO[b % ALFABETO.length]).join("");
const texto = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");

// Servidor (n8n etc.): x-api-key, sem limite. Navegador: origem do site + limite por IP.
const auth = (req, res, next) => {
  const key = req.get("x-api-key") || "";
  if (API_KEY && key.length === API_KEY.length && crypto.timingSafeEqual(Buffer.from(key), Buffer.from(API_KEY))) return next();
  if (ALLOWED_ORIGINS.includes(req.get("origin") || "")) return limitePorIP(req, res, next);
  if (!API_KEY) return next();
  return res.status(401).json({ erro: "x-api-key inválida" });
};

app.get("/health", (_req, res) => res.json({ ok: true }));
app.get("/api/nichos", (_req, res) => res.json(Object.keys(NICHOS)));

app.post("/api/material", auth, async (req, res) => {
  const b = req.body || {};
  const lead = {
    nome: texto(b.nome, 80),
    empresa: texto(b.empresa, 80),
    nicho: texto(b.nicho, 60),
    atendentes: texto(b.atendentes || b.objetivo, 20)
  };
  if (lead.nome.length < 2) return res.status(400).json({ erro: "Campo 'nome' é obrigatório." });

  const nicho = getNicho(lead.nicho);
  const id = novoId();
  // Nome usado ao baixar o PDF ou ao enviá-lo como documento no WhatsApp
  const arquivo = `Plano de atendimento - ${(lead.empresa || lead.nome).replace(/[\\/:*?"<>|]+/g, " ").trim()}.pdf`;
  const t0 = Date.now();
  try {
    const pdf = await gerarPDF(renderHTML(lead, nicho));
    await salvar(id, pdf, arquivo);
    const url = `${baseUrl(req)}/m/${id}`;
    console.log(`[material] ${nicho.nome} · ${arquivo} · ${Date.now() - t0}ms`);
    res.status(201).json({ id, url, arquivo, nicho: nicho.nome, paginas: 4 });
  } catch (err) {
    console.error("[material] falha ao gerar", err);
    res.status(500).json({ erro: "Não foi possível gerar o material." });
  }
});

// Link público do PDF (lê do disco local ou do bucket privado)
// /m/<id> (atual) ou /m/plano-<empresa>-<id>.pdf (links dos primeiros testes)
const CHAVE_RE = /^([A-Za-z0-9]{10}|plano-[a-z0-9-]*-[A-Za-z0-9_-]{16}\.pdf)$/;
app.get("/m/:chave", async (req, res) => {
  const { chave } = req.params;
  if (!CHAVE_RE.test(chave)) return res.sendStatus(404);
  try {
    const achado = await abrir(chave);
    if (!achado) return res.sendStatus(404);
    const { stream, nomeDownload } = achado;
    const ascii = nomeDownload.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\x20-\x7e]/g, "").replace(/"/g, "");
    res.set({ "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(nomeDownload)}`,
      "Cache-Control": "public, max-age=86400", "X-Robots-Tag": "noindex" });
    stream.on("error", () => res.destroy()).pipe(res);
  } catch (err) {
    console.error("[material] falha ao abrir", chave, err.message);
    res.sendStatus(500);
  }
});

app.listen(PORT, () => {
  console.log(`API de material na porta ${PORT} (armazenamento: ${usandoGCS ? "GCS " + process.env.GCS_BUCKET : "local"})`);
  getBrowser().catch((e) => console.error("[material] Chrome não abriu:", e.message)); // aquece
  if (!API_KEY) console.warn("Aviso: API_KEY não definida — o endpoint está aberto (ok só para teste local).");
});

// Encerramento (Ctrl+C local, SIGTERM do Cloud Run): fecha o Chrome e sai
const encerrar = async () => {
  try { if (browserPromise) await (await browserPromise).close(); } catch (_) {}
  process.exit(0);
};
process.on("SIGTERM", encerrar);
process.on("SIGINT", encerrar);
