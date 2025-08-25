(() => {
  // 1) BASE dinâmica (GitHub Pages vs Vercel/Live Server)
  const isGitHub = location.hostname.includes('github.io');
  const basePath = isGitHub ? '/Abriuchaveiro/' : '/';

  // 2) Garante um único <base> e que ele está no topo do <head>
  const ensureBase = () => {
    let baseEl = document.head.querySelector('base');
    if (!baseEl) {
      baseEl = document.createElement('base');
      document.head.prepend(baseEl);
    } else if (document.head.firstChild !== baseEl) {
      document.head.prepend(baseEl);
    }
    baseEl.href = basePath;
  };
  ensureBase();

  // 3) Ajusta atributos relativos dentro de um container ESPECÍFICO
  function ajustarAtributo(container, selector, attr) {
    container.querySelectorAll(selector).forEach(el => {
      const val = el.getAttribute(attr);
      if (!val) return;

      // pula âncoras, tel/mail, absolutos, data URIs
      if (
        val.startsWith('#') ||
        val.startsWith('mailto:') ||
        val.startsWith('tel:') ||
        /^(https?:)?\/\//.test(val) ||
        val.startsWith('data:') ||
        val.startsWith('/') // já absoluto na raiz
      ) {
        return;
      }

      // normaliza relativo → prefixa basePath
      const fixed = (basePath + val.replace(/^\.?\//, '')).replace(/\/{2,}/g, '/');
      el.setAttribute(attr, fixed);
    });
  }

  async function carregarFragmento(url) {
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`Erro ao carregar ${url} (HTTP ${res.status})`);
    const html = await res.text();
    const wrap = document.createElement('div');
    wrap.innerHTML = html;

    // Corrige APENAS o que veio do fragmento
    ajustarAtributo(wrap, 'img[src]', 'src');
    ajustarAtributo(wrap, 'script[src]', 'src');
    ajustarAtributo(wrap, 'link[href]', 'href');

    return wrap;
  }

  (async () => {
    // HEADER
    try {
      const header = await carregarFragmento('header.html');
      document.body.prepend(header);
    } catch (e) {
      console.error(e);
    }

    // FOOTER
    try {
      const footer = await carregarFragmento('footer.html');
      document.body.append(footer);
    } catch (e) {
      console.error(e);
    }

    // --------- Interações da página ---------

    // Rotação de frases (com guardas)
    const frases = document.querySelectorAll('.text-wrap span');
    if (frases.length) {
      let index = 0;
      frases[0].classList.add('active');
      setInterval(() => {
        frases[index]?.classList.remove('active');
        index = (index + 1) % frases.length;
        frases[index]?.classList.add('active');
      }, 3000);
    }

    // Dropdown nav (com guardas)
    const dropdown = document.querySelector('#menu__dropdown');
    const dropdownList = document.querySelector('.container__dropdown');
    let mouseInsideDropdown = false;
    let mouseInsideList = false;

    function showDropdown() { if (dropdown) dropdown.style.overflow = 'visible'; }
    function hideDropdown() { if (dropdown) dropdown.style.overflow = 'hidden'; }

    if (dropdown && dropdownList) {
      dropdown.addEventListener('mouseenter', () => { mouseInsideDropdown = true; showDropdown(); });
      dropdown.addEventListener('mouseleave', () => { mouseInsideDropdown = false; if (!mouseInsideList) hideDropdown(); });
      dropdownList.addEventListener('mouseenter', () => { mouseInsideList = true; showDropdown(); });
      dropdownList.addEventListener('mouseleave', () => { mouseInsideList = false; if (!mouseInsideDropdown) hideDropdown(); });
    }

    // Estilo do cabeçalho na página de contato
    const cabecalhoContainer = document.querySelector('.cabeçalho__container');
    if (cabecalhoContainer && window.location.pathname.endsWith('/contato.html')) {
      cabecalhoContainer.style.backgroundColor = 'rgba(17, 17, 17, 0.53)';
      cabecalhoContainer.style.backdropFilter = 'blur(5px)';
    }

    // Ativa link atual no menu
    const links = document.querySelectorAll('.container__menu__navegacao__lista a[href]');
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    links.forEach(link => {
      const linkPath = link.getAttribute('href').split('/').pop();
      if (linkPath === currentPath) link.classList.add('active');
    });

    // Esconde o cabeçalho ao rolar
    const cabecalho = document.getElementById('cabecalho');
    if (cabecalho) {
      cabecalho.style.transition = '.3s ease-out';
      const toggleCabecalho = () => {
        cabecalho.style.transform = window.pageYOffset > 50 ? 'translateY(-200%)' : 'translateY(0)';
      };
      toggleCabecalho();
      window.addEventListener('scroll', toggleCabecalho, { passive: true });
    }
  })();
})();
