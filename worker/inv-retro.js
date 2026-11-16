/* «Retroattivo»: i segnali passati (docs «segnali») tradotti in ipotesi di mercato con una REGOLA FISSA, scritta e salvata
   nel repository prima di guardare qualsiasi prezzo (commit «regola congelata»). Nessun modello sceglie caso per caso.
   Le regole non si ritoccano dopo aver visto i risultati: una regola nuova = una versione nuova, con la data, e i
   risultati delle versioni si mostrano separati.

   REGOLA v1 (16/11/2026)
   1. Filoni considerati e strumenti: se l'evento è un'ESCALATION, lo strumento va nella direzione indicata; se è una
      DISTENSIONE, nella direzione opposta. Gli altri filoni restano fuori (legame con i prezzi non abbastanza diretto:
      manovra, carovita, carburanti, elezioni, ecc.).
   2. Classificazione dell'evento solo dal testo, con le espressioni qui sotto, in quest'ordine: distensione forte,
      escalation, distensione debole; nessuna corrispondenza = fuori. Fuori anche i segnali che parlano già di un prezzo
      (Brent, spread, punti base, dollari al barile): sarebbero circolari.
   3. Due prove:
      A «previsione»: segnali con attesa «probabile», dal giorno di pubblicazione (informazione disponibile quel giorno);
      B «a evento avvenuto»: segnali con stato «avvenuto», dal giorno in cui è stato verificato.
      Prezzo di partenza = ultima chiusura in archivio fino a quel giorno compreso; misura a 1 (informativa), 7 e 30 giorni
      con le stesse soglie delle ipotesi vere. Una sola ipotesi per strumento, giorno e direzione (i doppioni si contano una volta).
   4. Confronto: 50% (caso) e «sempre su» sugli stessi strumenti e periodi. */

export const RETRO_VERSIONE = "v1 · 16/11/2026";
export const RETRO_FILONI = {
  "t-guerra-iran": { n: "Iran e Hormuz", esc: { brent: "su", ttf: "su", oro: "su", noli: "su" } },
  "t-yemen-mar-rosso": { n: "Yemen e Mar Rosso", esc: { noli: "su", brent: "su" } },
  "t-ucraina": { n: "Ucraina", esc: { ttf: "su", grano: "su", oro: "su" } },
  "t-nato-kaliningrad": { n: "Russia-NATO", esc: { ttf: "su", oro: "su" } },
};
const CIRC = /brent|spread|punti base|al barile/i;
const DE_FORTE = /tregua|cessate il fuoco|pausa|stop ai raid|riapertura|riapr|riprend|allentament|esenzion|accordo|accett|moratoria|liberazione/i;
const ESC = /attacc|colpisc|colpit|colpi|raid|affond|mina\b|missil|dron|bomb|moab|operazioni militari|truppe|forze egiziane|intervento militare|sostegno militare|mobilitaz|leva\b|chiamata alle armi|sanzion|esercitaz|rafforzament|minaccia|restrizione|sequestr|fermo|danni|danneggiament|morti|vittime|offensiv|guadagni territoriali|controllo di una località|perdita di un drone|patto di difesa|aiuti militari|patriot|interruzion|articolo 4|personale diplomatico/i;
const DE_DEBOLE = /colloqui|incontr|round|negoziat|risposta formale|risposta ufficiale|risposta.*piano|controproposta|proposta|mediator|vertice|scambio di prigionieri|riconciliazione|transiti|bozza/i;

export function retroClasse(evento) {
  const e = String(evento || "");
  if (CIRC.test(e)) return null;
  if (DE_FORTE.test(e)) return "de";
  if (ESC.test(e)) return "esc";
  if (DE_DEBOLE.test(e)) return "de";
  return null;
}
const inv = (d) => (d === "su" ? "giu" : "su");

/* segnali: [{key, filone_id, attesa, stato, data, chiuso, evento}] → ipotesi retro {prova, strumento, direzione, data, …} */
export function retroIpotesi(segnali) {
  const out = [], visti = new Set();
  for (const s of segnali) {
    const F = RETRO_FILONI[s.filone_id]; if (!F) continue;
    const c = retroClasse(s.evento); if (!c) continue;
    const prove = [];
    if (s.attesa === "probabile" && /^\d{4}-\d{2}-\d{2}$/.test(s.data || "")) prove.push(["A", s.data]);
    if (s.stato === "avvenuto" && /^\d{4}-\d{2}-\d{2}$/.test(s.chiuso || "")) prove.push(["B", s.chiuso]);
    for (const [prova, data] of prove) for (const [k, d] of Object.entries(F.esc)) {
      const direzione = c === "esc" ? d : inv(d), id = prova + "|" + k + "|" + data + "|" + direzione;
      if (visti.has(id)) continue; visti.add(id);
      out.push({ prova, strumento: k, direzione, data, filone: s.filone_id, classe: c, segnale: s.key, evento: s.evento });
    }
  }
  return out;
}

/* valutazione con le soglie degli strumenti: serie {k: [[data, valore]]}, cfg {k: {banda:[7g,30g], abs}} */
export function retroValuta(ip, serie, cfg, oggi) {
  const res = [];
  for (const h of ip) {
    const p = serie[h.strumento], c = cfg[h.strumento]; if (!p || !p.length || !c) continue;
    let b0 = null; for (const x of p) { if (x[0] <= h.data) b0 = x; else break; }
    if (!b0) continue;
    const r = { ...h, prezzo0: b0[1] };
    for (const [g, banda] of [[1, c.banda[0] / 2], [7, c.banda[0]], [30, c.banda[1]]]) {
      const lim = new Date(Date.parse(h.data + "T12:00:00Z") + g * 864e5).toISOString().slice(0, 10);
      if (lim > oggi) continue;
      const fine = g === 1 ? p.find((x) => x[0] > b0[0]) : (() => { let z = null; for (const x of p) { if (x[0] <= lim) z = x; else break; } return z; })();
      if (!fine || fine[0] <= b0[0]) continue;
      const ret = c.abs ? fine[1] - b0[1] : (fine[1] / b0[1] - 1) * 100, s = h.direzione === "su" ? ret : -ret;
      r["g" + g] = { ret: +ret.toFixed(2), esito: s > banda ? "giusta" : s < -banda ? "sbagliata" : "piatta", su: ret > banda ? 1 : ret < -banda ? -1 : 0 };
    }
    res.push(r);
  }
  return res;
}

/* riepilogo: per prova e orizzonte, giuste su (giuste + sbagliate) — le piatte non contano — e «sempre su» */
export function retroRiepilogo(val) {
  const R = {};
  for (const prova of ["A", "B"]) for (const g of [1, 7, 30]) {
    const V = val.filter((v) => v.prova === prova && v["g" + g]);
    const gi = V.filter((v) => v["g" + g].esito === "giusta").length, sb = V.filter((v) => v["g" + g].esito === "sbagliata").length;
    const su = V.filter((v) => v["g" + g].su === 1).length, giu = V.filter((v) => v["g" + g].su === -1).length;
    const per = {};
    for (const v of V) { const k = v.filone; per[k] = per[k] || { giuste: 0, sbagliate: 0 }; if (v["g" + g].esito === "giusta") per[k].giuste++; if (v["g" + g].esito === "sbagliata") per[k].sbagliate++; }
    R[prova + g] = { n: V.length, giuste: gi, sbagliate: sb, piatte: V.length - gi - sb, sempre_su: su + giu ? { giuste: su, n: su + giu } : null, per_filone: per };
  }
  return R;
}
