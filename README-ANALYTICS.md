# 📊 Sistema de Analytics de Comportamento do Usuário

Sistema completo de rastreamento de comportamento do usuário, similar ao **Microsoft Clarity**, implementado para o DevChat.

## 🎯 Funcionalidades

### 1. **Rastreamento Automático**
- ✅ Tempo de permanência em cada seção da página
- ✅ Profundidade de scroll (scroll depth)
- ✅ Cliques e interações (heatmap)
- ✅ Intenção de saída (exit intent)
- ✅ Jornada do usuário entre páginas
- ✅ Sessões únicas com timeout de 30 minutos

### 2. **Métricas Capturadas**
- **Page Views**: URL, título, referrer, viewport
- **Scroll Depth**: Marcos de 25%, 50%, 75%, 90%, 100%
- **Section Viewing**: Tempo gasto em cada seção identificada
- **Clicks**: Coordenadas X/Y, elemento, texto, href
- **Events**: Todos os eventos customizados
- **Exit Intent**: Detecção de movimento do mouse para fora da página

### 3. **Armazenamento**
- **Local**: localStorage para persistência entre páginas
- **Servidor**: Supabase para análise centralizada
- **Sincronização**: A cada 30 segundos + ao sair da página

## 📁 Arquivos Criados

### JavaScript
1. **`assets/js/user-analytics.js`** - Módulo principal de rastreamento
   - Captura eventos automaticamente
   - Gerencia sessões
   - Sincroniza com servidor

2. **`assets/js/supabase-config.js`** - Atualizado com funções de analytics
   - `saveAnalyticsToSupabase()` - Salvar dados
   - `getAnalyticsFromSupabase()` - Buscar dados

### HTML
3. **`admin/analytics.html`** - Dashboard de visualização
   - Estatísticas gerais
   - Tempo por seção
   - Páginas mais visitadas
   - Heatmap de cliques
   - Eventos recentes

### SQL
4. **`supabase-analytics-schema.sql`** - Schema do banco de dados
   - Tabela `user_analytics`
   - Índices otimizados
   - Views agregadas
   - Políticas RLS

### Tracking
5. **`partials/tracking.html`** - Atualizado com script de analytics

## 🚀 Como Usar

### 1. Configurar o Banco de Dados

Execute o SQL no Supabase:

```bash
# No Supabase SQL Editor, execute:
supabase-analytics-schema.sql
```

### 2. Incluir nos HTMLs

O script já está incluído em `index.html`. Para outras páginas:

```html
<!-- Antes do </body> -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="/assets/js/supabase-config.js"></script>
<script src="/assets/js/user-analytics.js"></script>
```

### 3. Acessar o Dashboard

Abra no navegador:
```
http://localhost/admin/analytics.html
```

## 📊 API JavaScript

### Métodos Disponíveis

```javascript
// Obter sessão atual
DevChatAnalytics.getSession()

// Rastrear evento customizado
DevChatAnalytics.trackCustomEvent('button_click', { 
  button: 'cta-hero' 
})

// Obter estatísticas de seções
DevChatAnalytics.getSectionStats()

// Obter dados de cliques (heatmap)
DevChatAnalytics.getClickHeatmap()

// Exportar dados da sessão
DevChatAnalytics.exportData()

// Limpar sessão
DevChatAnalytics.clearSession()
```

### Exemplo de Uso

```javascript
// Rastrear clique em botão específico
document.getElementById('meu-botao').addEventListener('click', function() {
  DevChatAnalytics.trackCustomEvent('cta_clicked', {
    location: 'hero',
    text: this.textContent
  });
});

// Ver dados da sessão no console
console.log(DevChatAnalytics.getSession());
```

## 📈 Dados Coletados

### Estrutura da Sessão

```json
{
  "id": "unique-session-id",
  "startTime": 1234567890,
  "lastActivity": 1234567890,
  "pageViews": [
    {
      "url": "https://example.com/",
      "path": "/",
      "title": "Home",
      "timestamp": 1234567890,
      "viewport": { "width": 1920, "height": 1080 }
    }
  ],
  "events": [
    {
      "type": "scroll_depth",
      "timestamp": 1234567890,
      "data": { "depth": 50, "pixels": 800 }
    }
  ],
  "scrollDepth": 75,
  "sectionsViewed": {
    "hero": 5000,
    "recursos": 8000,
    "planos": 12000
  },
  "clicks": [
    {
      "x": 500,
      "y": 300,
      "element": "BUTTON",
      "text": "Começar agora",
      "href": "#planos"
    }
  ],
  "exitIntent": false
}
```

## 🎨 Dashboard - Visualizações

### 1. Estatísticas Gerais
- Sessões únicas
- Tempo médio por página
- Scroll médio
- Taxa de exit intent

### 2. Tempo por Seção
- Gráfico de barras mostrando tempo gasto em cada seção
- Ordenado por tempo decrescente

### 3. Páginas Mais Visitadas
- Tabela com visualizações, tempo médio, scroll médio
- Badge colorido para taxa de exit intent

### 4. Heatmap de Cliques
- Visualização dos pontos de clique na página
- Filtrado por página específica

### 5. Eventos Recentes
- Lista dos últimos 50 eventos
- Tipo, página, dados e timestamp

## 🔒 Privacidade e LGPD

- ✅ Não coleta dados pessoais identificáveis
- ✅ Apenas dados de comportamento anônimo
- ✅ Sessões identificadas por ID aleatório
- ✅ Dados armazenados de forma segura no Supabase
- ✅ RLS (Row Level Security) habilitado

## 🛠️ Configurações

### Ajustar Parâmetros

Edite em `assets/js/user-analytics.js`:

```javascript
var CONFIG = {
  sessionTimeout: 30 * 60 * 1000,      // 30 minutos
  scrollThresholds: [25, 50, 75, 90, 100], // % de scroll
  sectionViewThreshold: 0.5,            // 50% visível
  heartbeatInterval: 5000,              // 5 segundos
  maxEvents: 1000                       // máximo de eventos
};
```

## 📊 Queries Úteis

### Top 10 Páginas Mais Visitadas
```sql
SELECT 
  page_path,
  COUNT(*) as views,
  AVG(time_on_page) as avg_time,
  AVG(scroll_depth) as avg_scroll
FROM user_analytics
GROUP BY page_path
ORDER BY views DESC
LIMIT 10;
```

### Seções Mais Populares
```sql
SELECT * FROM analytics_popular_sections
LIMIT 20;
```

### Taxa de Exit Intent por Página
```sql
SELECT 
  page_path,
  COUNT(*) as total,
  SUM(CASE WHEN exit_intent THEN 1 ELSE 0 END) as exits,
  ROUND(SUM(CASE WHEN exit_intent THEN 1 ELSE 0 END)::numeric / COUNT(*) * 100, 2) as exit_rate
FROM user_analytics
GROUP BY page_path
ORDER BY exit_rate DESC;
```

## 🔄 Sincronização

### Quando os Dados São Enviados

1. **A cada 30 segundos** (heartbeat automático)
2. **Ao sair da página** (beforeunload)
3. **Ao mudar de página** (se SPA)

### Fallback

Se o envio falhar:
- Dados permanecem no localStorage
- Tentativa de reenvio na próxima sessão
- Máximo de 1000 eventos por sessão

## 🎯 Casos de Uso

### 1. Otimizar Landing Pages
- Identifique onde os usuários passam mais tempo
- Veja quais seções são ignoradas
- Ajuste o conteúdo baseado em dados reais

### 2. Melhorar Conversão
- Analise o comportamento antes de conversões
- Identifique pontos de abandono
- Teste diferentes layouts

### 3. UX/UI Design
- Heatmap mostra onde os usuários clicam
- Scroll depth indica se o conteúdo é visto
- Exit intent ajuda a criar estratégias de retenção

## 🐛 Debug

### Ver Dados no Console

```javascript
// Ver sessão atual
console.log(DevChatAnalytics.getSession());

// Ver estatísticas de seções
console.log(DevChatAnalytics.getSectionStats());

// Ver cliques
console.log(DevChatAnalytics.getClickHeatmap());

// Exportar tudo
console.log(DevChatAnalytics.exportData());
```

### Limpar Dados de Teste

```javascript
// Limpar localStorage
DevChatAnalytics.clearSession();
localStorage.clear();
```

## 📝 Próximos Passos

- [ ] Implementar exportação CSV no dashboard
- [ ] Adicionar filtros por data no dashboard
- [ ] Criar relatórios automáticos por email
- [ ] Implementar session replay (gravação de sessão)
- [ ] Adicionar comparação entre períodos
- [ ] Integrar com Google Analytics para correlação

## 🤝 Suporte

Para dúvidas ou problemas:
1. Verifique o console do navegador
2. Confira se o Supabase está configurado
3. Valide se a tabela `user_analytics` existe
4. Teste com `DevChatAnalytics.getSession()`

---

**Desenvolvido para DevChat** 🚀
Sistema de analytics de comportamento similar ao Microsoft Clarity
