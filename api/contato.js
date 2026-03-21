const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
const RECAPTCHA_EXPECTED_ACTION = "contato_form_submit";
const DEFAULT_FORMSPREE_ENDPOINT = "https://formspree.io/f/xqeynvqb";

function asObject(rawBody) {
  if (!rawBody) return {};
  if (typeof rawBody === "object") return rawBody;
  if (typeof rawBody === "string") {
    try {
      return JSON.parse(rawBody);
    } catch {
      return {};
    }
  }
  return {};
}

function sanitizeText(value, max = 500) {
  return String(value || "").trim().slice(0, max);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Método não permitido." });
  }

  const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
  if (!recaptchaSecret) {
    return res
      .status(500)
      .json({ message: "RECAPTCHA_SECRET_KEY não configurada no servidor." });
  }

  const body = asObject(req.body);

  const nome = sanitizeText(body.nome, 80);
  const email = sanitizeText(body.email, 120);
  const telefone = sanitizeText(body.telefone, 30);
  const bairro = sanitizeText(body.bairro, 80);
  const tipoServico = sanitizeText(body.tipo_servico, 80);
  const mensagem = sanitizeText(body.mensagem, 2500);
  const subject =
    sanitizeText(body._subject, 180) || "Novo contato do site - Abriu Chaveiro";

  const recaptchaToken = sanitizeText(body.recaptchaToken, 2048);
  const honeypot = sanitizeText(body.honeypot, 120);

  if (honeypot) {
    return res.status(200).json({ ok: true });
  }

  if (
    nome.length < 3 ||
    !isValidEmail(email) ||
    telefone.replace(/\D/g, "").length < 10 ||
    bairro.length < 3 ||
    !tipoServico ||
    !recaptchaToken
  ) {
    return res.status(400).json({ message: "Dados inválidos no formulário." });
  }

  try {
    const verifyPayload = new URLSearchParams();
    verifyPayload.set("secret", recaptchaSecret);
    verifyPayload.set("response", recaptchaToken);

    const forwardedFor = String(req.headers["x-forwarded-for"] || "")
      .split(",")[0]
      .trim();
    if (forwardedFor) {
      verifyPayload.set("remoteip", forwardedFor);
    }

    const verifyResponse = await fetch(RECAPTCHA_VERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: verifyPayload.toString(),
    });

    if (!verifyResponse.ok) {
      return res.status(502).json({ message: "Falha na validação do reCAPTCHA." });
    }

    const verifyResult = await verifyResponse.json();
    const minScore = Number(process.env.RECAPTCHA_MIN_SCORE || "0.5");

    const recaptchaValido =
      verifyResult?.success === true &&
      verifyResult?.action === RECAPTCHA_EXPECTED_ACTION &&
      typeof verifyResult?.score === "number" &&
      verifyResult.score >= minScore;

    if (!recaptchaValido) {
      return res
        .status(403)
        .json({ message: "Falha na verificação humana do reCAPTCHA." });
    }

    const formspreeEndpoint =
      process.env.FORMSPREE_ENDPOINT || DEFAULT_FORMSPREE_ENDPOINT;

    const formspreePayload = new URLSearchParams();
    formspreePayload.set("nome", nome);
    formspreePayload.set("email", email);
    formspreePayload.set("telefone", telefone);
    formspreePayload.set("bairro", bairro);
    formspreePayload.set("tipo_servico", tipoServico);
    formspreePayload.set("mensagem", mensagem);
    formspreePayload.set("_subject", subject);

    const formspreeResponse = await fetch(formspreeEndpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formspreePayload.toString(),
    });

    if (!formspreeResponse.ok) {
      return res.status(502).json({ message: "Falha no encaminhamento do contato." });
    }

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ message: "Erro interno no processamento do contato." });
  }
};
