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
});
