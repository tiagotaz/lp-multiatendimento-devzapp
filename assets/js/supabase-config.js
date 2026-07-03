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
    const { error } = await supabase
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
      }]);

    if (error) {
      console.error('[DevChat] Erro ao salvar lead no Supabase:', error);
      return { success: false, error: error.message };
    }

    console.log('[DevChat] ✓ Lead salvo no Supabase');
    return { success: true };
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

// Função para salvar analytics no Supabase
window.saveAnalyticsToSupabase = async function(analyticsData) {
  if (!supabase) {
    console.warn('[DevChat] Supabase client não disponível');
    return { success: false, error: 'Supabase client não disponível' };
  }

  console.log('[DevChat] Salvando analytics no Supabase:', analyticsData);

  try {
    const { error } = await supabase
      .from('user_analytics')
      .insert([{
        session_id: analyticsData.session_id,
        page_url: analyticsData.page_url,
        page_path: analyticsData.page_path,
        events: analyticsData.events,
        scroll_depth: analyticsData.scroll_depth,
        sections_viewed: analyticsData.sections_viewed,
        clicks: analyticsData.clicks,
        time_on_page: analyticsData.time_on_page,
        exit_intent: analyticsData.exit_intent,
        viewport_width: analyticsData.viewport?.width,
        viewport_height: analyticsData.viewport?.height,
        created_at: new Date().toISOString()
      }]);

    if (error) {
      console.error('[DevChat] Erro ao salvar analytics no Supabase:', error);
      return { success: false, error: error.message };
    }

    console.log('[DevChat] ✓ Analytics salvo no Supabase');
    return { success: true };
  } catch (e) {
    console.error('[DevChat] Exceção ao salvar analytics no Supabase:', e);
    return { success: false, error: e.message };
  }
};

// Função para buscar analytics do Supabase
window.getAnalyticsFromSupabase = async function(filters = {}) {
  if (!supabase) {
    console.warn('[DevChat] Supabase client não disponível');
    return { success: false, error: 'Supabase client não disponível', data: [] };
  }

  try {
    let query = supabase
      .from('user_analytics')
      .select('*')
      .order('created_at', { ascending: false });

    // Aplicar filtros opcionais
    if (filters.page_path) {
      query = query.eq('page_path', filters.page_path);
    }
    if (filters.session_id) {
      query = query.eq('session_id', filters.session_id);
    }
    if (filters.limit) {
      query = query.limit(filters.limit);
    } else {
      query = query.limit(100);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[DevChat] Erro ao buscar analytics do Supabase:', error);
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data: data || [] };
  } catch (e) {
    console.error('[DevChat] Exceção ao buscar analytics do Supabase:', e);
    return { success: false, error: e.message, data: [] };
  }
};
