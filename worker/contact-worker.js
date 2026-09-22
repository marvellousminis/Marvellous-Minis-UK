/*
 * Contact form handler for marvellousminisuk.co.uk
 *
 * Receives the enquiry form from the website and emails it on. Runs on
 * Cloudflare Workers, so no server to maintain and nothing to pay for at
 * this volume. See README.txt in this folder for how to deploy it.
 */

// Only these sites may post to the Worker. Anything else is refused, so the
// address cannot be used as an open relay for spam.
const ALLOWED_ORIGINS = [
  "https://marvellousminisuk.co.uk",
  "https://www.marvellousminisuk.co.uk",
  "https://marvellousminis.github.io"
];

const MAX_FIELD = 4000;

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin"
  };
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) }
  });
}

const clean = value => String(value == null ? "" : value).trim().slice(0, MAX_FIELD);

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(allowed) });
    }
    if (request.method !== "POST") {
      return json({ error: "Use POST" }, 405, allowed);
    }
    if (!ALLOWED_ORIGINS.includes(origin)) {
      return json({ error: "Not allowed from this site" }, 403, allowed);
    }

    let data;
    try {
      data = await request.json();
    } catch (err) {
      return json({ error: "Could not read the form" }, 400, allowed);
    }

    // The form carries a hidden field a human never sees. If it is filled in,
    // a bot filled it, so accept the request and quietly throw it away.
    if (clean(data.company)) return json({ ok: true }, 200, allowed);

    const name = clean(data.name);
    const email = clean(data.email);
    const message = clean(data.message);

    if (!name || !message) return json({ error: "Please fill in every field" }, 400, allowed);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: "That email address doesn't look right" }, 400, allowed);
    }

    const body =
      `New commission enquiry from marvellousminisuk.co.uk\n\n` +
      `Name:  ${name}\n` +
      `Email: ${email}\n\n` +
      `${message}\n`;

    // Sent through Resend. Swap this block for another provider if you prefer;
    // everything above stays the same.
    const sent = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: env.MAIL_FROM,
        to: [env.MAIL_TO],
        reply_to: email,
        subject: `Commission enquiry — ${name}`,
        text: body
      })
    });

    if (!sent.ok) {
      console.error("mail provider refused", sent.status, await sent.text());
      return json({ error: "Could not send right now" }, 502, allowed);
    }

    return json({ ok: true }, 200, allowed);
  }
};
