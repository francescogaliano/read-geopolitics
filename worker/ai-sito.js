/* Sito privato «Intelligenza artificiale» su /ai (dal 22/11/2026): stessa pagina e stessi dati della sezione /ig/ia del pannello,
   ma con accesso, API e «aggiungi a schermata Home» propri, così un giorno si sposta su un dominio suo senza riscritture.
   - /ai              la pagina (ai.html); senza accesso mostra il login
   - /ai/login        POST {password}: stessa password del pannello; cookie ai_sess con Path=/
   - /ig/ai-entra     dal pannello già aperto: crea la sessione e porta su ai.readgeopolitics.com/entra con un gettone usa-e-getta (niente password)
   - /ai/k            finestra di accesso usa-e-getta: si apre solo scrivendo la parola chiave (AI_PAROLA, default «#login») nella ricerca; chiede AI_PASSWORD (se manca, la password del pannello)
   - /ai/entra        scambia il gettone con il cookie di accesso. Il sito pubblico non ha nessun ingresso con password: /ai/accedi e /ai/login rispondono «non trovata»
   - /ai/esci         chiude la sessione
   - /ai/api          POST: solo le azioni ai_* (aiPanelApi)
   - /ai/manifest.webmanifest, /ai/icon-180|192|512.png   app sul telefono (simbolo del logo, senza scritta)
   I dati restano nelle collezioni ai_* del database (non vanno mai sul sito pubblico). */
import { aiPanelApi } from "./ai.js";
import { AI_PNG } from "./ai-icone.js";

const COOKIE = "ai_sess", MAX = 30 * 86400;
const HEAD = `<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><link rel="icon" href="/ai/icon-180.png?v=3" type="image/png"><link rel="apple-touch-icon" href="/ai/icon-180.png?v=3"><link rel="manifest" href="/ai/manifest.webmanifest?v=3"><meta name="apple-mobile-web-app-title" content="IA"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="theme-color" content="#0B1118"><meta name="robots" content="noindex">`;
const LOGIN = `<!doctype html><html lang="it"><head>${HEAD}<title>Intelligenza artificiale · accesso</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0B1118;color:#E8EDF2;font:16px/1.5 system-ui,sans-serif}form{width:min(340px,88vw)}h1{font:600 24px/1.2 Georgia,serif;margin:0 0 4px}p{color:#7F909E;margin:0 0 18px;font-size:14px}input,button{width:100%;box-sizing:border-box;min-height:48px;border-radius:10px;font:inherit}input{background:#111A23;border:1px solid #1F2B35;color:#E8EDF2;padding:0 14px}button{margin-top:10px;border:0;background:#86B4EA;color:#0B1118;font-weight:600;cursor:pointer}#e{color:#EF6F62;font-size:14px;min-height:22px;margin-top:8px}</style></head><body><form id="f"><h1>Intelligenza artificiale</h1><p>Strumento privato. Stessa password del pannello.</p><input id="p" type="password" autocomplete="current-password" placeholder="Password" autofocus><button>Entra</button><div id="e"></div></form><script>document.getElementById("f").onsubmit=e=>{e.preventDefault();fetch("/ai/login",{method:"POST",body:JSON.stringify({password:document.getElementById("p").value})}).then(r=>r.json()).then(j=>{if(j.ok)location.reload();else document.getElementById("e").textContent=j.error==="troppi_tentativi"?"Troppi tentativi: riprova tra 15 minuti.":"Password errata."}).catch(()=>{document.getElementById("e").textContent="Connessione assente."})}</script></body></html>`;
/* finestra di accesso (si apre solo dopo la parola chiave): sfondo scuro e riquadro centrato, come un popup */
const POPUP = `<!doctype html><html lang="it"><head>${HEAD}<title>Accesso</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:rgba(5,9,14,.92);color:#E8EDF2;font:16px/1.5 system-ui,sans-serif;padding:env(safe-area-inset-top) 16px env(safe-area-inset-bottom)}form{box-sizing:border-box;width:min(360px,100%);background:#0F1720;border:1px solid #1F2B35;border-radius:14px;padding:22px 20px 16px;box-shadow:0 20px 60px rgba(0,0,0,.5)}h1{font:600 22px/1.2 Georgia,serif;margin:0 0 4px}p{color:#7F909E;margin:0 0 16px;font-size:14px}input,button{width:100%;box-sizing:border-box;min-height:48px;border-radius:10px;font:inherit}input{background:#111A23;border:1px solid #1F2B35;color:#E8EDF2;padding:0 14px}button{margin-top:10px;border:0;background:#86B4EA;color:#0B1118;font-weight:600;cursor:pointer}a{display:block;text-align:center;color:#7F909E;font-size:14px;margin-top:12px;text-decoration:none;min-height:24px}#e{color:#EF6F62;font-size:14px;min-height:22px;margin-top:8px}</style></head><body><form id="f"><h1>Accesso</h1><p>Inserisci la password.</p><input id="p" type="password" autocomplete="current-password" placeholder="Password" autofocus><button>Entra</button><div id="e"></div><a href="/ai">Annulla</a></form><script>const E=document.getElementById("e");document.getElementById("f").onsubmit=e=>{e.preventDefault();fetch("/ai/k",{method:"POST",body:JSON.stringify({t:"__T__",password:document.getElementById("p").value})}).then(r=>r.json()).then(j=>{if(j.ok)return location.replace("/ai");E.textContent=j.error==="troppi_tentativi"?"Troppi tentativi: riprova tra 15 minuti.":j.error==="scaduta"?"Finestra scaduta: riparti dalla ricerca.":"Password errata (hai scritto "+j.lung+" caratteri)."}).catch(()=>{E.textContent="Connessione assente."})}</script></body></html>`;
const ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"> <rect x="0" y="0" width="128" height="128" rx="26" fill="#0A1728"/> <path d="M16 35L110 12V118L102 115V24L24 42V116L16 120Z" fill="#A6D4FA"/> <path d="M24 42L102 24V114C77 103 48 107 24 116Z" fill="#0A1728"/> <path d="M24 86C39 76 53 70 69 72C84 73 94 80 102 80V114C77 102 49 107 24 116Z" fill="#244D7A"/> <path d="M24 88C43 74 62 74 73 77C87 81 94 82 102 82V90C89 88 77 89 63 94C48 99 36 104 24 112Z" fill="#6CAAE2" opacity=".55"/> <path d="M24 110C39 96 56 93 70 96C84 99 94 104 102 105V114C80 105 55 107 24 116Z" fill="#1B3B62"/> <path d="M30 80C50 63 76 54 102 52V69C76 63 53 69 30 80Z" fill="#F5B94D"/> <path d="M24 110C37 100 49 96 61 96L74 84H102" stroke="#A6D4FA" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/> <path d="M42 114C51 110 58 109 66 108L81 96H102" stroke="#A6D4FA" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/> <circle cx="74" cy="84" r="4" fill="#F6F1E8"/> <circle cx="66" cy="108" r="4" fill="#F6F1E8"/> </svg>`;
const MANIFEST = JSON.stringify({ name: "Intelligenza artificiale", short_name: "IA", start_url: "/ai", scope: "/ai", id: "/ai", display: "standalone", background_color: "#0A1728", theme_color: "#0B1118", icons: [...[192, 512].map((n) => ({ src: "/ai/icon-" + n + ".png?v=3", sizes: n + "x" + n, type: "image/png", purpose: "any" })), ...[192, 512].map((n) => ({ src: "/ai/icon-m" + n + ".png?v=3", sizes: n + "x" + n, type: "image/png", purpose: "maskable" }))] });
/* Path=/ : vale sia per …/ai sia per il sottodominio ai.readgeopolitics.com (dove gli indirizzi non hanno /ai) */
const cookie = (id, age) => `${COOKIE}=${id}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${age}`;

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

/* loghi dei protagonisti e dei fornitori: l'icona ufficiale del sito, presa una volta e tenuta in cache 30 giorni (solo domini in elenco) */
export const AI_LOGHI = new Set(["anthropic.com","openai.com","google.com","gemini.google.com","cloud.google.com","x.ai","meta.com","mistral.ai","deepseek.com","qwen.ai","kimi.com","nvidia.com","amd.com","broadcom.com","huawei.com","tsmc.com","asml.com","aws.amazon.com","azure.microsoft.com","microsoft.com","oracle.com","coreweave.com","copilot.microsoft.com","sap.com","siemens.com","palantir.com","salesforce.com","ibm.com","cursor.com","samsung.com","intel.com","apple.com","perplexity.ai","cohere.com","alibabacloud.com","moonshot.ai","zhipuai.cn","bytedance.com","tencent.com","baidu.com","aleph-alpha.com","huggingface.co","databricks.com","snowflake.com","servicenow.com","adobe.com","accenture.com","deloitte.com","capgemini.com","reply.com","elevenlabs.io","stability.ai","midjourney.com","runwayml.com","scale.com","arm.com","micron.com","skhynix.com","cerebras.ai","groq.com"]);
async function logo(d) {
  if (!AI_LOGHI.has(d)) return new Response("", { status: 404 });
  const chiave = new Request("https://logo.cache/" + d), c = caches.default, hit = await c.match(chiave);
  if (hit) return hit;
  const r = await fetch("https://www.google.com/s2/favicons?domain=" + encodeURIComponent(d) + "&sz=128", { cf: { cacheTtl: 2592000 } }).catch(() => null);
  if (!r || !r.ok || !/image/.test(r.headers.get("content-type") || "")) return new Response("", { status: 404, headers: { "cache-control": "public, max-age=3600" } });
  const out = new Response(await r.arrayBuffer(), { headers: { "content-type": r.headers.get("content-type"), "cache-control": "public, max-age=2592000" } });
  await c.put(chiave, out.clone());
  return out;
}
/* restituisce una Response per i percorsi /ai…, altrimenti null */
export async function aiSito(request, env, p, method, url, h) {
  if (p !== "/ai" && !p.startsWith("/ai/")) return null;
  const html = (b, s = 200) => new Response(b, { status: s, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex" } });
  { const mi = p.match(/^\/ai\/icon-(180|192|512|m192|m512)\.png$/); if (mi) return new Response(Uint8Array.from(atob(AI_PNG[mi[1]]), (c) => c.charCodeAt(0)), { headers: { "content-type": "image/png", "cache-control": "public, max-age=86400" } }); }
  { const m = p.match(/^\/ai\/logo\/([a-z0-9.-]+)$/); if (m && method === "GET") return logo(m[1]); }
  if (p === "/ai/icon.svg") return new Response(ICON, { headers: { "content-type": "image/svg+xml", "cache-control": "public, max-age=86400" } });
  if (p === "/ai/manifest.webmanifest") return new Response(MANIFEST, { headers: { "content-type": "application/manifest+json", "cache-control": "no-cache" } });
  /* 23/11/2026: niente ingresso con password dal sito. Si entra solo dal pannello (già protetto) con il gettone di /ai/entra.
     /ai/accedi e /ai/login rispondono come pagine inesistenti, così non c'è nessuna porta da indovinare. */
  if (p === "/ai/accedi" || p === "/ai/login") return new Response("Pagina non trovata", { status: 404, headers: { "content-type": "text/plain; charset=utf-8", "x-robots-tag": "noindex" } });
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
    /* modo pubblico (variabile AI_PUBBLICO = "1"): senza accesso si leggono solo i contenuti, mai i clienti */
    const io = await aiSessione(request, env, h), pub = !io && env.AI_PUBBLICO === "1";
    const b = await request.json().catch(() => null);
    /* 23/11/2026 ingresso nascosto in due passaggi (vale anche nell'app installata sul telefono, che non condivide i cookie con il browser):
       1) la parola chiave scritta nella casella di ricerca (variabile AI_PAROLA, modificabile su Cloudflare; se manca vale «#login»)
          non dà accesso: restituisce solo l'indirizzo di una finestra di accesso usa-e-getta, valida 10 minuti;
       2) nella finestra serve la password del pannello. Il controllo della parola esiste solo qui: la pagina non la contiene. */
    if (!io && b && b.action === "ai_cerca") {
      const parola = String(env.AI_PAROLA || "#login").trim().toLowerCase(), q = String(b.q || "").trim().toLowerCase();
      if (parola.length >= 4 && h.safeEq(q, parola)) {
        const t = h.rid(); await h.kvSet(env, "aik:" + t, { exp: Date.now() + 600000, n: 0 });
        return new Response(JSON.stringify({ ok: true, storie: [], brevi: [], vai: "/ai/k?t=" + t }), { headers: { "content-type": "application/json", "cache-control": "no-store" } });
      }
    }
    if (!io && !pub) return h.fail(401, "unauthorized");
    if (!b || !["ai_get", "ai_cerca", "ai_approf", "ai_fonti", "ai_c360"].includes(String(b.action || ""))) return h.fail(400, "azione_non_ammessa");
    b._pubblico = !io;
    if (pub && b.action === "ai_get") {
      const k = new Request("https://ai.cache/get/" + encodeURIComponent(String(b.data || "oggi"))), hit = await caches.default.match(k);
      if (hit) return hit;
      const r0 = await aiPanelApi(env, b, { kvGet: h.kvGet, kvSet: h.kvSet, romeToday: h.romeToday });
      if (!(r0 instanceof Response)) return r0 ? h.json(r0) : h.fail(404, "not_found");
      const out = new Response(r0.body, { headers: { "content-type": "application/json; charset=utf-8", "cache-control": "public, max-age=300" } });
      await caches.default.put(k, out.clone());
      return out;
    }
    const r = await aiPanelApi(env, b, { kvGet: h.kvGet, kvSet: h.kvSet, romeToday: h.romeToday });
    return r instanceof Response ? r : r ? h.json(r) : h.fail(404, "not_found");
  }
  /* finestra di accesso aperta dalla parola chiave: esiste solo con un gettone valido, altrimenti «non trovata» */
  if (p === "/ai/k" && method === "GET") {
    const t = String(url.searchParams.get("t") || ""), k = t && (await h.kvGet(env, "aik:" + t));
    if (!k || k.exp < Date.now()) return new Response("Pagina non trovata", { status: 404, headers: { "content-type": "text/plain; charset=utf-8", "x-robots-tag": "noindex" } });
    return html(POPUP.replace("__T__", t.replace(/[^a-z0-9]/gi, "")));
  }
  if (p === "/ai/k" && method === "POST") {
    const b = await request.json().catch(() => ({})), t = String(b.t || ""), k = t && (await h.kvGet(env, "aik:" + t)), ip = request.headers.get("cf-connecting-ip") || "x";
    if (!k || k.exp < Date.now()) return h.json({ ok: false, error: "scaduta" }, 401);
    const rl = (await h.kvGet(env, "rl:" + ip)) || { n: 0, t: Date.now() };
    if (Date.now() - rl.t > 900000) { rl.n = 0; rl.t = Date.now(); }
    if (rl.n >= 5) { await h.kvDel(env, "aik:" + t); return h.json({ ok: false, error: "troppi_tentativi" }, 429); }
    /* password della finestra: AI_PASSWORD (variabile propria, modificabile su Cloudflare); se manca, quella del pannello. Spazi ai bordi ignorati */
    const pw = String(b.password || "").trim(), atteso = String(env.AI_PASSWORD || env.PANEL_PASSWORD || env.WRITE_TOKEN || "").trim(), ok = !!atteso && h.safeEq(pw, atteso);
    if (!ok) {
      rl.n++; await h.kvSet(env, "rl:" + ip, rl); k.n++;
      if (k.n >= 3) await h.kvDel(env, "aik:" + t); else await h.kvSet(env, "aik:" + t, k);
      return h.json({ ok: false, error: k.n >= 3 ? "scaduta" : "password_errata", lung: pw.length }, 401);
    }
    await h.kvDel(env, "aik:" + t); await h.kvDel(env, "rl:" + ip);
    return new Response(JSON.stringify({ ok: true }), { headers: { "content-type": "application/json", "set-cookie": cookie(await nuova(env, h), MAX) } });
  }
  if (p === "/ai/entra" && method === "GET") { const t = String(url.searchParams.get("t") || ""), r = t && (await h.kvGet(env, "aitok:" + t)); if (t) await h.kvDel(env, "aitok:" + t); if (r && r.exp > Date.now()) return new Response(null, { status: 302, headers: { location: "/ai", "set-cookie": cookie(r.id, MAX) } }); return new Response(null, { status: 302, headers: { location: "/ai" } }); }
  if (p === "/ai/accedi" && method === "GET") return (await aiSessione(request, env, h)) ? new Response(null, { status: 302, headers: { location: "/ai" } }) : html(LOGIN, 200);
  if ((p === "/ai" || p === "/ai/" || /^\/ai\/(temi|filiera|protagonisti|filoni|archivio|clienti)\/?$/.test(p)) && method === "GET") { /* ogni vista ha il suo indirizzo: stessa pagina, la vista la sceglie la pagina */ if (await aiSessione(request, env, h)) return html(pagina(h.AI_HTML)); return env.AI_PUBBLICO === "1" ? html(pagina(h.AI_HTML).replace("<script>", "<script>window.AI_PUB=1;"), 200) : new Response("Pagina non trovata", { status: 404, headers: { "content-type": "text/plain; charset=utf-8", "x-robots-tag": "noindex" } }); }
  return h.fail(404, "not_found");
}
/* /ig/ai-entra: dal pannello (cookie /ig) apre /ai senza password */
/* 23/11/2026: il pannello sta su un altro indirizzo, quindi non può lasciare il cookie su ai.readgeopolitics.com.
   Crea la sessione e un gettone usa-e-getta (60 secondi) che il sottodominio scambia con il cookie in /ai/entra. */
export async function aiEntra(env, h) { const id = await nuova(env, h), t = h.rid(); await h.kvSet(env, "aitok:" + t, { id, exp: Date.now() + 60000 }); return new Response(null, { status: 302, headers: { location: "https://ai.readgeopolitics.com/entra?t=" + t } }); }
