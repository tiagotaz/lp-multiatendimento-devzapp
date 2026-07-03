# ⚡ Deploy Rápido

## 🚀 Um Comando Para Subir Tudo

```bash
./deploy.sh
```

Isso vai:
1. ✅ Fazer commit no Git
2. ✅ Push para o repositório
3. ✅ Deploy no Google Cloud Run
4. ✅ Mostrar URL de produção

## 📍 Onde Está Rodando

**Projeto GCP:** `devzap-prod`  
**Serviço:** `multiatendimento-paginas`  
**Região:** `us-east4`

**Console:** https://console.cloud.google.com/run/detail/us-east4/multiatendimento-paginas/observability/metrics?project=devzap-prod

## 🔧 Comandos Úteis

### Ver logs em tempo real
```bash
gcloud run services logs tail multiatendimento-paginas --region us-east4 --project devzap-prod
```

### Ver URL do serviço
```bash
gcloud run services describe multiatendimento-paginas --region us-east4 --project devzap-prod --format='value(status.url)'
```

### Fazer rollback
```bash
# Listar versões
gcloud run revisions list --service multiatendimento-paginas --region us-east4 --project devzap-prod

# Voltar para versão anterior
gcloud run services update-traffic multiatendimento-paginas --to-revisions [REVISION-NAME]=100 --region us-east4 --project devzap-prod
```

## ✅ Verificar Deploy

Após deploy, teste:

1. Site carregando: `curl -I [URL-DO-SERVICO]`
2. Analytics funcionando: Abra console do navegador → `DevChatAnalytics.getSession()`
3. Dashboard: `[URL-DO-SERVICO]/admin/analytics.html`

## 🐛 Problemas?

**Erro de autenticação:**
```bash
gcloud auth login
gcloud config set project devzap-prod
```

**Erro de permissão:**
Verifique se você tem role `roles/run.admin` no projeto

**Deploy travou:**
Cancele com `Ctrl+C` e tente novamente

---

💡 **Dica:** Sempre teste localmente antes de fazer deploy!
