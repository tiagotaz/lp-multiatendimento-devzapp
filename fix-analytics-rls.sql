-- Fix RLS Policy para user_analytics
-- Permitir inserção anônima de dados de analytics

-- Remover políticas existentes se houver
DROP POLICY IF EXISTS "Permitir inserção anônima de analytics" ON user_analytics;
DROP POLICY IF EXISTS "Permitir leitura de analytics para autenticados" ON user_analytics;

-- Desabilitar RLS temporariamente para testar
-- ALTER TABLE user_analytics DISABLE ROW LEVEL SECURITY;

-- OU manter RLS e criar políticas corretas:

-- Política 1: Permitir INSERT para usuários anônimos (anon role)
CREATE POLICY "Permitir inserção anônima de analytics"
  ON user_analytics
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Política 2: Permitir SELECT para usuários autenticados
CREATE POLICY "Permitir leitura de analytics para autenticados"
  ON user_analytics
  FOR SELECT
  TO authenticated
  USING (true);

-- Política 3: Permitir SELECT para anon (para o dashboard funcionar)
CREATE POLICY "Permitir leitura de analytics para anon"
  ON user_analytics
  FOR SELECT
  TO anon
  USING (true);

-- Verificar se as políticas foram criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'user_analytics';

-- Testar inserção (execute depois de criar as políticas)
-- INSERT INTO user_analytics (session_id, page_url, page_path) 
-- VALUES ('test-session', 'https://test.com', '/test');
