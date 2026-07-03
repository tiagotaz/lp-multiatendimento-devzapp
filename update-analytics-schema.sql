-- Adicionar colunas de UTM na tabela user_analytics
-- Execute este SQL no Supabase SQL Editor

ALTER TABLE user_analytics 
ADD COLUMN IF NOT EXISTS utm_source TEXT,
ADD COLUMN IF NOT EXISTS utm_medium TEXT,
ADD COLUMN IF NOT EXISTS utm_campaign TEXT,
ADD COLUMN IF NOT EXISTS utm_term TEXT,
ADD COLUMN IF NOT EXISTS utm_content TEXT;

-- Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_user_analytics_utm_source ON user_analytics(utm_source);
CREATE INDEX IF NOT EXISTS idx_user_analytics_utm_medium ON user_analytics(utm_medium);

-- Comentários
COMMENT ON COLUMN user_analytics.utm_source IS 'Origem do tráfego (google, facebook, etc)';
COMMENT ON COLUMN user_analytics.utm_medium IS 'Meio do tráfego (cpc, social, email, etc)';
COMMENT ON COLUMN user_analytics.utm_campaign IS 'Nome da campanha';
COMMENT ON COLUMN user_analytics.utm_term IS 'Termo/palavra-chave';
COMMENT ON COLUMN user_analytics.utm_content IS 'Conteúdo/variação do anúncio';
