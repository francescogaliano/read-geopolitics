/* Rassegna (dal 17/11/2026): il Worker legge i feed RSS dell'elenco (rassegna-fonti.js) e tiene titoli, link e ora
   delle ultime 72 ore. Solo titoli e link: nessun testo degli articoli (politica fonti: lettura di una pagina pubblica,
   il feed, una volta ogni ora circa; nessuna copia).
   - cron ogni 5 minuti: un gruppo di feed per volta (tutto l'elenco in circa un'ora)
   - GET /v1/rassegna?ore=24 (token): i titoli raggruppati per storia, con le fonti che la riportano, per le routine
   - pannello /ig/rassegna: stato di ogni feed (funziona o no) e storie del giorno per numero di fonti */
import { RS_FONTI, RS_AREE } from "./rassegna-fonti.js";
import { rsIndice, rsEntita, raggruppa, luogo, parole } from "./rassegna-entita.js";

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
/* Google News rifiuta le richieste dai server di Cloudflare (503/429, verificato il 17/11): dopo ogni indirizzo
   Google si prova la stessa ricerca su Bing News (solo titoli; il link vero è nel parametro url). */
function bing(gurl) { try { const q = new URL(gurl).searchParams.get("q").replace(/\s*when:\d+d/, ""), it = /hl=it/.test(gurl); return "https://www.bing.com/news/search?format=rss&q=" + encodeURIComponent(q) + (it ? "&setlang=it&cc=IT" : "&setlang=en&cc=US"); } catch (e) { return null; } }
const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch (e) { return u; } };
const GIORNI_FERMO = 14;
async function leggi(f) {
  const tentativi = [], prova = [];
  for (const u of f.urls) { prova.push(u); if (u.includes("news.google.com")) { const b = bing(u); if (b) prova.push(b); } }
  for (const url of prova) {
    const google = url.includes("news.google.com"), viaBing = url.includes("bing.com/news");
    try {
      const r = await fetch(url, { headers: { "user-agent": UA, accept: "application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.5" }, redirect: "follow", signal: AbortSignal.timeout(9000), cf: { cacheTtl: 240 } });
      if (!r.ok) { tentativi.push(host(url) + ": HTTP " + r.status); continue; }
      let voci = rsParse((await r.text()).slice(0, 2e6), google);
      if (viaBing) voci = voci.map((v) => { try { const real = new URL(v.link).searchParams.get("url"); return real ? { ...v, link: real, sito: host(real) } : v; } catch (e) { return v; } });
      if (!voci.length) { tentativi.push(host(url) + ": feed vuoto o non leggibile"); continue; }
      const ultima = voci.reduce((m, v) => (v.data && v.data > m ? v.data : m), "");
      if (ultima && Date.now() - Date.parse(ultima) > GIORNI_FERMO * 864e5) { tentativi.push(host(url) + ": fermo da " + Math.round((Date.now() - Date.parse(ultima)) / 864e5) + " giorni"); continue; }
      return { ok: true, url, via: google ? "google" : viaBing ? "bing" : "diretto", voci, tentativi };
    } catch (e) { tentativi.push(host(url) + ": " + String((e && e.name === "TimeoutError") ? "tempo scaduto" : (e && e.message) || e).slice(0, 80)); }
  }
  return { ok: false, voci: [], tentativi, fermo: tentativi.length > 0 && tentativi.every((t) => /fermo da/.test(t)) };
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
    stato[f.id] = { ok: r.ok, fermo: !!r.fermo, url: r.url || null, via: r.via || null, n: r.voci.length, fresche: fresche.length, ultima: ultima || null, senza_data: r.voci.length > 0 && !r.voci.some((v) => v.data), errori: r.tentativi, at: ora, campione: r.voci.slice(0, 3).map((v) => v.titolo) };
    for (const v of fresche) ins.push(env.DB.prepare("INSERT OR IGNORE INTO rs_voci (link, fonte, titolo, sito, data, visto) VALUES (?1, ?2, ?3, ?4, ?5, ?6)").bind(v.link, f.id, v.titolo, v.sito || null, v.data || ora, ora)); // senza data: vale la prima volta che il titolo è stato visto
  }
  for (let i = 0; i < ins.length; i += 50) await env.DB.batch(ins.slice(i, i + 50));
  await env.DB.prepare("DELETE FROM rs_voci WHERE data < ?1").bind(lim).run();
  await h.kvSet(env, K_STATO, stato);
  const ni = (g.i + quanti) % RS_FONTI.length;
  await h.kvSet(env, K_GIRO, { i: ni, at: ora });
  return { fatti: lista.map((f) => f.id), prossimo: ni, totale: RS_FONTI.length, nuove: ins.length };
}
export async function rsCron(env, h) { try { await rsGiro(env, h, PER_GIRO); } catch (e) { try { await h.kvSet(env, "rs:err", { at: new Date().toISOString(), msg: String((e && e.message) || e).slice(0, 300) }); } catch (_) {} } }

/* ---------- indice dei nomi: glossario del sito e filoni attivi, ricaricati ogni 12 ore ---------- */
const K_IND = "rs:indice";
async function indice(env, h) {
  let x = await h.kvGet(env, K_IND);
  if (!x || Date.now() - Date.parse(x.at) > 12 * 3600e3) {
    const gl = await env.DB.prepare("SELECT key, json_extract(data,'$.tipo') t, json_extract(data,'$.termine') n, json_extract(data,'$.alias') a FROM rdocs WHERE type='glossario'").all();
    const th = await env.DB.prepare("SELECT key, json_extract(data,'$.titolo') t, json_extract(data,'$.breve') b, json_extract(data,'$.bandiere') p FROM rdocs WHERE type='threads' AND json_extract(data,'$.stato')='attivo'").all();
    const js = (v) => { try { return JSON.parse(v || "[]"); } catch (e) { return []; } };
    x = { at: new Date().toISOString(), gloss: (gl.results || []).map((r) => [r.key, r.t, [r.n, ...js(r.a)].filter(Boolean)]), filoni: (th.results || []).map((r) => ({ id: r.key, titolo: r.t || "", breve: r.b || "", paesi: js(r.p) })) };
    await h.kvSet(env, K_IND, x);
  }
  const I = rsIndice(x.gloss);
  const filoni = x.filoni.map((t) => ({ ...t, E: new Set([...rsEntita(t.titolo + " " + t.breve, I).map((e) => e.k), ...t.paesi.map((p) => "p:" + p)]), K: parole(t.titolo + " " + t.breve) }));
  return { I, filoni };
}

export async function rsVoci(env, ore) {
  await tabella(env);
  const da = new Date(Date.now() - Math.max(1, Math.min(72, ore || 24)) * 3600e3).toISOString();
  const r = await env.DB.prepare("SELECT link, fonte, titolo, sito, data FROM rs_voci WHERE data >= ?1 ORDER BY data ASC LIMIT 4000").bind(da).all();
  return r.results || [];
}

/* ---------- storie e indice per il briefing (regole fisse, 0-100) ----------
   Mondo: fonti diverse (max 25), aree diverse (20), almeno una non occidentale (10), fonte primaria (10), filone attivo (15),
   crescita nelle ultime 6 ore rispetto alle 6 prima (10), novità (10 se nuova, 5 se aggiorna un filone).
   Italia: le aree sono sostituite dagli orientamenti diversi (30) e non conta il non occidentale.
   ≥ 60 candidata, 40-59 da valutare, sotto 40 sotto soglia. L'indice ordina, non decide: il briefing sceglie per impatto. */
const PESO = { ufficiale: 4, agenzia: 3, analisi: 2, testata: 1, statale: 0 };
export function rsStorie(voci, ctx) {
  const M = Object.fromEntries(RS_FONTI.map((f) => [f.id, f])), ora = Date.now();
  const items = [];
  for (const v of voci) { const f = M[v.fonte]; if (!f) continue; const K = parole(v.titolo); if (K.size < 2) continue; items.push({ ...v, f, lingua: f.lingua, K, ent: rsEntita(v.titolo, ctx.I) }); }
  const G = raggruppa(items);
  return G.map((g) => {
    const vv = g.voci, fonti = [...new Set(vv.map((x) => x.fonte))], uniche = fonti.map((id) => vv.find((x) => x.fonte === id));
    const aree = [...new Set(uniche.map((x) => x.f.area))], nonocc = uniche.filter((x) => NON_OCC.has(x.f.area)).length;
    const primarie = uniche.filter((x) => x.f.classe === "P" || x.f.tipo === "ufficiale").length, statali = uniche.filter((x) => x.f.tipo === "statale").length;
    const ita = uniche.filter((x) => x.f.area === "italia");
    let L = luogo(g); if (!L.iso && ita.length >= Math.max(1, uniche.length * 0.6)) L = { iso: "ITA", ll: null, paesi: ["ITA"] };
    const isIta = L.iso === "ITA";
    const serie = Array(12).fill(0); for (const x of uniche) { const h = Math.floor((ora - Date.parse(x.data)) / 3600e3); if (h >= 0 && h < 12) serie[11 - h]++; }
    const last = serie.slice(6).reduce((a, b) => a + b, 0), prev = serie.slice(0, 6).reduce((a, b) => a + b, 0);
    const soglia = Math.max(1, Math.ceil(g.n * 0.3)), core = new Set([...g.ec.entries()].filter(([, c]) => c >= soglia).map(([k]) => k));
    let filone = null, fb = 0;
    for (const t of ctx.filoni) { let e = 0, enc = 0; for (const k of t.E) if (core.has(k)) { e++; if (k[0] !== "p") enc++; } let kw = 0; for (const w of t.K) if (g.K.has(w)) kw++; const sc = e + enc + kw * 0.5; if ((enc >= 1 || e >= 2 || kw >= 2) && sc >= 2 && sc > fb) { fb = sc; filone = { id: t.id, titolo: t.titolo }; } }
    const n = fonti.length, p = isIta
      ? { f: Math.min(n, 10) / 10 * 25, a: Math.min(Math.max(ita.length - 1, 0), 4) / 4 * 30, pr: primarie ? 10 : 0, fi: filone ? 15 : 0, cr: Math.max(0, Math.min(10, (last - prev) * 1.5)), nv: filone ? 5 : 10 }
      : { f: Math.min(n, 10) / 10 * 25, a: Math.min(aree.length - 1, 3) / 3 * 20, no: nonocc ? 10 : 0, pr: primarie ? 10 : 0, fi: filone ? 15 : 0, cr: Math.max(0, Math.min(10, (last - prev) * 1.5)), nv: filone ? 5 : 10 };
    const indice = Math.round(Object.values(p).reduce((a, b) => a + b, 0));
    const capo = (uniche.filter((x) => x.f.lingua === "it").sort((a, b) => PESO[b.f.tipo] - PESO[a.f.tipo])[0]) || uniche.slice().sort((a, b) => (PESO[b.f.tipo] - PESO[a.f.tipo]) || String(b.data).localeCompare(String(a.data)))[0];
    return { titolo: capo.titolo, n_fonti: n, aree, non_occidentali: nonocc, primarie, statali, italia: isIta, orientamenti: ita.length, iso: L.iso, ll: L.ll, paesi: L.paesi || [], filone, serie, cresce: last >= 4 && last > prev * 1.5, indice, parti: p, stato: indice >= 60 ? "candidata" : indice >= 40 ? "da valutare" : "sotto soglia",
      prima: vv[0].data, ultima: vv[vv.length - 1].data,
      voci: uniche.sort((a, b) => (PESO[b.f.tipo] - PESO[a.f.tipo])).slice(0, 14).map((x) => ({ fonte: x.fonte, nome: x.f.nome, area: x.f.area, tipo: x.f.tipo, orient: x.f.orient, paese: x.f.paese, titolo: x.titolo, link: x.link, data: x.data, google: x.link.includes("news.google.com") || x.link.includes("bing.com") })) };
  }).sort((a, b) => b.indice - a.indice || b.n_fonti - a.n_fonti);
}
function equilibrio(voci) {
  const M = Object.fromEntries(RS_FONTI.map((f) => [f.id, f])), A = {}, I = {};
  for (const v of voci) { const f = M[v.fonte]; if (!f) continue; A[f.area] = (A[f.area] || 0) + 1; if (f.area === "italia") I[f.id] = (I[f.id] || 0) + 1; }
  return { aree: A, italia: RS_FONTI.filter((f) => f.area === "italia").map((f) => ({ id: f.id, nome: f.nome, orient: f.orient, n: I[f.id] || 0 })) };
}
function riepilogo(stato) {
  const fonti = RS_FONTI.map((f) => { const s = stato[f.id] || {}; return { id: f.id, nome: f.nome, area: f.area, tipo: f.tipo, classe: f.classe, orient: f.orient, paese: f.paese, lingua: f.lingua, ok: s.ok ?? null, fermo: !!s.fermo, senza_data: !!s.senza_data, via: s.via || null, url: s.url || null, n: s.n || 0, fresche: s.fresche || 0, ultima: s.ultima || null, errori: s.errori || [], at: s.at || null, campione: s.campione || [], urls: f.urls }; });
  return { fonti, aree: RS_AREE, totale: fonti.length, ok: fonti.filter((f) => f.ok === true).length, ko: fonti.filter((f) => f.ok === false).length, fermi: fonti.filter((f) => f.ok === false && f.fermo).length, mai: fonti.filter((f) => f.ok === null).length };
}

/* rotta della routine: GET /v1/rassegna?ore=24&min=2 */
export async function rsRoute(request, env, url, h) {
  if (!h.authorized(request, env)) return h.fail(401, "unauthorized");
  const ore = +url.searchParams.get("ore") || 24, min = Math.max(1, +url.searchParams.get("min") || 1);
  const voci = await rsVoci(env, ore), S = rsStorie(voci, await indice(env, h)).filter((g) => g.n_fonti >= min).slice(0, 300);
  const R = riepilogo((await h.kvGet(env, K_STATO)) || {});
  return h.json({ ok: true, ore, voci: voci.length, fonti_ok: R.ok, fonti_totale: R.totale, fonti_ko: R.fonti.filter((f) => f.ok === false).map((f) => f.nome),
    nota: "Solo titoli e link. Per i fatti apri l'articolo (una pagina per volta) o cerca lo stesso fatto su una fonte leggibile; i link news.google.com e bing.com sono solo segnali. Media di Stato solo per la posizione ufficiale. «indice» (0-100) ordina per ampiezza e pluralità delle fonti, filone attivo e crescita: non misura l'impatto, che valuti tu.",
    storie: S.map((g) => ({ titolo: g.titolo, indice: g.indice, stato: g.stato, italia: g.italia, n_fonti: g.n_fonti, aree: g.aree, non_occidentali: g.non_occidentali, orientamenti_italiani: g.orientamenti, primarie: g.primarie, statali: g.statali, paese: g.iso, filone: g.filone, in_crescita: g.cresce, prima: g.prima, ultima: g.ultima, voci: g.voci.map((v) => ({ fonte: v.nome, tipo: v.tipo, orient: v.orient, paese: v.paese, titolo: v.titolo, link: v.link, data: v.data })) })) });
}

/* pannello: rs_get (stato, storie con indice, equilibrio), rs_giro (verifica un gruppo di feed adesso) */
export async function rsPanelApi(env, b, h) {
  if (b.action === "rs_get") {
    const R = riepilogo((await h.kvGet(env, K_STATO)) || {}), voci = await rsVoci(env, 24), S = rsStorie(voci, await indice(env, h));
    const multi = S.filter((g) => g.n_fonti >= 2);
    return { ok: true, ...R, voci24: voci.length, n_storie: multi.length, giro: (await h.kvGet(env, K_GIRO)) || null, err: (await h.kvGet(env, "rs:err")) || null,
      mondo: multi.filter((g) => !g.italia).slice(0, 14), italia: multi.filter((g) => g.italia).slice(0, 8),
      radar: S.filter((g) => !g.italia && g.n_fonti <= 2 && (g.primarie >= 1 || g.non_occidentali === g.n_fonti)).sort((a, b) => b.indice - a.indice).slice(0, 8),
      crescita: S.filter((g) => g.cresce).sort((a, b) => b.serie.slice(9).reduce((x, y) => x + y, 0) - a.serie.slice(9).reduce((x, y) => x + y, 0)).slice(0, 6),
      mappa: multi.filter((g) => g.iso).slice(0, 40).map((g) => ({ titolo: g.titolo, iso: g.iso, ll: g.ll, n: g.n_fonti, stato: g.stato, cresce: g.cresce })),
      equilibrio: equilibrio(voci) };
  }
  if (b.action === "rs_giro") return { ok: true, ...(await rsGiro(env, h, Math.max(1, Math.min(15, +b.n || 12)))) };
  return null;
}
