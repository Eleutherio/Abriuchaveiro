// Js/incluir-header-footer.js

document.addEventListener("DOMContentLoaded", async () => {
  const isGitHub = location.hostname.includes("github.io");
  const basePath = isGitHub ? "/Abriuchaveiro/" : "./";

  // HEADER
  const headerContainer = document.createElement("div");
  document.body.prepend(headerContainer);

  try {
    const headerResponse = await fetch(`${basePath}contents/header.html`);
    if (!headerResponse.ok) throw new Error("Erro ao carregar header");
    const headerHTML = await headerResponse.text();
    headerContainer.innerHTML = headerHTML;
  } catch (err) {
    console.error(err);
  }

  // FOOTER
  const footerContainer = document.createElement("div");
  document.body.append(footerContainer);

  try {
    const footerResponse = await fetch(`${basePath}contents/footer.html`);
    if (!footerResponse.ok) throw new Error("Erro ao carregar footer");
    const footerHTML = await footerResponse.text();
    footerContainer.innerHTML = footerHTML;
  } catch (err) {
    console.error(err);
  }

  // === Script de estilização da navegação ===

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
      // Só esconde se o mouse também não estiver na lista
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
      // Só esconde se o mouse também não estiver no dropdown
      if (!mouseInsideDropdown) {
        hideDropdown();
      }
    });
  }

  // muda o fundo do cabeçalho na página de contato para cor escura com blur
  const cabecalhoContainer = document.querySelector(".cabeçalho__container");
  if (window.location.pathname.endsWith("/contato.html")) {
    cabecalhoContainer.style.backgroundColor = "rgba(17, 17, 17, 0.53)";
    cabecalhoContainer.style.backdropFilter = "blur(5px)";
  }
  // ------------------

  const links = document.querySelectorAll(
    ".container__menu__navegacao__lista a"
  );
  const currentPath = window.location.pathname.split("/").pop() || "index.html";

  links.forEach((link) => {
    const linkPath = link.getAttribute("href").split("/").pop();
    if (linkPath === currentPath) {
      link.classList.add("active");
    }
  });
  // Esconde o cabeçalho ao rolar a página
  const cabecalho = document.getElementById("cabecalho");

  if (cabecalho) {
    // Aplica a transição uma vez, para garantir suavidade
    cabecalho.style.transition = ".3s ease-out";

    // Verifica a posição atual da página ao carregar
    if (window.pageYOffset > 50) {
      cabecalho.style.transform = "translateY(-200%)";
    } else {
      cabecalho.style.transform = "translateY(0)";
    }

    // Sempre escuta o scroll do usuário
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 50) {
        cabecalho.style.transform = "translateY(-200%)";
      } else {
        cabecalho.style.transform = "translateY(0)";
      }
    });
  }
});
// --------------------
