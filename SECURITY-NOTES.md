# 🔒 Notas de Segurança - DevChat Analytics

## ✅ Supabase ANON_KEY é Segura para Expor

### Por que a ANON_KEY pode estar no frontend?

A `ANON_KEY` do Supabase é **projetada para ser pública** e exposta no código frontend. Ela é protegida por:

1. **Row Level Security (RLS)**: Políticas de segurança no banco de dados
2. **Permissões limitadas**: Só pode fazer o que as políticas RLS permitem
3. **Sem acesso administrativo**: Não pode modificar schema ou configurações

### ⚠️ O que NUNCA deve ser exposto:

- ❌ **SERVICE_ROLE_KEY**: Tem acesso total ao banco
- ❌ **Senhas de usuários**
- ❌ **Tokens de API privados**
- ❌ **Chaves de criptografia**

### ✅ Proteções Implementadas:

#### 1. Row Level Security (RLS)

```sql
-- Tabela user_analytics
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;

-- Política: Permitir INSERT anônimo
CREATE POLICY "Permitir inserção anônima de analytics"
  ON user_analytics
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Política: Permitir SELECT apenas para autenticados
CREATE POLICY "Permitir leitura de analytics para autenticados"
  ON user_analytics
  FOR SELECT
  TO authenticated
  USING (true);
```

#### 2. Tabela de Leads

```sql
-- Tabela leads
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Política: Permitir INSERT anônimo (para formulários)
CREATE POLICY "Permitir inserção anônima de leads"
  ON leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Política: Apenas autenticados podem ler
CREATE POLICY "Permitir leitura de leads para autenticados"
  ON leads
  FOR SELECT
  TO authenticated
  USING (true);
```

### 📊 O que a ANON_KEY pode fazer:

✅ **Permitido:**
- Inserir dados de analytics (anônimo)
- Inserir leads de formulários (anônimo)
- Ler dados de analytics (se autenticado)
- Ler leads (se autenticado)

❌ **Bloqueado:**
- Deletar dados
- Modificar dados de outros usuários
- Acessar tabelas sem políticas RLS
- Executar comandos administrativos
- Modificar schema do banco

### 🔐 Boas Práticas Implementadas:

1. **RLS habilitado em todas as tabelas**
2. **Políticas específicas por operação (INSERT, SELECT, UPDATE, DELETE)**
3. **Separação entre anon e authenticated**
4. **Logs de auditoria automáticos (created_at, updated_at)**
5. **Validação de dados no frontend e backend**

### 📚 Referências:

- [Supabase Security Best Practices](https://supabase.com/docs/guides/auth/row-level-security)
- [Understanding RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [API Keys](https://supabase.com/docs/guides/api/api-keys)

### 🎯 Resumo:

**A ANON_KEY no código frontend é SEGURA** porque:
- É pública por design
- Protegida por RLS
- Sem privilégios administrativos
- Auditada e monitorada

**Nunca exponha:**
- SERVICE_ROLE_KEY
- Senhas
- Tokens privados
- Chaves de criptografia

---

**Desenvolvido para DevChat** 🔒
Sistema seguro e em conformidade com LGPD
