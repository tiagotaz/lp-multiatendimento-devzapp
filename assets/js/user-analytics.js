/* DevChat - User Behavior Analytics (similar to Microsoft Clarity)
 * Rastreia: tempo em seções, cliques, scroll, saídas, heatmap
 */
(function () {
  "use strict";

  // Configuração
  var CONFIG = {
    sessionTimeout: 30 * 60 * 1000, // 30 minutos
    scrollThresholds: [25, 50, 75, 90, 100], // % de scroll
    sectionViewThreshold: 0.5, // 50% visível para contar
    heartbeatInterval: 5000, // 5 segundos
    storageKey: "devchat_analytics",
    maxEvents: 1000, // máximo de eventos por sessão
  };

  // Estado da sessão
  var session = {
    id: null,
    startTime: null,
    lastActivity: null,
    pageViews: [],
    events: [],
    scrollDepth: 0,
    sectionsViewed: {},
    clicks: [],
    exitIntent: false,
  };

  // Gerar ID único
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Obter ou criar sessão
  function getSession() {
    try {
      var stored = localStorage.getItem(CONFIG.storageKey);
      if (stored) {
        var data = JSON.parse(stored);
        var now = Date.now();
        // Se a última atividade foi há menos de 30min, continua a sessão
        if (data.lastActivity && now - data.lastActivity < CONFIG.sessionTimeout) {
          return data;
        }
      }
    } catch (e) {
      console.warn("[Analytics] Erro ao recuperar sessão:", e);
    }
    return null;
  }

  // Salvar sessão
  function saveSession() {
    try {
      session.lastActivity = Date.now();
      localStorage.setItem(CONFIG.storageKey, JSON.stringify(session));
    } catch (e) {
      console.warn("[Analytics] Erro ao salvar sessão:", e);
    }
  }

  // Inicializar sessão
  function initSession() {
    var existing = getSession();
    if (existing) {
      session = existing;
      console.log("[Analytics] Sessão continuada:", session.id);
    } else {
      session.id = generateId();
      session.startTime = Date.now();
      session.lastActivity = Date.now();
      session.pageViews = [];
      session.events = [];
      session.scrollDepth = 0;
      session.sectionsViewed = {};
      session.clicks = [];
      session.exitIntent = false;
      console.log("[Analytics] Nova sessão criada:", session.id);
    }
  }

  // Registrar evento
  function trackEvent(type, data) {
    if (session.events.length >= CONFIG.maxEvents) {
      return; // Limite atingido
    }

    var event = {
      type: type,
      timestamp: Date.now(),
      data: data || {},
    };

    session.events.push(event);
    saveSession();

    // Log para debug
    console.log("[Analytics] Evento:", type, data);
  }

  // Rastrear visualização de página
  function trackPageView() {
    // Capturar UTMs da URL
    var urlParams = new URLSearchParams(location.search);
    var utms = {
      utm_source: urlParams.get('utm_source') || '',
      utm_medium: urlParams.get('utm_medium') || '',
      utm_campaign: urlParams.get('utm_campaign') || '',
      utm_term: urlParams.get('utm_term') || '',
      utm_content: urlParams.get('utm_content') || '',
    };

    var pageData = {
      url: location.href,
      path: location.pathname,
      title: document.title,
      referrer: document.referrer,
      timestamp: Date.now(),
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      screen: {
        width: screen.width,
        height: screen.height,
      },
      utms: utms,
    };

    session.pageViews.push(pageData);
    trackEvent("page_view", pageData);
  }

  // Rastrear scroll depth
  var scrollTracked = {};
  function trackScroll() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var scrollPercent = Math.round((scrollTop / docHeight) * 100);

    if (scrollPercent > session.scrollDepth) {
      session.scrollDepth = scrollPercent;
    }

    // Rastrear marcos de scroll
    CONFIG.scrollThresholds.forEach(function (threshold) {
      if (scrollPercent >= threshold && !scrollTracked[threshold]) {
        scrollTracked[threshold] = true;
        trackEvent("scroll_depth", {
          depth: threshold,
          pixels: scrollTop,
        });
      }
    });
  }

  // Rastrear tempo em seções
  var sectionObserver;
  var sectionTimers = {};

  function trackSections() {
    if (!("IntersectionObserver" in window)) return;

    var sections = document.querySelectorAll("section[id], section[class*='section']");
    if (sections.length === 0) return;

    sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var sectionId = entry.target.id || entry.target.className.split(" ")[0] || "unknown";

          if (entry.isIntersecting && entry.intersectionRatio >= CONFIG.sectionViewThreshold) {
            // Seção entrou na viewport
            if (!sectionTimers[sectionId]) {
              sectionTimers[sectionId] = {
                startTime: Date.now(),
                totalTime: session.sectionsViewed[sectionId] || 0,
              };
              trackEvent("section_enter", { section: sectionId });
            }
          } else {
            // Seção saiu da viewport
            if (sectionTimers[sectionId]) {
              var timeSpent = Date.now() - sectionTimers[sectionId].startTime;
              var totalTime = sectionTimers[sectionId].totalTime + timeSpent;
              session.sectionsViewed[sectionId] = totalTime;
              trackEvent("section_exit", {
                section: sectionId,
                timeSpent: timeSpent,
                totalTime: totalTime,
              });
              delete sectionTimers[sectionId];
            }
          }
        });
        saveSession();
      },
      {
        threshold: CONFIG.sectionViewThreshold,
        rootMargin: "0px",
      }
    );

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  // Rastrear cliques (heatmap)
  function trackClicks() {
    document.addEventListener("click", function (e) {
      var target = e.target;
      var clickData = {
        x: e.clientX,
        y: e.clientY,
        pageX: e.pageX,
        pageY: e.pageY,
        element: target.tagName,
        id: target.id || null,
        class: target.className || null,
        text: target.textContent ? target.textContent.trim().substring(0, 50) : null,
        href: target.href || (target.closest("a") ? target.closest("a").href : null),
      };

      session.clicks.push(clickData);
      trackEvent("click", clickData);

      // Limitar número de cliques armazenados
      if (session.clicks.length > 500) {
        session.clicks = session.clicks.slice(-500);
      }
    });
  }

  // Rastrear exit intent (intenção de saída)
  function trackExitIntent() {
    var exitTracked = false;

    document.addEventListener("mouseleave", function (e) {
      if (e.clientY <= 0 && !exitTracked) {
        exitTracked = true;
        session.exitIntent = true;
        trackEvent("exit_intent", {
          timeOnPage: Date.now() - (session.pageViews[session.pageViews.length - 1]?.timestamp || session.startTime),
        });
      }
    });
  }

  // Rastrear saída da página
  function trackPageExit() {
    window.addEventListener("beforeunload", function () {
      // Finalizar timers de seções
      Object.keys(sectionTimers).forEach(function (sectionId) {
        var timeSpent = Date.now() - sectionTimers[sectionId].startTime;
        var totalTime = sectionTimers[sectionId].totalTime + timeSpent;
        session.sectionsViewed[sectionId] = totalTime;
      });

      var exitData = {
        url: location.href,
        timeOnPage: Date.now() - (session.pageViews[session.pageViews.length - 1]?.timestamp || session.startTime),
        scrollDepth: session.scrollDepth,
        sectionsViewed: Object.keys(session.sectionsViewed).length,
      };

      trackEvent("page_exit", exitData);

      // Enviar dados para o servidor (se disponível)
      sendAnalyticsToServer();
    });
  }

  // Heartbeat - atualiza atividade periodicamente
  function startHeartbeat() {
    setInterval(function () {
      session.lastActivity = Date.now();
      saveSession();
    }, CONFIG.heartbeatInterval);
  }

  // Enviar analytics para o servidor
  function sendAnalyticsToServer() {
    if (!window.saveAnalyticsToSupabase) return;

    // Capturar UTMs da última page view
    var lastPageView = session.pageViews[session.pageViews.length - 1];
    var utms = lastPageView?.utms || {};

    var analyticsData = {
      session_id: session.id,
      page_url: location.href,
      page_path: location.pathname,
      events: session.events,
      scroll_depth: session.scrollDepth,
      sections_viewed: session.sectionsViewed,
      clicks: session.clicks,
      time_on_page: Date.now() - (session.pageViews[session.pageViews.length - 1]?.timestamp || session.startTime),
      exit_intent: session.exitIntent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      utm_source: utms.utm_source || null,
      utm_medium: utms.utm_medium || null,
      utm_campaign: utms.utm_campaign || null,
      utm_term: utms.utm_term || null,
      utm_content: utms.utm_content || null,
    };

    window.saveAnalyticsToSupabase(analyticsData).catch(function (e) {
      console.warn("[Analytics] Erro ao enviar para servidor:", e);
    });
  }

  // Enviar analytics periodicamente (a cada 30 segundos)
  function startPeriodicSync() {
    setInterval(function () {
      sendAnalyticsToServer();
    }, 30000);
  }

  // API pública
  window.DevChatAnalytics = {
    getSession: function () {
      return session;
    },
    trackCustomEvent: function (eventName, data) {
      trackEvent("custom_" + eventName, data);
    },
    getSectionStats: function () {
      return session.sectionsViewed;
    },
    getClickHeatmap: function () {
      return session.clicks;
    },
    exportData: function () {
      return JSON.stringify(session, null, 2);
    },
    clearSession: function () {
      localStorage.removeItem(CONFIG.storageKey);
      console.log("[Analytics] Sessão limpa");
    },
  };

  // Inicialização
  function init() {
    initSession();
    trackPageView();
    trackSections();
    trackClicks();
    trackExitIntent();
    trackPageExit();
    startHeartbeat();
    startPeriodicSync();

    // Rastrear scroll com throttle
    var scrollTimeout;
    window.addEventListener(
      "scroll",
      function () {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(trackScroll, 100);
      },
      { passive: true }
    );

    console.log("[Analytics] Sistema inicializado");
  }

  // Iniciar quando o DOM estiver pronto
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
