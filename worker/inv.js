/* v-inv: «Investimenti», sezione privata del pannello (solo Francesco).
   Le ipotesi (segnale/appuntamento/scenario → strumento, direzione, orizzonte) le scrive una routine con il token;
   il Worker mette data, ora e prezzo di partenza e da lì non si toccano più.
   La valutazione si calcola a ogni lettura dai prezzi già nel database (docs di tipo «mercati»): niente stime di Claude.
   Tutto sta nella tabella kv (privata): non passa mai da /api/data.json, /api/docs o /api/doc. */

export const INV_STR = {
  brent: { n: "Brent", u: "$/barile", banda: [1.5, 3] },
  ttf: { n: "Gas TTF", u: "€/MWh", banda: [2, 4] },
  noli: { n: "Noli container", u: "punti", banda: [1, 2] },
  oro: { n: "Oro", u: "$/oncia", banda: [1, 2] },
  grano: { n: "Grano", u: "cent $/bushel", banda: [1.5, 3] },
  spread: { n: "Spread", u: "pb BTP-Bund", abs: true, banda: [3, 6] },
  eurusd: { n: "Euro/dollaro", u: "", banda: [0.4, 0.8] },
};
const DIR = ["su", "giu", "zero"], FID = ["bassa", "media", "alta"], ORIG = ["segnale", "calendario", "scenario", "altro"];
const K_IP = "inv:ipotesi", K_DI = "inv:diario";

const addDays = (d, n) => new Date(Date.parse(d + "T12:00:00Z") + n * 86400000).toISOString().slice(0, 10);
const cut = (s, n) => String(s == null ? "" : s).replace(/\s+/g, " ").trim().slice(0, n);

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
const lastOnOrBefore = (p, d) => { let r = null; for (const x of p) { if (x[0] <= d) r = x; else break; } return r; };
const firstOnOrAfter = (p, d) => p.find((x) => x[0] >= d) || null;

/* valuta un'ipotesi: ret = variazione % (o in punti per gli strumenti «abs»); esito giusta / sbagliata / piatta / aperta */
export function invValuta(h, p) {
  const cfg = INV_STR[h.strumento]; if (!cfg || !p || !p.length || !Number.isFinite(h.prezzo0)) return { stato: "senza_prezzi" };
  /* prezzo d'ingresso: quello noto alla registrazione se è dello stesso giorno; se era più vecchio (es. venerdì per
     un'ipotesi del lunedì), il primo prezzo dal giorno della registrazione in poi, così il movimento precedente non conta */
  const base = h.data0 >= h.data ? [h.data0, h.prezzo0] : firstOnOrAfter(p, h.data);
  if (!base) return { stato: "aperta", giorni: 0, ret: null, attesa_ingresso: true };
  const target = addDays(h.data, h.orizzonte), fine = p.find((x) => x[0] >= target && x[0] > base[0]) || null;
  const dopo = p.filter((x) => x[0] > base[0]), now = fine || dopo[dopo.length - 1];
  if (!now) return { stato: "aperta", giorni: 0, ret: null, ingresso: { data: base[0], valore: base[1] } };
  const ret = cfg.abs ? now[1] - base[1] : (now[1] / base[1] - 1) * 100;
  const b = cfg.banda[h.orizzonte >= 30 ? 1 : 0];
  let esito = null;
  if (fine) {
    if (h.direzione === "zero") esito = Math.abs(ret) <= b ? "giusta" : "sbagliata";
    else { const s = h.direzione === "su" ? ret : -ret; esito = s > b ? "giusta" : s < -b ? "sbagliata" : "piatta"; }
  }
  const giorni = Math.round((Date.parse(now[0]) - Date.parse(h.data)) / 86400000);
  return { stato: fine ? "chiusa" : "aperta", ret: +ret.toFixed(3), al: now[0], prezzo1: now[1], ingresso: { data: base[0], valore: base[1] }, esito, giorni: Math.max(0, Math.min(giorni, h.orizzonte)), banda: b };
}

/* bilancio: solo ipotesi chiuse in tempo reale (non retroattive) */
export function invBilancio(L) {
  const ch = L.filter((h) => h.v && h.v.stato === "chiusa" && !h.retro);
  const dec = ch.filter((h) => h.v.esito === "giusta" || h.v.esito === "sbagliata");
  const giuste = dec.filter((h) => h.v.esito === "giusta").length;
  const conGuad = ch.filter((h) => h.direzione !== "zero" && !INV_STR[h.strumento].abs);
  const guad = (h) => (h.direzione === "su" ? 1 : -1) * h.v.ret;
  const perFid = FID.map((f) => { const x = dec.filter((h) => h.fiducia === f); return { fiducia: f, n: x.length, giuste: x.filter((h) => h.v.esito === "giusta").length }; });
  // linea cumulata, in ordine di chiusura; «a caso» = stesso movimento con segno pseudo-casuale fisso per id
  const ord = conGuad.slice().sort((a, b) => String(a.v.al).localeCompare(String(b.v.al)));
  let c = 0, r = 0; const cum = [];
  for (const h of ord) { c += guad(h); let hs = 2166136261; for (const ch2 of h.id) hs = Math.imul(hs ^ ch2.charCodeAt(0), 16777619) >>> 0; r += ((hs >>> 16) & 1 ? 1 : -1) * h.v.ret; cum.push({ al: h.v.al, segnali: +c.toFixed(2), caso: +r.toFixed(2) }); }
  // per filone: le ipotesi nate dalla stessa crisi vanno insieme, così si vede se un tema pesa troppo
  const fil = {}; for (const h of dec) { const k = (h.origine && h.origine.filone_id) || "senza filone"; const r = (fil[k] ||= { filone: k, n: 0, giuste: 0 }); r.n++; if (h.v.esito === "giusta") r.giuste++; }
  const per_filone = Object.values(fil).sort((a, b) => b.n - a.n);
  return { per_filone, chiuse: ch.length, decise: dec.length, giuste, piatte: ch.filter((h) => h.v.esito === "piatta").length, guadagno_medio: conGuad.length ? +(conGuad.reduce((s, h) => s + guad(h), 0) / conGuad.length).toFixed(2) : null, per_fiducia: perFid, cumulata: cum };
}

function invPulisci(x, serie, oggi, ora) {
  if (!x || typeof x !== "object") return { err: "ipotesi non valida" };
  const strumento = String(x.strumento || ""); if (!INV_STR[strumento]) return { err: "strumento sconosciuto: " + strumento };
  const direzione = String(x.direzione || "").replace("giù", "giu"); if (!DIR.includes(direzione)) return { err: "direzione: su | giu | zero" };
  const orizzonte = +x.orizzonte; if (![7, 30].includes(orizzonte)) return { err: "orizzonte: 7 o 30" };
  const fiducia = String(x.fiducia || ""); if (!FID.includes(fiducia)) return { err: "fiducia: bassa | media | alta" };
  const meccanismo = cut(x.meccanismo, 240); if (meccanismo.length < 10) return { err: "meccanismo mancante" };
  const o = x.origine || {}; const tipo = ORIG.includes(o.tipo) ? o.tipo : "altro";
  const origine = { tipo, id: cut(o.id, 80), testo: cut(o.testo, 300), filone_id: cut(o.filone_id, 80) };
  const p = serie[strumento] || []; const p0 = lastOnOrBefore(p, oggi); // ultimo prezzo noto al momento della registrazione
  if (!p0) return { err: "nessun prezzo per " + strumento };
  const id = "h-" + oggi.replace(/-/g, "") + "-" + strumento + "-" + orizzonte + "-" + (origine.id || cut(meccanismo, 24)).replace(/[^a-z0-9]+/gi, "").slice(0, 28).toLowerCase();
  return { h: { id, strumento, direzione, orizzonte, fiducia, meccanismo, origine, data: oggi, registrata_il: ora, data0: p0[0], prezzo0: p0[1] } };
}

/* rotta per la routine (token): GET /v1/inv/contesto, POST /v1/inv/ipotesi */
export async function invRoute(request, env, p, method, h) {
  if (!h.authorized(request, env)) return h.fail(401, "unauthorized");
  const serie = await invSerie(env), oggi = h.romeToday();
  const L = (await h.kvGet(env, K_IP)) || [];
  if (p === "/v1/inv/contesto" && method === "GET") {
    const strumenti = Object.fromEntries(Object.entries(INV_STR).map(([k, c]) => { const s = serie[k] || []; const l = s[s.length - 1]; return [k, { nome: c.n, unita: c.u, ultimo: l ? { data: l[0], valore: l[1] } : null, banda_7: c.banda[0], banda_30: c.banda[1] }]; }));
    const aperte = L.map((x) => ({ ...x, v: invValuta(x, serie[x.strumento]) })).filter((x) => x.v.stato === "aperta").map((x) => ({ id: x.id, strumento: x.strumento, direzione: x.direzione, orizzonte: x.orizzonte, data: x.data, origine: x.origine }));
    return h.json({ ok: true, oggi, strumenti, aperte, regole: "direzione su|giu|zero; orizzonte 7|30; fiducia bassa|media|alta; origine.tipo segnale|calendario|scenario|altro; meccanismo 10-240 caratteri. Le ipotesi non si modificano." });
  }
  if (p === "/v1/inv/ipotesi" && method === "POST") {
    const b = await request.json().catch(() => null); const arr = b && Array.isArray(b.ipotesi) ? b.ipotesi.slice(0, 30) : null;
    if (!arr) return h.fail(400, "json", "atteso { ipotesi: [ … ] }");
    const ora = new Date().toISOString(), ids = new Set(L.map((x) => x.id)), out = [];
    for (const x of arr) {
      const r = invPulisci(x, serie, oggi, ora);
      if (r.err) { out.push({ ok: false, errore: r.err }); continue; }
      if (ids.has(r.h.id)) { out.push({ ok: false, id: r.h.id, errore: "già registrata (le ipotesi non si modificano)" }); continue; }
      ids.add(r.h.id); L.push(r.h); out.push({ ok: true, id: r.h.id, prezzo0: r.h.prezzo0, data0: r.h.data0 });
    }
    await h.kvSet(env, K_IP, L);
    return h.json({ ok: true, registrate: out.filter((x) => x.ok).length, esiti: out });
  }
  return h.fail(404, "not_found");
}

/* azioni del pannello (sessione): inv_get, inv_nota */
export async function invPanelApi(env, b, h) {
  if (b.action === "inv_get") {
    const serie = await invSerie(env);
    const L = ((await h.kvGet(env, K_IP)) || []).map((x) => ({ ...x, v: invValuta(x, serie[x.strumento]) }));
    const strumenti = Object.fromEntries(Object.entries(INV_STR).map(([k, c]) => [k, { n: c.n, u: c.u, abs: !!c.abs, p: (serie[k] || []).slice(-80) }]));
    return { ok: true, oggi: h.romeToday(), strumenti, ipotesi: L.slice(-400), bilancio: invBilancio(L), diario: ((await h.kvGet(env, K_DI)) || []).slice(-60).reverse() };
  }
  if (b.action === "inv_nota") {
    const t = cut(b.testo, 2000); if (t.length < 2) return { ok: false, error: "testo vuoto" };
    const D = (await h.kvGet(env, K_DI)) || []; D.push({ at: new Date().toISOString(), testo: t }); await h.kvSet(env, K_DI, D.slice(-2000));
    return { ok: true };
  }
  return null;
}
