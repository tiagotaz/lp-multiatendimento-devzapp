# 🔧 Configuração do Supabase - DevChat

Este guia explica como configurar o Supabase para salvar e gerenciar os leads capturados nas landing pages.

## 📋 Pré-requisitos

- Conta no Supabase: https://supabase.com
- Projeto criado no Supabase

## 🚀 Passo a Passo

### 1. Criar a Tabela de Leads

1. Acesse seu projeto no Supabase
2. Vá em **SQL Editor** no menu lateral
3. Clique em **New Query**
4. Cole o conteúdo do arquivo [`supabase-schema.sql`](supabase-schema.sql)
5. Clique em **Run** para executar o SQL

Isso irá criar:
- ✅ Tabela `leads` com todos os campos necessários
- ✅ Índices para melhor performance
- ✅ Row Level Security (RLS) configurado
- ✅ Políticas de acesso (anônimos podem inserir, autenticados podem ler/editar)

### 2. Criar Usuário Admin

1. Vá em **Authentication** → **Users** no Supabase
2. Clique em **Add user** → **Create new user**
3. Preencha:
   - **Email**: seu@email.com
   - **Password**: sua_senha_segura
   - **Auto Confirm User**: ✅ (marque esta opção)
4. Clique em **Create user**

### 3. Verificar Configuração

As credenciais do Supabase já estão configuradas em:
- **URL**: `https://lhjyijzbutujfyfsnxil.supabase.co`
- **Anon Key**: Configurada em [`assets/js/supabase-config.js`](assets/js/supabase-config.js)

## 🎯 Como Funciona

### Captura de Leads

Quando um usuário preenche o formulário:

1. **Webhook** → Envia para `https://webhook.integrations.devzapp.com.br/webhook/lp-chat`
2. **Supabase** → Salva no banco de dados (tabela `leads`)
3. **localStorage** → Backup local no navegador
4. **Meta Pixel** → Dispara eventos de conversão (2 pixels)
5. **Google Analytics** → Registra evento `generate_lead`

### Área Admin

**URL**: `/admin/` ou `/admin/index.html`

**Autenticação**:
- Redireciona para `/admin/login.html` se não estiver autenticado
- Login com email/senha criados no Supabase
- Sessão mantida automaticamente

**Funcionalidades**:
- ✅ Dashboard com estatísticas de leads
- ✅ Tabela com últimos 100 leads
- ✅ Filtro por origem (Google, Facebook, etc)
- ✅ Atualização automática a cada 30 segundos
- ✅ Botão de logout

## 📊 Dados Salvos

Cada lead contém:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | ID único do lead |
| `nome` | VARCHAR | Nome completo |
| `email` | VARCHAR | Email |
| `telefone` | VARCHAR | Telefone/WhatsApp |
| `atendentes` | VARCHAR | Quantidade de atendentes |
| `pagina` | TEXT | URL da página de captura |
| `utm_source` | VARCHAR | Origem (google, facebook, etc) |
| `utm_medium` | VARCHAR | Meio (cpc, organic, etc) |
| `utm_campaign` | VARCHAR | Nome da campanha |
| `utm_term` | VARCHAR | Termo/palavra-chave |
| `utm_content` | VARCHAR | Conteúdo/variação |
| `created_at` | TIMESTAMP | Data/hora de criação |
| `updated_at` | TIMESTAMP | Data/hora de atualização |

## 🔐 Segurança

### Row Level Security (RLS)

A tabela `leads` tem RLS habilitado com as seguintes políticas:

- **INSERT**: Usuários anônimos podem inserir (para captura de leads)
- **SELECT**: Apenas usuários autenticados podem ler
- **UPDATE**: Apenas usuários autenticados podem atualizar
- **DELETE**: Apenas usuários autenticados podem deletar

### Autenticação

- Login protegido com Supabase Auth
- Sessão gerenciada automaticamente
- Redirecionamento automático se não autenticado

## 🧪 Testar

### 1. Testar Captura de Lead

1. Acesse qualquer landing page
2. Preencha o formulário de lead
3. Envie
4. Verifique no console do navegador:
   ```
   [DevChat] ✓ Lead salvo no Supabase
   ```

### 2. Testar Área Admin

1. Acesse `/admin/`
2. Faça login com as credenciais criadas
3. Verifique se os leads aparecem na tabela
4. Teste o botão de logout

## 📝 Arquivos Modificados

- ✅ [`assets/js/supabase-config.js`](assets/js/supabase-config.js) - Configuração do Supabase
- ✅ [`assets/js/main.js`](assets/js/main.js) - Salvamento de leads
- ✅ [`admin/index.html`](admin/index.html) - Dashboard com autenticação
- ✅ [`admin/login.html`](admin/login.html) - Página de login
- ✅ [`index.html`](index.html) - Scripts do Supabase
- ✅ [`supabase-schema.sql`](supabase-schema.sql) - Schema do banco

## 🆘 Troubleshooting

### Erro: "Supabase client não disponível"

- Verifique se o script do Supabase está carregando: `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2`
- Verifique se o arquivo `supabase-config.js` está sendo carregado

### Erro: "Row Level Security"

- Execute o SQL do arquivo `supabase-schema.sql` novamente
- Verifique se as políticas foram criadas em **Authentication** → **Policies**

### Leads não aparecem no admin

- Verifique se você está autenticado
- Abra o console do navegador e veja se há erros
- Verifique se a tabela `leads` existe no Supabase

## 📞 Suporte

Para dúvidas ou problemas, verifique:
- Console do navegador (F12)
- Logs do Supabase em **Logs** → **API Logs**
