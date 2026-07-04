-- Script para deletar registros de analytics com data futura
-- Execute este script no Supabase SQL Editor

-- Ver quantos registros serão deletados (execute primeiro para verificar)
SELECT COUNT(*) as total_registros_futuros
FROM user_analytics
WHERE created_at > NOW();

-- Ver os registros que serão deletados (opcional - para conferir)
SELECT id, page_path, created_at
FROM user_analytics
WHERE created_at > NOW()
ORDER BY created_at DESC
LIMIT 100;

-- DELETAR os registros com data futura
-- ATENÇÃO: Esta operação é irreversível!
-- Descomente a linha abaixo para executar a deleção:

-- DELETE FROM user_analytics WHERE created_at > NOW();

-- Após executar, verificar quantos registros restaram
-- SELECT COUNT(*) as total_registros_restantes FROM user_analytics;
