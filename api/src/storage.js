// Onde o PDF fica guardado. Em ambos os casos o link público é servido pela própria API
// em /m/<id> (no site, o nginx repassa /m/ para cá), então o bucket continua privado.
// - Sem GCS_BUCKET: salva em api/storage/ (modo local).
// - Com GCS_BUCKET: salva no Google Cloud Storage.
// O nome "bonito" do arquivo (com a empresa) vai nos metadados, não na URL.
const fs = require("fs");
const path = require("path");

const LOCAL_DIR = path.resolve(__dirname, "../storage");
const BUCKET = process.env.GCS_BUCKET || "";
const PREFIX = "materiais";

let bucket = null;
if (BUCKET) {
  const { Storage } = require("@google-cloud/storage");
  bucket = new Storage().bucket(BUCKET);
}

async function salvar(id, buffer, nomeDownload) {
  if (bucket) {
    await bucket.file(`${PREFIX}/${id}.pdf`).save(buffer, {
      contentType: "application/pdf",
      resumable: false,
      metadata: { metadata: { nomeDownload } }
    });
    return;
  }
  await fs.promises.mkdir(LOCAL_DIR, { recursive: true });
  await fs.promises.writeFile(path.join(LOCAL_DIR, `${id}.pdf`), buffer);
  await fs.promises.writeFile(path.join(LOCAL_DIR, `${id}.json`), JSON.stringify({ nomeDownload }));
}

// Devolve { stream, nomeDownload } ou null se não existir.
// Aceita também os nomes antigos (plano-<empresa>-<id>.pdf) dos primeiros testes.
async function abrir(chave) {
  const arquivo = chave.endsWith(".pdf") ? chave : `${chave}.pdf`;
  if (bucket) {
    const obj = bucket.file(`${PREFIX}/${arquivo}`);
    const [existe] = await obj.exists();
    if (!existe) return null;
    const [meta] = await obj.getMetadata();
    return { stream: obj.createReadStream(), nomeDownload: meta.metadata?.nomeDownload || arquivo };
  }
  const f = path.join(LOCAL_DIR, arquivo);
  if (!fs.existsSync(f)) return null;
  let nomeDownload = arquivo;
  try { nomeDownload = JSON.parse(fs.readFileSync(f.replace(/\.pdf$/, ".json"), "utf8")).nomeDownload || arquivo; } catch (_) {}
  return { stream: fs.createReadStream(f), nomeDownload };
}

module.exports = { salvar, abrir, usandoGCS: !!bucket };
