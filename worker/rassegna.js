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
  for (const k of Object.keys(stato)) if (!RS_FONTI.some((f) => f.id === k)) delete stato[k]; // fonti tolte dall'elenco (es. corriere-pol il 17/11) non restano come errori
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

export async function rsVociTra(env, da, a) {
  await tabella(env);
  const r = await env.DB.prepare("SELECT link, fonte, titolo, sito, data FROM rs_voci WHERE data >= ?1 AND data < ?2 ORDER BY data ASC LIMIT 4000").bind(da, a).all();
  return r.results || [];
}
export async function rsVoci(env, ore) {
  await tabella(env);
  const da = new Date(Date.now() - Math.max(1, Math.min(72, ore || 24)) * 3600e3).toISOString();
  const r = await env.DB.prepare("SELECT link, fonte, titolo, sito, data FROM rs_voci WHERE data >= ?1 ORDER BY data ASC LIMIT 4000").bind(da).all();
  return r.results || [];
}

/* ---------- storie e indice per il briefing (regole fisse, 0-100) ----------
   Mondo: fonti diverse (max 35), aree diverse (30), almeno una non occidentale (10), fonte primaria (10),
   crescita nelle ultime 6 ore rispetto alle 6 prima (15).
   Italia: le aree sono sostituite dalle testate italiane diverse (40) e non conta il non occidentale.
   Il filone attivo è solo un'etichetta: per le regole del briefing un filone già seguito non ha vantaggi (corretto il 17/11/2026).
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
      ? { f: Math.min(n, 10) / 10 * 35, a: Math.min(Math.max(ita.length - 1, 0), 4) / 4 * 40, pr: primarie ? 10 : 0, cr: Math.max(0, Math.min(15, (last - prev) * 2)) }
      : { f: Math.min(n, 10) / 10 * 35, a: Math.min(aree.length - 1, 3) / 3 * 30, no: nonocc ? 10 : 0, pr: primarie ? 10 : 0, cr: Math.max(0, Math.min(15, (last - prev) * 2)) };
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

/* ---------- il briefing ai raggi X: le regole del progetto controllate sul briefing salvato ---------- */
const OCC = new Set("IT FR DE ES PT NL BE LU IE AT DK SE FI PL CZ SK HU SI HR RO BG GR CY MT EE LV LT GB US CA AU NZ NO CH IS UA MD EU".split(" "));
const ITA_PROG = { corriere: "Corriere della Sera", repubblica: "la Repubblica", sole24ore: "Il Sole 24 Ore", lastampa: "La Stampa", fattoquotidiano: "Il Fatto Quotidiano", ilgiornale: "il Giornale", avvenire: "Avvenire" };
const ITA_HOST = { "corriere.it": "corriere", "repubblica.it": "repubblica", "ilsole24ore.com": "sole24ore", "lastampa.it": "lastampa", "ilfattoquotidiano.it": "fattoquotidiano", "ilgiornale.it": "ilgiornale", "avvenire.it": "avvenire" };
const jp = (v, d) => { try { return JSON.parse(v); } catch (e) { return d; } };
export async function rsBrief(env, h, data) {
  const B = data ? await env.DB.prepare("SELECT key, data FROM rdocs WHERE type='briefings' AND key=?1").bind(data).first() : await env.DB.prepare("SELECT key, data FROM rdocs WHERE type='briefings' ORDER BY key DESC LIMIT 1").first();
  if (!B) return { ok: false, error: "nessun briefing" };
  const b = jp(B.data, {}), ids = [...(b.storie_mondo || []), ...(b.storie_italia || [])], ita = new Set(b.storie_italia || []);
  const prev = await env.DB.prepare("SELECT key FROM rdocs WHERE type='briefings' AND key < ?1 ORDER BY key DESC LIMIT 1").bind(B.key).first(), next = await env.DB.prepare("SELECT key FROM rdocs WHERE type='briefings' AND key > ?1 ORDER BY key ASC LIMIT 1").bind(B.key).first();
  const S = ids.length ? (await env.DB.prepare("SELECT key, data FROM rdocs WHERE type='stories' AND key IN (" + ids.map((_, i) => "?" + (i + 1)).join(",") + ")").bind(...ids).all()).results || [] : [];
  const st = ids.map((id) => { const r = S.find((x) => x.key === id); return r ? { id, ...jp(r.data, {}) } : null; }).filter(Boolean);
  const fid = new Set(); for (const s of st) for (const f of s.fonti || []) { if (f.id) fid.add(f.id); if (f.origine) fid.add(f.origine); }
  const SR = {}; const L = [...fid]; for (let i = 0; i < L.length; i += 80) { const part = L.slice(i, i + 80); const r = await env.DB.prepare("SELECT key, data FROM rdocs WHERE type='sources' AND key IN (" + part.map((_, k) => "?" + (k + 1)).join(",") + ")").bind(...part).all(); for (const x of r.results || []) SR[x.key] = jp(x.data, {}); }
  const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch (e) { return ""; } };
  const cit = {}; let tot = 0, via = 0;
  const storie = st.map((s) => {
    const F = (s.fonti || []).map((f) => {
      const chi = f.origine || f.id || host(f.url), src = SR[f.origine] || SR[f.id] || {}, carrier = SR[f.id] || {};
      const seconda = !!f.origine || /\(via |\bvia\b|\(da /i.test(f.nome || "");
      const paese = String(src.paese || carrier.paese || "").toUpperCase(), primaria = src.politica === "P" || carrier.politica === "P";
      const statale = !primaria && /statal|di stato|state/i.test((src.orientamento || "") + " " + (f.nome || ""));
      return { nome: f.nome, url: f.url, chi, paese, primaria, statale, seconda, nonocc: !!paese && !OCC.has(paese), itaprog: ITA_PROG[f.id] ? f.id : ITA_HOST[host(f.url)] || null };
    });
    for (const f of F) { cit[f.chi] = cit[f.chi] || { n: 0, nome: (SR[f.chi] || {}).nome || f.nome.replace(/\s*\(.*$/, "").replace(/\s+via\s+.*$/i, "") }; cit[f.chi].n++; tot++; if (f.seconda) via++; }
    const testate = new Set(F.map((f) => f.chi)).size, isIta = ita.has(s.id);
    const perPaese = {}; for (const f of F) if (f.paese) perPaese[f.paese] = (perPaese[f.paese] || 0) + 1;
    const top = Object.entries(perPaese).sort((a, b) => b[1] - a[1])[0];
    const perChi = {}; for (const f of F) perChi[f.chi] = (perChi[f.chi] || 0) + 1; const topChi = Object.entries(perChi).sort((a, b) => b[1] - a[1])[0];
    const avvisi = [];
    if (F.length < 3) avvisi.push("meno di 3 fonti");
    if (testate < 2) avvisi.push("una sola testata o ente");
    if (!isIta && !F.some((f) => f.nonocc)) avvisi.push("nessuna fonte non occidentale (ammesso se il tema non lo consente)");
    if (!isIta && top && F.length >= 4 && top[1] / F.length >= 0.75) avvisi.push(top[1] + " fonti su " + F.length + " dallo stesso paese (" + top[0] + ")" + (F.filter((f) => f.statale).length ? ", di cui " + F.filter((f) => f.statale).length + " statali" : ""));
    if (topChi && F.length >= 4 && topChi[1] / F.length >= 0.5) avvisi.push((cit[topChi[0]] || {}).nome + " fa metà o più delle citazioni della storia");
    if (isIta && !F.some((f) => f.itaprog)) avvisi.push("nessuna delle 7 testate italiane del progetto");
    return { id: s.id, titolo: s.titolo, italia: isIta, paesi: s.paesi || [], filone: s.filone_id || null, confidenza: (s.confidenza || {}).livello || null, n: F.length, testate, nonocc: F.filter((f) => f.nonocc).length, primarie: F.filter((f) => f.primaria).length, statali: F.filter((f) => f.statale).length, seconda: F.filter((f) => f.seconda).length, fonti: F.map((f) => ({ nome: f.nome, url: f.url, seconda: f.seconda, statale: f.statale, primaria: f.primaria })), avvisi };
  });
  const testate = Object.entries(cit).map(([k, v]) => ({ id: k, nome: v.nome, n: v.n, quota: tot ? +(v.n / tot * 100).toFixed(1) : 0 })).sort((a, b) => b.n - a.n);
  const sel = (b.selezione || []).map((x) => ({ titolo: x.titolo, regione: x.regione, punti: x.punti || [], totale: x.totale ?? (x.punti || []).reduce((a, c) => a + c, 0), esito: x.esito, motivo: x.motivo || "" }));
  const minM = Math.min(...sel.filter((x) => x.esito === "storia" && x.regione !== "Italia").map((x) => x.totale)), minI = Math.min(...sel.filter((x) => x.esito === "storia" && x.regione === "Italia").map((x) => x.totale));
  for (const x of sel) {
    const min = x.regione === "Italia" ? minI : minM; x.avvisi = [];
    if (x.esito !== "storia" && x.totale >= min) x.avvisi.push(x.motivo ? "esclusa con un punteggio da storia" : "esclusa con un punteggio da storia, senza motivo scritto");
    if ((x.punti[2] || 0) >= 2 && /nessun fatto nuovo|niente di nuovo|già raccontat|nessuna novit/i.test(x.motivo)) x.avvisi.push("novità " + x.punti[2] + " su 3, ma il motivo dice che non c'è un fatto nuovo");
  }
  const itaUsate = new Set(); for (const s of storie) if (s.italia) for (const f of s.fonti) { const k = ITA_HOST[host(f.url)]; if (k) itaUsate.add(k); }
  const aj = testate.find((t) => t.id === "aljazeera"), mx = testate[0] || { quota: 0, nome: "" };
  const mondo = storie.filter((s) => !s.italia);
  const regole = [
    { esito: storie.every((s) => s.n >= 3) ? "ok" : "ko", testo: "Ogni storia ha almeno 3 fonti", dettaglio: "il minimo è " + Math.min(...storie.map((s) => s.n)), valore: storie.filter((s) => s.n >= 3).length + " su " + storie.length },
    { esito: mondo.every((s) => s.nonocc) ? "ok" : "am", testo: "Fonte non occidentale nelle storie dal mondo", dettaglio: mondo.filter((s) => !s.nonocc).map((s) => s.titolo.slice(0, 40) + "…").join("; ") || "in tutte", valore: mondo.filter((s) => s.nonocc).length + " su " + mondo.length },
    { esito: mx.quota <= 20 ? "ok" : "ko", testo: "Nessuna testata oltre il 20%", dettaglio: "la più citata: " + testate.filter((t) => t.n === mx.n).map((t) => t.nome).join(", ") + " al " + Math.round(mx.quota) + "%", valore: Math.round(mx.quota) + "%" },
    { esito: !aj || aj.quota <= 10 ? "ok" : "ko", testo: "Al Jazeera sotto il 10%", dettaglio: aj ? aj.n + " citazioni" : "non citata", valore: (aj ? Math.round(aj.quota) : 0) + "%" },
    { esito: itaUsate.size >= 2 ? "ok" : itaUsate.size ? "am" : "ko", testo: "Testate italiane dell'elenco del progetto", dettaglio: itaUsate.size ? "usate: " + [...itaUsate].map((k) => ITA_PROG[k]).join(", ") : "nessuna tra Corriere, Repubblica, Sole, Stampa, Fatto, Giornale, Avvenire", valore: itaUsate.size + " su 7" },
    { esito: via / Math.max(tot, 1) <= 0.15 ? "ok" : "am", testo: "Fonti di seconda mano («via»)", dettaglio: "articoli di un'agenzia o testata letti tramite un'altra", valore: via + " su " + tot },
    { esito: sel.some((x) => x.avvisi.some((a) => a.startsWith("esclusa"))) ? "am" : "ok", testo: "Escluse con punteggio da storia", dettaglio: sel.filter((x) => x.avvisi.some((a) => a.startsWith("esclusa"))).map((x) => (x.titolo.length > 34 ? x.titolo.slice(0, 32) + "…" : x.titolo) + " (" + x.totale + ")").join("; ") || "nessuna", valore: String(sel.filter((x) => x.avvisi.some((a) => a.startsWith("esclusa"))).length) },
    { esito: sel.some((x) => x.avvisi.some((a) => a.startsWith("novità"))) ? "am" : "ok", testo: "Punteggi coerenti con il motivo", dettaglio: sel.filter((x) => x.avvisi.some((a) => a.startsWith("novità"))).map((x) => x.titolo.length > 34 ? x.titolo.slice(0, 32) + "…" : x.titolo).join("; ") || "tutti coerenti", valore: String(sel.filter((x) => x.avvisi.some((a) => a.startsWith("novità"))).length) },
  ];
  // la rassegna delle 24 ore prima del briefing (fino alle 7 del giorno, ora di Roma)
  let rassegna = [];
  try {
    const a = new Date(Date.parse(B.key + "T06:00:00Z")), da = new Date(a.getTime() - 24 * 3600e3), ctx = await indice(env, h);
    const RS = rsStorie(await rsVociTra(env, da.toISOString(), a.toISOString()), ctx).filter((g) => g.n_fonti >= 4).slice(0, 12);
    // abbinamento prudente: servono 2 nomi propri in comune (esclusi quelli che compaiono ovunque: Stati Uniti, Ue, Trump),
    // oppure 1 nome e 2 parole in comune. Meglio una «non valutata» in più che un falso «storia».
    const GEN = new Set(["p:USA", "g:ue", "g:donald-trump"]);
    const E = (t) => new Set(rsEntita(t, ctx.I).map((e) => (e.iso ? "p:" + e.iso : e.k)).filter((k) => !GEN.has(k))); // una città vale come il suo paese
    const dove = [...st.map((s) => ({ t: s.titolo, testo: s.titolo + " " + (s.fatti || ""), esito: "storia", motivo: "" })), ...sel.filter((x) => x.esito !== "storia").map((x) => ({ t: x.titolo, testo: x.titolo, esito: x.esito, motivo: x.motivo }))].map((x) => ({ ...x, E: E(x.testo), K: parole(x.testo) }));
    rassegna = RS.map((g) => { const testo = g.titolo + " " + g.voci.map((v) => v.titolo).slice(0, 6).join(" "), ge = E(testo), gk = parole(testo); let best = null, bs = 0;
      for (const x of dove) { let e = 0; for (const k of x.E) if (ge.has(k)) e++; let kw = 0; for (const w of x.K) if (gk.has(w)) kw++; const sc = e * 2 + kw; if ((e >= 2 || (e >= 1 && kw >= 2)) && sc > bs) { bs = sc; best = x; } }
      return { titolo: g.titolo, n_fonti: g.n_fonti, aree: g.aree.length, italia: g.italia, indice: g.indice, esito: best ? best.esito : "non valutata", motivo: best ? best.motivo : "", con: best && best.esito === "storia" ? best.t : null }; });
  } catch (e) { rassegna = []; }
  return { ok: true, data: B.key, prima: prev ? prev.key : null, dopo: next ? next.key : null, n_storie: storie.length, n_mondo: mondo.length, n_italia: storie.length - mondo.length, candidate: sel.length, citazioni: tot, testate_n: testate.length, regole, storie, selezione: sel, testate: testate.slice(0, 10), rassegna };
}

/* ---------- fotografia del giorno: rassegna e briefing a confronto, salvata (dal 20/11/2026) ----------
   I titoli della rassegna restano 72 ore: senza una fotografia salvata non resta nulla su cui decidere se usarla come base.
   Finestra: le 24 ore prima delle 7 (ora di Roma) del giorno del briefing. «Storia larga» = almeno 4 fonti diverse.
   Per ogni storia larga: era nel briefing, era stata valutata ed esclusa, o non era stata valutata.
   Per quelle nel briefing: quali testate della rassegna la davano e il briefing non ha citato. */
const K_FOTO = "rs:foto";
const K_GIUD = "rs:giudizi"; // { dal, al, sintesi_il, verdetto, sintesi, giorni: { "AAAA-MM-GG": { frase, recuperate, controlli, storie: [{ titolo, g: "A"|"B"|"C", motivo, n_fonti, tipo }] } } }
const nrm = (t) => String(t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\(.*?\)/g, " ").replace(/\b(via|da)\b.*$/, " ").replace(/[^a-z0-9]+/g, " ").trim();
export function rsConfronta(RS, st, sel, ctx) { // puro: storie larghe della rassegna contro storie e candidate del briefing
  const GEN = new Set(["p:USA", "g:ue", "g:donald-trump"]);
  const E = (t) => new Set(rsEntita(t, ctx.I).map((e) => (e.iso ? "p:" + e.iso : e.k)).filter((k) => !GEN.has(k)));
  const dove = [...st.map((x) => ({ t: x.titolo, testo: x.titolo + " " + (x.fatti || ""), esito: "storia", motivo: "", fonti: x.fonti || [] })), ...sel.filter((x) => x.esito !== "storia").map((x) => ({ t: x.titolo, testo: x.titolo, esito: x.esito || "esclusa", motivo: x.motivo || "", fonti: [] }))].map((x) => ({ ...x, E: E(x.testo), Et: E(x.t), Kt: parole(x.t) }));
  const non = {}, out = [];
  for (const g of RS) {
    // v3 (21/11/2026): i gruppi della rassegna possono mescolare titoli diversi, e un nome comune (Xi, Roma) bastava ad agganciarli.
    // Ora si guardano i titoli UNO PER UNO: un titolo «parla della storia» se ha due nomi del titolo della storia, o un nome e una parola,
    // o tre parole (un paese vale mezzo nome). Il gruppo è abbinato se almeno un terzo dei suoi titoli (e almeno 2) parla della stessa storia.
    // Se il titolo principale del gruppo parla della storia basta un quarto dei titoli (almeno 1).
    const VV = g.voci.slice(0, 8).map((v) => ({ e: E(v.titolo), k: parole(v.titolo) })), HV = { e: E(g.titolo), k: parole(g.titolo) }; let best = null, bs = 0;
    const parla = (x, v) => { let ev = 0; for (const k of x.Et) if (v.e.has(k)) ev += k.startsWith("p:") ? 0.5 : 1; /* un paese (anche da una città) vale mezzo nome */ let kv = 0; for (const w of x.Kt) if (v.k.has(w)) kv++; return ev >= 2 || (ev >= 1 && kv >= 1) || kv >= 3; };
    for (const x of dove) {
      let ok = 0; for (const v of VV) if (parla(x, v)) ok++;
      const serve = parla(x, HV) ? Math.max(1, Math.ceil(VV.length / 4)) : Math.max(2, Math.ceil(VV.length / 3));
      if (ok >= serve && ok > bs) { bs = ok; best = x; }
    }
    const r = { titolo: g.titolo, n_fonti: g.n_fonti, aree: g.aree.length, italia: g.italia, indice: g.indice, esito: best ? (best.esito === "storia" ? "nel briefing" : "valutata ed esclusa") : "non valutata", motivo: best ? String(best.motivo || "").slice(0, 160) : "", con: best && best.esito === "storia" ? best.t : null };
    if (best && best.esito === "storia") {
      const citate = best.fonti.map((f) => nrm(f.nome)).concat(best.fonti.map((f) => String(f.id || "")), best.fonti.map((f) => String(f.origine || "")));
      const manca = g.voci.filter((v) => v.tipo !== "statale" && !citate.some((c) => c && (c === v.fonte || c.includes(nrm(v.nome)) || nrm(v.nome).includes(c) && c.length > 4)));
      r.fonti_briefing = best.fonti.length; r.non_citate = manca.length;
      for (const v of manca) { non[v.fonte] = non[v.fonte] || { nome: v.nome, area: v.area, n: 0 }; non[v.fonte].n++; }
    }
    out.push(r);
  }
  const nb = out.filter((r) => r.esito === "nel briefing"), fuori = out.filter((r) => r.esito !== "nel briefing");
  return { storie_larghe: out.length, nel_briefing: nb.length, valutate_escluse: out.filter((r) => r.esito === "valutata ed esclusa").length, non_valutate: out.filter((r) => r.esito === "non valutata").length,
    media_fonti_rassegna: nb.length ? +(nb.reduce((a, r) => a + r.n_fonti, 0) / nb.length).toFixed(1) : null, media_fonti_briefing: nb.length ? +(nb.reduce((a, r) => a + (r.fonti_briefing || 0), 0) / nb.length).toFixed(1) : null,
    mancate: fuori.slice(0, 30), coperte: nb.slice(0, 12), testate_non_citate: Object.values(non).sort((a, b) => b.n - a.n).slice(0, 12) };
}
export async function rsFoto(env, h, data) {
  const B = await env.DB.prepare("SELECT key, data FROM rdocs WHERE type='briefings' AND key=?1").bind(data).first(); if (!B) return null;
  const b = jp(B.data, {}), ids = [...(b.storie_mondo || []), ...(b.storie_italia || [])]; if (!ids.length) return null;
  const S = (await env.DB.prepare("SELECT key, data FROM rdocs WHERE type='stories' AND key IN (" + ids.map((_, i) => "?" + (i + 1)).join(",") + ")").bind(...ids).all()).results || [];
  const st = S.map((x) => jp(x.data, {})), a = new Date(Date.parse(data + "T06:00:00Z")), da = new Date(a.getTime() - 24 * 3600e3), ctx = await indice(env, h);
  await tabella(env);
  const voci = ((await env.DB.prepare("SELECT link, fonte, titolo, sito, data FROM rs_voci WHERE data >= ?1 AND data < ?2 ORDER BY data DESC LIMIT 4000").bind(da.toISOString(), a.toISOString()).all()).results || []).reverse(), prima = (await env.DB.prepare("SELECT min(data) m FROM rs_voci").first()) || {};
  const RS = rsStorie(voci, ctx).filter((g) => g.n_fonti >= 4).slice(0, 80);
  return { v: 3, data, fatta: new Date().toISOString(), titoli: voci.length, fonti_attive: new Set(voci.map((v) => v.fonte)).size, parziale: voci.length >= 4000 ? "letti i 4.000 titoli più recenti della finestra" : prima.m && prima.m > da.toISOString() ? "la raccolta non copre tutta la finestra" : "", storie_briefing: st.length, ...rsConfronta(RS, st, b.selezione || [], ctx) };
}
/* dal cron: dopo le 9 di Roma salva la fotografia di oggi; recupera ieri e l'altro ieri se mancano (finché i titoli ci sono) */
export async function rsFotoCron(env, h, oggi, oraRoma) {
  if (oraRoma < 9) return; const F = (await h.kvGet(env, K_FOTO)) || {}; let fatto = false;
  for (const g of [0, 1, 2]) { const d = new Date(Date.parse(oggi + "T12:00:00Z") - g * 864e5).toISOString().slice(0, 10); if (F[d] && (F[d].v === 3 || F[d].tenuta)) continue; const f = await rsFoto(env, h, d); if (!f) continue; if (!F[d] || !f.parziale || f.parziale.startsWith("letti")) F[d] = f; else F[d].tenuta = true; /* titoli già scaduti: resta la fotografia vecchia, non si riprova */ fatto = true; break; } // una per giro: il cron resta leggero
  if (fatto) { const K = Object.keys(F).sort().slice(-90), o = {}; for (const k of K) o[k] = F[k]; await h.kvSet(env, K_FOTO, o); }
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
  if (b.action === "rs_foto") { const F = (await h.kvGet(env, K_FOTO)) || {}; return { ok: true, giorni: Object.keys(F).sort().reverse().map((k) => F[k]), giudizi: (await h.kvGet(env, K_GIUD)) || null }; } // i giudizi li scrive Claude ogni mattina, a mano, durante la prova: qui si leggono soltanto
  if (b.action === "rs_brief") return await rsBrief(env, h, /^\d{4}-\d{2}-\d{2}$/.test(b.data || "") ? b.data : null);
  if (b.action === "rs_giro") return { ok: true, ...(await rsGiro(env, h, Math.max(1, Math.min(15, +b.n || 12)))) };
  return null;
}

export { leggi as rsLeggi }; // usato anche dalla sezione IA (ai.js)
