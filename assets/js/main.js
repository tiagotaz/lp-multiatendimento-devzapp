/* DevChat - interações da landing page (vanilla JS, sem dependências) */
(function () {
  "use strict";

  /* ---- Header sombra ao rolar ---- */
  var header = document.getElementById("header");
  var onScroll = function () {
    if (window.scrollY > 8) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Menu mobile ---- */
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("mobileMenu");
  if (toggle && menu) {
    var closeMenu = function () {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    };
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll(".faq__item").forEach(function (item) {
    var btn = item.querySelector(".faq__q");
    var ans = item.querySelector(".faq__a");
    btn.addEventListener("click", function () {
      var isOpen = item.classList.contains("is-open");
      // fecha os demais
      document.querySelectorAll(".faq__item.is-open").forEach(function (other) {
        if (other !== item) {
          other.classList.remove("is-open");
          other.querySelector(".faq__a").style.maxHeight = null;
          other.querySelector(".faq__q").setAttribute("aria-expanded", "false");
        }
      });
      if (isOpen) {
        item.classList.remove("is-open");
        ans.style.maxHeight = null;
        btn.setAttribute("aria-expanded", "false");
      } else {
        item.classList.add("is-open");
        ans.style.maxHeight = ans.scrollHeight + "px";
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---- Tracking de conversão (Meta Pixel + GA4) ---- */
  var fire = function (event, params, gtagEvent) {
    console.log("[DevChat] Disparando eventos:", { fbq: event, gtag: gtagEvent || event, params: params });
    try {
      if (window.fbq) {
        window.fbq("track", event, params || {});
        console.log("[DevChat] ✓ Facebook Pixel disparado:", event);
      } else {
        console.warn("[DevChat] ⚠️ window.fbq não encontrado");
      }
    } catch (e) { console.error("[DevChat] Erro fbq:", e); }
    try {
      if (window.gtag) {
        window.gtag("event", gtagEvent || event, params || {});
        console.log("[DevChat] ✓ Google Analytics disparado:", gtagEvent || event);
      } else {
        console.warn("[DevChat] ⚠️ window.gtag não encontrado");
      }
    } catch (e) { console.error("[DevChat] Erro gtag:", e); }
  };

  /* ---- UTMs: captura da URL e persiste (sobrevive à navegação) ---- */
  var UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
  var getUTMs = function () {
    var stored = {};
    try { stored = JSON.parse(localStorage.getItem("devchat_utms") || "{}"); } catch (e) {}
    var qs = new URLSearchParams(location.search), found = false, out = {};
    UTM_KEYS.forEach(function (k) {
      var v = qs.get(k);
      if (v) { out[k] = v; found = true; } else if (stored[k]) { out[k] = stored[k]; }
    });
    if (found) { try { localStorage.setItem("devchat_utms", JSON.stringify(out)); } catch (e) {} }
    return out;
  };
  getUTMs(); // captura no carregamento

  /* ---- Máscara de telefone BR + limpeza de erro (delegada) ---- */
  var maskPhone = function (v) {
    var d = v.replace(/\D/g, "").slice(0, 11);
    if (d.length === 0) return "";
    if (d.length <= 2) return "(" + d;
    if (d.length <= 6) return "(" + d.slice(0, 2) + ") " + d.slice(2);
    if (d.length <= 10) return "(" + d.slice(0, 2) + ") " + d.slice(2, 6) + "-" + d.slice(6);
    return "(" + d.slice(0, 2) + ") " + d.slice(2, 7) + "-" + d.slice(7);
  };
  document.addEventListener("input", function (e) {
    var t = e.target;
    if (!t || !t.matches) return;
    if (t.matches("[data-lead-form] input[name=telefone]")) t.value = maskPhone(t.value);
    if (t.matches("[data-lead-form] input, [data-lead-form] select") && t.classList.contains("is-invalid")) {
      t.classList.remove("is-invalid");
      var m = t.form && t.form.querySelector("[data-error-for=" + t.name + "]");
      if (m) m.hidden = true;
    }
  });

  /* ---- Envio do lead para o webhook (nome, email, telefone, objetivo, UTMs) ---- */
  var ENDPOINT = "https://webhook.integrations.devzapp.com.br/webhook/lp-chat";
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var setError = function (form, field, on) {
    var el = form.querySelector("[name=" + field + "]");
    var msg = form.querySelector("[data-error-for=" + field + "]");
    if (el) el.classList.toggle("is-invalid", on);
    if (msg) msg.hidden = !on;
  };
  var showSuccess = function (form) {
    var box = form.closest(".modal, .lead-card") || form;
    box.innerHTML =
      '<div class="modal__ok"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" stroke="currentColor" stroke-width="1.6"/><path d="M7 12.5l3.2 3.2L17 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '<h3>Recebemos seus dados!</h3><p class="modal__sub">Nossos consultores vão entrar em contato com você pelo WhatsApp informado. Fique de olho no seu celular!</p></div>';
  };
  var initLeadForm = function (form) {
    if (!form || form.__leadInit) return;
    form.__leadInit = true;
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var get = function (n) { var el = form.querySelector("[name=" + n + "]"); return el ? el.value.trim() : ""; };
      var nome = get("nome"), email = get("email"), tel = get("telefone"), atend = get("atendentes");
      var telDigits = tel.replace(/\D/g, "");
      var nomeOk = nome.length >= 2, emailOk = EMAIL_RE.test(email);
      var telOk = telDigits.length >= 10 && telDigits.length <= 11;
      setError(form, "nome", !nomeOk);
      setError(form, "email", !emailOk);
      setError(form, "telefone", !telOk);
      var bad = (!nomeOk && form.querySelector("[name=nome]")) ||
                (!emailOk && form.querySelector("[name=email]")) ||
                (!telOk && form.querySelector("[name=telefone]"));
      if (bad) { bad.focus(); return; }

      var btn = form.querySelector("button[type=submit]");
      if (btn) { btn.disabled = true; btn.dataset.html = btn.innerHTML; btn.innerHTML = "Enviando..."; }

      var utms = getUTMs();
      var payload = {
        nome: nome, email: email, telefone: tel,
        objetivo: atend,          // quantidade de atendentes no escritório
        atendentes: atend,
        pagina: location.href,
        utm_source: utms.utm_source || "",
        utm_medium: utms.utm_medium || "",
        utm_campaign: utms.utm_campaign || "",
        utm_term: utms.utm_term || "",
        utm_content: utms.utm_content || ""
      };
      
      // Disparar eventos de conversão ANTES do fetch
      fire("Lead", { content_name: "teste_gratis", num_atendentes: atend }, "generate_lead");
      
      // Salvar lead localmente para estatísticas
      try {
        var leads = JSON.parse(localStorage.getItem("devchat_leads") || "[]");
        leads.push({
          nome: nome,
          email: email,
          telefone: tel,
          atendentes: atend,
          pagina: location.pathname,
          data: new Date().toISOString(),
          utms: utms
        });
        // Manter apenas os últimos 100 leads
        if (leads.length > 100) leads = leads.slice(-100);
        localStorage.setItem("devchat_leads", JSON.stringify(leads));
      } catch (e) {}
      
      var finish = function () {
        showSuccess(form);
      };
      fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }).then(finish).catch(finish); // sucesso de UX mesmo se a leitura da resposta falhar
    });
  };
  document.querySelectorAll("[data-lead-form]").forEach(initLeadForm);

  /* ---- Modal de captação (injetado uma vez, comum a todas as páginas) ---- */
  var modal = document.createElement("div");
  modal.className = "modal-ov";
  modal.id = "leadModal";
  modal.hidden = true;
  modal.innerHTML =
    '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="leadModalTitle">' +
      '<button class="modal__close" type="button" aria-label="Fechar">&times;</button>' +
      '<h3 id="leadModalTitle">Comece seu teste grátis</h3>' +
      '<p class="modal__sub">Preencha e um especialista entra em contato pelo seu WhatsApp.</p>' +
      '<form class="lead-form" data-lead-form data-origem="modal" novalidate>' +
        '<div><label for="m_nome">Seu nome</label><input type="text" id="m_nome" name="nome" placeholder="Nome e sobrenome" required /><p class="field-error" data-error-for="nome" hidden>Informe seu nome.</p></div>' +
        '<div><label for="m_email">Seu e-mail</label><input type="email" id="m_email" name="email" placeholder="voce@empresa.com.br" autocomplete="email" required /><p class="field-error" data-error-for="email" hidden>Informe um e-mail válido.</p></div>' +
        '<div><label for="m_tel">Seu WhatsApp</label><input type="tel" id="m_tel" name="telefone" placeholder="(00) 00000-0000" inputmode="numeric" maxlength="16" autocomplete="tel" required /><p class="field-error" data-error-for="telefone" hidden>Informe um WhatsApp válido com DDD.</p></div>' +
        '<div><label for="m_at">Quantidade de atendentes no escritório</label><select id="m_at" name="atendentes"><option value="1 a 2">1 a 2</option><option value="3 a 5">3 a 5</option><option value="6 a 10">6 a 10</option><option value="11 a 20">11 a 20</option><option value="21 ou mais">21 ou mais</option></select></div>' +
        '<button type="submit" class="btn btn--primary btn--lg btn--block">Quero começar agora<svg viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
        '<p class="lead-form__note">Seus dados estão seguros (LGPD).</p>' +
      '</form>' +
    '</div>';
  var modalReady = false;
  var ensureModal = function () {
    if (modalReady) return;
    document.body.appendChild(modal);
    initLeadForm(modal.querySelector("[data-lead-form]"));
    modal.addEventListener("click", function (e) {
      if (e.target === modal || e.target.closest(".modal__close")) closeModal();
    });
    modalReady = true;
  };
  var openModal = function () {
    ensureModal();
    modal.hidden = false;
    document.body.classList.add("modal-open");
    requestAnimationFrame(function () { modal.classList.add("is-open"); });
    var first = modal.querySelector("input[name=nome]");
    if (first) first.focus();
  };
  var closeModal = function () {
    modal.classList.remove("is-open");
    document.body.classList.remove("modal-open");
    setTimeout(function () { modal.hidden = true; }, 200);
  };
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !modal.hidden) closeModal(); });

  /* ---- Cliques nos CTAs: abre modal (especialista / teste grátis / demonstração) ---- */
  var MODAL_TRIGGER = /especialista|teste gr[aá]tis|demonstra/i;
  document.addEventListener("click", function (ev) {
    var a = ev.target.closest("a, button");
    if (!a) return;
    if (a.closest("[data-lead-form]")) return; // dentro de um form: deixa o submit agir
    var txt = (a.textContent || "").trim();
    var href = (a.getAttribute("href") || "").toLowerCase();
    if (MODAL_TRIGGER.test(txt)) {
      ev.preventDefault();
      openModal();
      return;
    }
    if (href.indexOf("wa.me") !== -1 || href.indexOf("whatsapp") !== -1) {
      // Por enquanto não redirecionamos para o WhatsApp: abrimos o modal de captação.
      ev.preventDefault();
      openModal();
      return;
    }
    if (a.classList.contains("btn--primary") || a.classList.contains("btn--light")) {
      fire("Lead", { content_name: txt.slice(0, 80) });
    }
  });

  /* ---- Reveal on scroll ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }
})();
