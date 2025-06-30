document.addEventListener("DOMContentLoaded", () => {
  const isGitHubPages = location.hostname.includes("github.io");
  const basePath = isGitHubPages ? "/Abriuchaveiro/" : "./";

  function ajustarAtributo(elementos, atributo) {
    elementos.forEach(el => {
      const valor = el.getAttribute(atributo);
      if (valor && !valor.startsWith("http") && !valor.startsWith("data:")) {
        el.setAttribute(atributo, basePath + valor.replace(/^\.?\//, ""));
      }
    });
  }

  ajustarAtributo(document.querySelectorAll("img"), "src");
  ajustarAtributo(document.querySelectorAll("script[src]"), "src");
  ajustarAtributo(document.querySelectorAll("link[href]"), "href");
});
