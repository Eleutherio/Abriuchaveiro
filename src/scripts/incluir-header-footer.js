(() => {
  const baseHref = new URL(".", location.href).href;

  const ensureBase = () => {
    let baseEl = document.head.querySelector("base");
    if (!baseEl) {
      baseEl = document.createElement("base");
      document.head.prepend(baseEl);
    } else if (document.head.firstChild !== baseEl) {
      document.head.prepend(baseEl);
    }
    baseEl.href = baseHref;
  };

  ensureBase();

  const iniciarCarregamentoPagina = () => {
    document.documentElement.classList.add("is-page-loading");
  };

  const aguardarEventoLoad = () =>
    new Promise((resolve) => {
      if (document.readyState === "complete") {
        resolve();
        return;
      }
      window.addEventListener("load", resolve, { once: true });
    });

  const aguardarImagensNaoLazy = () => {
    const pendentes = Array.from(document.images).filter(
      (img) => !img.complete && img.loading !== "lazy",
    );
    if (!pendentes.length) return Promise.resolve();

    return Promise.all(
      pendentes.map(
        (img) =>
          new Promise((resolve) => {
            img.addEventListener("load", resolve, { once: true });
            img.addEventListener("error", resolve, { once: true });
          }),
      ),
    );
  };

  const aguardarComTimeout = (promise, timeoutMs = 6000) =>
    Promise.race([
      promise,
      new Promise((resolve) => {
        window.setTimeout(resolve, timeoutMs);
      }),
    ]);

  const finalizarCarregamentoPagina = async () => {
    await aguardarEventoLoad();
    await aguardarComTimeout(aguardarImagensNaoLazy());
    document.documentElement.classList.remove("is-page-loading");
  };

  iniciarCarregamentoPagina();

  function ajustarAtributo(container, selector, attr) {
    container.querySelectorAll(selector).forEach((el) => {
      const val = el.getAttribute(attr);
      if (!val) return;

      if (
        val.startsWith("#") ||
        val.startsWith("mailto:") ||
        val.startsWith("tel:") ||
        /^(https?:)?\/\//.test(val) ||
        val.startsWith("data:") ||
        val.startsWith("/")
      ) {
        return;
      }

      const fixed = new URL(val, baseHref).href;
      el.setAttribute(attr, fixed);
    });
  }

  async function carregarFragmento(url) {
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) {
      throw new Error(`Erro ao carregar ${url} (HTTP ${res.status})`);
    }

    const html = await res.text();
    const wrap = document.createElement("div");
    wrap.innerHTML = html;

    ajustarAtributo(wrap, "img[src]", "src");
    ajustarAtributo(wrap, "script[src]", "src");
    ajustarAtributo(wrap, "link[href]", "href");

    return wrap;
  }

  async function inserirFragmento(url, inserter) {
    try {
      const fragmento = await carregarFragmento(url);
      inserter(fragmento);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async function inserirParciaisDeclarativas() {
    const slots = Array.from(document.querySelectorAll("[data-partial-src]"));
    if (!slots.length) return;

    await Promise.all(
      slots.map(async (slot) => {
        const url = slot.getAttribute("data-partial-src");
        if (!url) return;

        try {
          const fragmento = await carregarFragmento(url);
          slot.replaceWith(...Array.from(fragmento.childNodes));
        } catch (e) {
          console.error(e);
        }
      }),
    );
  }

  const ANO_INICIO_MERCADO = 2002;
  const FORMATOS_ANOS_MERCADO = {
    anos: (anos) => `${anos} anos`,
    "ha-anos": (anos) => `Há ${anos} anos`,
    "anos-mercado": (anos) => `${anos} anos de mercado`,
  };

  const obterAnosMercado = () =>
    Math.max(1, new Date().getFullYear() - ANO_INICIO_MERCADO);

  const atualizarAnosMercado = () => {
    const anos = obterAnosMercado();
    document.querySelectorAll("[data-market-years-format]").forEach((el) => {
      const format = el.getAttribute("data-market-years-format") || "anos";
      const formatar =
        FORMATOS_ANOS_MERCADO[format] || FORMATOS_ANOS_MERCADO.anos;
      el.textContent = formatar(anos);
    });
  };

  (async () => {
    try {
      await Promise.all([
        inserirFragmento("../partials/header.html", (fragmento) => {
          document.body.prepend(fragmento);
        }),
        inserirFragmento("../partials/footer.html", (fragmento) => {
          document.body.append(fragmento);
        }),
      ]);
      await inserirParciaisDeclarativas();
      atualizarAnosMercado();
      document.dispatchEvent(new CustomEvent("partials:ready"));

    const ajustarOffsetBotoesFlutuantes = () => {
      const footer = document.querySelector(".site-footer");
      if (!footer) return;

      const footerTop = footer.getBoundingClientRect().top;
      const overlap = Math.max(0, window.innerHeight - footerTop + 8);
      document.documentElement.style.setProperty(
        "--footer-overlap-offset",
        `${Math.round(overlap)}px`,
      );
    };

    ajustarOffsetBotoesFlutuantes();
    window.addEventListener("scroll", ajustarOffsetBotoesFlutuantes, {
      passive: true,
    });
    window.addEventListener("resize", ajustarOffsetBotoesFlutuantes);

    const frases = document.querySelectorAll(".text-wrap span");
    if (frases.length) {
      let index = 0;
      frases[0].classList.add("active");
      setInterval(() => {
        frases[index]?.classList.remove("active");
        index = (index + 1) % frases.length;
        frases[index]?.classList.add("active");
      }, 3000);
    }

    const cabecalhoContainer = document.querySelector(".cabecalho__container");
    if (
      cabecalhoContainer &&
      window.location.pathname.endsWith("/contato.html")
    ) {
      cabecalhoContainer.style.backgroundColor = "rgba(17, 17, 17, 0.53)";
      cabecalhoContainer.style.backdropFilter = "blur(5px)";
    }

    const normalizePath = (value) => {
      const stripped = (value || "").split("#")[0];
      const file = stripped.split("/").pop() || "index.html";
      return file.toLowerCase();
    };

    const hasHashFragment = (value) => (value || "").includes("#");

    const currentPath = normalizePath(window.location.pathname);
    const desktopPageLinks = document.querySelectorAll(
      ".container__menu__navegacao__lista > .container__menu__navegacao__lista--indices > a[href]",
    );
    const mobilePageLinks = document.querySelectorAll(
      ".mobile-menu__list--pages a[href]",
    );

    desktopPageLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;
      if (hasHashFragment(href)) return;

      if (normalizePath(href) === currentPath) {
        link.classList.add("active");
      }
    });

    mobilePageLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;

      if (normalizePath(href) === currentPath) {
        link.classList.add("active");
        link.classList.add("is-current");
      }
    });

    const mobileSectionsList = document.querySelector("[data-mobile-sections]");
    const mobileSectionsByPage = {
      "index.html": [
        { label: "Início", href: "#referencia-de-navegacao--inicio" },
        { label: "Serviços", href: "#referencia-de-navegacao--servicos" },
        { label: "Orçamento", href: "#referencia-de-navegacao--orcamento" },
        { label: "Avaliações", href: "#referencia-de-navegacao--avaliacao" },
        { label: "Localização", href: "#referencia-de-navegacao--localizacao" },
      ],
      "sobre.html": [
        { label: "Início", href: "#referencia-de-navegacao--inicio" },
        { label: "História", href: "#historia" },
        { label: "Diferenciais", href: "#diferenciais" },
        { label: "Bairros", href: "#bairros" },
        { label: "Avaliações", href: "#avaliacoes" },
        { label: "FAQ", href: "#faq" },
      ],
      "contato.html": [
        { label: "Início", href: "index.html#referencia-de-navegacao--inicio" },
        { label: "Serviços", href: "index.html#referencia-de-navegacao--servicos" },
        { label: "Orçamento", href: "index.html#referencia-de-navegacao--orcamento" },
        { label: "Avaliações", href: "index.html#referencia-de-navegacao--avaliacao" },
      ],
    };

    const fallbackSections = [
      { label: "Início", href: "index.html#referencia-de-navegacao--inicio" },
      { label: "Serviços", href: "index.html#referencia-de-navegacao--servicos" },
      { label: "Orçamento", href: "index.html#referencia-de-navegacao--orcamento" },
      { label: "Avaliações", href: "index.html#referencia-de-navegacao--avaliacao" },
    ];

    if (mobileSectionsList) {
      const sections =
        mobileSectionsByPage[currentPath] || fallbackSections;

      mobileSectionsList.innerHTML = sections
        .map(
          (section) =>
            `<li><a href="${section.href.startsWith("#") ? `${currentPath}${section.href}` : section.href}">${section.label}</a></li>`,
        )
        .join("");
    }

    const mobileMenu = document.getElementById("mobile-menu-panel");
    const mobileMenuToggle = document.querySelector(".mobile-header__toggle");
    const mobileMenuCloseButtons = document.querySelectorAll(
      "[data-mobile-menu-close]",
    );

    const closeMobileMenu = () => {
      if (!mobileMenu || !mobileMenuToggle) return;
      mobileMenu.classList.remove("is-open");
      mobileMenuToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("is-mobile-menu-open");
      window.setTimeout(() => {
        if (!mobileMenu.classList.contains("is-open")) {
          mobileMenu.hidden = true;
        }
      }, 240);
    };

    const openMobileMenu = () => {
      if (!mobileMenu || !mobileMenuToggle) return;
      mobileMenu.hidden = false;
      mobileMenuToggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("is-mobile-menu-open");
      window.requestAnimationFrame(() => {
        mobileMenu.classList.add("is-open");
      });
    };

    if (mobileMenu && mobileMenuToggle) {
      mobileMenuToggle.addEventListener("click", () => {
        const isOpen = mobileMenu.classList.contains("is-open");
        if (isOpen) closeMobileMenu();
        else openMobileMenu();
      });

      mobileMenuCloseButtons.forEach((button) => {
        button.addEventListener("click", closeMobileMenu);
      });

      mobileMenu.querySelectorAll("a[href]").forEach((link) => {
        link.addEventListener("click", closeMobileMenu);
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeMobileMenu();
      });

      window.addEventListener("resize", () => {
        if (window.innerWidth > 900) {
          closeMobileMenu();
        }
      });
    }

    document
      .querySelectorAll('.botao__voltar__topo, .rodape__atalhos-lista a[href="#"]')
      .forEach((link) => {
        link.addEventListener("click", (event) => {
          event.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
      });

      const cabecalho = document.getElementById("cabecalho");
      if (cabecalho) {
        cabecalho.style.transition = ".3s ease-out";
        const botaoVoltarTopo = document.querySelector(".botao__voltar__topo");

        let ultimoScrollY = Math.max(0, window.pageYOffset || 0);
        let cabecalhoRecolhido = ultimoScrollY > 50;
        const DELTA_MINIMO = 4;

        const aplicarEstadoCabecalho = () => {
          cabecalho.style.transform = cabecalhoRecolhido
            ? "translateY(-200%)"
            : "translateY(0)";

          if (botaoVoltarTopo) {
            botaoVoltarTopo.classList.toggle("is-visible", cabecalhoRecolhido);
          }
        };

        const toggleCabecalho = () => {
          const menuMobileAberto = document.body.classList.contains(
            "is-mobile-menu-open",
          );
          const scrollAtual = Math.max(0, window.pageYOffset || 0);

          if (menuMobileAberto) {
            cabecalhoRecolhido = false;
            aplicarEstadoCabecalho();
            ultimoScrollY = scrollAtual;
            return;
          }

          if (scrollAtual <= 8) {
            cabecalhoRecolhido = false;
            aplicarEstadoCabecalho();
            ultimoScrollY = scrollAtual;
            return;
          }

          if (scrollAtual > ultimoScrollY + DELTA_MINIMO) {
            cabecalhoRecolhido = true;
          } else if (scrollAtual < ultimoScrollY - DELTA_MINIMO) {
            cabecalhoRecolhido = false;
          }

          aplicarEstadoCabecalho();
          ultimoScrollY = scrollAtual;
        };

        aplicarEstadoCabecalho();
        window.addEventListener("scroll", toggleCabecalho, { passive: true });
      }
    } finally {
      await finalizarCarregamentoPagina();
    }
  })();
})();
