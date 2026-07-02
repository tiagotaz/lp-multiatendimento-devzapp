# 📋 Próximos Passos - DevChat

## ⚠️ IMPORTANTE: Verificar Anon Key do Supabase

O erro `Cannot read properties of undefined (reading 'signInWithPassword')` indica que a **anon key** do Supabase pode estar incorreta.

### Como obter a anon key correta:

1. Acesse seu projeto no Supabase: https://lhjyijzbutujfyfsnxil.supabase.co
2. Vá em **Settings** (⚙️) → **API**
3. Copie a chave **anon** / **public** (NÃO a service_role)
4. Substitua no arquivo [`assets/js/supabase-config.js`](assets/js/supabase-config.js) na linha 3

A chave deve começar com `eyJ...` e ser bem longa (JWT token).

## 🔧 Configurações Necessárias

### 1. Executar SQL no Supabase

1. Acesse: https://lhjyijzbutujfyfsnxil.supabase.co
2. Vá em **SQL Editor**
3. Clique em **New Query**
4. Cole todo o conteúdo do arquivo [`supabase-schema.sql`](supabase-schema.sql)
5. Clique em **Run** (ou pressione Ctrl+Enter)
6. Verifique se apareceu "Success. No rows returned"

### 2. Criar Usuário Admin

1. No Supabase, vá em **Authentication** → **Users**
2. Clique em **Add user** → **Create new user**
3. Preencha:
   - **Email**: seu@email.com (use um email real)
   - **Password**: SuaSenhaSegura123! (mínimo 6 caracteres)
   - **Auto Confirm User**: ✅ **MARQUE ESTA OPÇÃO**
4. Clique em **Create user**

### 3. Configurar Domínio Customizado (Opcional)

Se quiser usar `https://multiatendimento.devzapp.com.br` ao invés da URL do Cloud Run:

1. No Google Cloud Console, vá em **Cloud Run**
2. Clique no serviço `multiatendimento-paginas`
3. Vá na aba **MANAGE CUSTOM DOMAINS**
4. Clique em **ADD MAPPING**
5. Selecione o domínio `devzapp.com.br`
6. Adicione o subdomínio: `multiatendimento`
7. Siga as instruções para configurar o DNS

## 🧪 Testar a Integração

### Teste 1: Captura de Lead

1. Acesse qualquer landing page (ex: https://multiatendimento-paginas-rqdj55quuq-uk.a.run.app)
2. Preencha o formulário de lead
3. Abra o Console do navegador (F12)
4. Verifique se aparece:
   ```
   [DevChat] ✓ Lead salvo no Supabase
   ```
5. Vá no Supabase → **Table Editor** → **leads**
6. Verifique se o lead apareceu na tabela

### Teste 2: Login Admin

1. Acesse: https://multiatendimento-paginas-rqdj55quuq-uk.a.run.app/admin/
2. Deve redirecionar para `/admin/login.html`
3. Faça login com o email/senha criados
4. Deve redirecionar para `/admin/` e mostrar o dashboard
5. Verifique se os leads aparecem na tabela

### Teste 3: Tracking de Conversão

1. Preencha um formulário de lead
2. Abra o Console (F12)
3. Verifique se aparece:
   ```
   [DevChat] ✓ Facebook Pixel disparado: Lead
   [DevChat] ✓ Google Analytics disparado: generate_lead
   [DevChat] ✓ Lead salvo no Supabase
   ```

## 🐛 Troubleshooting

### Erro: "Supabase client não disponível"

**Causa**: Biblioteca do Supabase não carregou ou anon key incorreta

**Solução**:
1. Abra o Console do navegador (F12)
2. Vá na aba **Network**
3. Recarregue a página
4. Procure por `supabase-js` - deve estar com status 200
5. Se não aparecer, verifique se o CDN está acessível
6. Verifique a anon key em [`assets/js/supabase-config.js`](assets/js/supabase-config.js)

### Erro: "Cannot read properties of undefined (reading 'signInWithPassword')"

**Causa**: Anon key incorreta ou Supabase client não inicializado

**Solução**:
1. Obtenha a anon key correta no Supabase (Settings → API)
2. Substitua em [`assets/js/supabase-config.js`](assets/js/supabase-config.js)
3. Faça commit e deploy novamente

### Erro: "Row Level Security"

**Causa**: Políticas de RLS não foram criadas

**Solução**:
1. Execute o SQL do arquivo [`supabase-schema.sql`](supabase-schema.sql) novamente
2. Verifique em **Authentication** → **Policies** se as políticas existem

### Leads não aparecem no admin

**Possíveis causas**:
1. Não está autenticado → Faça login
2. Tabela não foi criada → Execute o SQL
3. Erro de permissão → Verifique as políticas RLS

**Solução**:
1. Abra o Console (F12)
2. Veja se há erros em vermelho
3. Verifique se a tabela `leads` existe no Supabase

## 📊 Verificar se está funcionando

### No Supabase:

1. **Table Editor** → **leads**: Deve mostrar os leads capturados
2. **Authentication** → **Users**: Deve mostrar o usuário admin criado
3. **API Logs**: Deve mostrar as requisições de INSERT e SELECT

### No Meta Pixel:

1. Acesse: https://business.facebook.com/events_manager2
2. Selecione o Pixel **716484894892905**
3. Vá em **Test Events**
4. Preencha um formulário na landing page
5. Deve aparecer o evento "Lead" em tempo real

### No Google Analytics:

1. Acesse: https://analytics.google.com
2. Selecione a propriedade **G-P15VS8SPRJ**
3. Vá em **Realtime** → **Events**
4. Preencha um formulário
5. Deve aparecer o evento "generate_lead"

## 🎯 URLs Importantes

- **Cloud Run**: https://multiatendimento-paginas-rqdj55quuq-uk.a.run.app
- **Admin**: https://multiatendimento-paginas-rqdj55quuq-uk.a.run.app/admin/
- **Login**: https://multiatendimento-paginas-rqdj55quuq-uk.a.run.app/admin/login.html
- **Supabase**: https://lhjyijzbutujfyfsnxil.supabase.co
- **GitHub**: https://github.com/tiagotaz/lp-multiatendimento-devzapp

## 📞 Suporte

Se precisar de ajuda:
1. Verifique o Console do navegador (F12) para erros
2. Verifique os logs do Supabase em **Logs** → **API Logs**
3. Verifique os logs do Cloud Run no Google Cloud Console
