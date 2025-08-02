document.addEventListener("DOMContentLoaded", async () => {
  const isGitHub = location.hostname.includes("github.io");
  const basePath = isGitHub ? "./Abriuchaveiro/" : "/"; 

  const base = document.createElement("base");
  base.href = basePath;
  document.head.prepend(base);

  // Função para ajustar atributos (src, href) adicionando basePath
  function ajustarAtributo(elementos, atributo) {
    elementos.forEach(el => {
      const valor = el.getAttribute(atributo);
      if (valor && !valor.startsWith("http") && !valor.startsWith("data:") && !valor.startsWith(basePath)) {
        el.setAttribute(atributo, basePath + valor.replace(/^\.?\//, ""));
      }
    });
  }

  // Carregar header
  const headerContainer = document.createElement("div");
  document.body.prepend(headerContainer);
  try {
    const headerResponse = await fetch(`${basePath}header.html`);
    if (!headerResponse.ok) throw new Error("Erro ao carregar header");
    const headerHTML = await headerResponse.text();
    headerContainer.innerHTML = headerHTML;

    // Ajusta src e href do header para basePath
    ajustarAtributo(headerContainer.querySelectorAll("img"), "src");
    ajustarAtributo(headerContainer.querySelectorAll("script[src]"), "src");
    ajustarAtributo(headerContainer.querySelectorAll("link[href]"), "href");

  } catch (err) {
    console.error(err);
  }

  // Carregar footer
  const footerContainer = document.createElement("div");
  document.body.append(footerContainer);
  try {
    const footerResponse = await fetch(`${basePath}footer.html`);
    if (!footerResponse.ok) throw new Error("Erro ao carregar footer");
    const footerHTML = await footerResponse.text();
    footerContainer.innerHTML = footerHTML;

    // Ajusta src e href do footer para basePath
    ajustarAtributo(footerContainer.querySelectorAll("img"), "src");
    ajustarAtributo(footerContainer.querySelectorAll("script[src]"), "src");
    ajustarAtributo(footerContainer.querySelectorAll("link[href]"), "href");

  } catch (err) {
    console.error(err);
  }

  // Ajustar src e href do documento principal
  ajustarAtributo(document.querySelectorAll("img"), "src");
  ajustarAtributo(document.querySelectorAll("script[src]"), "src");
  ajustarAtributo(document.querySelectorAll("link[href]"), "href");

  // Dropdown nav
  const frases = document.querySelectorAll(".text-wrap span");
    let index = 0;

  setInterval(() => {
    frases[index].classList.remove("active");
    index = (index + 1) % frases.length;
    frases[index].classList.add("active");
  }, 3000); // troca a cada 3 segundos


  const dropdown = document.querySelector("#menu__dropdown");
  const dropdownList = document.querySelector(".container__dropdown");

  let mouseInsideDropdown = false;
  let mouseInsideList = false;

  function showDropdown() {
    dropdown.style.overflow = "visible";
  }

  function hideDropdown() {
    dropdown.style.overflow = "hidden";
  }

  if (dropdown && dropdownList) {
    dropdown.addEventListener("mouseenter", () => {
      mouseInsideDropdown = true;
      showDropdown();
    });

    dropdown.addEventListener("mouseleave", () => {
      mouseInsideDropdown = false;
      if (!mouseInsideList) {
        hideDropdown();
      }
    });

    dropdownList.addEventListener("mouseenter", () => {
      mouseInsideList = true;
      showDropdown();
    });

    dropdownList.addEventListener("mouseleave", () => {
      mouseInsideList = false;
      if (!mouseInsideDropdown) {
        hideDropdown();
      }
    });
  }

  // Estilo do cabeçalho na página de contato
  const cabecalhoContainer = document.querySelector(".cabeçalho__container");
    if (window.location.pathname.endsWith("/contato.html")) {
      cabecalhoContainer.style.backgroundColor = "rgba(17, 17, 17, 0.53)";
      cabecalhoContainer.style.backdropFilter = "blur(5px)";
    }

  // Ativa link atual no menu
  const links = document.querySelectorAll(".container__menu__navegacao__lista a");
  const currentPath = window.location.pathname.split("/").pop() || "index.html";

  links.forEach((link) => {
    const linkPath = link.getAttribute("href").split("/").pop();
    if (linkPath === currentPath) {
      link.classList.add("active");
    }
  });

  // Esconde o cabeçalho ao rolar
  const cabecalho = document.getElementById("cabecalho");

  if (cabecalho) {
    cabecalho.style.transition = ".3s ease-out";

    function toggleCabecalho() {
      if (window.pageYOffset > 50) {
        cabecalho.style.transform = "translateY(-200%)";
      } else {
        cabecalho.style.transform = "translateY(0)";
      }
    }

    toggleCabecalho();
    window.addEventListener("scroll", toggleCabecalho);
  }
});
