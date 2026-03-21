document.addEventListener("DOMContentLoaded", () => {
  const bindRipple = (botao) => {
    if (!botao || botao.dataset.rippleBound === "1") return;

    botao.addEventListener("mouseenter", (e) => {
      const ripple = document.createElement("span");
      ripple.classList.add("ripple");

      const rect = botao.getBoundingClientRect();
      const tamanho = Math.max(botao.offsetWidth, botao.offsetHeight);
      ripple.style.width = ripple.style.height = `${tamanho}px`;
      ripple.style.left = `${e.clientX - rect.left - tamanho / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - tamanho / 2}px`;

      botao.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });

    botao.dataset.rippleBound = "1";
  };

  const bindRippleButtons = (root = document) => {
    if (root.matches?.(".botao__whatsapp")) {
      bindRipple(root);
      return;
    }

    root.querySelectorAll?.(".botao__whatsapp").forEach(bindRipple);
  };

  bindRippleButtons();

  const SELECTOR =
    'a[href*="elfsight.com/google-reviews-widget"], a[href*="elfsight.com/?utm"]';

  const tame = (a) => {
    if (!a) return;
    a.style.setProperty("position", "fixed", "important");
    a.style.setProperty("left", "-99999px", "important");
    a.style.setProperty("top", "-99999px", "important");
    a.style.setProperty("right", "auto", "important");
    a.style.setProperty("bottom", "auto", "important");
    a.style.setProperty("transform", "none", "important");
    a.style.setProperty("margin", "0", "important");
    a.style.setProperty("width", "1px", "important");
    a.style.setProperty("height", "1px", "important");
    a.style.setProperty("opacity", "0.001", "important");
    a.style.setProperty("z-index", "1", "important");
    a.style.setProperty("animation", "none", "important");
    a.style.setProperty("visibility", "visible", "important");
    a.setAttribute("data-elfsight-tamed", "1");
  };

  const applyAll = (root = document) =>
    root.querySelectorAll(SELECTOR).forEach(tame);

  applyAll();

  const mo = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === "attributes" && m.target.matches?.(SELECTOR)) {
        tame(m.target);
      }

      m.addedNodes.forEach((n) => {
        if (n.nodeType !== 1) return;
        bindRippleButtons(n);
        if (n.matches?.(SELECTOR)) tame(n);
        else applyAll(n);
      });
    }
  });

  mo.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["style", "class", "href"],
  });
});
