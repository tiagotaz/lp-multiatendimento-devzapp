// Gera um PDF de exemplo para cada nicho chamando a API local.
// Uso: npm start (em outro terminal) e depois npm run exemplo
const BASE = process.env.API_URL || "http://localhost:3333";
const { NICHOS } = require("../src/nichos");

(async () => {
  for (const nicho of Object.keys(NICHOS)) {
    const res = await fetch(`${BASE}/api/material`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": process.env.API_KEY || "" },
      body: JSON.stringify({ nome: "Mariana Souza", empresa: `Empresa Exemplo ${nicho}`, nicho, atendentes: "6 a 10" })
    });
    const json = await res.json();
    console.log(`${nicho.padEnd(28)} ${res.status}  ${json.url || json.erro}`);
  }
})();
