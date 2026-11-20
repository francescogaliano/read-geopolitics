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
   - ribasso (dal 20/11/2026, solo conto «modello»): «scoperto» apre una posizione al ribasso, «ricopri» la chiude.
     Funziona come un contratto per differenza: non si incassa nulla all'apertura, il valore del conto cambia del
     guadagno o della perdita (n × (prezzo d'ingresso − prezzo di oggi)); l'importo impegnato resta bloccato in cassa.
     Ogni giorno si paga un costo sul valore della posizione (PF_SC_COSTO, annuo: è un'ipotesi prudente, non la tariffa
     di un intermediario). Uscita obbligatoria: se una chiusura supera il prezzo d'ingresso di «stop» per cento, la
     posizione si chiude da sola a quella chiusura (regola C1). Limiti: PF_SC_PESO per posizione, PF_SC_MAX in tutto. */

export const PF_COSTO = 0.0015;
export const PF_RIF = { sim: "iwda.nl", nome: "ETF mercato mondiale (iShares MSCI World, euro)" };
export const PF_FX = "eurusd=x";
export const PF_MAX_PESO = 10, PF_MAX_POS = 15;
export const PF_SC_PESO = 3, PF_SC_MAX = 15, PF_SC_COSTO = 0.05;
const EUR = new Set(["de", "it", "fr", "nl", "es", "be", "pt", "at", "fi", "ie"]);

export function pfValuta(sim) {
  const s = String(sim || ""), i = s.lastIndexOf("."), suf = i > 0 ? s.slice(i + 1) : "";
  return suf === "us" ? "USD" : EUR.has(suf) ? "EUR" : null;
}
const KO = { vendi: 1, ricopri: 1, compra: 2, scoperto: 3 }; // nello stesso giorno: prima le chiusure, poi gli acquisti, poi le aperture al ribasso
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
    // eseguita una volta = congelata (18/11/2026): data e prezzo non si ricalcolano più, anche se la serie dei prezzi cambia
    if (o.fisso && o.fisso.d && o.fisso.pe > 0) { E.push({ o, d: o.fisso.d, k: KO[o.tipo] || 2 }); continue; }
    const v = pfValuta(o.sim);
    if (!v) { esiti[o.id] = { stato: "rifiutata", nota: "valuta non supportata (per ora euro e dollari)" }; continue; }
    const P = serie(o.sim), primaChiusura = o.at && Date.parse(o.at) < pfChiusura(o.data, v) - 5 * 60000;
    const x = (primaChiusura && P.find((y) => y[0] === o.data)) || firstAfter(P, o.data);
    const agg = aggiornato ? Date.parse(aggiornato(o.sim) || 0) : Infinity;
    if (!x || x[0] > oggi || agg < pfChiusura(x[0], v) + MARGINE) { esiti[o.id] = { stato: "in_attesa", giorno: primaChiusura ? o.data : null, nota: primaChiusura ? "si esegue alla chiusura di oggi" : "si esegue alla chiusura del prossimo giorno di Borsa" }; continue; }
    if (v === "USD" && !lastOn(fx, x[0])) { esiti[o.id] = { stato: "in_attesa", nota: "manca il cambio euro/dollaro" }; continue; }
    E.push({ o, d: x[0], k: KO[o.tipo] || 2 });
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
  const st = (c) => (conti[c] ||= { cassa: 0, quote: 0, versato: 0, pos: {}, sc: {}, serie: [], inizio: inizio[c] || null, chiuse: [] });
  const impegnato = (c) => Object.values(c.sc).reduce((a, q) => a + q.base, 0);
  const valore = (c, d) => { let v = c.cassa; for (const [s, q] of Object.entries(c.pos)) { const pe = prezzoEur(s, d); v += q.n * (pe == null ? q.ultimo || 0 : (q.ultimo = pe)); } for (const [s, q] of Object.entries(c.sc)) { const pe = prezzoEur(s, d); v += q.n * (q.pe0 - (pe == null ? q.ultimo || q.pe0 : (q.ultimo = pe))); } return v; };
  let i = 0;
  const chiudiSc = (c, s, q, d, pe, auto) => {
    const lordo = q.n * (q.pe0 - pe), costo = q.n * pe * PF_COSTO, resa = q.base > 0 ? +(((lordo - costo - q.interessi) / q.base) * 100).toFixed(2) : null;
    c.cassa += lordo - costo; delete c.sc[s];
    const r = { sim: s, data: d, resa, eur: +(lordo - costo).toFixed(2), lato: "giu", dal: q.dal, prezzo0: q.prezzo0, prezzo: (lastOn(serie(s), d) || [])[1] ?? null, interessi: +q.interessi.toFixed(2), ...(auto ? { auto } : {}), ops: q.ops };
    c.chiuse.push(r); return r;
  };
  for (const d of cal) {
    for (const c of Object.values(conti)) for (const [s, q] of Object.entries(c.sc)) { // ribasso: costo giornaliero e uscita obbligatoria
      const pe = prezzoEur(s, d); if (pe == null) continue;
      const gg = Math.max(0, Math.round((Date.parse(d) - Date.parse(q.fino)) / 864e5)), int = q.n * pe * PF_SC_COSTO * gg / 365;
      c.cassa -= int; q.interessi += int; q.fino = d;
      const px = lastOn(serie(s), d);
      if (d > q.dal && px && px[0] === d && q.stop > 0 && px[1] >= q.prezzo0 * (1 + q.stop / 100)) chiudiSc(c, s, q, d, pe, "stop");
    }
    for (; i < E.length && E[i].d === d; i++) {
      const { o } = E[i], c = st(o.conto);
      if (o.tipo === "versa") {
        const v = valore(c, d), idx = c.quote > 0 && v > 0 ? v / c.quote : 100;
        c.cassa += o.eur; c.versato += o.eur; c.quote += o.eur / idx;
        esiti[o.id] = { stato: "eseguita", data: d, eur: o.eur }; continue;
      }
      const fx0 = o.fisso && o.fisso.pe > 0 ? o.fisso : null, pe = fx0 ? fx0.pe : prezzoEur(o.sim, d); if (pe == null || !(pe > 0)) { esiti[o.id] = { stato: "in_attesa", nota: "prezzo non disponibile" }; continue; }
      if (o.tipo === "compra") {
        if (c.sc[o.sim]) { esiti[o.id] = { stato: "rifiutata", nota: "c'è una posizione al ribasso aperta sullo stesso titolo" }; continue; }
        let eur = Math.min(+o.eur || 0, Math.max(0, c.cassa - impegnato(c)));
        if (o.conto === "modello") { // limiti del modello: 10% per titolo, 15 titoli
          const v = valore(c, d), gia = c.pos[o.sim] ? c.pos[o.sim].n * pe : 0;
          eur = Math.min(eur, Math.max(0, v * PF_MAX_PESO / 100 - gia));
          if (!c.pos[o.sim] && Object.keys(c.pos).length >= PF_MAX_POS) eur = 0;
        }
        if (eur < 1) { esiti[o.id] = { stato: "rifiutata", nota: c.cassa < 1 ? "liquidità insufficiente" : "limite raggiunto (10% per titolo o 15 titoli)" }; continue; }
        const costo = eur * PF_COSTO, n = (eur - costo) / pe, q = (c.pos[o.sim] ||= { n: 0, speso: 0, dal: d, ops: [] });
        q.n += n; q.speso += eur; q.ultimo = pe; q.ops.push(o.id); c.cassa -= eur;
        esiti[o.id] = { stato: "eseguita", data: d, prezzo: fx0 ? fx0.prezzo : lastOn(serie(o.sim), d)[1], pe: +pe.toFixed(6), eur: +eur.toFixed(2), n: +n.toFixed(6), costo: +costo.toFixed(2) };
      } else if (o.tipo === "scoperto") {
        if (c.pos[o.sim] || c.sc[o.sim]) { esiti[o.id] = { stato: "rifiutata", nota: c.pos[o.sim] ? "il titolo è già in portafoglio al rialzo" : "c'è già una posizione al ribasso su questo titolo" }; continue; }
        const v = valore(c, d), giaSc = Object.entries(c.sc).reduce((a, [s2, q2]) => a + q2.n * (prezzoEur(s2, d) ?? q2.pe0), 0);
        const eur = Math.min(+o.eur || 0, v * PF_SC_PESO / 100, Math.max(0, v * PF_SC_MAX / 100 - giaSc), Math.max(0, c.cassa - impegnato(c)));
        if (eur < 1) { esiti[o.id] = { stato: "rifiutata", nota: "limite del ribasso raggiunto (" + PF_SC_PESO + "% per posizione, " + PF_SC_MAX + "% in tutto) o liquidità insufficiente" }; continue; }
        const costo = eur * PF_COSTO, n = eur / pe, prezzo = fx0 ? fx0.prezzo : lastOn(serie(o.sim), d)[1];
        c.cassa -= costo; c.sc[o.sim] = { n, pe0: pe, prezzo0: prezzo, base: eur, dal: d, fino: d, stop: Math.max(0, +o.stop || 0), interessi: costo, ultimo: pe, ops: [o.id] };
        esiti[o.id] = { stato: "eseguita", data: d, prezzo, pe: +pe.toFixed(6), eur: +eur.toFixed(2), n: +n.toFixed(6), costo: +costo.toFixed(2), stop: +o.stop || null };
      } else if (o.tipo === "ricopri") {
        const q = c.sc[o.sim]; if (!q) { esiti[o.id] = { stato: "rifiutata", nota: "nessuna posizione al ribasso su questo titolo (forse già chiusa dall'uscita obbligatoria)" }; continue; }
        q.ops.push(o.id); const r = chiudiSc(c, o.sim, q, d, pe, null);
        esiti[o.id] = { stato: "eseguita", data: d, prezzo: fx0 ? fx0.prezzo : r.prezzo, pe: +pe.toFixed(6), eur: r.eur, n: +q.n.toFixed(6), resa: r.resa };
      } else {
        const q = c.pos[o.sim]; if (!q || q.n <= 0) { esiti[o.id] = { stato: "rifiutata", nota: "titolo non in portafoglio" }; continue; }
        const fr = Math.max(0, Math.min(1, o.quota == null ? 1 : +o.quota)), n = q.n * fr, lordo = n * pe, costo = lordo * PF_COSTO, base = q.speso * fr;
        c.cassa += lordo - costo; q.n -= n; q.speso -= base;
        const r = { stato: "eseguita", data: d, prezzo: fx0 ? fx0.prezzo : lastOn(serie(o.sim), d)[1], pe: +pe.toFixed(6), eur: +(lordo - costo).toFixed(2), n: +n.toFixed(6), costo: +costo.toFixed(2), resa: base > 0 ? +(((lordo - costo) / base - 1) * 100).toFixed(2) : null };
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
    const scoperti = Object.entries(c.sc).map(([s, q]) => { const pe = prezzoEur(s, oggi) ?? q.ultimo, px = (lastOn(serie(s), oggi) || [])[1] ?? null; return { sim: s, n: +q.n.toFixed(6), prezzo0: q.prezzo0, prezzo: px, valuta: pfValuta(s), impegnato: +q.base.toFixed(2), peso: v > 0 ? +(q.n * pe / v * 100).toFixed(1) : 0, resa: q.base > 0 ? +(((q.n * (q.pe0 - pe) - q.interessi) / q.base) * 100).toFixed(2) : null, dal: q.dal, stop: q.stop, stop_prezzo: q.stop > 0 ? +(q.prezzo0 * (1 + q.stop / 100)).toFixed(4) : null, costi: +q.interessi.toFixed(2), ops: q.ops }; });
    out[k] = { scoperti, libera: +(c.cassa - impegnato(c)).toFixed(2), valore: +v.toFixed(2), versato: +c.versato.toFixed(2), cassa: +c.cassa.toFixed(2), peso_cassa: v > 0 ? +(c.cassa / v * 100).toFixed(1) : 100, inizio: c.inizio, posizioni: pos, chiuse: c.chiuse.slice(-50), serie: c.serie, rend: rendimenti(c.serie, oggi) };
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

/* Bilancio per regola: ogni acquisto eseguito del modello, dal prezzo d'ingresso alla vendita (o a oggi se è ancora aperto).
   Le vendite si contano per regola con la resa della parte venduta. */
export const PF_REGOLE = { A1: "Ipotesi al rialzo, fiducia media", A2: "Ipotesi al rialzo, fiducia alta", A3: "Chiave in prova", A4: "Prezzo di riferimento (es. offerta di acquisto)", V1: "Tesi smentita", V2: "Azienda uscita dagli osservati", V3: "Ipotesi al ribasso", V4: "Orizzonte passato", V5: "Tesi in bilico (metà)", S1: "Ribasso: ipotesi al ribasso, fiducia alta", C1: "Ribasso: uscita obbligatoria", C2: "Ribasso: tesi smentita", C3: "Ribasso: orizzonte passato", C4: "Ribasso: ipotesi al rialzo", C5: "Ribasso: azienda uscita dagli osservati" };
export function pfPerRegola(ops, prezzi, oggi) {
  const M = (ops || []).filter((o) => o.conto === "modello" && o.esito && o.esito.stato === "eseguita" && o.tipo !== "versa");
  const G = {};
  for (const o of M) {
    const k = o.regola || "senza regola", g = (G[k] ||= { regola: k, nome: PF_REGOLE[k] || "Ordini senza codice (prima delle regole numerate)", n: 0, chiuse: 0, aperte: 0, rese: [] });
    g.n++;
    if (o.tipo === "scoperto") {
      const out = M.find((y) => y.tipo === "ricopri" && y.sim === o.sim && y.esito.data > o.esito.data), last = (prezzi[o.sim] || []).filter((x) => x[0] <= oggi).pop(), px = out ? out.esito.prezzo : last && last[1];
      if (px && o.esito.prezzo) { g.rese.push((1 - px / o.esito.prezzo) * 100); out ? g.chiuse++ : g.aperte++; }
    } else if (o.tipo === "compra") {
      const out = M.find((y) => y.tipo === "vendi" && y.sim === o.sim && y.esito.data > o.esito.data);
      const last = (prezzi[o.sim] || []).filter((x) => x[0] <= oggi).pop();
      const px = out ? out.esito.prezzo : last && last[1];
      if (px && o.esito.prezzo) { g.rese.push((px / o.esito.prezzo - 1) * 100); out ? g.chiuse++ : g.aperte++; }
    } else if (o.esito.resa != null) { g.rese.push(o.esito.resa); g.chiuse++; }
  }
  return Object.values(G).map((g) => ({ regola: g.regola, nome: g.nome, n: g.n, chiuse: g.chiuse, aperte: g.aperte, resa_media: g.rese.length ? +(g.rese.reduce((a, b) => a + b, 0) / g.rese.length).toFixed(2) : null, positive: g.rese.filter((r) => r > 0).length, misurate: g.rese.length })).sort((a, b) => a.regola.localeCompare(b.regola));
}
