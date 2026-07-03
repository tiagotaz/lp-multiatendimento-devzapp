#!/bin/bash

# Script para adicionar analytics em todas as páginas HTML
# Adiciona os scripts antes do </body>

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Adicionando analytics em todas as páginas HTML...${NC}"

# Encontrar todos os arquivos HTML (exceto admin)
find . -name "*.html" -not -path "./admin/*" -not -path "./_modelo/*" | while read file; do
    # Verificar se já tem o script de analytics
    if grep -q "user-analytics.js" "$file"; then
        echo -e "${GREEN}✓ $file já tem analytics${NC}"
    else
        # Verificar se tem </body>
        if grep -q "</body>" "$file"; then
            # Adicionar scripts antes do </body>
            # Usar sed para adicionar as linhas
            sed -i.bak '/<\/body>/i\
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>\
<script src="/assets/js/supabase-config.js"></script>\
<script src="/assets/js/user-analytics.js"></script>
' "$file"
            
            # Remover backup
            rm "${file}.bak"
            
            echo -e "${GREEN}✓ Analytics adicionado em: $file${NC}"
        else
            echo -e "${YELLOW}⚠ $file não tem tag </body>${NC}"
        fi
    fi
done

echo -e "${GREEN}Concluído!${NC}"
