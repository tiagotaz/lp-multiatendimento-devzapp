# Regras de Contabilização de Tráfego

## Localização do Código
Arquivo: [`admin/index.html`](admin/index.html:944)
Função: `updateTrafficSourcesFromLeads(leads)`

## Como Funciona

### 1. Extração do UTM Source

Para cada lead capturado, o sistema tenta extrair o `utm_source` de duas formas:

```javascript
// Prioridade 1: Campo utm_source direto do lead
if (lead.utm_source) {
  utmSource = lead.utm_source.toLowerCase().trim();
}

// Prioridade 2: Extrair da URL da página
else if (lead.pagina) {
  const urlMatch = lead.pagina.match(/utm_source=([^&]+)/);
  if (urlMatch) {
    utmSource = urlMatch[1].toLowerCase().trim();
  }
}
```

### 2. Classificação por Fonte de Tráfego

Depois de extrair o `utm_source`, o lead é classificado em uma das 4 categorias:

#### 🔍 Google Ads
**Regra:** `utm_source` contém "google" OU "gclid"

```javascript
if (utmSource.includes('google') || utmSource.includes('gclid')) {
  googleCount++;
}
```

**Exemplos que contam como Google:**
- `utm_source=google`
- `utm_source=google-ads`
- `utm_source=googleads`
- URL contém `gclid=` (Google Click ID)

---

#### 📘 Facebook Ads
**Regra:** `utm_source` contém "fb" OU "facebook" OU "instagram" OU "ig"

```javascript
else if (utmSource.includes('fb') || utmSource.includes('facebook') || 
         utmSource.includes('instagram') || utmSource.includes('ig')) {
  facebookCount++;
}
```

**Exemplos que contam como Facebook:**
- `utm_source=fb`
- `utm_source=facebook`
- `utm_source=facebook-ads`
- `utm_source=instagram`
- `utm_source=ig`
- URL contém `fbclid=` (se também tiver `utm_source=fb`)

---

#### 🌐 Orgânico
**Regra:** `utm_source` está vazio OU é "organic" OU "organico"

```javascript
else if (utmSource === '' || utmSource === 'organic' || utmSource === 'organico') {
  organicCount++;
}
```

**Exemplos que contam como Orgânico:**
- Lead sem UTM nenhum
- `utm_source=organic`
- `utm_source=organico`
- Campo `utm_source` vazio ou null

---

#### 🔗 Outras Fontes
**Regra:** `utm_source` tem algum valor que não se encaixa nas categorias acima

```javascript
else if (utmSource !== '') {
  otherCount++;
}
```

**Exemplos que contam como Outras Fontes:**
- `utm_source=email`
- `utm_source=newsletter`
- `utm_source=linkedin`
- `utm_source=twitter`
- `utm_source=whatsapp`
- Qualquer outro valor personalizado

---

## Ordem de Prioridade

A classificação segue esta ordem (primeira regra que bater):

1. **Google** - se contém "google" ou "gclid"
2. **Facebook** - se contém "fb", "facebook", "instagram" ou "ig"
3. **Orgânico** - se está vazio ou é "organic"/"organico"
4. **Outras Fontes** - qualquer outro valor
5. **Orgânico (fallback)** - se nenhuma regra anterior bateu

---

## Exemplos Práticos

### Exemplo 1: Lead do Facebook
```
URL: https://multiatendimento.devzapp.com.br/p1-compacta/?fbclid=...&utm_source=fb&utm_medium=paid
Campo utm_source: "fb"
Resultado: 📘 Facebook Ads
```

### Exemplo 2: Lead do Google
```
URL: https://multiatendimento.devzapp.com.br/?gclid=...&utm_source=google&utm_medium=cpc
Campo utm_source: "google"
Resultado: 🔍 Google Ads
```

### Exemplo 3: Lead Orgânico
```
URL: https://multiatendimento.devzapp.com.br/
Campo utm_source: null
Resultado: 🌐 Orgânico
```

### Exemplo 4: Lead de Email
```
URL: https://multiatendimento.devzapp.com.br/?utm_source=email&utm_campaign=newsletter
Campo utm_source: "email"
Resultado: 🔗 Outras Fontes
```

---

## Debugging

Para ver como cada lead está sendo classificado, abra o Console do navegador (F12) no admin e procure por logs com `[Admin]`:

```
[Admin] Calculando fontes de tráfego de 50 leads
[Admin] Lead: João Silva | utm_source: fb | pagina: https://.../?utm_source=fb
  -> Facebook
[Admin] Lead: Maria Santos | utm_source: google | pagina: https://.../?utm_source=google
  -> Google
[Admin] Resultado: { google: 15, facebook: 20, organic: 10, other: 5 }
```

---

## Possíveis Problemas

### Facebook mostrando 0 mesmo com leads FB

**Causas possíveis:**

1. **Campo `utm_source` está vazio** - O sistema não consegue extrair o UTM
   - Solução: Verificar se o formulário está salvando o campo `utm_source`

2. **UTM está na URL mas não no campo** - O campo `pagina` tem o UTM mas o campo `utm_source` está vazio
   - Solução: O código já tenta extrair da URL, mas pode não estar funcionando

3. **Valor diferente do esperado** - O `utm_source` pode ser "facebook" em vez de "fb"
   - Solução: O código já aceita ambos, mas verificar o valor exato

4. **Leads antigos sem UTM** - Leads capturados antes da implementação do rastreamento
   - Solução: Normal, só leads novos terão UTM

---

## Como Modificar as Regras

Para adicionar novas fontes ou modificar a classificação, edite a função em [`admin/index.html`](admin/index.html:968):

```javascript
// Exemplo: Adicionar LinkedIn como fonte separada
else if (utmSource.includes('linkedin') || utmSource.includes('li')) {
  linkedinCount++;
  console.log('  -> LinkedIn');
}
```

Não esqueça de:
1. Adicionar o card no HTML
2. Adicionar a variável de contagem
3. Atualizar o elemento no DOM
4. Fazer deploy novamente
