/* ==========================================================================
   script.js
   Funcionalidades da página: tema claro/escuro, ano automático,
   contador de cliques nos links, cópia do e-mail e mensagens de feedback.
   ========================================================================== */

// Executa o código somente depois que o HTML terminar de carregar
document.addEventListener("DOMContentLoaded", () => {
    setupTheme();
    setupYear();
    setupLinkClicks();
    setupCopyEmail();
  });
  
  /* --------------------------------------------------------------------------
     1. TEMA CLARO / ESCURO
     Guarda a escolha do usuário no localStorage para lembrar na próxima visita.
     -------------------------------------------------------------------------- */
  function setupTheme() {
    const root = document.documentElement;
    const toggleBtn = document.getElementById("theme-toggle");
    const icon = document.getElementById("theme-icon");
    const STORAGE_KEY = "linktree-theme";
  
    // Usa o tema salvo, ou a preferência do sistema operacional, como ponto de partida
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    const initialTheme = savedTheme || (prefersLight ? "light" : "dark");
  
    applyTheme(initialTheme);
  
    toggleBtn.addEventListener("click", () => {
      const isLight = root.getAttribute("data-theme") === "light";
      const nextTheme = isLight ? "dark" : "light";
      applyTheme(nextTheme);
      localStorage.setItem(STORAGE_KEY, nextTheme);
    });
  
    function applyTheme(theme) {
      if (theme === "light") {
        root.setAttribute("data-theme", "light");
        icon.textContent = "☀️";
        toggleBtn.setAttribute("aria-pressed", "true");
      } else {
        root.removeAttribute("data-theme");
        icon.textContent = "🌙";
        toggleBtn.setAttribute("aria-pressed", "false");
      }
    }
  }
  
  /* --------------------------------------------------------------------------
     2. ANO AUTOMÁTICO NO RODAPÉ
     -------------------------------------------------------------------------- */
  function setupYear() {
    const yearSpan = document.getElementById("year");
    yearSpan.textContent = new Date().getFullYear();
  }
  
  /* --------------------------------------------------------------------------
     3. CONTADOR DE CLIQUES NOS LINKS
     Apenas uma demonstração local: os números ficam salvos no navegador
     do próprio usuário, não em um servidor.
     -------------------------------------------------------------------------- */
  function setupLinkClicks() {
    const STORAGE_KEY = "linktree-clicks";
    const links = document.querySelectorAll(".link-btn");
    const counts = loadCounts();
  
    // Mostra os contadores já salvos assim que a página abre
    links.forEach((link) => updateCountBadge(link, counts));
  
    links.forEach((link) => {
      link.addEventListener("click", () => {
        const name = link.dataset.linkName;
        counts[name] = (counts[name] || 0) + 1;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(counts));
  
        updateCountBadge(link, counts);
        showToast(`Abrindo "${link.querySelector(".link-label").textContent}"...`);
        // O link continua funcionando normalmente: não usamos preventDefault().
      });
    });
  
    function loadCounts() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
      } catch {
        return {};
      }
    }
  
    function updateCountBadge(link, counts) {
      const badge = link.querySelector(".link-count");
      const name = link.dataset.linkName;
      const total = counts[name] || 0;
      badge.textContent = total > 0 ? `${total}x` : "";
    }
  }
  
  /* --------------------------------------------------------------------------
     4. COPIAR E-MAIL COM UM CLIQUE
     -------------------------------------------------------------------------- */
  function setupCopyEmail() {
    const copyBtn = document.getElementById("copy-email");
    if (!copyBtn) return;
  
    copyBtn.addEventListener("click", async () => {
      const email = copyBtn.dataset.email;
  
      try {
        await navigator.clipboard.writeText(email);
        showToast("E-mail copiado para a área de transferência!");
      } catch {
        // Alguns navegadores/contextos bloqueiam a Clipboard API (ex: sem HTTPS)
        showToast("Não foi possível copiar automaticamente. Copie manualmente: " + email);
      }
    });
  }
  
  /* --------------------------------------------------------------------------
     5. MENSAGEM DE FEEDBACK (TOAST)
     -------------------------------------------------------------------------- */
  let toastTimeout;
  function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("is-visible");
  
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 2200);
  }
