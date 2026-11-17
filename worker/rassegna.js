/* Rassegna (dal 17/11/2026): il Worker legge i feed RSS dell'elenco (rassegna-fonti.js) e tiene titoli, link e ora
   delle ultime 72 ore. Solo titoli e link: nessun testo degli articoli (politica fonti: lettura di una pagina pubblica,
   il feed, una volta ogni ora circa; nessuna copia).
   - cron ogni 5 minuti: un gruppo di feed per volta (tutto l'elenco in circa un'ora)
   - GET /v1/rassegna?ore=24 (token): i titoli raggruppati per storia, con le fonti che la riportano, per le routine
   - pannello /ig/rassegna: stato di ogni feed (funziona o no) e storie del giorno per numero di fonti */
import { RS_FONTI, RS_AREE } from "./rassegna-fonti.js";

const UA = "ReadGeopolitics-rassegna/1.0 (+https://www.readgeopolitics.com/metodo.html)";
const K_STATO = "rs:stato", K_GIRO = "rs:giro", PER_GIRO = 10, ORE_TENUTE = 72;
const NON_OCC = new Set(["medio-oriente", "africa", "asia", "americhe"]);

async function tabella(env) {
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS rs_voci (link TEXT PRIMARY KEY, fonte TEXT NOT NULL, titolo TEXT NOT NULL, sito TEXT, data TEXT NOT NULL, visto TEXT NOT NULL)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS rs_voci_data ON rs_voci (data)").run();
}

/* ---------- lettura di un feed RSS o Atom, senza librerie ---------- */
const ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
function dec(s) {
  return String(s || "").replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/<[^>]+>/g, " ")
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => e[0] === "#" ? String.fromCodePoint(e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : +e.slice(1)) : ENT[e.toLowerCase()] ?? m)
    .replace(/\s+/g, " ").trim();
}
const tag = (b, t) => { const m = b.match(new RegExp("<" + t + "(?:\\s[^>]*)?>([\\s\\S]*?)</" + t + ">", "i")); return m ? m[1] : ""; };
export function rsParse(xml, google) {
  const out = [], blocchi = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || xml.match(/<entry[\s>][\s\S]*?<\/entry>/gi) || [];
  for (const b of blocchi.slice(0, 60)) {
    let titolo = dec(tag(b, "title")), link = dec(tag(b, "link"));
    if (!link) { const m = b.match(/<link[^>]*href="([^"]+)"/i); if (m) link = dec(m[1]); }
    if (!link) { const m = b.match(/<guid[^>]*>([^<]+)<\/guid>/i); if (m && /^https?:/.test(m[1].trim())) link = m[1].trim(); }
    const d = dec(tag(b, "pubDate") || tag(b, "updated") || tag(b, "published") || tag(b, "dc:date"));
    let sito = ""; const s = b.match(/<source[^>]*url="([^"]+)"/i); if (s) { try { sito = new URL(dec(s[1])).hostname.replace(/^www\./, ""); } catch (e) {} }
    if (google) { const src = dec(tag(b, "source")); if (src && titolo.endsWith(" - " + src)) titolo = titolo.slice(0, -(src.length + 3)); }
    const t = Date.parse(d);
    if (titolo && /^https?:\/\//.test(link)) out.push({ titolo: titolo.slice(0, 300), link: link.slice(0, 600), data: isNaN(t) ? null : new Date(t).toISOString(), sito });
  }
  return out;
}
async function leggi(f) {
  const errori = [];
  for (const url of f.urls) {
    const google = url.includes("news.google.com");
    try {
      const r = await fetch(url, { headers: { "user-agent": UA, accept: "application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.5" }, redirect: "follow", signal: AbortSignal.timeout(9000), cf: { cacheTtl: 240 } });
      if (!r.ok) { errori.push("HTTP " + r.status); continue; }
      const voci = rsParse((await r.text()).slice(0, 2e6), google);
      if (!voci.length) { errori.push("feed vuoto o non leggibile"); continue; }
      return { ok: true, url, via: google ? "google" : "diretto", voci, errori };
    } catch (e) { errori.push(String((e && e.name === "TimeoutError") ? "tempo scaduto" : (e && e.message) || e).slice(0, 80)); }
  }
  return { ok: false, voci: [], errori };
}

/* un giro: i prossimi PER_GIRO feed dell'elenco */
export async function rsGiro(env, h, n) {
  await tabella(env);
  const g = (await h.kvGet(env, K_GIRO)) || { i: 0 }, quanti = Math.min(n || PER_GIRO, RS_FONTI.length), lista = [];
  for (let k = 0; k < quanti; k++) lista.push(RS_FONTI[(g.i + k) % RS_FONTI.length]);
  const ora = new Date().toISOString(), lim = new Date(Date.now() - ORE_TENUTE * 3600e3).toISOString();
  const esiti = await Promise.all(lista.map((f) => leggi(f).then((r) => [f, r])));
  const stato = (await h.kvGet(env, K_STATO)) || {}, ins = [];
  for (const [f, r] of esiti) {
    const fresche = r.voci.filter((v) => !v.data || v.data >= lim);
    const ultima = r.voci.reduce((m, v) => (v.data && v.data > m ? v.data : m), "");
    stato[f.id] = { ok: r.ok, url: r.url || null, via: r.via || null, n: r.voci.length, fresche: fresche.length, ultima: ultima || null, errori: r.errori, at: ora, campione: r.voci.slice(0, 3).map((v) => v.titolo) };
    for (const v of fresche) ins.push(env.DB.prepare("INSERT OR IGNORE INTO rs_voci (link, fonte, titolo, sito, data, visto) VALUES (?1, ?2, ?3, ?4, ?5, ?6)").bind(v.link, f.id, v.titolo, v.sito || null, v.data || ora, ora));
  }
  for (let i = 0; i < ins.length; i += 50) await env.DB.batch(ins.slice(i, i + 50));
  await env.DB.prepare("DELETE FROM rs_voci WHERE data < ?1").bind(lim).run();
  await h.kvSet(env, K_STATO, stato);
  const ni = (g.i + quanti) % RS_FONTI.length;
  await h.kvSet(env, K_GIRO, { i: ni, at: ora });
  return { fatti: lista.map((f) => f.id), prossimo: ni, totale: RS_FONTI.length, nuove: ins.length };
}
export async function rsCron(env, h) { try { await rsGiro(env, h, PER_GIRO); } catch (e) { try { await h.kvSet(env, "rs:err", { at: new Date().toISOString(), msg: String((e && e.message) || e).slice(0, 300) }); } catch (_) {} } }

/* ---------- storie: titoli simili raggruppati (parole in comune) ---------- */
const STOP = new Set("della dello delle degli dalla dalle nella nelle sulla sulle alla alle anche come dopo prima perché questo questa sono stato stata essere hanno ancora contro senza verso oltre with from that this have will about after over into their they what when where which while more than been says said amid news live update updates video watch".split(" "));
const parole = (t) => new Set(String(t).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length > 3 && !STOP.has(w)));
function jac(a, b) { let n = 0; for (const w of a) if (b.has(w)) n++; return n / (a.size + b.size - n || 1); }
const PESO = { ufficiale: 4, agenzia: 3, analisi: 2, testata: 1, statale: 0 };

export async function rsVoci(env, ore) {
  await tabella(env);
  const da = new Date(Date.now() - Math.max(1, Math.min(72, ore || 24)) * 3600e3).toISOString();
  const r = await env.DB.prepare("SELECT link, fonte, titolo, sito, data FROM rs_voci WHERE data >= ?1 ORDER BY data DESC LIMIT 3000").bind(da).all();
  return r.results || [];
}
export function rsStorie(voci) {
  const M = Object.fromEntries(RS_FONTI.map((f) => [f.id, f])), G = [];
  for (const v of voci) {
    const f = M[v.fonte]; if (!f) continue; const P = parole(v.titolo); if (P.size < 3) continue;
    let best = null, bj = 0;
    for (const g of G) { if (g.lingua !== f.lingua) continue; const j = jac(P, g.P); if (j > bj) { bj = j; best = g; } }
    const voce = { fonte: f.id, nome: f.nome, area: f.area, tipo: f.tipo, orient: f.orient, paese: f.paese, titolo: v.titolo, link: v.link, data: v.data, google: v.link.includes("news.google.com") };
    if (best && bj >= 0.45) { best.voci.push(voce); for (const w of P) best.P.add(w); }
    else G.push({ lingua: f.lingua, P, voci: [voce] });
  }
  return G.map((g) => {
    const fonti = [...new Set(g.voci.map((v) => v.fonte))], capo = g.voci.slice().sort((a, b) => (PESO[b.tipo] - PESO[a.tipo]) || String(b.data).localeCompare(String(a.data)))[0];
    const aree = [...new Set(g.voci.map((v) => v.area))];
    return { titolo: capo.titolo, n_fonti: fonti.length, aree, non_occidentali: [...new Set(g.voci.filter((v) => NON_OCC.has(v.area)).map((v) => v.fonte))].length, statali: g.voci.some((v) => v.tipo === "statale"), prima: g.voci.reduce((m, v) => (v.data < m ? v.data : m), g.voci[0].data), ultima: g.voci.reduce((m, v) => (v.data > m ? v.data : m), g.voci[0].data), voci: g.voci.filter((v, i, a) => a.findIndex((x) => x.fonte === v.fonte) === i).slice(0, 12) };
  }).sort((a, b) => b.n_fonti - a.n_fonti || String(b.ultima).localeCompare(String(a.ultima)));
}
function riepilogo(stato) {
  const fonti = RS_FONTI.map((f) => { const s = stato[f.id] || {}; return { id: f.id, nome: f.nome, area: f.area, tipo: f.tipo, classe: f.classe, orient: f.orient, paese: f.paese, lingua: f.lingua, ok: s.ok ?? null, via: s.via || null, url: s.url || null, n: s.n || 0, fresche: s.fresche || 0, ultima: s.ultima || null, errori: s.errori || [], at: s.at || null, campione: s.campione || [], urls: f.urls }; });
  return { fonti, aree: RS_AREE, totale: fonti.length, ok: fonti.filter((f) => f.ok === true).length, ko: fonti.filter((f) => f.ok === false).length, mai: fonti.filter((f) => f.ok === null).length };
}

/* rotta della routine: GET /v1/rassegna?ore=24&min=2 */
export async function rsRoute(request, env, url, h) {
  if (!h.authorized(request, env)) return h.fail(401, "unauthorized");
  const ore = +url.searchParams.get("ore") || 24, min = Math.max(1, +url.searchParams.get("min") || 1);
  const voci = await rsVoci(env, ore), S = rsStorie(voci).filter((g) => g.n_fonti >= min).slice(0, 400);
  const R = riepilogo((await h.kvGet(env, K_STATO)) || {});
  return h.json({ ok: true, ore, voci: voci.length, fonti_ok: R.ok, fonti_totale: R.totale, fonti_ko: R.fonti.filter((f) => f.ok === false).map((f) => f.nome),
    nota: "Solo titoli e link. Per i fatti apri l'articolo (una pagina per volta) o cerca lo stesso fatto su una fonte leggibile; i link news.google.com rimandano alla testata indicata. Media di Stato solo per la posizione ufficiale.",
    storie: S.map((g) => ({ titolo: g.titolo, n_fonti: g.n_fonti, aree: g.aree, non_occidentali: g.non_occidentali, statali: g.statali, prima: g.prima, ultima: g.ultima, voci: g.voci.map((v) => ({ fonte: v.nome, tipo: v.tipo, orient: v.orient, paese: v.paese, titolo: v.titolo, link: v.link, data: v.data })) })) });
}

/* pannello: rs_get (stato e storie), rs_giro (verifica un gruppo di feed adesso) */
export async function rsPanelApi(env, b, h) {
  if (b.action === "rs_get") {
    const R = riepilogo((await h.kvGet(env, K_STATO)) || {}), voci = await rsVoci(env, 24);
    return { ok: true, ...R, voci24: voci.length, giro: (await h.kvGet(env, K_GIRO)) || null, err: (await h.kvGet(env, "rs:err")) || null, storie: rsStorie(voci).filter((g) => g.n_fonti >= 2).slice(0, 60) };
  }
  if (b.action === "rs_giro") return { ok: true, ...(await rsGiro(env, h, Math.max(1, Math.min(15, +b.n || 12)))) };
  return null;
}
