/* Pagina esterna delle chiavi di lettura (dal 20/11/2026).
   La pagina non legge mai i dati privati: legge solo una COPIA FILTRATA (kv «pub:chiavi») che contiene
   - solo le chiavi che Francesco ha marcato pubblicabili, una per una;
   - solo i campi elencati qui sotto (un campo nuovo non esce mai da solo);
   - niente simboli di Borsa, niente «chi ci guadagna tra i quotati», niente ipotesi sui prezzi, niente note e codici interni.
   I nomi di società restano solo come soggetti di fatti con fonte; le soglie sulle materie prime solo come condizione di smentita.
   Un testo libero che contiene parole da consiglio d'investimento viene TRATTENUTO (non entra nella copia) e segnalato nel pannello. */

export const PUB_KV = "pub:chiavi", PUB_TOKEN_KV = "pub:chiavi:token", PUB_CFG_KV = "pub:chiavi:cfg";
export const VERDETTI = ["aperta", "confermata", "smentita", "dormiente"];
const VERT = { en: "Energia e materie prime", te: "Tecnologia", di: "Industria", tr: "Trasporti", altro: "Altro" };
const VIETATE = /\b(quotat[aeio]|ticker|simbol[oi] di borsa|in borsa|azionist[ai]|investitor[ei]|conviene (comprare|vendere|investire)|comprare (il titolo|le azioni|azioni)|vendere (il titolo|le azioni|azioni)|al rialzo|al ribasso|prezzo obiettivo|target price|portafogli[oi]|scommett\w*|specula\w*)\b/i;
const giorni = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 864e5);
const slugP = (t) => String(t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
const isData = (d) => /^\d{4}-\d{2}-\d{2}$/.test(d || "");

/* REGOLA DEI VERDETTI (approvata il 20/11/2026), senza prezzi di società o fondi.
   Qui solo la parte che si può calcolare: è una PROPOSTA, il verdetto vale quando Francesco lo approva.
   - smentita: i fatti contro indipendenti sono almeno 3 e pari o più di quelli a favore; oppure la soglia su una materia
     prima è superata per la durata scritta nella chiave (soglia.durata, in rilevazioni; 10 se la chiave non la indica);
   - dormiente: nessun fatto nuovo da 90 giorni, e mai finché c'è una data futura in «Da osservare».
   «Confermata» e «smentita perché la condizione si è verificata» le propone la routine (campo verdetto_proposto):
   servono un fatto con data e fonte, e per la conferma una conseguenza attesa diventata visibile, saldo almeno +3, 30 giorni di vita. */
export function verdettoMeccanico(k, oggi, serie) {
  const F = k.fatti || [], fav = F.filter((f) => f.verso > 0).length, con = F.filter((f) => f.verso < 0).length;
  if (con >= 3 && con >= fav) return { stato: "smentita", motivo: "I fatti contro (" + con + ") sono pari o più di quelli a favore (" + fav + ")." };
  const sg = k.soglia, p = sg && serie ? serie(sg) : null;
  if (sg && p && p.length) { const n = Math.max(1, +sg.durata || 10), ult = p.slice(-n); if (ult.length >= n && ult.every((x) => (sg.verso === "sotto" ? x[1] < sg.valore : x[1] > sg.valore))) return { stato: "smentita", motivo: "La soglia è superata da " + n + " rilevazioni di fila (dal " + ult[0][0].split("-").reverse().join("/") + ")." }; }
  const ultimo = F.map((f) => f.aggiunto || f.data).sort().pop() || k.creata || oggi;
  const futura = (k.osservare || []).some((o) => isData(o.quando) && o.quando >= oggi);
  if (giorni(ultimo, oggi) >= 90 && !futura) return { stato: "dormiente", motivo: "Nessun fatto nuovo da " + giorni(ultimo, oggi) + " giorni." };
  return null;
}
export const andamento = (k, oggi) => { const s = (k.fatti || []).filter((f) => giorni(f.aggiunto || f.data, oggi) <= 30).reduce((a, f) => a + f.verso, 0); return s > 0 ? "si rafforza" : s < 0 ? "si indebolisce" : "stabile"; };

/* la copia filtrata: SOLO questi campi. Restituisce anche i testi trattenuti, per il pannello. */
export function copiaPubblica(chiavi, oggi, cfg) {
  const trattenuti = [], out = [];
  const ok = (id, campo, t) => { const s = String(t || "").trim(); if (!s) return ""; if (VIETATE.test(s)) { trattenuti.push({ id, campo, parola: (s.match(VIETATE) || [""])[0] }); return ""; } return s; };
  for (const k of chiavi || []) {
    if (k.pubblica !== true) continue;
    const id = k.id, F = (k.fatti || []).filter((f) => !f.superato_da && (f.fonti || []).some((q) => /^https:\/\//.test(q.url || "")));
    const v = k.verdetto && VERDETTI.includes(k.verdetto.stato) ? k.verdetto : { stato: "aperta" };
    const rip = (k.ripercussioni || []).map((r, i) => ({ stato: r.stato, testo: ok(id, "ripercussione " + (i + 1), r.testo), base: ok(id, "ripercussione " + (i + 1), r.base), dato: ok(id, "ripercussione " + (i + 1), r.dato), entro: String(r.entro || "").slice(0, 40), dal: r.dal || "" })).filter((r) => r.testo);
    const toc = k.toccati ? { pressione: ok(id, "chi è toccato", k.toccati.perde), spazio: ok(id, "chi è toccato", k.toccati.guadagna) } : null;
    out.push({
      slug: slugP(k.nome), titolo: String(k.nome || ""), verticale: VERT[k.settore] || "Altro", tesi: ok(id, "tesi", k.tesi),
      stato: v.stato, stato_dal: v.dal || "", stato_motivo: v.stato === "aperta" ? "" : ok(id, "motivo del verdetto", v.motivo), andamento: v.stato === "aperta" ? andamento(k, oggi) : "",
      dal: k.creata || "", aggiornata: k.aggiornata || "",
      porta: ok(id, "dove porta", k.porta), ripercussioni: rip, toccati: toc && (toc.pressione || toc.spazio) ? toc : null,
      osservare: (k.osservare || []).map((o, i) => ({ quando: String(o.quando || ""), testo: ok(id, "da osservare " + (i + 1), o.testo), senso: ok(id, "da osservare " + (i + 1), o.senso) })).filter((o) => o.testo),
      catena: (k.catena || []).map((c, i) => ok(id, "catena " + (i + 1), c)).filter(Boolean),
      racconto: ok(id, "racconto per l'esterno", k.racconto_pubblico),
      smentita: ok(id, "cosa la farebbe cadere", k.smentita), smentita_del: k.smentita_del || k.creata || "", smentita_prec: (k.smentita_prec || []).map((s) => ({ testo: ok(id, "smentita precedente", s.testo), dal: s.dal || "", fino: s.fino || "" })).filter((s) => s.testo),
      favore: F.filter((f) => f.verso > 0).length, contro: F.filter((f) => f.verso < 0).length, fonti: new Set(F.flatMap((f) => (f.fonti || []).map((q) => { try { return new URL(q.url).hostname.replace(/^www\./, ""); } catch (e) { return ""; } })).filter(Boolean)).size,
      fatti: F.slice().sort((a, b) => b.data.localeCompare(a.data)).map((f) => ({ data: f.data, verso: f.verso > 0 ? 1 : -1, testo: String(f.testo || ""), fonti: (f.fonti || []).filter((q) => /^https:\/\//.test(q.url || "")).slice(0, 3).map((q) => ({ nome: String(q.nome || "fonte").slice(0, 60), url: q.url })) })),
    });
  }
  const conteggio = Object.fromEntries(VERDETTI.map((s) => [s, out.filter((k) => k.stato === s).length]));
  const c = cfg || {};
  return { copia: { aggiornata: oggi, nome: String(c.nome || "").slice(0, 60), contatto: /^[^\s@<>"]+@[^\s@<>"]+\.[a-z]{2,}$/i.test(c.contatto || "") ? c.contatto : "", conteggio, chiavi: out }, trattenuti };
}
