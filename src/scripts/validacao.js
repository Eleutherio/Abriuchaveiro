document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");
  if (!form) return;

  const nome = document.getElementById("input--nome");
  const email = document.getElementById("input--email");
  const telefone = document.getElementById("input--telefone");
  const bairro = document.getElementById("input--bairro");
  const tipoServico = document.getElementById("select");
  const mensagem = form.querySelector('textarea[name="mensagem"]');
  const subject = form.querySelector('input[name="_subject"]');
  const submit = document.getElementById("submit");
  const formStatus = document.getElementById("form-status");
  const honeypot = form.querySelector('input[name="_gotcha"]');

  const recaptchaSiteKey =
    document
      .querySelector('meta[name="recaptcha-site-key"]')
      ?.getAttribute("content")
      ?.trim() || "";

  const RECAPTCHA_PLACEHOLDER = "INSIRA_AQUI_SUA_SITE_KEY_RECAPTCHA_V3";
  const RECAPTCHA_ACTION = "contato_form_submit";
  const RECAPTCHA_SCRIPT_ID = "google-recaptcha-v3-api";
  const RECAPTCHA_NOT_CONFIGURED = "RECAPTCHA_NOT_CONFIGURED";
  const STORAGE_KEYS = {
    nome: "nome",
    email: "email",
    telefone: "telefone",
    bairro: "bairro",
  };

  let recaptchaScriptPromise = null;

  nome.value = localStorage.getItem(STORAGE_KEYS.nome) || "";
  email.value = localStorage.getItem(STORAGE_KEYS.email) || "";
  telefone.value = localStorage.getItem(STORAGE_KEYS.telefone) || "";
  bairro.value = localStorage.getItem(STORAGE_KEYS.bairro) || "";

  const salvarRascunho = () => {
    localStorage.setItem(STORAGE_KEYS.nome, nome.value);
    localStorage.setItem(STORAGE_KEYS.email, email.value);
    localStorage.setItem(STORAGE_KEYS.telefone, telefone.value);
    localStorage.setItem(STORAGE_KEYS.bairro, bairro.value);
  };

  [nome, email, telefone, bairro].forEach((input) => {
    input.addEventListener("input", salvarRascunho);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (honeypot && honeypot.value.trim() !== "") {
      formStatus.textContent = "Não foi possível processar o envio.";
      return;
    }

    if (!validarFormulario()) {
      formStatus.textContent = "Por favor, preencha todos os campos corretamente.";
      return;
    }

    const originalSubmitValue = submit.value;
    submit.disabled = true;
    submit.value = "Enviando...";
    formStatus.textContent = "";

    try {
      salvarRascunho();
      const recaptchaToken = await gerarTokenRecaptcha();
      const payload = {
        nome: nome.value.trim(),
        email: email.value.trim(),
        telefone: telefone.value.trim(),
        bairro: bairro.value.trim(),
        tipo_servico: tipoServico.value,
        mensagem: mensagem?.value?.trim() || "",
        _subject: subject?.value || "Novo contato do site - Abriu Chaveiro",
        honeypot: honeypot?.value?.trim() || "",
        recaptchaToken,
      };

      const response = await fetch(form.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.message || "FORM_SUBMIT_FAILED");
      }

      window.location.href = form.dataset.successUrl || "./obrigado.html";
    } catch (error) {
      if (error?.message === RECAPTCHA_NOT_CONFIGURED) {
        formStatus.textContent =
          "ReCAPTCHA não configurado. Defina sua Site Key no meta recaptcha-site-key.";
      } else {
        formStatus.textContent =
          "Não foi possível enviar. Tente novamente em alguns instantes.";
      }

      submit.disabled = false;
      submit.value = originalSubmitValue;
    }
  });

  function validarFormulario() {
    let valido = true;

    if (!validarNome()) valido = false;
    if (!validarEmail()) valido = false;
    if (!validarTelefone()) valido = false;
    if (!validarBairro()) valido = false;
    if (!validarTipoServico()) valido = false;

    return valido;
  }

  function validarNome() {
    if (nome.value.trim().length >= 3 && nome.value.trim().length <= 30) {
      nome.style.border = "1px solid green";
      return true;
    }

    nome.style.border = "1px solid red";
    return false;
  }

  function validarEmail() {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (regex.test(email.value.trim())) {
      email.style.border = "1px solid green";
      return true;
    }

    email.style.border = "1px solid red";
    return false;
  }

  function validarTelefone() {
    const digits = telefone.value.replace(/\D/g, "");
    const regex = /^\d{10,11}$/;

    if (regex.test(digits)) {
      telefone.style.border = "1px solid green";
      return true;
    }

    telefone.style.border = "1px solid red";
    return false;
  }

  function validarBairro() {
    if (bairro.value.trim().length >= 3) {
      bairro.style.border = "1px solid green";
      return true;
    }

    bairro.style.border = "1px solid red";
    return false;
  }

  function validarTipoServico() {
    if (tipoServico.value && tipoServico.value !== "0") {
      tipoServico.style.border = "1px solid green";
      return true;
    }

    tipoServico.style.border = "1px solid red";
    return false;
  }

  function validarInput(input) {
    switch (input.id) {
      case "input--nome":
        return validarNome();
      case "input--email":
        return validarEmail();
      case "input--telefone":
        return validarTelefone();
      case "input--bairro":
        return validarBairro();
      case "select":
        return validarTipoServico();
      default:
        return true;
    }
  }

  document.addEventListener(
    "focus",
    (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") {
        const inputs = document.querySelectorAll("input, select");
        inputs.forEach((input) => {
          if (input !== e.target && !validarInput(input)) {
            input.style.border = "";
          }
        });

        if (!validarInput(e.target)) {
          e.target.style.border = "1px solid red";
        }
      }
    },
    true,
  );

  function isRecaptchaConfigured() {
    return (
      recaptchaSiteKey &&
      recaptchaSiteKey.length > 0 &&
      recaptchaSiteKey !== RECAPTCHA_PLACEHOLDER
    );
  }

  function carregarScriptRecaptcha() {
    if (window.grecaptcha?.execute) {
      return Promise.resolve();
    }

    if (recaptchaScriptPromise) {
      return recaptchaScriptPromise;
    }

    recaptchaScriptPromise = new Promise((resolve, reject) => {
      const existingScript = document.getElementById(RECAPTCHA_SCRIPT_ID);
      if (existingScript) {
        existingScript.addEventListener("load", resolve, { once: true });
        existingScript.addEventListener("error", reject, { once: true });
        return;
      }

      const script = document.createElement("script");
      script.id = RECAPTCHA_SCRIPT_ID;
      script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(
        recaptchaSiteKey,
      )}`;
      script.async = true;
      script.defer = true;
      script.addEventListener("load", resolve, { once: true });
      script.addEventListener("error", reject, { once: true });
      document.head.appendChild(script);
    });

    return recaptchaScriptPromise;
  }

  async function gerarTokenRecaptcha() {
    if (!isRecaptchaConfigured()) {
      throw new Error(RECAPTCHA_NOT_CONFIGURED);
    }

    await carregarScriptRecaptcha();

    await new Promise((resolve) => {
      window.grecaptcha.ready(resolve);
    });

    const token = await window.grecaptcha.execute(recaptchaSiteKey, {
      action: RECAPTCHA_ACTION,
    });

    if (!token) {
      throw new Error("RECAPTCHA_TOKEN_FAILED");
    }

    return token;
  }
});
