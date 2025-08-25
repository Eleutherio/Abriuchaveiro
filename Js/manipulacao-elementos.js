document.addEventListener("DOMContentLoaded", () => {

      const botoes = document.querySelectorAll(".botao__whatsapp");

  botoes.forEach(botao => {
    botao.addEventListener("mouseenter", function (e) {
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
      }, 600); // mesmo tempo do CSS
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const SELECTOR =
    'a[href*="elfsight.com/google-reviews-widget"], a[href*="elfsight.com/?utm"]';

  const tame = (a) => {
    if (!a) return;
    // sobrescreve propriedades com !important (inline)
    a.style.setProperty('position', 'fixed', 'important');
    a.style.setProperty('left', '-99999px', 'important');
    a.style.setProperty('top', '-99999px', 'important');
    a.style.setProperty('right', 'auto', 'important');
    a.style.setProperty('bottom', 'auto', 'important');
    a.style.setProperty('transform', 'none', 'important');     // cancela translateX(-50%)
    a.style.setProperty('margin', '0', 'important');
    a.style.setProperty('width', '1px', 'important');
    a.style.setProperty('height', '1px', 'important');
    a.style.setProperty('opacity', '0.001', 'important');
    a.style.setProperty('z-index', '1', 'important');
    a.style.setProperty('animation', 'none', 'important');
    a.style.setProperty('visibility', 'visible', 'important'); // evita checks de hidden
    a.setAttribute('data-elfsight-tamed', '1');
  };

  const applyAll = (root = document) =>
    root.querySelectorAll(SELECTOR).forEach(tame);

  // aplica no que já existe
  applyAll();

  // observa novos nós e mudanças de atributos (eles reescrevem o style)
  const mo = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === 'attributes' && m.target.matches?.(SELECTOR)) {
        tame(m.target);
      }
      m.addedNodes.forEach((n) => {
        if (n.nodeType !== 1) return;
        if (n.matches?.(SELECTOR)) tame(n);
        else applyAll(n);
      });
    }
  });

  mo.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class', 'href']
  });
});
