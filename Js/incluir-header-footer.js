document.addEventListener("DOMContentLoaded", async () => {
  // Define caminhos conforme profundidade da página
  const path = window.location.pathname;
  const isRoot = path === "/" || path.endsWith("/index.html");

  const prefix = isRoot ? "./" : "../";

  // Cria e injeta o HEADER
  const headerContainer = document.createElement("div");
  document.body.prepend(headerContainer);

  try {
    const headerResponse = await fetch(`${prefix}contents/header.html`);
    const headerHTML = await headerResponse.text();
    headerContainer.innerHTML = headerHTML;

    console.log("✅ Header carregado. Executando script...");

} catch (error) {
    console.error("❌ Erro ao carregar o header:", error);
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

    const links = document.querySelectorAll(".container__menu__navegacao__lista a");
    const currentPath = window.location.pathname.split("/").pop() || "index.html";

    links.forEach(link => {
        const linkPath = link.getAttribute("href").split("/").pop();
        if (linkPath === currentPath) {
            link.classList.add("active");
        }
});
    // Esconde o cabeçalho ao rolar a página
    const cabecalho = document.getElementById("cabecalho");
    if (cabecalho) {
      window.addEventListener("scroll", () => {
        if (pageYOffset > 50) {
          cabecalho.style.transition = ".3s ease-out";
          cabecalho.style.transform = "translateY(-200%)";
        } else {
          cabecalho.style.transform = "";
        }
      });
    }
    // ----------------
    // Ajusta o espaçamento (gap) dos itens com a classe .dropdown--hover ao passar o mouse (desativado)
    // const barra = document.querySelectorAll(".dropdown--hover");
    // barra.forEach(item => {
    //   item.addEventListener("mouseenter", () => {
    //     mouseInsideList = true;
    //     item.style.gap = "2.3em";
    //   });
    //   item.addEventListener("mouseleave", () => {
    //     mouseInsideList = false;
    //     item.style.gap = "1.3em";
    //   });
    // });
    // ----------------


  // Cria e injeta o FOOTER
  const footerContainer = document.createElement("div");
  document.body.appendChild(footerContainer);
  try {
    const footerResponse = await fetch(`${prefix}contents/footer.html`);
    const footerHTML = await footerResponse.text();
    footerContainer.innerHTML = footerHTML;
  } catch (error) {
    console.error("❌ Erro ao carregar o footer:", error);
  }
});
// --------------------