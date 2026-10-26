// Teste rápido dentro do container: abre o Chrome, gera um PDF e confere as 4 páginas.
// Uso: node scripts/smoke.js
const puppeteer = require("puppeteer");
const { renderHTML } = require("../src/template");
const { getNicho } = require("../src/nichos");

(async () => {
  const t0 = Date.now();
  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  console.log(`Chrome abriu em ${Date.now() - t0}ms (${await browser.version()})`);
  const page = await browser.newPage();
  await page.setContent(renderHTML({ nome: "Ana Lima", empresa: "Clínica Viva", atendentes: "3 a 5" }, getNicho("Clínica ou consultório")), { waitUntil: "load" });
  await page.evaluateHandle("document.fonts.ready");
  const pdf = Buffer.from(await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true }));
  const paginas = (pdf.toString("latin1").match(/\/Type \/Page[^s]/g) || []).length;
  await browser.close();
  console.log(`PDF: ${pdf.length} bytes, ${paginas} páginas, total ${Date.now() - t0}ms`);
  process.exit(paginas === 4 ? 0 : 1);
})().catch((e) => { console.error("FALHOU:", e.message); process.exit(1); });
