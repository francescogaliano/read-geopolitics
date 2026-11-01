// Cloudflare Pages Function: /spiegato/?id=<id>
// Serve la pagina dello Spiegato (file statico) mettendo titolo e descrizione veri nei meta tag,
// così il link condiviso su WhatsApp, Telegram, Instagram mostra l'anteprima dello Spiegato e non una generica.
const RG_API = "https://rg-api.briefinghub.workers.dev";
const esc = (t) => String(t == null ? "" : t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const plain = (t) => String(t || "").replace(/\*\*?/g, "").replace(/\[\[([^\]|]+)\|[^\]]+\]\]/g, "$1").trim();

export async function onRequest(ctx) {
  const res = await ctx.next();
  try {
    const url = new URL(ctx.request.url);
    const id = (url.searchParams.get("id") || "").replace(/[^a-z0-9-]/g, "");
    if (!id || url.searchParams.get("k") || !(res.headers.get("content-type") || "").includes("text/html")) return res;
    let m = null;
    try {
      const r = await fetch(RG_API + "/api/spiegato?meta=1&id=" + id, { cf: { cacheTtl: 300, cacheEverything: true } });
      if (r.ok) { const j = await r.json(); if (j && j.ok) m = { t: plain(j.titolo), d: plain(j.dek) }; }
    } catch (e) {}
    if (!m) {
      try {
        const r = await ctx.env.ASSETS.fetch(new URL("/spiegato/" + id + ".json", url.origin));
        if (r.ok) { const j = await r.json(); m = { t: plain(j.titolo), d: plain(j.dek) }; }
      } catch (e) {}
    }
    if (!m || !m.t) return res;
    const canon = url.origin + "/spiegato/?id=" + id, img = url.origin + "/img/globo.jpg";
    return new HTMLRewriter()
      .on("title", { element(e) { e.setInnerContent(m.t + " · Spiegato · Read Geopolitics"); } })
      .on('meta[property="og:title"]', { element(e) { e.setAttribute("content", m.t); } })
      .on('meta[property="og:description"]', { element(e) { e.setAttribute("content", m.d); } })
      .on('meta[name="description"]', { element(e) { e.setAttribute("content", m.d); } })
      .on("head", { element(e) { e.append('<meta property="og:url" content="' + esc(canon) + '"><meta property="og:image" content="' + esc(img) + '"><meta name="twitter:card" content="summary_large_image"><link rel="canonical" href="' + esc(canon) + '">', { html: true }); } })
      .transform(res);
  } catch (e) { return res; }
}
