/* Sito privato «Intelligenza artificiale» su /ai (dal 22/11/2026): stessa pagina e stessi dati della sezione /ig/ia del pannello,
   ma con accesso, API e «aggiungi a schermata Home» propri, così un giorno si sposta su un dominio suo senza riscritture.
   - /ai              la pagina (ai.html); senza accesso mostra il login
   - /ai/login        POST {password}: stessa password del pannello; cookie ai_sess con Path=/ai
   - /ig/ai-entra     dal pannello già aperto: crea la sessione /ai senza ridigitare la password (il cookie del pannello vale solo su /ig)
   - /ai/esci         chiude la sessione
   - /ai/api          POST: solo le azioni ai_* (aiPanelApi)
   - /ai/manifest.webmanifest, /ai/icon-180|192|512.png   app sul telefono (icona dal concept n. 1, provvisoria)
   I dati restano nelle collezioni ai_* del database (non vanno mai sul sito pubblico). */
import { aiPanelApi } from "./ai.js";
import { AI_PNG } from "./ai-icone.js";

const COOKIE = "ai_sess", MAX = 30 * 86400;
const HEAD = `<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><link rel="icon" href="/ai/icon-180.png" type="image/png"><link rel="apple-touch-icon" href="/ai/icon-180.png"><link rel="manifest" href="/ai/manifest.webmanifest"><meta name="apple-mobile-web-app-title" content="IA"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="theme-color" content="#0B1118"><meta name="robots" content="noindex">`;
const LOGIN = `<!doctype html><html lang="it"><head>${HEAD}<title>Intelligenza artificiale · accesso</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0B1118;color:#E8EDF2;font:16px/1.5 system-ui,sans-serif}form{width:min(340px,88vw)}h1{font:600 24px/1.2 Georgia,serif;margin:0 0 4px}p{color:#7F909E;margin:0 0 18px;font-size:14px}input,button{width:100%;box-sizing:border-box;min-height:48px;border-radius:10px;font:inherit}input{background:#111A23;border:1px solid #1F2B35;color:#E8EDF2;padding:0 14px}button{margin-top:10px;border:0;background:#86B4EA;color:#0B1118;font-weight:600;cursor:pointer}#e{color:#EF6F62;font-size:14px;min-height:22px;margin-top:8px}</style></head><body><form id="f"><h1>Intelligenza artificiale</h1><p>Strumento privato. Stessa password del pannello.</p><input id="p" type="password" autocomplete="current-password" placeholder="Password" autofocus><button>Entra</button><div id="e"></div></form><script>document.getElementById("f").onsubmit=e=>{e.preventDefault();fetch("/ai/login",{method:"POST",body:JSON.stringify({password:document.getElementById("p").value})}).then(r=>r.json()).then(j=>{if(j.ok)location.reload();else document.getElementById("e").textContent=j.error==="troppi_tentativi"?"Troppi tentativi: riprova tra 15 minuti.":"Password errata."}).catch(()=>{document.getElementById("e").textContent="Connessione assente."})}</script></body></html>`;
const ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0B1118"/><text x="32" y="42" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="28" fill="#86B4EA">IA</text></svg>`;
const MANIFEST = JSON.stringify({ name: "Intelligenza artificiale", short_name: "IA", start_url: "/ai", scope: "/ai", id: "/ai", display: "standalone", background_color: "#0B1118", theme_color: "#0B1118", icons: [192, 512].map((n) => ({ src: "/ai/icon-" + n + ".png", sizes: n + "x" + n, type: "image/png", purpose: "any" })) });
const cookie = (id, age) => `${COOKIE}=${id}; Path=/ai; HttpOnly; Secure; SameSite=Lax; Max-Age=${age}`;

async function aiSessione(request, env, h) { const id = h.getCookie(request, COOKIE); if (!id) return false; const s = await h.kvGet(env, "sess:" + id); return !!(s && s.exp > Date.now()); }
async function nuova(env, h) { const id = h.rid(); await h.kvSet(env, "sess:" + id, { exp: Date.now() + MAX * 1000, sito: "ai" }); return id; }

/* la stessa pagina del pannello, con testa, titolo e collegamenti del sito */
let PAG = null;
function pagina(src) {
  if (PAG) return PAG;
  PAG = src.replace('<link rel="icon" href="/ig/panel.svg?v=2" type="image/svg+xml">', HEAD.replace(/<meta charset="utf-8"><meta name="viewport"[^>]*>/, "").replace('<meta name="robots" content="noindex">', ""))
    .replace("<title>Intelligenza artificiale · Pannello</title>", "<title>Intelligenza artificiale</title>")
;
  return PAG;
}
/* restituisce una Response per i percorsi /ai…, altrimenti null */
export async function aiSito(request, env, p, method, url, h) {
  if (p !== "/ai" && !p.startsWith("/ai/")) return null;
  const html = (b, s = 200) => new Response(b, { status: s, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex" } });
  if (/^\/ai\/icon-(180|192|512)\.png$/.test(p)) return new Response(Uint8Array.from(atob(AI_PNG[p.slice(9, 12)]), (c) => c.charCodeAt(0)), { headers: { "content-type": "image/png", "cache-control": "public, max-age=86400" } });
  if (p === "/ai/icon.svg") return new Response(ICON, { headers: { "content-type": "image/svg+xml", "cache-control": "public, max-age=86400" } });
  if (p === "/ai/manifest.webmanifest") return new Response(MANIFEST, { headers: { "content-type": "application/manifest+json", "cache-control": "public, max-age=86400" } });
  if (p === "/ai/login" && method === "POST") {
    const b = await request.json().catch(() => ({})), ip = request.headers.get("cf-connecting-ip") || "x";
    const rl = (await h.kvGet(env, "rl:" + ip)) || { n: 0, t: Date.now() };
    if (Date.now() - rl.t > 900000) { rl.n = 0; rl.t = Date.now(); }
    if (rl.n >= 5) return h.json({ ok: false, error: "troppi_tentativi" }, 429);
    if (!h.safeEq(String(b.password || ""), env.PANEL_PASSWORD || env.WRITE_TOKEN || "")) { rl.n++; await h.kvSet(env, "rl:" + ip, rl); return h.json({ ok: false, error: "password_errata" }, 401); }
    await h.kvDel(env, "rl:" + ip);
    return new Response(JSON.stringify({ ok: true }), { headers: { "content-type": "application/json", "set-cookie": cookie(await nuova(env, h), MAX) } });
  }
  if (p === "/ai/esci") { const id = h.getCookie(request, COOKIE); if (id) await h.kvDel(env, "sess:" + id); return new Response(null, { status: 302, headers: { location: "/ai", "set-cookie": cookie("", 0) } }); }
  if (p === "/ai/api" && method === "POST") {
    if (!(await aiSessione(request, env, h))) return h.fail(401, "unauthorized");
    const b = await request.json().catch(() => null);
    if (!b || !String(b.action || "").startsWith("ai_")) return h.fail(400, "azione_non_ammessa");
    const r = await aiPanelApi(env, b, { kvGet: h.kvGet, kvSet: h.kvSet, romeToday: h.romeToday });
    return r ? h.json(r) : h.fail(404, "not_found");
  }
  if ((p === "/ai" || p === "/ai/") && method === "GET") return (await aiSessione(request, env, h)) ? html(pagina(h.AI_HTML)) : html(LOGIN, 401);
  return h.fail(404, "not_found");
}
/* /ig/ai-entra: dal pannello (cookie /ig) apre /ai senza password */
export async function aiEntra(env, h) { return new Response(null, { status: 302, headers: { location: "/ai", "set-cookie": cookie(await nuova(env, h), MAX) } }); }
