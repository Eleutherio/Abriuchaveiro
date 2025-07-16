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