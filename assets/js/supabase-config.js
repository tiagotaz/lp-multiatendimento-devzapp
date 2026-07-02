/* Configuração do Supabase para DevChat */
const SUPABASE_URL = 'https://lhjyijzbutujfyfsnxil.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxoanlpanpidXR1amZ5ZnNueGlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3OTcwMDQsImV4cCI6MjA5NzM3MzAwNH0.5_lgRT0xPoVq43ZFjuwkRD2CenW8FI8wZOXC1abocT8';

// Inicializar cliente Supabase (evitar redeclaração)
if (typeof window !== 'undefined' && !window.supabaseClient) {
  if (window.supabase) {
    try {
      window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      console.log('[DevChat] Supabase client inicializado com sucesso');
    } catch (e) {
      console.error('[DevChat] Erro ao inicializar Supabase:', e);
    }
  } else {
    console.warn('[DevChat] Biblioteca Supabase não carregada');
  }
}

// Referência global para facilitar acesso
var supabase = window.supabaseClient || null;

// Função para salvar lead no Supabase
window.saveLeadToSupabase = async function(leadData) {
  if (!supabase) {
    console.warn('[DevChat] Supabase client não disponível');
    return { success: false, error: 'Supabase client não disponível' };
  }

  console.log('[DevChat] Tentando salvar lead no Supabase:', leadData);

  try {
    const { data, error } = await supabase
      .from('leads')
      .insert([{
        nome: leadData.nome,
        email: leadData.email,
        telefone: leadData.telefone,
        atendentes: leadData.atendentes,
        pagina: leadData.pagina,
        utm_source: leadData.utm_source || null,
        utm_medium: leadData.utm_medium || null,
        utm_campaign: leadData.utm_campaign || null,
        utm_term: leadData.utm_term || null,
        utm_content: leadData.utm_content || null,
        created_at: new Date().toISOString()
      }])
      .select();

    if (error) {
      console.error('[DevChat] Erro ao salvar lead no Supabase:', error);
      return { success: false, error: error.message };
    }

    console.log('[DevChat] ✓ Lead salvo no Supabase:', data);
    return { success: true, data: data };
  } catch (e) {
    console.error('[DevChat] Exceção ao salvar lead no Supabase:', e);
    return { success: false, error: e.message };
  }
};

// Função para buscar leads do Supabase
window.getLeadsFromSupabase = async function(limit = 100) {
  if (!supabase) {
    console.warn('[DevChat] Supabase client não disponível');
    return { success: false, error: 'Supabase client não disponível', data: [] };
  }

  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[DevChat] Erro ao buscar leads do Supabase:', error);
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data: data || [] };
  } catch (e) {
    console.error('[DevChat] Exceção ao buscar leads do Supabase:', e);
    return { success: false, error: e.message, data: [] };
  }
};
