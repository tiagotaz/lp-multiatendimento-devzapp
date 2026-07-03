#!/bin/bash

# 🚀 Script de Deploy Automatizado para Google Cloud Run
# Projeto: DevZapp - Multiatendimento Páginas
# Região: us-east4
# Projeto GCP: devzap-prod

set -e  # Parar em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
PROJECT_ID="devzap-prod"
SERVICE_NAME="multiatendimento-paginas"
REGION="us-east4"

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   🚀 Deploy DevZapp - Multiatendimento Páginas       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Verificar se está no diretório correto
if [ ! -f "index.html" ]; then
    echo -e "${RED}❌ Erro: Execute este script no diretório raiz do projeto${NC}"
    exit 1
fi

# Verificar se gcloud está instalado
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ Erro: Google Cloud SDK não está instalado${NC}"
    echo "Instale em: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Verificar autenticação
echo -e "${YELLOW}🔐 Verificando autenticação...${NC}"
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" &> /dev/null; then
    echo -e "${RED}❌ Não autenticado. Execute: gcloud auth login${NC}"
    exit 1
fi

# Configurar projeto
echo -e "${YELLOW}⚙️  Configurando projeto GCP...${NC}"
gcloud config set project $PROJECT_ID

# Perguntar por mensagem de commit
echo ""
read -p "📝 Mensagem do commit (Enter para usar padrão): " COMMIT_MSG
if [ -z "$COMMIT_MSG" ]; then
    COMMIT_MSG="deploy: atualização $(date '+%Y-%m-%d %H:%M:%S')"
fi

# Git: Add, Commit, Push
echo ""
echo -e "${YELLOW}📦 Preparando Git...${NC}"

# Verificar se há mudanças
if [[ -n $(git status -s) ]]; then
    echo -e "${GREEN}✓ Mudanças detectadas${NC}"
    
    git add .
    echo -e "${GREEN}✓ Arquivos adicionados${NC}"
    
    git commit -m "$COMMIT_MSG"
    echo -e "${GREEN}✓ Commit realizado${NC}"
    
    # Verificar se há remote configurado
    if git remote | grep -q 'origin'; then
        git push origin main || git push origin master
        echo -e "${GREEN}✓ Push realizado${NC}"
    else
        echo -e "${YELLOW}⚠️  Nenhum remote configurado, pulando push${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Nenhuma mudança para commitar${NC}"
fi

# Deploy no Cloud Run
echo ""
echo -e "${YELLOW}🚀 Iniciando deploy no Google Cloud Run...${NC}"
echo -e "${BLUE}   Projeto: $PROJECT_ID${NC}"
echo -e "${BLUE}   Serviço: $SERVICE_NAME${NC}"
echo -e "${BLUE}   Região: $REGION${NC}"
echo ""

gcloud run deploy $SERVICE_NAME \
  --source . \
  --region $REGION \
  --project $PROJECT_ID \
  --platform managed \
  --allow-unauthenticated \
  --quiet

# Verificar se deploy foi bem sucedido
if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║   ✅ Deploy realizado com sucesso!                    ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    # Obter URL do serviço
    SERVICE_URL=$(gcloud run services describe $SERVICE_NAME \
      --region $REGION \
      --project $PROJECT_ID \
      --format='value(status.url)')
    
    echo -e "${BLUE}🌐 URL do serviço:${NC}"
    echo -e "${GREEN}   $SERVICE_URL${NC}"
    echo ""
    
    echo -e "${BLUE}📊 Console GCP:${NC}"
    echo -e "${GREEN}   https://console.cloud.google.com/run/detail/$REGION/$SERVICE_NAME/observability/metrics?project=$PROJECT_ID${NC}"
    echo ""
    
    echo -e "${BLUE}📈 Analytics Dashboard:${NC}"
    echo -e "${GREEN}   $SERVICE_URL/admin/analytics.html${NC}"
    echo ""
    
    echo -e "${YELLOW}💡 Dicas:${NC}"
    echo "   • Verifique os logs: gcloud run services logs tail $SERVICE_NAME --region $REGION --project $PROJECT_ID"
    echo "   • Teste o analytics: Abra o console do navegador e digite 'DevChatAnalytics.getSession()'"
    echo ""
else
    echo ""
    echo -e "${RED}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║   ❌ Erro no deploy                                   ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}Verifique os logs acima para mais detalhes${NC}"
    exit 1
fi
