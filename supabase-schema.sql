-- ============================================================
-- SCHEMA SUPABASE - Tabela de Leads DevChat
-- Execute este SQL no Supabase SQL Editor
-- ============================================================

-- Criar tabela de leads
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefone VARCHAR(50) NOT NULL,
  atendentes VARCHAR(50),
  pagina TEXT,
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255),
  utm_term VARCHAR(255),
  utm_content VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_utm_source ON leads(utm_source);
CREATE INDEX IF NOT EXISTS idx_leads_utm_campaign ON leads(utm_campaign);

-- Habilitar Row Level Security (RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Política: Permitir INSERT para usuários anônimos (para captura de leads)
CREATE POLICY "Permitir insert de leads anônimos"
ON leads FOR INSERT
TO anon
WITH CHECK (true);

-- Política: Permitir SELECT apenas para usuários autenticados
CREATE POLICY "Permitir select de leads para autenticados"
ON leads FOR SELECT
TO authenticated
USING (true);

-- Política: Permitir UPDATE apenas para usuários autenticados
CREATE POLICY "Permitir update de leads para autenticados"
ON leads FOR UPDATE
TO authenticated
USING (true);

-- Política: Permitir DELETE apenas para usuários autenticados
CREATE POLICY "Permitir delete de leads para autenticados"
ON leads FOR DELETE
TO authenticated
USING (true);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
CREATE TRIGGER update_leads_updated_at
BEFORE UPDATE ON leads
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Comentários na tabela
COMMENT ON TABLE leads IS 'Tabela de leads capturados nas landing pages do DevChat';
COMMENT ON COLUMN leads.id IS 'ID único do lead (UUID)';
COMMENT ON COLUMN leads.nome IS 'Nome completo do lead';
COMMENT ON COLUMN leads.email IS 'Email do lead';
COMMENT ON COLUMN leads.telefone IS 'Telefone/WhatsApp do lead';
COMMENT ON COLUMN leads.atendentes IS 'Quantidade de atendentes no escritório';
COMMENT ON COLUMN leads.pagina IS 'URL da página onde o lead foi capturado';
COMMENT ON COLUMN leads.utm_source IS 'Origem do tráfego (google, facebook, etc)';
COMMENT ON COLUMN leads.utm_medium IS 'Meio do tráfego (cpc, organic, etc)';
COMMENT ON COLUMN leads.utm_campaign IS 'Nome da campanha';
COMMENT ON COLUMN leads.utm_term IS 'Termo/palavra-chave da campanha';
COMMENT ON COLUMN leads.utm_content IS 'Conteúdo/variação do anúncio';
COMMENT ON COLUMN leads.created_at IS 'Data e hora de criação do registro';
COMMENT ON COLUMN leads.updated_at IS 'Data e hora da última atualização';
