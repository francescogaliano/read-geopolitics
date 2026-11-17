/* Simulatore di portafoglio con soldi virtuali (privato, dal 17/11/2026).
   Due conti: «modello» (lo gestisce la routine radar con regole fisse) e «mio» (prove a mano di Francesco).
   Riferimento: un ETF sul mercato mondiale quotato in euro (PF_RIF).

   Tutto si ricalcola dal registro delle operazioni (kv inv:pf), in modo deterministico:
   - versamento: entra in cassa il giorno stesso e compra quote al valore della quota di quel giorno (partenza 100),
     così le ricariche non cambiano il rendimento (come un fondo);
   - compra / vendi: se la decisione (campo «at») arriva prima della chiusura di quella Borsa, si esegue alla chiusura
     dello stesso giorno; se arriva dopo (o in un giorno senza Borsa), alla chiusura del giorno di Borsa successivo.
     Il prezzo di una chiusura si usa solo se è stato scaricato almeno 30 minuti dopo l'orario di chiusura, così non
     si esegue mai su un prezzo di metà giornata (niente senno di poi, niente prezzi provvisori);
     con costi PF_COSTO su ogni operazione; nello stesso giorno prima i versamenti, poi le vendite, poi gli acquisti;
   - valute: euro e dollari (convertiti con il cambio EUR/USD del giorno); le altre per ora non sono ammesse;
   - solo acquisti: niente vendite allo scoperto. */

export const PF_COSTO = 0.0015;
export const PF_RIF = { sim: "iwda.nl", nome: "ETF mercato mondiale (iShares MSCI World, euro)" };
export const PF_FX = "eurusd=x";
export const PF_MAX_PESO = 10, PF_MAX_POS = 15;
const EUR = new Set(["de", "it", "fr", "nl", "es", "be", "pt", "at", "fi", "ie"]);

export function pfValuta(sim) {
  const s = String(sim || ""), i = s.lastIndexOf("."), suf = i > 0 ? s.slice(i + 1) : "";
  return suf === "us" ? "USD" : EUR.has(suf) ? "EUR" : null;
}
const lastOn = (p, d) => { let r = null; for (const x of p || []) { if (x[0] <= d) r = x; else break; } return r; };
const firstAfter = (p, d) => (p || []).find((x) => x[0] > d) || null;
/* orari di chiusura in UTC: Europa 17:30 ora di Roma, Stati Uniti 16:00 ora di New York (con le rispettive ore legali) */
const ultimaDom = (y, m) => { const d = new Date(Date.UTC(y, m + 1, 0)); d.setUTCDate(d.getUTCDate() - d.getUTCDay()); return d; };
const nDom = (y, m, n) => { const d = new Date(Date.UTC(y, m, 1)); d.setUTCDate(1 + ((7 - d.getUTCDay()) % 7) + 7 * (n - 1)); return d; };
export function pfChiusura(d, valuta) {
  const t = Date.parse(d + "T12:00:00Z"), y = +d.slice(0, 4);
  if (valuta === "USD") { const leg = t >= nDom(y, 2, 2).getTime() && t < nDom(y, 10, 1).getTime(); return Date.parse(d + "T" + (leg ? "20" : "21") + ":00:00Z"); }
  const leg = t >= ultimaDom(y, 2).getTime() && t < ultimaDom(y, 9).getTime(); return Date.parse(d + "T" + (leg ? "15" : "16") + ":30:00Z");
}
const MARGINE = 30 * 60000;
const addDays = (d, n) => new Date(Date.parse(d + "T12:00:00Z") + n * 864e5).toISOString().slice(0, 10);

/* ops: [{id, conto, tipo: versa|compra|vendi, data, sim, eur, quota, motivo, origine}]
   serie(sim) → [[data, chiusura]]; fx = serie EUR/USD (dollari per un euro); oggi = AAAA-MM-GG */
export function pfCalcola(ops, serie, fx, oggi, aggiornato) {
  const conti = {}, esiti = {};
  const prezzoEur = (sim, d) => {
    const v = pfValuta(sim), x = lastOn(serie(sim), d); if (!x || !v) return null;
    if (v === "EUR") return x[1];
    const f = lastOn(fx, d); return f && f[1] > 0 ? x[1] / f[1] : null;
  };
  // 1. data di esecuzione di ogni operazione
  const E = [];
  for (const o of ops || []) {
    if (o.tipo === "versa") { E.push({ o, d: o.data, k: 0 }); continue; }
    const v = pfValuta(o.sim);
    if (!v) { esiti[o.id] = { stato: "rifiutata", nota: "valuta non supportata (per ora euro e dollari)" }; continue; }
    const P = serie(o.sim), primaChiusura = o.at && Date.parse(o.at) < pfChiusura(o.data, v) - 5 * 60000;
    const x = (primaChiusura && P.find((y) => y[0] === o.data)) || firstAfter(P, o.data);
    const agg = aggiornato ? Date.parse(aggiornato(o.sim) || 0) : Infinity;
    if (!x || x[0] > oggi || agg < pfChiusura(x[0], v) + MARGINE) { esiti[o.id] = { stato: "in_attesa", giorno: primaChiusura ? o.data : null, nota: primaChiusura ? "si esegue alla chiusura di oggi" : "si esegue alla chiusura del prossimo giorno di Borsa" }; continue; }
    if (v === "USD" && !lastOn(fx, x[0])) { esiti[o.id] = { stato: "in_attesa", nota: "manca il cambio euro/dollaro" }; continue; }
    E.push({ o, d: x[0], k: o.tipo === "vendi" ? 1 : 2 });
  }
  E.sort((a, b) => a.d.localeCompare(b.d) || a.k - b.k || String(a.o.id).localeCompare(String(b.o.id)));
  // 2. calendario: tutti i giorni con un prezzo (riferimento o titoli usati), dal primo versamento a oggi
  const inizio = {};
  for (const e of E) if (e.o.tipo === "versa" && !inizio[e.o.conto]) inizio[e.o.conto] = e.d;
  const primo = Object.values(inizio).sort()[0];
  if (!primo) return { conti, esiti, rif: null };
  const sims = new Set([PF_RIF.sim]); for (const o of ops) if (o.sim) sims.add(o.sim);
  const giorni = new Set(E.map((e) => e.d));
  for (const s of sims) for (const x of serie(s) || []) if (x[0] >= primo && x[0] <= oggi) giorni.add(x[0]);
  giorni.add(oggi);
  const cal = [...giorni].filter((d) => d >= primo && d <= oggi).sort();
  // 3. ripasso giorno per giorno
  const st = (c) => (conti[c] ||= { cassa: 0, quote: 0, versato: 0, pos: {}, serie: [], inizio: inizio[c] || null, chiuse: [] });
  const valore = (c, d) => { let v = c.cassa; for (const [s, q] of Object.entries(c.pos)) { const pe = prezzoEur(s, d); v += q.n * (pe == null ? q.ultimo || 0 : (q.ultimo = pe)); } return v; };
  let i = 0;
  for (const d of cal) {
    for (; i < E.length && E[i].d === d; i++) {
      const { o } = E[i], c = st(o.conto);
      if (o.tipo === "versa") {
        const v = valore(c, d), idx = c.quote > 0 && v > 0 ? v / c.quote : 100;
        c.cassa += o.eur; c.versato += o.eur; c.quote += o.eur / idx;
        esiti[o.id] = { stato: "eseguita", data: d, eur: o.eur }; continue;
      }
      const pe = prezzoEur(o.sim, d); if (pe == null || !(pe > 0)) { esiti[o.id] = { stato: "in_attesa", nota: "prezzo non disponibile" }; continue; }
      if (o.tipo === "compra") {
        let eur = Math.min(+o.eur || 0, c.cassa);
        if (o.conto === "modello") { // limiti del modello: 10% per titolo, 15 titoli
          const v = valore(c, d), gia = c.pos[o.sim] ? c.pos[o.sim].n * pe : 0;
          eur = Math.min(eur, Math.max(0, v * PF_MAX_PESO / 100 - gia));
          if (!c.pos[o.sim] && Object.keys(c.pos).length >= PF_MAX_POS) eur = 0;
        }
        if (eur < 1) { esiti[o.id] = { stato: "rifiutata", nota: c.cassa < 1 ? "liquidità insufficiente" : "limite raggiunto (10% per titolo o 15 titoli)" }; continue; }
        const costo = eur * PF_COSTO, n = (eur - costo) / pe, q = (c.pos[o.sim] ||= { n: 0, speso: 0, dal: d, ops: [] });
        q.n += n; q.speso += eur; q.ultimo = pe; q.ops.push(o.id); c.cassa -= eur;
        esiti[o.id] = { stato: "eseguita", data: d, prezzo: lastOn(serie(o.sim), d)[1], eur: +eur.toFixed(2), n: +n.toFixed(6), costo: +costo.toFixed(2) };
      } else {
        const q = c.pos[o.sim]; if (!q || q.n <= 0) { esiti[o.id] = { stato: "rifiutata", nota: "titolo non in portafoglio" }; continue; }
        const fr = Math.max(0, Math.min(1, o.quota == null ? 1 : +o.quota)), n = q.n * fr, lordo = n * pe, costo = lordo * PF_COSTO, base = q.speso * fr;
        c.cassa += lordo - costo; q.n -= n; q.speso -= base;
        const r = { stato: "eseguita", data: d, prezzo: lastOn(serie(o.sim), d)[1], eur: +(lordo - costo).toFixed(2), n: +n.toFixed(6), costo: +costo.toFixed(2), resa: base > 0 ? +(((lordo - costo) / base - 1) * 100).toFixed(2) : null };
        esiti[o.id] = r; c.chiuse.push({ sim: o.sim, data: d, resa: r.resa, eur: r.eur });
        if (q.n < 1e-9 || fr >= 1) delete c.pos[o.sim];
      }
    }
    for (const c of Object.values(conti)) { if (!c.inizio || d < c.inizio || c.quote <= 0) continue; const v = valore(c, d); c.serie.push([d, +(v / c.quote).toFixed(4), +v.toFixed(2)]); }
  }
  // 4. riepilogo per conto
  const out = {};
  for (const [k, c] of Object.entries(conti)) {
    const v = valore(c, oggi), pos = Object.entries(c.pos).map(([s, q]) => { const pe = prezzoEur(s, oggi) ?? q.ultimo, val = q.n * pe; return { sim: s, n: +q.n.toFixed(6), prezzo_eur: +pe.toFixed(4), prezzo: (lastOn(serie(s), oggi) || [])[1] ?? null, valuta: pfValuta(s), valore: +val.toFixed(2), peso: v > 0 ? +(val / v * 100).toFixed(1) : 0, speso: +q.speso.toFixed(2), resa: q.speso > 0 ? +((val / q.speso - 1) * 100).toFixed(2) : null, dal: q.dal, ops: q.ops }; }).sort((a, b) => b.valore - a.valore);
    out[k] = { valore: +v.toFixed(2), versato: +c.versato.toFixed(2), cassa: +c.cassa.toFixed(2), peso_cassa: v > 0 ? +(c.cassa / v * 100).toFixed(1) : 100, inizio: c.inizio, posizioni: pos, chiuse: c.chiuse.slice(-50), serie: c.serie, rend: rendimenti(c.serie, oggi) };
  }
  // riferimento: lo stesso calendario, quota 100 al primo giorno del modello (o del primo conto)
  const p0d = (out.modello || Object.values(out)[0] || {}).inizio, R = serie(PF_RIF.sim) || [];
  let rif = null;
  if (p0d && R.length) { const b = lastOn(R, p0d) || R.find((x) => x[0] >= p0d); if (b) { const s = cal.filter((d) => d >= p0d).map((d) => { const x = lastOn(R, d); return x ? [d, +(x[1] / b[1] * 100).toFixed(4)] : null; }).filter(Boolean); rif = { ...PF_RIF, serie: s, rend: rendimenti(s, oggi), ultimo: R.at(-1)[0] }; } }
  return { conti: out, esiti, rif };
}

export function rendimenti(s, oggi) {
  const r = {}; if (!s || !s.length) return r;
  const ult = s.at(-1);
  for (const [k, g] of [["1s", 7], ["2s", 14], ["1m", 30], ["3m", 91], ["6m", 182], ["1a", 365]]) {
    const d = addDays(oggi, -g); if (s[0][0] > d) { r[k] = null; continue; }
    const b = lastOn(s, d); r[k] = b ? +((ult[1] / b[1] - 1) * 100).toFixed(2) : null;
  }
  r.tutto = +((ult[1] / s[0][1] - 1) * 100).toFixed(2);
  return r;
}
