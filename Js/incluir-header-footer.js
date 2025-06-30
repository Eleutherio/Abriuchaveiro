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

    // Corrige caminhos de imagens e links se estiver no GitHub Pages
    if (isGitHub) {
  const prefix = "/Abriuchaveiro/";

  const imgs = headerContainer.querySelectorAll("img");
  imgs.forEach(img => {
    const src = img.getAttribute("src");
    if (src && src.startsWith("./")) {
      img.src = prefix + src.slice(2);
    }
  });
}
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

  // Dropdown nav
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

    if (window.pageYOffset > 50) {
      cabecalho.style.transform = "translateY(-200%)";
    } else {
      cabecalho.style.transform = "translateY(0)";
    }

    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 50) {
        cabecalho.style.transform = "translateY(-200%)";
      } else {
        cabecalho.style.transform = "translateY(0)";
      }
    });
  }
});
