/* «Investimenti», sezione privata del pannello (solo Francesco).
   - Ipotesi: evento → strumento, direzione, orizzonte. Le scrive una routine con il token; il Worker mette data, ora e
     prezzo di partenza e da lì non si toccano più. Valutate a ogni lettura dai prezzi (1 g informativo, 7 e 30 g).
   - Chiavi di lettura: schemi che emergono da micro-fatti verificati (a favore e contro), in ogni settore; restano
     «spunti» finché non hanno un'attesa misurabile, poi vanno «in prova» con ipotesi a 30 o 90 giorni.
   - Radar: opportunità scelte dal modello (routine «radar»), aziende e fondi osservati con la loro scheda.
     Le aziende si aggiungono anche a mano dal pannello con il simbolo di borsa; le classifica e le studia la routine.
   - Prezzi: materie prime e cambi dal database (docs «mercati»); azioni ed ETF da Yahoo Finance (servizio non ufficiale,
     uso personale; Stooq prima se c'è il secret STOOQ_KEY), aggiornati dal cron e salvati in kv. Se il Worker viene
     bloccato, la routine scarica i prezzi da sé e li carica con /v1/inv/prezzi { ticker, p }.
   Tutto sta nella tabella kv (privata): non passa mai da /api/data.json, /api/docs o /api/doc. */

import { pfCalcola, pfValuta, pfChiusura, pfPerRegola, PF_RIF, PF_FX, PF_MAX_PESO, PF_SC_PESO, PF_SC_MAX } from "./inv-pf.js";
import { RETRO_VERSIONE, RETRO_FILONI, retroIpotesi, retroValuta, retroRiepilogo } from "./inv-retro.js";

export const INV_STR = {
  brent: { n: "Brent", u: "$/barile", banda: [1.5, 3] },
  ttf: { n: "Gas TTF", u: "€/MWh", banda: [2, 4] },
  noli: { n: "Noli container", u: "punti", banda: [1, 2] },
  oro: { n: "Oro", u: "$/oncia", banda: [1, 2] },
  grano: { n: "Grano", u: "cent $/bushel", banda: [1.5, 3] },
  spread: { n: "Spread", u: "pb BTP-Bund", abs: true, banda: [3, 6] },
  eurusd: { n: "Euro/dollaro", u: "", banda: [0.4, 0.8] },
};
const BANDA_AZ = [2, 4], BANDA_1G = 0.5; // azioni ed ETF: ±2% a 7 g, ±4% a 30 g; a 1 g metà della banda
const DIR = ["su", "giu", "zero"], FID = ["bassa", "media", "alta"], ORIG = ["segnale", "calendario", "scenario", "radar", "chiave", "altro"];
const SETT = ["en", "te", "di", "tr", "altro"], STATI = ["da_classificare", "osservo", "da_valutare", "in_bilico", "uscita"];
const K_IP = "inv:ipotesi", K_DI = "inv:diario", K_OPP = "inv:opp", K_OSS = "inv:oss", K_RQ = "inv:rq", K_CH = "inv:chiavi", K_FA = "inv:fatti", K_RQF = "inv:rqf", K_PF = "inv:pf", K_BL = "inv:bloccate";
const ST_CH = ["spunto", "in_prova", "confermata", "scartata"];
const SIM_RE = /^[a-z0-9^][a-z0-9.\-_]{0,19}$/;

const addDays = (d, n) => new Date(Date.parse(d + "T12:00:00Z") + n * 86400000).toISOString().slice(0, 10);
const cut = (s, n) => String(s == null ? "" : s).replace(/\s+/g, " ").trim().slice(0, n);
const num = (x) => (x !== null && x !== "" && Number.isFinite(+x) ? +x : null);
const fonti = (a) => (Array.isArray(a) ? a : []).slice(0, 10).map((f) => ({ nome: cut(f && f.nome, 60), url: /^https?:\/\//.test((f && f.url) || "") ? cut(f.url, 400) : "" })).filter((f) => f.nome);

/* simbolo interno (formato Stooq) dal simbolo di borsa: «NVDA» → nvda.us, «RHM.DE» → rhm.de, «LDO.MI» → ldo.it */
export function invSim(t) {
  let s = String(t || "").trim().toLowerCase().replace(/\s+/g, "").replace(/^az:/, "");
  if (!s) return "";
  s = s.replace(/\.mi$/, ".it").replace(/\.pa$/, ".fr").replace(/\.as$/, ".nl").replace(/\.l$/, ".uk").replace(/\.(f|xetra|de)$/, ".de")
    .replace(/\.mc$/, ".es").replace(/\.sw$/, ".ch").replace(/\.st$/, ".se").replace(/\.ol$/, ".no").replace(/\.he$/, ".fi").replace(/\.br$/, ".be").replace(/\.ls$/, ".pt").replace(/\.vi$/, ".at").replace(/\.t$/, ".jp");
  if (!s.includes(".") && !s.startsWith("^")) s += ".us";
  return SIM_RE.test(s) ? s : "";
}
const isAz = (k) => String(k || "").startsWith("az:");
/* MERCATI (20/11/2026): indici di riferimento. Hanno sempre i prezzi, si possono usare nelle ipotesi (strumento «^GSPC», ecc.)
   e servono a misurare la forza di un titolo rispetto al suo mercato. Non si comprano nel simulatore (lì servono i fondi). */
export const MERCATI = [["^gspc", "S&P 500"], ["^ndx", "Nasdaq 100"], ["^stoxx50e", "Euro Stoxx 50"], ["ftsemib.it", "FTSE MIB"]];
const BANDA_IDX = [1.2, 2.5]; // indici: si muovono meno di un singolo titolo
const isIdx = (sim) => MERCATI.some((m) => m[0] === sim);
const cfgOf = (k) => (isAz(k) ? { n: (MERCATI.find((m) => m[0] === k.slice(3)) || [])[1] || k.slice(3).toUpperCase(), u: "", banda: isIdx(k.slice(3)) ? BANDA_IDX : BANDA_AZ } : INV_STR[k]);
export function mercatoDi(sim) { // l'indice con cui confrontare un titolo, dalla Borsa in cui è quotato
  const s = String(sim || ""); if (isIdx(s) || s.startsWith("^")) return null;
  const suf = s.slice(s.lastIndexOf(".") + 1);
  return suf === "us" ? "^gspc" : suf === "it" ? "ftsemib.it" : ["de", "fr", "nl", "es", "be", "pt", "at", "fi", "ie"].includes(suf) ? "^stoxx50e" : null;
}

export async function invSerie(env) {
  const keys = Object.keys(INV_STR);
  const { results } = await env.DB.prepare("SELECT key, data FROM docs WHERE type='mercati' AND status='published' AND key IN (" + keys.map((_, i) => "?" + (i + 1)).join(",") + ")").bind(...keys).all();
  const out = {};
  for (const r of results || []) {
    let d; try { d = JSON.parse(r.data); } catch (e) { continue; }
    const p = (Array.isArray(d.storico) ? d.storico : []).filter((x) => x && /^\d{4}-\d{2}-\d{2}$/.test(x.data) && Number.isFinite(+x.valore)).map((x) => [x.data, +x.valore]).sort((a, b) => a[0].localeCompare(b[0]));
    const seen = new Set(); out[r.key] = p.filter((x) => (seen.has(x[0]) ? false : (seen.add(x[0]), true)));
  }
  return out;
}
async function pxGet(h, env, sim) { const r = await h.kvGet(env, "inv:px:" + sim); return r && Array.isArray(r.p) ? r : null; }
async function serieTutte(h, env, sims) {
  const S = await invSerie(env);
  for (const s of [...new Set(sims.concat(MERCATI.map((m) => m[0])))]) { const r = await pxGet(h, env, s); if (r && r.p.length) S["az:" + s] = r.p; }
  return S;
}

/* Stooq: CSV Date,Open,High,Low,Close,Volume. Senza chiave valida risponde con una pagina di istruzioni. */
export async function invStooq(env, sim) {
  if (!env.STOOQ_KEY) return { ok: false, errore: "manca la chiave Stooq (STOOQ_KEY)" };
  const d1 = new Date(Date.now() - 420 * 86400000).toISOString().slice(0, 10).replace(/-/g, "");
  const url = "https://stooq.com/q/d/l/?s=" + encodeURIComponent(sim) + "&d1=" + d1 + "&i=d&apikey=" + encodeURIComponent(env.STOOQ_KEY);
  let t = "";
  try { const r = await fetch(url, { headers: { "user-agent": "rg-api/1.0 (uso personale)" }, signal: AbortSignal.timeout(10000) }); t = await r.text(); if (!r.ok) return { ok: false, errore: "Stooq " + r.status }; }
  catch (e) { return { ok: false, errore: "rete: " + String((e && e.message) || e).slice(0, 80) }; }
  const L = t.trim().split(/\r?\n/);
  if (!/^date,/i.test(L[0] || "")) return { ok: false, errore: /exceeded/i.test(t) ? "limite giornaliero di Stooq" : /apikey/i.test(t) ? "chiave Stooq non valida" : /no data/i.test(t) ? "simbolo senza dati" : "risposta inattesa da Stooq" };
  const H = L[0].toLowerCase().split(","), iD = H.indexOf("date"), iC = H.indexOf("close");
  const p = L.slice(1).map((l) => l.split(",")).filter((c) => /^\d{4}-\d{2}-\d{2}$/.test(c[iD]) && Number.isFinite(+c[iC]) && +c[iC] > 0).map((c) => [c[iD], +c[iC]]);
  if (!p.length) return { ok: false, errore: "simbolo senza dati" };
  return { ok: true, p: p.sort((a, b) => a[0].localeCompare(b[0])).slice(-300) };
}
/* Yahoo Finance (endpoint «chart» del sito, non ufficiale, senza chiave): dal simbolo interno al simbolo Yahoo */
const YSUF = { us: "", de: ".DE", it: ".MI", fr: ".PA", nl: ".AS", uk: ".L", es: ".MC", ch: ".SW", se: ".ST", no: ".OL", dk: ".CO", fi: ".HE", be: ".BR", pt: ".LS", at: ".VI", jp: ".T", hk: ".HK", pl: ".WA" };
export function invYsym(sim) {
  const s = String(sim || ""); if (s.startsWith("^")) return s.toUpperCase();
  const i = s.lastIndexOf("."); if (i < 1) return s.toUpperCase();
  const suf = YSUF[s.slice(i + 1)]; return suf == null ? s.toUpperCase() : s.slice(0, i).toUpperCase() + suf;
}
/* dalla risposta JSON di /v8/finance/chart a [[data, chiusura]] (data nel fuso della borsa) */
export function invYparse(j) {
  const r = j && j.chart && Array.isArray(j.chart.result) ? j.chart.result[0] : null;
  if (!r) return { ok: false, errore: (j && j.chart && j.chart.error && cut(j.chart.error.description || j.chart.error.code, 80)) || "risposta inattesa da Yahoo" };
  const ts = r.timestamp || [], q = ((r.indicators || {}).quote || [])[0] || {}, c = q.close || [], off = ((r.meta || {}).gmtoffset || 0) * 1000;
  const m = new Map();
  ts.forEach((t, i) => { const v = c[i]; if (Number.isFinite(v) && v > 0) m.set(new Date(t * 1000 + off).toISOString().slice(0, 10), +(+v).toFixed(4)); });
  const p = [...m.entries()].sort((a, b) => a[0].localeCompare(b[0])).slice(-300);
  return p.length ? { ok: true, p } : { ok: false, errore: "simbolo senza dati" };
}
export async function invYahoo(env, sim) {
  const y = encodeURIComponent(invYsym(sim)); let ultimo = "Yahoo: nessuna risposta";
  for (const host of ["query1", "query2"]) {
    try {
      const r = await fetch("https://" + host + ".finance.yahoo.com/v8/finance/chart/" + y + "?range=2y&interval=1d", { headers: { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36", accept: "application/json" }, signal: AbortSignal.timeout(10000) });
      const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (e) {}
      if (j) { const x = invYparse(j); if (x.ok || r.status === 404) return r.status === 404 ? { ok: false, errore: "simbolo non trovato su Yahoo (" + invYsym(sim) + ")" } : x; ultimo = "Yahoo: " + x.errore; }
      else ultimo = "Yahoo " + r.status + (r.status === 429 ? " (troppe richieste: il Worker è bloccato)" : "");
    } catch (e) { ultimo = "rete: " + String((e && e.message) || e).slice(0, 80); }
  }
  return { ok: false, errore: ultimo };
}
/* catena: Stooq se c'è la chiave, poi Yahoo */
async function invScarica(env, sim) {
  let e1 = null;
  if (env.STOOQ_KEY) { const r = await invStooq(env, sim); if (r.ok) return { ...r, fonte: "stooq" }; e1 = r.errore; }
  const r = await invYahoo(env, sim); if (r.ok) return { ...r, fonte: "yahoo" };
  return { ok: false, errore: (e1 ? "Stooq: " + e1 + " · " : "") + r.errore };
}
async function pxSalva(h, env, sim, r) {
  const prev = (await h.kvGet(env, "inv:px:" + sim)) || {};
  const now = new Date().toISOString();
  // i giorni già salvati non spariscono (18/11/2026: Yahoo ha mandato una serie senza il 17/11 e l'acquisto di Avio è tornato in attesa); i valori nuovi prevalgono
  const unisci = (a, b) => { const m = new Map((a || []).map((x) => [x[0], x[1]])); for (const x of b || []) m.set(x[0], x[1]); return [...m.entries()].sort((x, y) => x[0].localeCompare(y[0])).slice(-520); };
  const rec = r.ok ? { p: unisci(prev.p, r.p), at: now, tentato: now, errore: null, fonte: r.fonte } : { p: prev.p || [], at: prev.at || null, tentato: now, errore: r.errore, fonte: prev.fonte || null };
  await h.kvSet(env, "inv:px:" + sim, rec);
  return rec;
}
async function pxAggiorna(h, env, sim) { return pxSalva(h, env, sim, await invScarica(env, sim)); }
/* prezzi caricati dalla routine: [[AAAA-MM-GG, chiusura], …] oppure la risposta JSON grezza di Yahoo «chart» */
function pxDaRoutine(b) {
  if (b && b.chart) return { ...invYparse(b), fonte: "routine" };
  const a = Array.isArray(b) ? b : null; if (!a) return { ok: false, errore: "prezzi: atteso [[data, chiusura], …]" };
  const m = new Map(); for (const x of a) if (Array.isArray(x) && /^\d{4}-\d{2}-\d{2}$/.test(x[0]) && Number.isFinite(+x[1]) && +x[1] > 0) m.set(x[0], +x[1]);
  const p = [...m.entries()].sort((x, y) => x[0].localeCompare(y[0])).slice(-300);
  return p.length >= 5 ? { ok: true, p, fonte: "routine" } : { ok: false, errore: "prezzi: troppo pochi giorni validi" };
}
/* cron (ogni 15 minuti): al massimo 4 simboli per giro, quelli tentati più di 18 ore fa */
export async function invCron(env, h) {
  const O = ((await h.kvGet(env, K_OSS)) || []).filter((o) => o.stato !== "uscita");
  const Lp = ((await h.kvGet(env, K_IP)) || []).filter((x) => isAz(x.strumento)).map((x) => x.strumento.slice(3));
  const P = (((await h.kvGet(env, K_PF)) || {}).ops || []).map((o) => o.sim).filter(Boolean);
  const pf = P.length || (((await h.kvGet(env, K_PF)) || {}).ops || []).length ? [PF_FX, PF_RIF.sim] : [];
  let n = 0;
  for (const s of [...new Set(pf.concat(P, O.map((o) => o.sim), Lp, O.length ? MERCATI.map((m) => m[0]) : []))]) {
    if (n >= 6) break;
    const r = await h.kvGet(env, "inv:px:" + s);
    if (r && r.tentato) {
      const now = Date.now(), v = pfValuta(s) || "EUR", ch = pfChiusura(new Date(now + 3600000).toISOString().slice(0, 10), v) + 30 * 60000;
      const dopoChiusura = pf.length && (P.includes(s) || pf.includes(s)) && now > ch && Date.parse(r.tentato) < ch;
      if (!dopoChiusura && now - Date.parse(r.tentato) < (P.includes(s) ? 6 : 18) * 3600000) continue;
    }
    await pxAggiorna(h, env, s); n++;
  }
  return n;
}

const lastOnOrBefore = (p, d) => { let r = null; for (const x of p) { if (x[0] <= d) r = x; else break; } return r; };
const firstOnOrAfter = (p, d) => p.find((x) => x[0] >= d) || null;

/* valuta un'ipotesi: ret = variazione % (o in punti per gli strumenti «abs»); esito giusta / sbagliata / piatta.
   v1 = la stessa misura al primo giorno di borsa dopo l'ingresso (informativa, banda dimezzata). */
export function invValuta(h, p) {
  const cfg = cfgOf(h.strumento); if (!cfg || !p || !p.length || !Number.isFinite(h.prezzo0)) return { stato: "senza_prezzi" };
  /* prezzo d'ingresso: quello noto alla registrazione se è dello stesso giorno; se era più vecchio (es. venerdì per
     un'ipotesi del lunedì), il primo prezzo dal giorno della registrazione in poi, così il movimento precedente non conta */
  const base = h.data0 >= h.data ? [h.data0, h.prezzo0] : firstOnOrAfter(p, h.data);
  if (!base) return { stato: "aperta", giorni: 0, ret: null, attesa_ingresso: true };
  const rr = (x) => (cfg.abs ? x[1] - base[1] : (x[1] / base[1] - 1) * 100);
  const esitoDi = (ret, b) => { if (h.direzione === "zero") return Math.abs(ret) <= b ? "giusta" : "sbagliata"; const s = h.direzione === "su" ? ret : -ret; return s > b ? "giusta" : s < -b ? "sbagliata" : "piatta"; };
  const b = h.orizzonte >= 90 ? cfg.banda[1] * 1.5 : cfg.banda[h.orizzonte >= 30 ? 1 : 0]; // a 90 giorni la banda dei 30 aumentata della metà
  const dopo = p.filter((x) => x[0] > base[0]);
  const v1 = dopo[0] ? { ret: +rr(dopo[0]).toFixed(3), al: dopo[0][0], esito: esitoDi(rr(dopo[0]), b * BANDA_1G) } : null;
  const target = addDays(h.data, h.orizzonte), fine = dopo.find((x) => x[0] >= target) || null, now = fine || dopo[dopo.length - 1];
  if (!now) return { stato: "aperta", giorni: 0, ret: null, ingresso: { data: base[0], valore: base[1] }, v1 };
  const ret = rr(now);
  const giorni = Math.round((Date.parse(now[0]) - Date.parse(h.data)) / 86400000);
  return { stato: fine ? "chiusa" : "aperta", ret: +ret.toFixed(3), al: now[0], prezzo1: now[1], ingresso: { data: base[0], valore: base[1] }, esito: fine ? esitoDi(ret, b) : null, giorni: Math.max(0, Math.min(giorni, h.orizzonte)), banda: b, v1 };
}

const quota = (L) => { const d = L.filter((x) => x === "giusta" || x === "sbagliata"); return { n: d.length, giuste: d.filter((x) => x === "giusta").length }; };
/* bilancio: solo ipotesi in tempo reale (non retroattive) */
export function invBilancio(L) {
  const live = L.filter((h) => !h.retro && h.v);
  const ch = live.filter((h) => h.v.stato === "chiusa");
  const dec = ch.filter((h) => h.v.esito === "giusta" || h.v.esito === "sbagliata");
  const giuste = dec.filter((h) => h.v.esito === "giusta").length;
  const conGuad = ch.filter((h) => h.direzione !== "zero" && !(cfgOf(h.strumento) || {}).abs);
  const guad = (h) => (h.direzione === "su" ? 1 : -1) * h.v.ret;
  const perFid = FID.map((f) => { const x = dec.filter((h) => h.fiducia === f); return { fiducia: f, n: x.length, giuste: x.filter((h) => h.v.esito === "giusta").length }; });
  // linea cumulata in ordine di chiusura; «a caso» = stesso movimento con segno pseudo-casuale fisso per id
  const ord = conGuad.slice().sort((a, b) => String(a.v.al).localeCompare(String(b.v.al)));
  let c = 0, r = 0; const cum = [];
  for (const h of ord) { c += guad(h); let hs = 2166136261; for (const ch2 of h.id) hs = Math.imul(hs ^ ch2.charCodeAt(0), 16777619) >>> 0; r += ((hs >>> 16) & 1 ? 1 : -1) * h.v.ret; cum.push({ al: h.v.al, segnali: +c.toFixed(2), caso: +r.toFixed(2) }); }
  // per filone: le ipotesi nate dalla stessa crisi vanno insieme, così si vede se un tema pesa troppo
  const fil = {}; for (const h of dec) { const k = (h.origine && h.origine.filone_id) || "senza filone"; const q = (fil[k] ||= { filone: k, n: 0, giuste: 0 }); q.n++; if (h.v.esito === "giusta") q.giuste++; }
  // affidabilità per livello (aziende e fondi / materie prime e cambi) e per orizzonte
  const liv = (pred) => { const X = live.filter(pred); return { g1: quota(X.map((h) => h.v.v1 && h.v.v1.esito)), g7: quota(X.filter((h) => h.orizzonte === 7 && h.v.stato === "chiusa").map((h) => h.v.esito)), g30: quota(X.filter((h) => h.orizzonte === 30 && h.v.stato === "chiusa").map((h) => h.v.esito)), g90: quota(X.filter((h) => h.orizzonte === 90 && h.v.stato === "chiusa").map((h) => h.v.esito)) }; };
  return { per_filone: Object.values(fil).sort((a, b) => b.n - a.n), chiuse: ch.length, decise: dec.length, giuste, piatte: ch.filter((h) => h.v.esito === "piatta").length, guadagno_medio: conGuad.length ? +(conGuad.reduce((s, h) => s + guad(h), 0) / conGuad.length).toFixed(2) : null, per_fiducia: perFid, cumulata: cum, aziende: liv((h) => isAz(h.strumento)), materie: liv((h) => !isAz(h.strumento)) };
}

/* indicatori tecnici da prezzi di chiusura giornalieri: medie 50/200, MACD (12, 26, 9), RSI 14 */
export function invTecnica(p) {
  if (!p || p.length < 35) return null;
  const v = p.map((x) => x[1]), n = v.length, last = v[n - 1];
  const ma = (k) => (n >= k ? v.slice(n - k).reduce((a, b) => a + b, 0) / k : null);
  const ema = (a, k) => { const o = []; const al = 2 / (k + 1); let e = a[0]; a.forEach((x, i) => { e = i ? x * al + e * (1 - al) : x; o.push(e); }); return o; };
  const e12 = ema(v, 12), e26 = ema(v, 26), macd = v.map((_, i) => e12[i] - e26[i]), sig = ema(macd, 9), hist = macd.map((m, i) => m - sig[i]);
  let giro = null; for (let i = n - 1; i > 0; i--) if (Math.sign(hist[i]) !== Math.sign(hist[i - 1])) { giro = n - 1 - i; break; }
  let g = 0, l = 0; for (let i = Math.max(1, n - 14); i < n; i++) { const d = v[i] - v[i - 1]; if (d > 0) g += d; else l -= d; }
  const m50 = ma(50), m200 = ma(200);
  let am = 0; for (let i = n - 14; i < n; i++) am += Math.abs(v[i] / v[i - 1] - 1); // quanto si muove di solito in un giorno (media su 14 sedute, dalle chiusure)
  return { amp14: +(am / 14 * 100).toFixed(2), ultimo: last, data: p[n - 1][0], m50, m200, sopra50: m50 == null ? null : last > m50, sopra200: m200 == null ? null : last > m200, macd: hist[n - 1] >= 0 ? "su" : "giu", macd_giro: giro, rsi: Math.round(100 - 100 / (1 + g / (l || 1e-9))), var1m: n > 21 ? +((last / v[n - 22] - 1) * 100).toFixed(1) : null, hist: hist.slice(-260).map((x) => +x.toFixed(4)) };
}

/* forza rispetto al mercato: variazione del titolo meno variazione del suo indice, in punti, a 1 e a 3 mesi */
export function invForza(p, pm, nome) {
  if (!p || !pm || p.length < 10 || pm.length < 10) return null;
  const d1 = p[p.length - 1][0], a = lastOnOrBefore(p, d1), b = lastOnOrBefore(pm, d1); if (!a || !b) return null;
  const diff = (g) => { const d0 = new Date(Date.parse(d1 + "T12:00:00Z") - g * 864e5).toISOString().slice(0, 10), a0 = lastOnOrBefore(p, d0), b0 = lastOnOrBefore(pm, d0); return a0 && b0 && p[0][0] <= d0 && pm[0][0] <= d0 ? +(((a[1] / a0[1]) - (b[1] / b0[1])) * 100).toFixed(1) : null; };
  const m1 = diff(30), m3 = diff(91); return m1 == null && m3 == null ? null : { rif: nome, m1, m3 };
}
const forzaDi = (sim, serie) => { const m = mercatoDi(sim); return m ? invForza(serie["az:" + sim], serie["az:" + m], (MERCATI.find((x) => x[0] === m) || [])[1]) : null; };
function mercatiVista(serie, L, pannello) {
  return MERCATI.map(([sim, nome]) => { const s = serie["az:" + sim] || [], l = s[s.length - 1], t = invTecnica(s); if (t) delete t.hist;
    const o = { sim, simbolo: invYsym(sim), nome, ultimo: l ? { data: l[0], valore: l[1] } : null, tecnica: t, banda_7: BANDA_IDX[0], banda_30: BANDA_IDX[1] };
    if (pannello) { o.p = s.slice(-260); o.chiamate = L.filter((x) => x.strumento === "az:" + sim); }
    return o; });
}

/* REGOLA E1 (eccesso, dal 17/11/2026): dopo uno scatto troppo forte non si scommette che continui.
   Al rialzo: RSI14 sopra 75 oppure più del 25% in un mese (21 sedute). Al ribasso, simmetrica: RSI sotto 25 o meno del 25%.
   Eccezione solo con un fatto nuovo che ha una data entro 14 giorni: campo eccezione {data: AAAA-MM-GG, testo}. */
export function invEccesso(p, direzione, eccezione, oggi) {
  const t = invTecnica((p || []).filter((x) => x[0] <= oggi)); if (!t || !["su", "giu"].includes(direzione)) return null;
  const su = direzione === "su", troppo = su ? t.rsi > 75 || (t.var1m != null && t.var1m > 25) : t.rsi < 25 || (t.var1m != null && t.var1m < -25);
  if (!troppo) return null;
  const e = eccezione || {}, g = /^\d{4}-\d{2}-\d{2}$/.test(e.data || "") ? Math.round((Date.parse(e.data) - Date.parse(oggi)) / 864e5) : null;
  if (g != null && g >= 0 && g <= 14 && cut(e.testo, 200).length >= 10) return null;
  return "regola E1 (eccesso): " + (su ? "il titolo è già salito troppo" : "il titolo è già sceso troppo") + " (RSI " + t.rsi + (t.var1m != null ? ", " + (t.var1m >= 0 ? "+" : "") + t.var1m + "% in un mese" : "") + "); si può solo con un fatto nuovo con data entro 14 giorni: eccezione {data, testo}";
}
/* REGOLA E2 (conti trimestrali, dal 17/11/2026): niente nuove ipotesi né acquisti su un'azienda che presenta i conti
   entro 5 giorni. In quei giorni il prezzo salta per motivi che il radar non vede. Nessuna eccezione. */
export const E2_GIORNI = 5;
export function invConti(conti, oggi) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(conti || "")) return null;
  const g = Math.round((Date.parse(conti) - Date.parse(oggi)) / 864e5);
  return g >= 0 && g <= E2_GIORNI ? "regola E2 (conti): l'azienda presenta i conti il " + conti.split("-").reverse().join("/") + (g === 0 ? ", oggi" : ", tra " + g + (g === 1 ? " giorno" : " giorni")) + ": niente ipotesi né acquisti fino a dopo i conti" : null;
}
/* REGOLA C1 (confidenza calcolata, dal 17/11/2026): la fiducia di un'ipotesi non la dichiara il modello, la calcola il Worker.
   Punti: fonti indipendenti (domini diversi) 3+ = 2, 2 = 1; evento con data entro l'orizzonte = 1; per le aziende,
   tecnica concorde (sopra/sotto la media a 50 giorni e MACD nella stessa direzione) = 1, discorde = -1;
   voce non confermata (voce: true) = -2. Totale 3+ = alta, 1-2 = media, 0 o meno = bassa. */
export function invConfidenza(x, strumento, p, oggi, orizzonte, direzione) {
  const dom = new Set((Array.isArray(x.fonti) ? x.fonti : []).map((f) => { try { return new URL(f.url).hostname.replace(/^www\./, ""); } catch (e) { return null; } }).filter(Boolean));
  const punti = { fonti: dom.size >= 3 ? 2 : dom.size === 2 ? 1 : 0, evento: 0, tecnica: 0, voce: x.voce === true ? -2 : 0 };
  const ev = x.evento || {}; if (/^\d{4}-\d{2}-\d{2}$/.test(ev.data || "")) { const g = Math.round((Date.parse(ev.data) - Date.parse(oggi)) / 864e5); if (g >= 0 && g <= orizzonte) punti.evento = 1; }
  if (isAz(strumento) && direzione !== "zero") { const t = invTecnica((p || []).filter((y) => y[0] <= oggi)); if (t && t.sopra50 != null) { const su = direzione === "su", ok = su ? t.sopra50 && t.macd === "su" : !t.sopra50 && t.macd === "giu", ko = su ? !t.sopra50 && t.macd === "giu" : t.sopra50 && t.macd === "su"; punti.tecnica = ok ? 1 : ko ? -1 : 0; } }
  const tot = punti.fonti + punti.evento + punti.tecnica + punti.voce;
  return { fiducia: tot >= 3 ? "alta" : tot >= 1 ? "media" : "bassa", punti, totale: tot, domini: dom.size };
}
function ipPulisci(x, serie, oggi, ora, conti) {
  if (!x || typeof x !== "object") return { err: "ipotesi non valida" };
  let strumento = String(x.strumento || "").trim();
  if (!INV_STR[strumento]) { const s = invSim(strumento); strumento = s ? "az:" + s : ""; }
  if (!strumento || !serie[strumento]) return { err: "strumento sconosciuto o senza prezzi: " + cut(x.strumento, 30) };
  const direzione = String(x.direzione || "").replace("giù", "giu"); if (!DIR.includes(direzione)) return { err: "direzione: su | giu | zero" };
  const orizzonte = +x.orizzonte; if (![7, 30, 90].includes(orizzonte)) return { err: "orizzonte: 7, 30 o 90 (90 solo per le chiavi di lettura)" };
  if (orizzonte === 90 && (x.origine || {}).tipo !== "chiave") return { err: "orizzonte 90 solo con origine.tipo = chiave" };
  const fiducia_modello = FID.includes(String(x.fiducia || "")) ? String(x.fiducia) : null;
  const meccanismo = cut(x.meccanismo, 240); if (meccanismo.length < 10) return { err: "meccanismo mancante" };
  const o = x.origine || {}; const tipo = ORIG.includes(o.tipo) ? o.tipo : "altro";
  const origine = { tipo, id: cut(o.id, 80), testo: cut(o.testo, 300), filone_id: cut(o.filone_id, 80) };
  const p0 = lastOnOrBefore(serie[strumento], oggi); // ultimo prezzo noto al momento della registrazione
  if (!p0) return { err: "nessun prezzo per " + strumento };
  if (isAz(strumento)) { const e1 = invEccesso(serie[strumento], direzione, x.eccezione, oggi); if (e1) return { err: strumento.slice(3) + ": " + e1 }; }
  if (isAz(strumento) && direzione !== "zero") { const e2 = invConti(/^\d{4}-\d{2}-\d{2}$/.test(String(x.conti || "")) ? String(x.conti) : (conti || {})[strumento.slice(3)], oggi); if (e2) return { err: strumento.slice(3) + ": " + e2 }; }
  const id = "h-" + oggi.replace(/-/g, "") + "-" + strumento.replace(/[^a-z0-9]+/gi, "") + "-" + orizzonte + "-" + (origine.id || cut(meccanismo, 24)).replace(/[^a-z0-9]+/gi, "").slice(0, 28).toLowerCase();
  const conf = invConfidenza(x, strumento, serie[strumento], oggi, orizzonte, direzione), fiducia = conf.fiducia;
  const ecc = x.eccezione && x.eccezione.data ? { data: cut(x.eccezione.data, 10), testo: cut(x.eccezione.testo, 200) } : undefined;
  return { h: { id, strumento, direzione, orizzonte, fiducia, meccanismo, origine, data: oggi, registrata_il: ora, data0: p0[0], prezzo0: p0[1], eccezione: ecc, fiducia_modello, confidenza: { punti: conf.punti, totale: conf.totale, domini: conf.domini }, fonti: fonti(x.fonti).slice(0, 6), evento: x.evento && x.evento.data ? { data: cut(x.evento.data, 10), testo: cut(x.evento.testo, 160) } : undefined, voce: x.voce === true || undefined } };
}
async function registraIpotesi(h, env, arr, serie, oggi) {
  const L = (await h.kvGet(env, K_IP)) || [];
  const ora = new Date().toISOString(), ids = new Set(L.map((x) => x.id)), out = [];
  const O = (await h.kvGet(env, K_OSS)) || [], conti = Object.fromEntries(O.filter((o) => o.conti).map((o) => [o.sim, o.conti]));
  for (const x of (arr || []).slice(0, 40)) {
    const r = ipPulisci(x, serie, oggi, ora, conti);
    if (r.err) {
      out.push({ ok: false, errore: r.err });
      const rg = (r.err.match(/regola (E[12])/) || [])[1];
      if (rg) { // si tiene traccia delle ipotesi bloccate, per misurare se la regola evita errori
        const s0 = invSim(x.strumento), k = s0 ? "az:" + s0 : "", p0 = k && serie[k] ? lastOnOrBefore(serie[k], oggi) : null;
        if (p0) { const B = (await h.kvGet(env, K_BL)) || []; if (!B.some((b) => b.data === oggi && b.strumento === k && b.direzione === x.direzione)) { B.push({ data: oggi, strumento: k, direzione: x.direzione, prezzo0: p0[1], data0: p0[0], regola: rg }); await h.kvSet(env, K_BL, B.slice(-300)); } }
      }
      continue;
    }
    if (ids.has(r.h.id)) { out.push({ ok: false, id: r.h.id, errore: "già registrata (le ipotesi non si modificano)" }); continue; }
    ids.add(r.h.id); L.push(r.h); out.push({ ok: true, id: r.h.id, prezzo0: r.h.prezzo0, data0: r.h.data0, fiducia: r.h.fiducia, confidenza: r.h.confidenza });
  }
  await h.kvSet(env, K_IP, L);
  return out;
}

function ossPulisci(x, P) {
  const sim = invSim(x.sim || x.ticker); if (!sim) return null;
  P = P || {};
  const s = { ...P, sim, ticker: cut(x.ticker || P.ticker || sim.toUpperCase(), 20), nome: cut(x.nome || P.nome || sim.toUpperCase(), 80), borsa: cut(x.borsa || P.borsa, 40), tipo: x.tipo === "etf" || x.tipo === "azione" ? x.tipo : P.tipo || "azione" };
  if (x.settore) s.settore = SETT.includes(x.settore) ? x.settore : "altro";
  if (x.stato) s.stato = STATI.includes(x.stato) ? x.stato : s.stato || "osservo";
  if (x.perche != null) s.perche = cut(x.perche, 240);
  if (x.smentita != null) s.smentita = cut(x.smentita, 200);
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(x.conti || ""))) s.conti = String(x.conti); // data dei prossimi conti trimestrali (regola E2)
  if (x.opportunita_id != null) s.opportunita_id = cut(x.opportunita_id, 40);
  if (x.scheda && typeof x.scheda === "object") {
    const k = x.scheda;
    s.scheda = {
      sintesi: cut(k.sintesi, 600),
      esposizione: (Array.isArray(k.esposizione) ? k.esposizione : []).slice(0, 8).map((e) => [cut(e && e[0], 40), num(e && e[1])]).filter((e) => e[0] && e[1] != null),
      numeri: Object.fromEntries(Object.entries(k.numeri && typeof k.numeri === "object" ? k.numeri : {}).slice(0, 10).map(([a, b]) => [cut(a, 40), cut(b, 40)])),
      periodo: cut(k.periodo, 40),
      catalizzatori: (Array.isArray(k.catalizzatori) ? k.catalizzatori : []).slice(0, 6).map((c) => ({ data: /^\d{4}-\d{2}-\d{2}$/.test((c && c.data) || "") ? c.data : "", testo: cut(c && c.testo, 160) })).filter((c) => c.testo),
      fonti: fonti(k.fonti),
      aggiornata_il: new Date().toISOString(),
    };
  }
  s.aggiornata_il = new Date().toISOString();
  return s;
}
function oppPulisci(o, oggi) {
  if (!o || typeof o !== "object") return null;
  const t = cut(o.titolo, 90); if (!t) return null;
  const c = o.catalizzatore || {};
  return { id: cut(o.id, 40) || "o-" + oggi.replace(/-/g, "") + "-" + t.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 16), settore: SETT.includes(o.settore) ? o.settore : "altro", titolo: t, tesi: cut(o.tesi, 400), punteggio: Math.max(0, Math.min(100, Math.round(+o.punteggio || 0))), impatto: [1, 2, 3].includes(+o.impatto) ? +o.impatto : 2, direzione: DIR.includes(o.direzione) ? o.direzione : "su", catalizzatore: { data: /^\d{4}-\d{2}-\d{2}$/.test(c.data || "") ? c.data : "", testo: cut(c.testo, 120) }, strumenti: (Array.isArray(o.strumenti) ? o.strumenti : []).slice(0, 8).map((x) => invSim(x)).filter(Boolean), smentita: cut(o.smentita, 200), tipo: cut(o.tipo, 40), fonti: fonti(o.fonti), data: oggi,
    // spiegazione per chi non conosce il tema (dal 17/11/2026)
    cosa: cut(o.cosa, 900), meccanismo: cut(o.meccanismo, 1200),
    coinvolte: (Array.isArray(o.coinvolte) ? o.coinvolte : []).slice(0, 6).map((c) => c && { sim: invSim(c.ticker || c.sim) || "", ticker: cut(c.ticker, 20), nome: cut(c.nome, 60), ruolo: cut(c.ruolo, 300) }).filter((c) => c && c.nome),
    rischi: (Array.isArray(o.rischi) ? o.rischi : []).slice(0, 5).map((r) => r && { titolo: cut(r.titolo, 60), testo: cut(r.testo, 300) }).filter((r) => r && r.testo),
    guardare: (Array.isArray(o.guardare) ? o.guardare : []).slice(0, 6).map((g) => g && { quando: cut(g.quando, 20), testo: cut(g.testo, 200) }).filter((g) => g && g.testo),
    glossario: (Array.isArray(o.glossario) ? o.glossario : []).slice(0, 6).map((g) => g && { termine: cut(g.termine, 40), def: cut(g.def, 260) }).filter((g) => g && g.termine && g.def),
    riferimento: o.riferimento && Number.isFinite(+o.riferimento.valore) && +o.riferimento.valore > 0 ? { valore: +o.riferimento.valore, testo: cut(o.riferimento.testo, 40), sim: invSim(o.riferimento.ticker || o.riferimento.sim) || "" } : null };
}

/* chiavi di lettura e micro-fatti */
const slug = (t, n) => String(t || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, n);

/* VERTICALI (20/11/2026): un settore con i suoi numeri, la sua agenda e i suoi atti ufficiali. Il motore delle chiavi resta uno;
   ogni verticale ha un raccoglitore (routine) che porta materia prima con /v1/inv/verticale. Energia: i numeri vengono dal Worker
   rs-numeri (collegamento RS + secret RS_TOKEN), agenda e atti da kv «inv:ver:en». */
export const VER = { en: { n: "Energia e materie prime" } };
const K_VER = (v) => "inv:ver:" + v;
const VER_NUM = { en: [ // [chiave, nome, unità, colonna del valore, colonna della data, divisore]
  ["ttf", "Gas TTF (ACER)", "€/MWh", "ttf", "acer_pub"], ["gnl", "GNL spot Europa", "€/MWh", "lng", "acer_pub"],
  ["stor_ue", "Stoccaggi gas UE", "%", "stor_eu", "stor_date"], ["stor_it", "Stoccaggi gas Italia", "%", "stor_it", "stor_date"], ["stor_de", "Stoccaggi gas Germania", "%", "stor_de", "stor_date"],
  ["el_nord", "Elettricità zona Nord", "€/MWh", "el_nord", "el_nord_date"], ["brent", "Brent", "$/barile", "brent", "brent_date"],
  ["gasolio_it", "Gasolio Italia", "€/l", "diesel_it", "wob_date", 1000], ["cbam", "CBAM", "€/t", "cbam", null], ["import_el", "Import netto elettrico", "GWh", "net_imp_gwh", "net_imp_date"] ] };
const verIso = (d) => { const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(String(d || "")); return m ? m[3] + "-" + m[2].padStart(2, "0") + "-" + m[1].padStart(2, "0") : String(d || "").slice(0, 10); };
export function verSerie(hist, cols) { // storico di rs-numeri (una riga per giorno di raccolta) → serie per data vera del dato
  const out = {};
  for (const [k, n, u, col, dcol, div] of cols) {
    const o = {};
    for (const r of Array.isArray(hist) ? hist : []) { if (!r || r[col] == null || r[col] === "") continue; const d = verIso((dcol && r[dcol]) || r.date); const v = +r[col]; if (/^\d{4}-\d{2}-\d{2}$/.test(d) && Number.isFinite(v)) o[d] = div && v > 100 ? +(v / div).toFixed(3) : v; }
    const p = Object.entries(o).sort((a, b) => a[0].localeCompare(b[0]));
    if (p.length) out[k] = { n, u, p };
  }
  return out;
}
export function verArchivia(arch, fresche, cols) { // unisce le serie fresche all'archivio permanente { chiave: { data: valore } }; il dato fresco vince
  const A = arch && typeof arch === "object" ? arch : {}; let nuovi = 0;
  for (const [k, x] of Object.entries(fresche || {})) { const o = A[k] || (A[k] = {}); for (const [d, v] of x.p) if (o[d] !== v) { o[d] = v; nuovi++; } }
  const numeri = {};
  for (const [k, n, u] of cols) { const p = Object.entries(A[k] || {}).sort((a, b) => a[0].localeCompare(b[0])); if (p.length) numeri[k] = { n, u, p }; }
  return { arch: A, numeri, nuovi };
}
async function verNumeri(h, env, v) { // rs-numeri tiene solo gli ultimi 120 giorni: qui ogni dato letto resta per sempre in kv «inv:ver:en:num»
  if (v !== "en") return { numeri: {} };
  const arch = (await h.kvGet(env, K_VER(v) + ":num").catch(() => null)) || {};
  try {
    if (!env.RS || !env.RS_TOKEN) throw new Error("collegamento rs-numeri non configurato");
    const r = await env.RS.fetch("https://rs-numeri/history.json", { headers: { authorization: "Bearer " + env.RS_TOKEN } });
    if (!r.ok) throw new Error("rs-numeri: HTTP " + r.status);
    const m = verArchivia(arch, verSerie(await r.json(), VER_NUM[v]), VER_NUM[v]);
    if (m.nuovi) await h.kvSet(env, K_VER(v) + ":num", m.arch).catch(() => {});
    return { numeri: m.numeri };
  } catch (e) { return { numeri: verArchivia(arch, {}, VER_NUM[v]).numeri, errore: String((e && e.message) || e).slice(0, 120) }; }
}
const verUrl = (u) => (/^https:\/\/[^\s"<>]{4,400}$/.test(String(u || "")) ? String(u) : "");
export function verPulisci(b, prev, oggi) { // unisce agenda e atti nuovi a quelli in archivio; restituisce { dati, res }
  const D = { agenda: Array.isArray(prev && prev.agenda) ? prev.agenda : [], atti: Array.isArray(prev && prev.atti) ? prev.atti : [] }, res = { errori: [], agenda: 0, atti: 0, tolte: 0 };
  const giorni = (n) => new Date(Date.parse(oggi + "T12:00:00Z") + n * 864e5).toISOString().slice(0, 10);
  const A = new Map(D.agenda.map((x) => [x.id, x]));
  for (const x of (Array.isArray(b.agenda) ? b.agenda : []).slice(0, 120)) {
    const cosa = cut(x && x.cosa, 220), data = x && /^\d{4}-\d{2}-\d{2}$/.test(x.data || "") ? x.data : "", url = verUrl(x && x.fonte && x.fonte.url);
    if (!cosa || cosa.length < 8 || !data) { res.errori.push("agenda: servono data (AAAA-MM-GG) e cosa: " + cut(cosa, 40)); continue; }
    if (!url) { res.errori.push("agenda: serve la fonte con link https: " + cut(cosa, 40)); continue; }
    const id = slug(x.id, 60) || "d-" + data.replace(/-/g, "") + "-" + slug(cosa, 30), p = A.get(id) || {};
    A.set(id, { id, data, data_fine: /^\d{4}-\d{2}-\d{2}$/.test(x.data_fine || "") && x.data_fine > data ? x.data_fine : "", cosa, livello: ["globale", "UE", "Italia", "regione"].includes(x.livello) ? x.livello : p.livello || "Italia", stato: ["ufficiale", "da_confermare"].includes(x.stato) ? x.stato : p.stato || "da_confermare", fonte: { nome: cut(x.fonte.nome, 60) || "fonte", url }, inserita: p.inserita || oggi }); res.agenda++;
  }
  for (const id of (Array.isArray(b.agenda_tolte) ? b.agenda_tolte : []).slice(0, 60)) if (A.delete(slug(id, 60))) res.tolte++;
  D.agenda = [...A.values()].filter((x) => (x.data_fine || x.data) >= giorni(-30)).sort((a, b) => a.data.localeCompare(b.data)).slice(0, 500);
  const T = new Map(D.atti.map((x) => [x.id, x]));
  for (const x of (Array.isArray(b.atti) ? b.atti : []).slice(0, 80)) {
    const testo = cut(x && x.testo, 260), data = x && /^\d{4}-\d{2}-\d{2}$/.test(x.data || "") ? x.data : "", url = verUrl(x && x.fonte && x.fonte.url);
    if (!testo || testo.length < 12 || !data || data > oggi) { res.errori.push("atto: servono data non futura e testo: " + cut(testo, 40)); continue; }
    if (!url) { res.errori.push("atto: serve il link https all'atto: " + cut(testo, 40)); continue; }
    if (x.letto !== true) { res.errori.push("atto non letto (letto: true solo se hai aperto l'atto): " + cut(testo, 40)); continue; }
    const id = slug(x.id, 60) || "a-" + data.replace(/-/g, "") + "-" + slug(testo, 30), p = T.get(id) || {};
    T.set(id, { id, data, testo, ente: cut(x.ente, 60) || p.ente || "", ambito: cut(x.ambito, 40) || p.ambito || "", territorio: cut(x.territorio, 40) || p.territorio || "", scadenza: /^\d{4}-\d{2}-\d{2}$/.test(x.scadenza || "") ? x.scadenza : p.scadenza || "", fonte: { nome: cut(x.fonte.nome, 60) || "fonte", url }, inserito: p.inserito || oggi }); res.atti++;
  }
  D.atti = [...T.values()].filter((x) => x.data >= giorni(-120)).sort((a, b) => a.data.localeCompare(b.data)).slice(-600);
  D.aggiornato = oggi;
  return { dati: D, res };
}
async function verVista(h, env, oggi, breve) { // breve = per la routine (ultimo valore e finestre corte); altrimenti per il pannello (serie)
  const out = {}, giorni = (n) => new Date(Date.parse(oggi + "T12:00:00Z") + n * 864e5).toISOString().slice(0, 10);
  for (const v of Object.keys(VER)) {
    const d = (await h.kvGet(env, K_VER(v))) || {}, N = await verNumeri(h, env, v), numeri = {};
    for (const [k, x] of Object.entries(N.numeri)) { const p = x.p.slice(-60), vv = p.slice(-30).map((q) => q[1]), l = p[p.length - 1]; numeri[k] = breve ? { nome: x.n, unita: x.u, ultimo: { data: l[0], valore: l[1] }, min_30: Math.min(...vv), max_30: Math.max(...vv) } : { n: x.n, u: x.u, p }; }
    const ag = (Array.isArray(d.agenda) ? d.agenda : []).filter((x) => (x.data_fine || x.data) >= oggi && x.data <= giorni(breve ? 30 : 60)).slice(0, breve ? 40 : 60);
    const at = (Array.isArray(d.atti) ? d.atti : []).filter((x) => x.data >= giorni(breve ? -14 : -30)).slice(-(breve ? 60 : 80)).reverse();
    out[v] = { nome: VER[v].n, numeri, ...(N.errore ? { numeri_errore: N.errore } : {}), agenda: ag, atti: at, aggiornato: d.aggiornato || null };
  }
  return out;
}
function soglia(x) { // soglia di smentita misurabile su un numero di verticale: { ver, num, verso: "sotto"|"sopra", valore }
  if (!x || typeof x !== "object") return null;
  const ver = String(x.ver || ""), num = String(x.num || ""), valore = +x.valore;
  if (!VER_NUM[ver] || !VER_NUM[ver].some((c) => c[0] === num) || !["sotto", "sopra"].includes(x.verso) || !Number.isFinite(valore)) return null;
  return { ver, num, verso: x.verso, valore };
}
const RIP_ST = ["visibile", "attesa", "possibile"];
function chDirezione(x, p) { // la direzione della chiave: dove porta, ripercussioni, chi è toccato, cosa osservare (le scrive la routine dai fatti)
  const o = {}, has = (k) => x[k] != null;
  o.porta = has("porta") ? cut(x.porta, 280) : p.porta || "";
  o.ripercussioni = Array.isArray(x.ripercussioni) ? x.ripercussioni.slice(0, 5).map((r) => ({ stato: RIP_ST.includes(r && r.stato) ? r.stato : "possibile", testo: cut(r && r.testo, 170), base: cut(r && r.base, 150) })).filter((r) => r.testo) : p.ripercussioni || [];
  const t = x.toccati && typeof x.toccati === "object" ? { perde: cut(x.toccati.perde, 170), guadagna: cut(x.toccati.guadagna, 170) } : p.toccati || null;
  if (t && (t.perde || t.guadagna)) o.toccati = t;
  o.osservare = Array.isArray(x.osservare) ? x.osservare.slice(0, 4).map((r) => ({ quando: /^\d{4}-\d{2}-\d{2}$/.test((r && r.quando) || "") || ["presto", "settimane", "mesi"].includes(r && r.quando) ? r.quando : "", testo: cut(r && r.testo, 170), senso: cut(r && r.senso, 170) })).filter((r) => r.testo) : p.osservare || [];
  o.direzione_del = has("porta") || Array.isArray(x.ripercussioni) || Array.isArray(x.osservare) ? null : p.direzione_del || "";
  return o;
}
export function chPulisci(x, prev, oggi) {
  if (!x || typeof x !== "object") return null;
  const nome = cut(x.nome, 80) || (prev && prev.nome); if (!nome) return null;
  const p = prev || {}, has = (k) => x[k] != null, sg = x.soglia === null ? null : soglia(x.soglia) || p.soglia || null;
  return { id: p.id || slug(x.id, 40) || "k-" + slug(nome, 36), nome, tesi: has("tesi") ? cut(x.tesi, 320) : p.tesi || "", settore: SETT.includes(x.settore) ? x.settore : p.settore || "altro",
    stato: ST_CH.includes(x.stato) ? x.stato : p.stato || "spunto", catena: Array.isArray(x.catena) ? x.catena.slice(0, 4).map((c) => cut(c, 60)).filter(Boolean) : p.catena || [], manca: has("manca") ? cut(x.manca, 60) : p.manca || "",
    smentita: has("smentita") ? cut(x.smentita, 200) : p.smentita || "", prova_se: has("prova_se") ? cut(x.prova_se, 200) : p.prova_se || "", strumenti: Array.isArray(x.strumenti) ? x.strumenti.slice(0, 8).map((t) => invSim(t)).filter(Boolean) : p.strumenti || [],
    nota: has("nota") ? cut(x.nota, 240) : p.nota || "", sintesi: has("sintesi") ? cut(x.sintesi, 1000) : p.sintesi || "", sintesi_del: has("sintesi") && cut(x.sintesi, 1000) ? oggi : p.sintesi_del || "", creata: p.creata || oggi, aggiornata: oggi, origine: p.origine || "modello", ...(sg ? { soglia: sg } : {}), ...(() => { const d = chDirezione(x, p); if (d.direzione_del === null) d.direzione_del = oggi; return d; })() };
}
function faPulisci(x, prev, oggi, ids) {
  if (!x || typeof x !== "object") return { err: "fatto non valido" };
  const p = prev || {}, testo = cut(x.testo, 220) || p.testo; if (!testo || testo.length < 12) return { err: "testo del fatto mancante" };
  const data = /^\d{4}-\d{2}-\d{2}$/.test(x.data || "") ? x.data : p.data; if (!data || data > oggi) return { err: "data del fatto mancante o futura (AAAA-MM-GG): " + cut(testo, 40) };
  const F = x.fonti ? fonti(x.fonti).filter((q) => q.url) : p.fonti || []; if (!F.length) return { err: "serve almeno una fonte con link: " + cut(testo, 40) };
  const ch = x.chiave_id === null ? "" : x.chiave_id != null ? slug(x.chiave_id, 40) : p.chiave_id || ""; if (ch && !ids.has(ch)) return { err: "chiave sconosciuta: " + ch };
  const v = +x.verso; const verso = ch ? ([1, -1].includes(v) ? v : [1, -1].includes(p.verso) ? p.verso : null) : 0; if (verso === null) return { err: "verso: 1 (a favore) o -1 (contro) per un fatto dentro una chiave" };
  const agg = x.aggiorna === null ? "" : x.aggiorna != null ? slug(x.aggiorna, 60) : p.aggiorna || "";
  return { f: { aggiorna: agg, id: p.id || slug(x.id, 60) || "f-" + data.replace(/-/g, "") + "-" + slug(testo, 28), data, testo, verso, chiave_id: ch, settore: SETT.includes(x.settore) ? x.settore : p.settore || "altro", fonti: F, aggiunto: p.aggiunto || oggi, origine: p.origine || (x.da_richiesta ? "manuale" : "modello") } };
}
async function chiaviVista(h, env, L) {
  const K = (await h.kvGet(env, K_CH)) || [], F = (await h.kvGet(env, K_FA)) || [];
  // un fatto aggiornato da uno più recente (campo «aggiorna») non conta più: resta visibile sotto quello nuovo
  const sup = new Map(F.filter((f) => f.aggiorna).map((f) => [f.aggiorna, f.id]));
  const F2 = F.map((f) => (sup.has(f.id) ? { ...f, superato_da: sup.get(f.id) } : f));
  const chiavi = K.map((k) => { const tutti = F2.filter((f) => f.chiave_id === k.id).sort((a, b) => a.data.localeCompare(b.data) || a.id.localeCompare(b.id)), mie = tutti.filter((f) => !f.superato_da); return { ...k, fatti: mie, superati: tutti.filter((f) => f.superato_da), favore: mie.filter((f) => f.verso > 0).length, contro: mie.filter((f) => f.verso < 0).length, chiamate: (L || []).filter((x) => x.origine && x.origine.tipo === "chiave" && x.origine.id === k.id) }; });
  return { chiavi, sciolti: F2.filter((f) => !f.chiave_id && !f.superato_da).sort((a, b) => b.data.localeCompare(a.data)).slice(0, 60), richieste_fatti: ((await h.kvGet(env, K_RQF)) || []).filter((r) => !r.fatta) };
}

/* simulatore: legge il registro, scarica i prezzi mancanti (al massimo 6) e ricalcola tutto */
async function pfDati(h, env, oggi, scarica) {
  const L = (await h.kvGet(env, K_PF)) || { ops: [] }, ops = L.ops || [];
  const sims = [...new Set([PF_FX, PF_RIF.sim].concat(ops.map((o) => o.sim).filter(Boolean)))], S = {};
  let k = 0;
  const A = {};
  for (const s of sims) { let r = await pxGet(h, env, s); if ((!r || !r.p.length) && scarica && k < 6) { r = await pxAggiorna(h, env, s); k++; } S[s] = r && r.p ? r.p : []; A[s] = r && r.at; }
  const R = pfCalcola(ops, (s) => S[s] || [], S[PF_FX], oggi, (s) => A[s]);
  // congela le operazioni appena eseguite (18/11/2026): il registro non cambia più a posteriori
  const nuove = ops.filter((o) => o.tipo !== "versa" && !o.fisso && R.esiti[o.id] && R.esiti[o.id].stato === "eseguita" && R.esiti[o.id].pe > 0);
  if (nuove.length) { const L2 = (await h.kvGet(env, K_PF)) || { ops: [] }; let n = 0; for (const o of L2.ops || []) { const e = R.esiti[o.id]; if (!o.fisso && nuove.some((x) => x.id === o.id)) { o.fisso = { d: e.data, prezzo: e.prezzo, pe: e.pe, at: new Date().toISOString() }; n++; } } if (n) await h.kvSet(env, K_PF, L2); }
  return { ...R, ops: ops.map((o) => ({ ...o, esito: R.esiti[o.id] || { stato: "in_attesa" } })), prezzi: S };
}
/* ordini: dal radar (conto «modello») o dal pannello (conto «mio»); si eseguono alla prima chiusura successiva */
async function pfOrdini(h, env, arr, conto, oggi) {
  const L = (await h.kvGet(env, K_PF)) || { ops: [] }; L.ops ||= [];
  if (!L.ops.some((o) => o.conto === conto && o.tipo === "versa")) return [{ ok: false, errore: conto === "modello" ? "simulatore non ancora avviato da Francesco: nessun ordine" : "prima versa dei soldi virtuali nel tuo conto" }];
  const D = await pfDati(h, env, oggi, false), V = (D.conti[conto] || {}).valore || 0, out = [];
  for (const x of (arr || []).slice(0, 12)) {
    const tipo = x && x.tipo; if (!["compra", "vendi", "scoperto", "ricopri"].includes(tipo)) { out.push({ ok: false, errore: "tipo: compra | vendi | scoperto | ricopri" }); continue; }
    if (conto !== "modello" && (tipo === "scoperto" || tipo === "ricopri")) { out.push({ ok: false, errore: "il ribasso per ora è solo nel conto del modello" }); continue; }
    const sim = invSim(x.ticker || x.sim); if (!sim) { out.push({ ok: false, errore: "simbolo non valido: " + cut(x.ticker, 20) }); continue; }
    if (!pfValuta(sim)) { out.push({ ok: false, errore: "valuta non supportata per " + sim + " (per ora euro e dollari)" }); continue; }
    const motivo = cut(x.motivo, 300); if (conto === "modello" && motivo.length < 10) { out.push({ ok: false, errore: "motivo mancante per " + sim }); continue; }
    if (L.ops.some((o) => o.conto === conto && o.sim === sim && !(D.esiti[o.id] && D.esiti[o.id].stato !== "in_attesa") && o.tipo === tipo)) { out.push({ ok: false, errore: "c'è già un ordine in attesa su " + sim }); continue; }
    let regola = cut(x.regola, 6).toUpperCase();
    if (conto === "modello" && !(tipo === "scoperto" ? /^S1$/ : tipo === "ricopri" ? /^C[2-5]$/ : tipo === "compra" ? /^A[1-4]$/ : /^V[1-5]$/).test(regola)) { out.push({ ok: false, errore: "regola mancante o sbagliata per " + sim + ": A1-A4 per comprare, V1-V5 per vendere, S1 per aprire al ribasso, C2-C5 per chiuderlo (vedi istruzioni)" }); continue; }
    let stop = null;
    if (tipo === "scoperto") { // REGOLA S1 (ribasso, dal 20/11/2026): più stretta del rialzo, la applica il Worker
      const ip = ((await h.kvGet(env, K_IP)) || []).filter((y) => y.strumento === "az:" + sim && y.direzione === "giu" && y.data === oggi).pop();
      if (!ip) { out.push({ ok: false, errore: sim + ": regola S1 senza un'ipotesi «giù» registrata oggi" }); continue; }
      if (ip.voce) { out.push({ ok: false, errore: sim + ": regola E3 (voci): niente ribasso su una voce non confermata" }); continue; }
      if (ip.fiducia !== "alta") { out.push({ ok: false, errore: sim + ": al ribasso solo con fiducia calcolata alta (qui " + ip.fiducia + ")" }); continue; }
      const oss = ((await h.kvGet(env, K_OSS)) || []).find((o) => o.sim === sim), e2 = invConti(oss && oss.conti, oggi); if (e2) { out.push({ ok: false, errore: sim + ": " + e2 }); continue; }
      const px = await pxGet(h, env, sim), t = px && invTecnica(px.p.filter((y) => y[0] <= oggi));
      if (!t || t.sopra200 == null) { out.push({ ok: false, errore: sim + ": serve almeno un anno di prezzi per aprire al ribasso" }); continue; }
      if (t.sopra200) { out.push({ ok: false, errore: sim + ": al ribasso solo sotto la media a 200 giorni (qui il prezzo è sopra)" }); continue; }
      const e1 = invEccesso(px.p, "giu", x.eccezione, oggi); if (e1) { out.push({ ok: false, errore: sim + ": " + e1 }); continue; }
      if ((((await h.kvGet(env, K_OPP)) || {}).lista || []).some((op) => op.riferimento && invSim(op.riferimento.ticker) === sim)) { out.push({ ok: false, errore: sim + ": c'è un prezzo di riferimento aperto (es. un'offerta d'acquisto): niente ribasso" }); continue; }
      if (((D.conti[conto] || {}).posizioni || []).some((q) => q.sim === sim)) { out.push({ ok: false, errore: sim + ": è già in portafoglio al rialzo" }); continue; }
      stop = +Math.max(4, Math.min(12, 3 * (t.amp14 || 2))).toFixed(1); x.peso = PF_SC_PESO;
    }
    if (tipo === "ricopri" && !((D.conti[conto] || {}).scoperti || []).some((q) => q.sim === sim) && !L.ops.some((o) => o.conto === conto && o.sim === sim && o.tipo === "scoperto" && !(D.esiti[o.id] && D.esiti[o.id].stato !== "in_attesa"))) { out.push({ ok: false, errore: sim + ": nessuna posizione al ribasso da chiudere" }); continue; }
    if (conto === "modello" && tipo === "compra" && /^A[12]$/.test(regola)) { // A1/A2 richiedono un'ipotesi «su» di oggi; il peso segue la fiducia calcolata
      const ip = ((await h.kvGet(env, K_IP)) || []).filter((y) => y.strumento === "az:" + sim && y.direzione === "su" && y.data === oggi).pop();
      if (!ip) { out.push({ ok: false, errore: sim + ": regola " + regola + " senza un'ipotesi «su» registrata oggi" }); continue; }
      if (ip.voce) { out.push({ ok: false, errore: sim + ": regola E3 (voci): l'ipotesi poggia su una voce non confermata, niente acquisto" }); continue; }
      if (ip.fiducia === "bassa") { out.push({ ok: false, errore: sim + ": fiducia calcolata bassa (" + ip.confidenza.totale + " punti): niente acquisto" }); continue; }
      x.peso = ip.fiducia === "alta" ? 8 : 5; regola = ip.fiducia === "alta" ? "A2" : "A1";
    }
    if (conto === "modello" && tipo === "compra") {
      if (x.voce === true || ((await h.kvGet(env, K_IP)) || []).some((y) => y.strumento === "az:" + sim && y.data === oggi && y.voce)) { out.push({ ok: false, errore: sim + ": regola E3 (voci): oggi su questo titolo c'è solo una voce non confermata, niente acquisto" }); continue; }
      const oss = ((await h.kvGet(env, K_OSS)) || []).find((o) => o.sim === sim), e2 = invConti(/^\d{4}-\d{2}-\d{2}$/.test(String(x.conti || "")) ? String(x.conti) : oss && oss.conti, oggi);
      if (e2) { out.push({ ok: false, errore: sim + ": " + e2 }); continue; }
    }
    if (conto === "modello" && tipo === "compra") { const px = await pxGet(h, env, sim); const e1 = px && invEccesso(px.p, "su", x.eccezione, oggi); if (e1) { out.push({ ok: false, errore: sim + ": " + e1 }); continue; } }
    let eur = null, quota = null;
    if (tipo === "ricopri") quota = 1;
    else if (tipo === "scoperto") eur = +(V * PF_SC_PESO / 100).toFixed(2);
    else if (tipo === "compra") { eur = x.peso != null ? V * Math.min(PF_MAX_PESO, Math.max(0, +x.peso)) / 100 : +x.eur; if (!(eur >= 1)) { out.push({ ok: false, errore: "importo (eur) o peso (%) mancante per " + sim }); continue; } eur = +eur.toFixed(2); }
    else { quota = x.quota == null ? 1 : Math.max(0.05, Math.min(1, +x.quota)); if (!((D.conti[conto] || {}).posizioni || []).some((p) => p.sim === sim) && !L.ops.some((o) => o.conto === conto && o.sim === sim && o.tipo === "compra")) { out.push({ ok: false, errore: sim + " non è in portafoglio" }); continue; } }
    if (!(await pxGet(h, env, sim))) await pxAggiorna(h, env, sim);
    const o = { id: "p-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), conto, tipo, data: oggi, sim, eur, quota, ...(stop ? { stop } : {}), motivo, regola: regola || undefined, origine: x.origine && typeof x.origine === "object" ? { tipo: cut(x.origine.tipo, 20), id: cut(x.origine.id, 80) } : null, at: new Date().toISOString() };
    L.ops.push(o); out.push({ ok: true, id: o.id, sim, tipo, eur, quota });
  }
  await h.kvSet(env, K_PF, L);
  return out;
}
const pfRiassunto = (D, conto) => { const c = D.conti[conto]; if (!c) return { avviato: false }; return { avviato: true, valore: c.valore, versato: c.versato, cassa: c.cassa, peso_cassa: c.peso_cassa, rend: c.rend, posizioni: c.posizioni.map((p) => ({ sim: p.sim, peso: p.peso, resa: p.resa, dal: p.dal, origine: (D.ops.find((o) => o.id === p.ops[p.ops.length - 1]) || {}).origine || null })), al_ribasso: (c.scoperti || []).map((p) => ({ sim: p.sim, peso: p.peso, resa: p.resa, dal: p.dal, uscita_obbligatoria_sopra: p.stop_prezzo, origine: (D.ops.find((o) => o.id === p.ops[0]) || {}).origine || null })), in_attesa: D.ops.filter((o) => o.conto === conto && o.esito.stato === "in_attesa").map((o) => ({ id: o.id, tipo: o.tipo, sim: o.sim, data: o.data })), regole_ribasso: "tipo: scoperto (regola S1) apre al ribasso con peso fisso " + PF_SC_PESO + "% (max " + PF_SC_MAX + "% in tutto); tipo: ricopri (regole C2-C5) lo chiude; l'uscita obbligatoria C1 la applica il Worker", regole: "ordini: {tipo: compra|vendi, ticker, peso (% del portafoglio, max " + PF_MAX_PESO + ") oppure eur, quota (0-1, per vendere una parte), motivo, origine {tipo, id}}; eseguiti alla prima chiusura successiva, costi 0,15%" }; };

/* rotte della routine (token): /v1/inv/contesto, /v1/inv/ipotesi, /v1/inv/radar, /v1/inv/prezzi, /v1/inv/chiavi, /v1/inv/verticale */
export async function invRoute(request, env, p, method, h) {
  if (!h.authorized(request, env)) return h.fail(401, "unauthorized");
  const oggi = h.romeToday();
  const O = (await h.kvGet(env, K_OSS)) || [];
  if (p === "/v1/inv/contesto" && method === "GET") {
    const serie = await serieTutte(h, env, O.map((o) => o.sim));
    const L = (await h.kvGet(env, K_IP)) || [];
    const strumenti = Object.fromEntries(Object.entries(INV_STR).map(([k, c]) => { const s = serie[k] || []; const l = s[s.length - 1]; return [k, { nome: c.n, unita: c.u, ultimo: l ? { data: l[0], valore: l[1] } : null, banda_7: c.banda[0], banda_30: c.banda[1] }]; }));
    const osservati = O.map((o) => { const s = serie["az:" + o.sim] || []; const l = s[s.length - 1]; const t = invTecnica(s); if (t) delete t.hist; return { sim: o.sim, ticker: o.ticker, nome: o.nome, settore: o.settore, stato: o.stato, perche: o.perche, origine: o.origine, aggiunta_il: o.aggiunta_il, conti: o.conti || null, scheda_del: o.scheda ? o.scheda.aggiornata_il : null, ultimo: l ? { data: l[0], valore: l[1] } : null, tecnica: t, forza: forzaDi(o.sim, serie) || undefined }; });
    const aperte = L.map((x) => ({ ...x, v: invValuta(x, serie[x.strumento]) })).filter((x) => x.v.stato === "aperta").map((x) => ({ id: x.id, strumento: x.strumento, direzione: x.direzione, orizzonte: x.orizzonte, data: x.data, origine: x.origine }));
    return h.json({ ok: true, oggi, portafoglio: pfRiassunto(await pfDati(h, env, oggi, true), "modello"), strumenti, osservati, mercati: mercatiVista(serie, L, false), opportunita: ((await h.kvGet(env, K_OPP)) || {}).lista || [], richieste: ((await h.kvGet(env, K_RQ)) || []).filter((r) => !r.fatta), aperte, ...(await (async () => { const v = await chiaviVista(h, env, L); return { chiavi: v.chiavi.map((k) => ({ id: k.id, nome: k.nome, tesi: k.tesi, sintesi: k.sintesi, sintesi_del: k.sintesi_del, settore: k.settore, stato: k.stato, catena: k.catena, manca: k.manca, smentita: k.smentita, soglia: k.soglia || undefined, porta: k.porta || undefined, ripercussioni: k.ripercussioni && k.ripercussioni.length ? k.ripercussioni : undefined, toccati: k.toccati || undefined, osservare: k.osservare && k.osservare.length ? k.osservare : undefined, direzione_del: k.direzione_del || undefined, strumenti: k.strumenti, favore: k.favore, contro: k.contro, fatti: k.fatti.map((f) => ({ id: f.id, data: f.data, verso: f.verso, testo: f.testo, aggiorna: f.aggiorna || undefined })), ipotesi: k.chiamate.length })), fatti_sciolti: v.sciolti.map((f) => ({ id: f.id, data: f.data, settore: f.settore, testo: f.testo, aggiorna: f.aggiorna || undefined })), richieste_fatti: v.richieste_fatti }; })()),
      verticali: await verVista(h, env, oggi, true),
      regole: "ipotesi: strumento = una chiave di strumenti oppure «az:<simbolo interno>» di un osservato con prezzi; direzione su|giu|zero; orizzonte 7|30 (90 solo con origine.tipo «chiave»); fiducia bassa|media|alta; meccanismo 10-240 caratteri. Le ipotesi non si modificano." });
  }
  if (p === "/v1/inv/ipotesi" && method === "POST") {
    const b = await request.json().catch(() => null); const arr = b && Array.isArray(b.ipotesi) ? b.ipotesi : null;
    if (!arr) return h.fail(400, "json", "atteso { ipotesi: [ … ] }");
    const out = await registraIpotesi(h, env, arr, await serieTutte(h, env, O.map((o) => o.sim)), oggi);
    return h.json({ ok: true, registrate: out.filter((x) => x.ok).length, esiti: out });
  }
  if (p === "/v1/inv/prezzi" && method === "POST") { // la routine fa scaricare i prezzi al Worker, oppure li carica lei ({ ticker, p })
    const b = await request.json().catch(() => null); const sim = invSim(b && (b.sim || b.ticker));
    if (!sim) return h.fail(400, "simbolo");
    let r;
    if (b.p != null) { const x = pxDaRoutine(b.p); if (!x.ok) return h.fail(400, "prezzi", x.errore); r = await pxSalva(h, env, sim, x); }
    else r = await pxAggiorna(h, env, sim);
    return h.json({ ok: !r.errore, sim, simbolo_yahoo: invYsym(sim), fonte: r.fonte || null, giorni: (r.p || []).length, ultimo: (r.p || []).slice(-1)[0] || null, errore: r.errore || null });
  }
  if (p === "/v1/inv/radar" && method === "POST") {
    const b = await request.json().catch(() => null); if (!b) return h.fail(400, "json");
    const res = {};
    if (Array.isArray(b.opportunita)) {
      const lista = b.opportunita.slice(0, 8).map((o) => oppPulisci(o, oggi)).filter(Boolean).sort((a, c) => c.punteggio - a.punteggio);
      const prev = (await h.kvGet(env, K_OPP)) || {};
      const storia = (prev.storia || []).concat(prev.lista && prev.data !== oggi ? prev.lista : []).slice(-300);
      await h.kvSet(env, K_OPP, { data: oggi, lista, storia }); res.opportunita = lista.length;
    }
    if (Array.isArray(b.osservati) || Array.isArray(b.rimossi)) {
      const M = new Map(O.map((o) => [o.sim, o])); let n = 0;
      for (const x of (b.osservati || []).slice(0, 40)) { const sim = invSim(x.sim || x.ticker); if (!sim) continue; const prev = M.get(sim); const s = ossPulisci(x, prev); if (!s) continue; if (!prev) { s.aggiunta_il = oggi; s.origine = "modello"; } if (!s.stato || s.stato === "da_classificare") s.stato = "osservo"; M.set(sim, s); n++; }
      for (const r of (b.rimossi || []).slice(0, 40)) { const o = M.get(invSim(r)); if (o) { o.stato = "uscita"; o.uscita_il = oggi; } }
      await h.kvSet(env, K_OSS, [...M.values()].slice(-120)); res.osservati = n;
      // simboli nuovi senza prezzi: li scarica subito (al massimo 6), così le ipotesi dello stesso invio si possono registrare
      let k = 0; res.prezzi = {};
      for (const o of M.values()) { if (k >= 6 || o.stato === "uscita") continue; if (await pxGet(h, env, o.sim)) continue; const r = await pxAggiorna(h, env, o.sim); res.prezzi[o.sim] = r.errore || (r.p || []).length + " giorni"; k++; }
    }
    if (Array.isArray(b.richieste_fatte)) { const R = (await h.kvGet(env, K_RQ)) || []; const f = new Set(b.richieste_fatte.map(String)); R.forEach((r) => { if (f.has(r.id)) r.fatta = oggi; }); await h.kvSet(env, K_RQ, R.slice(-200)); }
    if (Array.isArray(b.ipotesi)) res.ipotesi = await registraIpotesi(h, env, b.ipotesi, await serieTutte(h, env, ((await h.kvGet(env, K_OSS)) || []).map((o) => o.sim)), oggi);
    if (Array.isArray(b.portafoglio)) res.portafoglio = await pfOrdini(h, env, b.portafoglio, "modello", oggi); // dopo le ipotesi: A1/A2 le leggono
    return h.json({ ok: true, ...res });
  }
  if (p === "/v1/inv/pf" && method === "POST") { // ordini del portafoglio «modello»: { ordini: [ … ] }
    const b = await request.json().catch(() => null); const arr = b && (b.ordini || b.portafoglio);
    if (!Array.isArray(arr)) return h.fail(400, "json", "atteso { ordini: [ … ] }");
    return h.json({ ok: true, esiti: await pfOrdini(h, env, arr, "modello", oggi) });
  }
  if (p === "/v1/inv/verticale" && method === "POST") { // il raccoglitore di una verticale: { verticale, agenda, agenda_tolte, atti }
    const b = await request.json().catch(() => null); if (!b) return h.fail(400, "json");
    const v = String(b.verticale || ""); if (!VER[v]) return h.fail(400, "verticale", "verticale sconosciuta: " + Object.keys(VER).join(", "));
    const { dati, res } = verPulisci(b, await h.kvGet(env, K_VER(v)), oggi);
    await h.kvSet(env, K_VER(v), dati);
    return h.json({ ok: true, verticale: v, ...res, in_archivio: { agenda: dati.agenda.length, atti: dati.atti.length } });
  }
  if (p === "/v1/inv/chiavi" && method === "POST") { // la routine «chiavi»: { chiavi, fatti, richieste_fatte, ipotesi }
    const b = await request.json().catch(() => null); if (!b) return h.fail(400, "json");
    const res = { errori: [] };
    const K = (await h.kvGet(env, K_CH)) || [], M = new Map(K.map((k) => [k.id, k]));
    if (Array.isArray(b.chiavi)) { let n = 0; for (const x of b.chiavi.slice(0, 30)) { const prev = M.get(slug(x && x.id, 40)); const k = chPulisci(x, prev, oggi); if (!k) { res.errori.push("chiave senza nome"); continue; } M.set(k.id, k); n++; } await h.kvSet(env, K_CH, [...M.values()].slice(-80)); res.chiavi = n; }
    if (Array.isArray(b.fatti)) {
      const F = (await h.kvGet(env, K_FA)) || [], FM = new Map(F.map((f) => [f.id, f])), ids = new Set(M.keys()); let n = 0;
      for (const x of b.fatti.slice(0, 60)) { const r = faPulisci(x, FM.get(slug(x && x.id, 60)), oggi, ids); if (r.err) { res.errori.push(r.err); continue; } FM.set(r.f.id, r.f); n++; }
      await h.kvSet(env, K_FA, [...FM.values()].slice(-1500)); res.fatti = n;
    }
    if (Array.isArray(b.richieste_fatte)) { const R = (await h.kvGet(env, K_RQF)) || []; const f = new Set(b.richieste_fatte.map(String)); R.forEach((r) => { if (f.has(r.id)) r.fatta = oggi; }); await h.kvSet(env, K_RQF, R.slice(-200)); }
    if (Array.isArray(b.ipotesi)) res.ipotesi = await registraIpotesi(h, env, b.ipotesi, await serieTutte(h, env, O.map((o) => o.sim)), oggi);
    return h.json({ ok: true, ...res });
  }
  return h.fail(404, "not_found");
}

/* retroattivo: segnali passati → ipotesi con la regola congelata in inv-retro.js, valutate sui prezzi in archivio */
async function invRetro(env, serie, oggi) {
  try {
    const F = Object.keys(RETRO_FILONI);
    const { results } = await env.DB.prepare("SELECT key, data FROM docs WHERE type='segnali' AND status='published' AND json_extract(data,'$.filone_id') IN (" + F.map((_, i) => "?" + (i + 1)).join(",") + ")").bind(...F).all();
    const S = [];
    for (const r of results || []) { let d; try { d = JSON.parse(r.data); } catch (e) { continue; } S.push({ key: r.key, filone_id: d.filone_id, attesa: d.attesa, stato: d.stato, data: d.data, chiuso: d.chiuso, evento: d.evento }); }
    const ip = retroIpotesi(S), val = retroValuta(ip, serie, INV_STR, oggi);
    return { versione: RETRO_VERSIONE, filoni: Object.fromEntries(Object.entries(RETRO_FILONI).map(([k, v]) => [k, v.n])), segnali: S.length, segnali_usati: new Set(ip.map((x) => x.segnale)).size, ipotesi: val.length, riepilogo: retroRiepilogo(val),
      lista: val.slice(-400).map((v) => ({ p: v.prova, k: v.strumento, d: v.direzione, t: v.data, f: v.filone, c: v.classe, e: String(v.evento || "").slice(0, 140), g7: v.g7 || null, g30: v.g30 || null })) };
  } catch (e) { return { errore: String((e && e.message) || e).slice(0, 120) }; }
}
async function eventiQuota(env) { // «Com'è finita»: probabili avvenuti + improbabili non avvenuti, sul totale di probabili e improbabili chiusi
  try {
    const r = await env.DB.prepare("SELECT json_extract(data,'$.attesa') a, json_extract(data,'$.stato') s, count(*) n FROM docs WHERE type='segnali' AND status='published' AND json_extract(data,'$.stato') IN ('avvenuto','smentito','scaduto') GROUP BY a, s").all();
    let n = 0, giuste = 0;
    for (const x of r.results || []) { if (x.a !== "probabile" && x.a !== "improbabile") continue; n += x.n; if ((x.a === "probabile") === (x.s === "avvenuto")) giuste += x.n; }
    return { n, giuste };
  } catch (e) { return null; }
}

/* azioni del pannello (sessione): inv_get, inv_nota, inv_aggiungi */
export async function invPanelApi(env, b, h) {
  if (b.action === "inv_get") {
    const O = (await h.kvGet(env, K_OSS)) || [];
    const serie = await serieTutte(h, env, O.map((o) => o.sim));
    const L = ((await h.kvGet(env, K_IP)) || []).map((x) => ({ ...x, v: invValuta(x, serie[x.strumento]) }));
    const strumenti = Object.fromEntries(Object.entries(INV_STR).map(([k, c]) => [k, { n: c.n, u: c.u, abs: !!c.abs, p: (serie[k] || []).slice(-80) }]));
    const osservati = [];
    for (const o of O) {
      const r = await pxGet(h, env, o.sim), s = serie["az:" + o.sim] || [], mie = L.filter((x) => x.strumento === "az:" + o.sim);
      osservati.push({ ...o, p: s.slice(-260), px: r ? { at: r.at, errore: r.errore || null } : null, tecnica: invTecnica(s), forza: forzaDi(o.sim, serie) || undefined, chiamate: mie, ci_ha_preso: quota(mie.filter((x) => x.v.stato === "chiusa").map((x) => x.v.esito)) });
    }
    return { ok: true, oggi: h.romeToday(), strumenti, ipotesi: L.slice(-600), mercati: mercatiVista(serie, L, true), bilancio: invBilancio(L), eventi: await eventiQuota(env), retro: await invRetro(env, serie, h.romeToday()), diario: ((await h.kvGet(env, K_DI)) || []).slice(-60).reverse(), opp: (await h.kvGet(env, K_OPP)) || { lista: [] }, osservati, richieste: ((await h.kvGet(env, K_RQ)) || []).filter((r) => !r.fatta), stooq: !!env.STOOQ_KEY, prezzi_fonte: env.STOOQ_KEY ? "Stooq, poi Yahoo" : "Yahoo Finance", radar_avvio: !!(env.RADAR_ROUTINE_ID && env.RADAR_ROUTINE_TOKEN), ...(await chiaviVista(h, env, L)), verticali: await verVista(h, env, h.romeToday(), false), bloccate: await (async () => { const B = (await h.kvGet(env, K_BL)) || []; const out = []; for (const b of B.slice(-60)) { const r = await pxGet(h, env, b.strumento.slice(3)), p = r ? r.p : []; const at = (g) => { const t = new Date(Date.parse(b.data0 + "T12:00:00Z") + g * 864e5).toISOString().slice(0, 10); if (!p.length || p.at(-1)[0] < t) return null; const z = lastOnOrBefore(p, t); return z ? +((z[1] / b.prezzo0 - 1) * 100).toFixed(2) : null; }; out.push({ ...b, dopo7: at(7), dopo30: at(30) }); } return out; })(), pf: await (async () => { const P = await pfDati(h, env, h.romeToday(), false); const oggi = h.romeToday(), px = {}; // prezzi e indicatori dei titoli in portafoglio, per la scheda della posizione (17/11/2026)
      for (const c of Object.values(P.conti || {})) for (const q of (c && c.posizioni) || []) if (!px[q.sim]) { const pp = (P.prezzi[q.sim] || []).filter((x) => x[0] <= oggi); const t = invTecnica(pp); if (t) delete t.hist; px[q.sim] = { p: pp.slice(-520), tecnica: t }; }
      return { conti: P.conti, rif: P.rif, ops: P.ops.slice(-200).reverse(), costo: 0.15, per_regola: pfPerRegola(P.ops, P.prezzi, oggi), px }; })() };
  }
  if (b.action === "inv_pf_versa") { // soldi virtuali: avvio o ricarica, nel conto del modello o nel mio
    const conto = b.conto === "mio" ? "mio" : "modello", eur = Math.round(+b.eur * 100) / 100;
    if (!(eur >= 100 && eur <= 10000000)) return { ok: false, error: "importo tra 100 € e 10 milioni" };
    const L = (await h.kvGet(env, K_PF)) || { ops: [] }; L.ops ||= [];
    L.ops.push({ id: "p-" + Date.now().toString(36) + "v", conto, tipo: "versa", data: h.romeToday(), eur, at: new Date().toISOString() });
    await h.kvSet(env, K_PF, L);
    for (const s of [PF_FX, PF_RIF.sim]) if (!(await pxGet(h, env, s))) await pxAggiorna(h, env, s);
    return { ok: true };
  }
  if (b.action === "inv_pf_ordine") { const r = (await pfOrdini(h, env, [{ tipo: b.tipo, ticker: b.ticker, eur: b.eur, quota: b.quota, motivo: b.motivo }], "mio", h.romeToday()))[0]; return r.ok ? { ok: true, ...r } : { ok: false, error: r.errore }; }
  if (b.action === "inv_pf_annulla") { // solo ordini miei ancora in attesa
    const L = (await h.kvGet(env, K_PF)) || { ops: [] }, D = await pfDati(h, env, h.romeToday(), false), o = (L.ops || []).find((x) => x.id === b.id);
    if (!o || o.conto !== "mio" || o.tipo === "versa" || (D.esiti[o.id] && D.esiti[o.id].stato !== "in_attesa")) return { ok: false, error: "ordine non annullabile" };
    L.ops = L.ops.filter((x) => x.id !== b.id); await h.kvSet(env, K_PF, L); return { ok: true };
  }
  if (b.action === "inv_fatto") { // un fatto o un link scritto a mano: lo verifica e lo colloca la routine «chiavi»
    const t = cut(b.testo, 600); if (t.length < 8) return { ok: false, error: "scrivi il fatto o incolla un link" };
    const R = (await h.kvGet(env, K_RQF)) || []; R.push({ id: "q-" + Date.now().toString(36), testo: t, chiave_id: slug(b.chiave_id, 40), at: new Date().toISOString() }); await h.kvSet(env, K_RQF, R.slice(-200));
    return { ok: true };
  }
  if (b.action === "inv_nota") {
    const t = cut(b.testo, 2000); if (t.length < 2) return { ok: false, error: "testo vuoto" };
    const D = (await h.kvGet(env, K_DI)) || []; D.push({ at: new Date().toISOString(), testo: t }); await h.kvSet(env, K_DI, D.slice(-2000));
    return { ok: true };
  }
  if (b.action === "inv_aggiungi") { // un simbolo inserito a mano: entra subito tra gli osservati «da classificare»
    const sim = invSim(b.ticker); if (!sim) return { ok: false, error: "simbolo non valido (es. NVDA, RHM.DE, LDO.MI)" };
    const O = (await h.kvGet(env, K_OSS)) || []; const oggi = h.romeToday();
    let o = O.find((x) => x.sim === sim);
    if (!o) { o = { sim, ticker: cut(b.ticker, 20).toUpperCase(), nome: cut(b.ticker, 20).toUpperCase(), settore: "altro", stato: "da_classificare", origine: "manuale", aggiunta_il: oggi }; O.push(o); }
    else if (o.stato === "uscita") { o.stato = "da_classificare"; o.origine = "manuale"; }
    await h.kvSet(env, K_OSS, O.slice(-120));
    const R = (await h.kvGet(env, K_RQ)) || []; const id = "r-" + Date.now().toString(36);
    R.push({ id, sim, ticker: o.ticker, nota: cut(b.nota, 200), at: new Date().toISOString() }); await h.kvSet(env, K_RQ, R.slice(-200));
    const px = await pxAggiorna(h, env, sim);
    let avvio = null;
    if (b.subito && env.RADAR_ROUTINE_ID && env.RADAR_ROUTINE_TOKEN) {
      try {
        const fr = await fetch("https://api.anthropic.com/v1/claude_code/routines/" + encodeURIComponent(env.RADAR_ROUTINE_ID) + "/fire", { method: "POST", headers: { authorization: "Bearer " + env.RADAR_ROUTINE_TOKEN, "anthropic-version": "2023-06-01", "content-type": "application/json" }, body: JSON.stringify({ text: "Nuova azienda dal pannello: " + o.ticker + " (" + sim + "). Classificala e prepara la scheda, senza rifare tutto il giro." }), signal: AbortSignal.timeout(8000) });
        avvio = fr.ok ? "avviata" : "errore " + fr.status;
      } catch (e) { avvio = "errore di rete"; }
    }
    return { ok: true, sim, prezzi: px.errore ? "non disponibili: " + px.errore : (px.p || []).length + " giorni", avvio };
  }
  return null;
}
