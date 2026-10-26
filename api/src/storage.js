// Onde o PDF fica guardado. Em ambos os casos o link público é servido pela própria API
// em /m/<arquivo>, então o bucket pode (e deve) continuar privado.
// - Sem GCS_BUCKET: salva em api/storage/ (modo local).
// - Com GCS_BUCKET: salva no Google Cloud Storage.
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

async function salvar(nomeArquivo, buffer) {
  if (bucket) {
    await bucket.file(`${PREFIX}/${nomeArquivo}`).save(buffer, { contentType: "application/pdf", resumable: false });
    return;
  }
  await fs.promises.mkdir(LOCAL_DIR, { recursive: true });
  await fs.promises.writeFile(path.join(LOCAL_DIR, nomeArquivo), buffer);
}

// Devolve um stream do PDF, ou null se não existir
async function abrir(nomeArquivo) {
  if (bucket) {
    const obj = bucket.file(`${PREFIX}/${nomeArquivo}`);
    const [existe] = await obj.exists();
    return existe ? obj.createReadStream() : null;
  }
  const f = path.join(LOCAL_DIR, nomeArquivo);
  return fs.existsSync(f) ? fs.createReadStream(f) : null;
}

module.exports = { salvar, abrir, usandoGCS: !!bucket };
