-- Schema para tabela de analytics de comportamento do usuário
-- Similar ao Microsoft Clarity

-- Criar tabela user_analytics
CREATE TABLE IF NOT EXISTS user_analytics (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  page_url TEXT NOT NULL,
  page_path TEXT NOT NULL,
  events JSONB DEFAULT '[]'::jsonb,
  scroll_depth INTEGER DEFAULT 0,
  sections_viewed JSONB DEFAULT '{}'::jsonb,
  clicks JSONB DEFAULT '[]'::jsonb,
  time_on_page INTEGER DEFAULT 0,
  exit_intent BOOLEAN DEFAULT false,
  viewport_width INTEGER,
  viewport_height INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para melhorar performance de queries
CREATE INDEX IF NOT EXISTS idx_user_analytics_session_id ON user_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_user_analytics_page_path ON user_analytics(page_path);
CREATE INDEX IF NOT EXISTS idx_user_analytics_created_at ON user_analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_analytics_exit_intent ON user_analytics(exit_intent) WHERE exit_intent = true;

-- Índice GIN para buscar dentro dos JSONBs
CREATE INDEX IF NOT EXISTS idx_user_analytics_events ON user_analytics USING GIN (events);
CREATE INDEX IF NOT EXISTS idx_user_analytics_sections ON user_analytics USING GIN (sections_viewed);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_analytics_updated_at
  BEFORE UPDATE ON user_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) - permitir inserção anônima
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;

-- Política: permitir inserção para usuários anônimos
CREATE POLICY "Permitir inserção anônima de analytics"
  ON user_analytics
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Política: permitir leitura apenas para usuários autenticados
CREATE POLICY "Permitir leitura de analytics para autenticados"
  ON user_analytics
  FOR SELECT
  TO authenticated
  USING (true);

-- View para estatísticas agregadas por página
CREATE OR REPLACE VIEW analytics_page_stats AS
SELECT 
  page_path,
  COUNT(DISTINCT session_id) as unique_sessions,
  COUNT(*) as total_views,
  AVG(time_on_page) as avg_time_on_page,
  AVG(scroll_depth) as avg_scroll_depth,
  SUM(CASE WHEN exit_intent THEN 1 ELSE 0 END) as exit_intent_count,
  DATE(created_at) as date
FROM user_analytics
GROUP BY page_path, DATE(created_at)
ORDER BY date DESC, total_views DESC;

-- View para seções mais visualizadas
CREATE OR REPLACE VIEW analytics_popular_sections AS
SELECT
  page_path,
  section_id,
  AVG(time_spent) as avg_time_spent,
  COUNT(*) as view_count
FROM (
  SELECT
    page_path,
    jsonb_object_keys(sections_viewed) as section_id,
    (sections_viewed->>jsonb_object_keys(sections_viewed))::numeric as time_spent
  FROM user_analytics
  WHERE sections_viewed != '{}'::jsonb
) as section_data
GROUP BY page_path, section_id
ORDER BY view_count DESC, avg_time_spent DESC;

-- View para heatmap de cliques
CREATE OR REPLACE VIEW analytics_click_heatmap AS
SELECT
  page_path,
  click_data,
  COUNT(*) as click_count
FROM (
  SELECT
    page_path,
    jsonb_array_elements(clicks) as click_data
  FROM user_analytics
  WHERE jsonb_array_length(clicks) > 0
) as clicks_expanded
GROUP BY page_path, click_data
ORDER BY click_count DESC;

-- Comentários para documentação
COMMENT ON TABLE user_analytics IS 'Armazena dados de comportamento do usuário (similar ao Microsoft Clarity)';
COMMENT ON COLUMN user_analytics.session_id IS 'ID único da sessão do usuário';
COMMENT ON COLUMN user_analytics.events IS 'Array de eventos capturados (cliques, scroll, etc)';
COMMENT ON COLUMN user_analytics.sections_viewed IS 'Objeto com tempo gasto em cada seção da página';
COMMENT ON COLUMN user_analytics.clicks IS 'Array de cliques com coordenadas e elementos';
COMMENT ON COLUMN user_analytics.time_on_page IS 'Tempo total na página em milissegundos';
COMMENT ON COLUMN user_analytics.exit_intent IS 'Se o usuário demonstrou intenção de sair';
