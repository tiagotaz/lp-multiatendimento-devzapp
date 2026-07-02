-- ============================================================
-- FIX: Corrigir política RLS para permitir INSERT anônimo
-- Execute este SQL no Supabase SQL Editor
-- ============================================================

-- Remover políticas existentes (se houver)
DROP POLICY IF EXISTS "Permitir insert de leads anônimos" ON leads;
DROP POLICY IF EXISTS "Permitir select de leads para autenticados" ON leads;
DROP POLICY IF EXISTS "Permitir update de leads para autenticados" ON leads;
DROP POLICY IF EXISTS "Permitir delete de leads para autenticados" ON leads;

-- Garantir que RLS está habilitado
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Política: Permitir INSERT para TODOS (anônimos e autenticados)
CREATE POLICY "Permitir insert de leads para todos"
ON leads FOR INSERT
TO public
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
