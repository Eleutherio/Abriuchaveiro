(() => {
  const STORAGE_KEY = "abriuchaveiro.cookie-consent.v1";
  const ACCEPTED = "accepted";
  const REJECTED = "rejected";
  const BANNER_ID = "cookie-consent-banner";
  const ELFSIGHT_SCRIPT_SRC = "https://elfsightcdn.com/platform.js";

  let bannerEl = null;
  let elfsightScriptPromise = null;

  function readStoredConsent() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      if (raw === ACCEPTED || raw === REJECTED) return raw;

      const parsed = JSON.parse(raw);
      if (parsed && (parsed.external === ACCEPTED || parsed.external === REJECTED)) {
        return parsed.external;
      }
      return null;
    } catch {
      return null;
    }
  }

  function writeStoredConsent(value) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          external: value,
          savedAt: new Date().toISOString(),
        }),
      );
    } catch {
      // Ignore storage failures. The banner will simply reappear on reload.
    }
  }

  function getReviewsBlock() {
    return document.querySelector(".google__reviews--consent");
  }

  function getMapBlock() {
    return document.querySelector(".localizacao__mapa-wrap[data-consent-src]");
  }

  function loadMapBlock(block) {
    const iframe = block?.querySelector("iframe");
    if (!iframe) return;

    if (iframe.dataset.consentLoaded === "1" && iframe.getAttribute("src")) {
      return;
    }

    const src = block.dataset.consentSrc;
    if (!src) return;

    iframe.dataset.consentLoaded = "1";
    iframe.style.opacity = "1";
    iframe.src = src;
    block.querySelector(".localizacao__mapa-fallback")?.remove();
    block.querySelector(".localizacao__mapa-overlay")?.remove();
  }

  function ensureElfsightScript() {
    if (document.querySelector('script[data-cookie-elfsight="1"]')) {
      return Promise.resolve();
    }

    if (elfsightScriptPromise) {
      return elfsightScriptPromise;
    }

    elfsightScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = ELFSIGHT_SCRIPT_SRC;
      script.async = true;
      script.dataset.cookieElfsight = "1";
      script.addEventListener("load", resolve, { once: true });
      script.addEventListener("error", reject, { once: true });
      document.head.appendChild(script);
    });

    return elfsightScriptPromise;
  }

  function loadReviewsBlock(block) {
    const widget = block?.querySelector(".google__reviews__widget");
    if (!widget) return;

    if (widget.dataset.consentLoaded === "1") {
      return;
    }

    const appId = block.dataset.elfsightAppId;
    if (!appId) return;

    block.querySelector(".google__reviews__fallback")?.remove();
    block.classList.remove("google__reviews--consent");
    widget.style.opacity = "1";
    widget.style.minHeight = "0";
    widget.innerHTML = "";

    const app = document.createElement("div");
    app.className = `elfsight-app-${appId}`;
    app.setAttribute("data-elfsight-app-lazy", "");
    widget.appendChild(app);
    widget.dataset.consentLoaded = "1";

    ensureElfsightScript().catch(() => {
      // Se a lib falhar, o widget ficará vazio como acontece no embed nativo.
    });
  }

  function applyConsent(value) {
    const reviewsBlock = getReviewsBlock();
    const mapBlock = getMapBlock();

    if (value === ACCEPTED) {
      if (reviewsBlock) loadReviewsBlock(reviewsBlock);
      if (mapBlock) loadMapBlock(mapBlock);
    }
  }

  function ensureBanner() {
    if (bannerEl) return bannerEl;

    bannerEl = document.getElementById(BANNER_ID);
    if (bannerEl) return bannerEl;

    bannerEl = document.createElement("aside");
    bannerEl.id = BANNER_ID;
    bannerEl.className = "cookie-consent";
    bannerEl.setAttribute("role", "dialog");
    bannerEl.setAttribute("aria-modal", "false");
    bannerEl.setAttribute("aria-labelledby", "cookie-consent-title");
    bannerEl.setAttribute("aria-describedby", "cookie-consent-desc");
    bannerEl.innerHTML = `
      <div class="cookie-consent__panel">
        <div class="cookie-consent__header">
          <div class="cookie-consent__mark" aria-hidden="true">C</div>
          <div class="cookie-consent__body">
            <p class="cookie-consent__title" id="cookie-consent-title">Cookies e conteúdo externo</p>
            <p class="cookie-consent__text" id="cookie-consent-desc">
              Usamos apenas cookies estritamente necessários para lembrar sua escolha.
              O mapa e as avaliações externas do Google/Elfsight só são carregados com sua autorização.
              Na página de contato, o envio do formulário usa integração externa (Formspree). Você pode rever essa decisão no rodapé a qualquer momento.
            </p>
          </div>
        </div>

        <div class="cookie-consent__actions">
          <button type="button" class="cookie-consent__button cookie-consent__button--accept" data-cookie-accept>Permitir conteúdo externo</button>
          <button type="button" class="cookie-consent__button cookie-consent__button--reject" data-cookie-reject>Manter bloqueado</button>
        </div>
      </div>
    `;

    document.body.appendChild(bannerEl);
    return bannerEl;
  }

  function showBanner() {
    const banner = ensureBanner();
    banner.hidden = false;
    requestAnimationFrame(() => {
      banner.classList.add("is-visible");
    });
  }

  function hideBanner() {
    if (!bannerEl) return;
    bannerEl.classList.remove("is-visible");
    bannerEl.hidden = true;
  }

  function setConsent(value) {
    writeStoredConsent(value);
    hideBanner();
    window.setTimeout(() => {
      window.location.reload();
    }, 0);
  }

  function initBannerControls() {
    document.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-cookie-settings]");
      if (trigger) {
        event.preventDefault();
        showBanner();
        return;
      }

      const accept = event.target.closest("[data-cookie-accept]");
      if (accept) {
        setConsent(ACCEPTED);
        return;
      }

      const reject = event.target.closest("[data-cookie-reject]");
      if (reject) {
        setConsent(REJECTED);
        return;
      }

    });
  }

  function initConsent() {
    ensureBanner();
    initBannerControls();

    const stored = readStoredConsent();
    if (stored === ACCEPTED || stored === REJECTED) {
      applyConsent(stored);
      hideBanner();
      return;
    }

    showBanner();
  }

  document.addEventListener("DOMContentLoaded", initConsent);

  window.openCookieConsentBanner = showBanner;
})();
