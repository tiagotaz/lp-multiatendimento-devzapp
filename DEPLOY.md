# 🚀 Deploy para Produção

Guia rápido para deploy no Google Cloud Run.

## 📋 Pré-requisitos

- Git configurado
- Google Cloud SDK instalado (`gcloud`)
- Autenticado no projeto `devzap-prod`

## 🎯 Deploy Rápido (Comando Único)

```bash
# Execute este comando para fazer deploy completo:
./deploy.sh
```

## 📝 Deploy Manual (Passo a Passo)

### 1. Commit e Push para Git

```bash
# Adicionar todos os arquivos
git add .

# Commit com mensagem descritiva
git commit -m "feat: adicionar sistema de analytics de comportamento"

# Push para o repositório
git push origin main
```

### 2. Deploy no Google Cloud Run

```bash
# Fazer deploy da aplicação
gcloud run deploy multiatendimento-paginas \
  --source . \
  --region us-east4 \
  --project devzap-prod \
  --platform managed \
  --allow-unauthenticated
```

## 🔗 URLs de Produção

- **Site**: https://multiatendimento-paginas-[hash]-ue.a.run.app
- **Console GCP**: https://console.cloud.google.com/run/detail/us-east4/multiatendimento-paginas/observability/metrics?project=devzap-prod
- **Analytics Dashboard**: https://[seu-dominio]/admin/analytics.html

## 📊 Verificar Deploy

Após o deploy, verifique:

1. ✅ Site carregando corretamente
2. ✅ Console do navegador sem erros
3. ✅ Analytics rastreando (abra console e digite `DevChatAnalytics.getSession()`)
4. ✅ Dashboard de analytics acessível

## 🔍 Logs e Monitoramento

```bash
# Ver logs em tempo real
gcloud run services logs tail multiatendimento-paginas \
  --region us-east4 \
  --project devzap-prod

# Ver métricas
gcloud run services describe multiatendimento-paginas \
  --region us-east4 \
  --project devzap-prod
```

## 🐛 Troubleshooting

### Erro de autenticação
```bash
gcloud auth login
gcloud config set project devzap-prod
```

### Erro de permissões
```bash
gcloud projects add-iam-policy-binding devzap-prod \
  --member="user:seu-email@gmail.com" \
  --role="roles/run.admin"
```

### Rollback para versão anterior
```bash
# Listar revisões
gcloud run revisions list \
  --service multiatendimento-paginas \
  --region us-east4 \
  --project devzap-prod

# Fazer rollback
gcloud run services update-traffic multiatendimento-paginas \
  --to-revisions [REVISION-NAME]=100 \
  --region us-east4 \
  --project devzap-prod
```

## 📦 Arquivos de Configuração

- **`app.yaml`** - Configuração do App Engine (se aplicável)
- **`Dockerfile`** - Container Docker
- **`.gcloudignore`** - Arquivos ignorados no deploy
- **`.dockerignore`** - Arquivos ignorados no build

## 🔐 Variáveis de Ambiente

As variáveis sensíveis devem ser configuradas no Google Cloud Console:

1. Acesse: Cloud Run > multiatendimento-paginas > Edit & Deploy New Revision
2. Vá em "Variables & Secrets"
3. Adicione as variáveis necessárias

**Nunca commite variáveis sensíveis no Git!**

## ✅ Checklist de Deploy

- [ ] Código testado localmente
- [ ] Commit feito com mensagem clara
- [ ] Push para repositório Git
- [ ] Deploy executado com sucesso
- [ ] Site verificado em produção
- [ ] Analytics funcionando
- [ ] Dashboard acessível
- [ ] Logs verificados sem erros

## 📞 Suporte

Em caso de problemas:
1. Verifique os logs no Cloud Run
2. Teste localmente com `docker build` e `docker run`
3. Consulte a documentação do Google Cloud Run
