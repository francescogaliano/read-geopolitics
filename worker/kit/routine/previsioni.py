#!/usr/bin/env python3
"""Previsioni private delle chiavi IA (dal 25/11/2026). Servono a verificare il metodo in settimane:
fatti precisi con scadenza, scritti prima, congelati, chiusi con esito e fonte.

Uso:
  python3 /tmp/rgdb.py list ai_previsioni --all > /tmp/prev.json   (o un file con la lista dei documenti)
  python3 /tmp/routine/previsioni.py /tmp/prev.json

Ogni documento ai_previsioni/<id>:
 {"id","chiave","dinamica" (meccanismo, o null se riguarda la chiave intera),"ipotesi" ("A"|"B"|null),
  "se_vera": a cosa da ragione se si avvera (max 60 caratteri), "testo": il fatto (chi, cosa, quanto, entro quando),
  "p": STIMA DI PARTENZA, probabilita' il giorno della creazione (5-95), congelata: il punteggio si fa su questa,
  "perche": una riga, da dove viene la stima di partenza (peso dell'ipotesi, correzione per la difficolta' del fatto),
  "storia": [{"data","p","perche"}] come si muove la stima dopo la creazione (fuori dall'impronta, si aggiunge e non si cancella),
  "creata","scadenza" (AAAA-MM-GG), "impronta": scritta da questo script alla creazione,
  "esito": null | "si" | "no", "fonte_esito": {"nome","url"}, "nota", "chiusa",
  "etichetta": {"distingue": "si"|"in_parte"|"no", "perche": una riga, "data": AAAA-MM-GG, "impronta"} (dal 27/11/2026):
     se l'esito separa le ipotesi in gara. Si scrive PRIMA dell'esito (alla nascita) e non si cambia piu'.
     Con --etichetta <file> stampa l'impronta dell'etichetta.}
Il punteggio si calcola due volte: su tutte e solo su quelle con "distingue": "si" (il metodo).
Lo script stampa errori, previsioni scadute da chiudere, e il punteggio (Brier: 0 perfetto, 0,25 = tirare a indovinare).
Con --impronta <file di UNA previsione nuova> stampa l'impronta da salvare nel documento.
"""
import json, sys, hashlib, datetime

CAMPI = ("id", "chiave", "se_vera", "testo", "p", "creata", "scadenza")


def impronta_etichetta(e):
    return hashlib.sha256(json.dumps([e.get("distingue"), e.get("perche"), e.get("data")], ensure_ascii=False).encode()).hexdigest()[:12]


def impronta(d):
    return hashlib.sha256(json.dumps([d.get("testo"), d.get("p"), d.get("scadenza"), d.get("ipotesi"), d.get("dinamica")], ensure_ascii=False).encode()).hexdigest()[:12]


def carica(path):
    x = json.load(open(path))
    if isinstance(x, dict):
        x = x.get("docs") or x.get("items") or [x]
    out = []
    for d in x if isinstance(x, list) else [x]:
        if isinstance(d, dict) and "data" in d and isinstance(d["data"], dict):
            d = {**d["data"], "id": d.get("doc_id") or d.get("key") or d["data"].get("id")}
        out.append(d)
    return out


def main():
    if len(sys.argv) < 2:
        print(__doc__); sys.exit(1)
    if sys.argv[1] == "--impronta":
        print(impronta(json.load(open(sys.argv[2])))); return
    if sys.argv[1] == "--etichetta":
        x = json.load(open(sys.argv[2])); print(impronta_etichetta(x.get("etichetta") or x)); return
    P = carica(sys.argv[1])
    oggi = datetime.date.today().isoformat()
    err, scadute, chiuse = [], [], []
    for d in P:
        manca = [c for c in CAMPI if d.get(c) in (None, "")]
        if manca:
            err.append(f"{d.get('id')}: mancano {', '.join(manca)}")
        if not 5 <= float(d.get("p") or 0) <= 95:
            err.append(f"{d.get('id')}: p fuori da 5-95")
        if d.get("impronta") and d["impronta"] != impronta(d):
            err.append(f"{d.get('id')}: cambiata dopo la creazione (le previsioni sono congelate)")
        if not d.get("impronta"):
            err.append(f"{d.get('id')}: manca l'impronta (python3 previsioni.py --impronta <file>)")
        e = d.get("etichetta")
        if not e and str(d.get("creata") or "") >= "2026-11-27":
            err.append(f"{d.get('id')}: manca l'etichetta (distingue si|in_parte|no, perche, data)")
        if e:
            if e.get("distingue") not in ("si", "in_parte", "no") or not e.get("perche"):
                err.append(f"{d.get('id')}: etichetta incompleta")
            if e.get("impronta") != impronta_etichetta(e):
                err.append(f"{d.get('id')}: etichetta cambiata dopo essere stata scritta")
            if d.get("chiusa") and str(e.get("data") or "") > str(d.get("chiusa")):
                err.append(f"{d.get('id')}: etichetta scritta dopo l'esito (non vale)")
        ultima = None
        for v in d.get("storia") or []:
            if not (v.get("data") and v.get("perche")) or not 5 <= float(v.get("p") or 0) <= 95:
                err.append(f"{d.get('id')}: voce di storia incompleta o p fuori da 5-95 ({v})")
            elif ultima and str(v["data"]) < ultima:
                err.append(f"{d.get('id')}: storia non in ordine di data")
            else:
                ultima = str(v.get("data"))
        if d.get("esito") in ("si", "no"):
            if not (d.get("fonte_esito") or {}).get("url"):
                err.append(f"{d.get('id')}: esito senza fonte")
            chiuse.append(d)
        elif str(d.get("scadenza")) < oggi:
            scadute.append(d)
    for e in err:
        print("ERRORE", e)
    for d in scadute:
        print(f"DA CHIUDERE {d['id']} (scaduta il {d['scadenza']}): {d['testo']}")
    aperte = [d for d in P if d.get("esito") not in ("si", "no")]
    per = {}
    for d in aperte:
        per[d.get("chiave")] = per.get(d.get("chiave"), 0) + 1
    print(f"aperte {len(aperte)}, chiuse {len(chiuse)}; aperte per chiave: {dict(sorted(per.items()))}")
    if chiuse:
        b = sum((float(d['p']) / 100 - (1 if d['esito'] == 'si' else 0)) ** 2 for d in chiuse) / len(chiuse)
        giuste = sum(1 for d in chiuse if (d['esito'] == 'si') == (float(d['p']) >= 50))
        print(f"punteggio Brier {b:.3f} su {len(chiuse)} (0 perfetto, 0,25 = a caso); giuste {giuste}/{len(chiuse)}")
        dis = [d for d in chiuse if (d.get("etichetta") or {}).get("distingue") == "si"]
        if dis:
            bd = sum((float(d['p']) / 100 - (1 if d['esito'] == 'si' else 0)) ** 2 for d in dis) / len(dis)
            print(f"punteggio del metodo (solo previsioni che distinguono) {bd:.3f} su {len(dis)}")
        fin = lambda d: float((d.get("storia") or [{"p": d["p"]}])[-1]["p"])
        bf = sum((fin(d) / 100 - (1 if d['esito'] == 'si' else 0)) ** 2 for d in chiuse) / len(chiuse)
        print(f"punteggio con l'ultima stima {bf:.3f}: {'gli aggiornamenti aiutano' if bf < b - 0.005 else 'gli aggiornamenti peggiorano' if bf > b + 0.005 else 'gli aggiornamenti non cambiano molto'}")
    mosse = [d for d in aperte if d.get("storia")]
    for d in mosse:
        u = d["storia"][-1]
        print(f"STIMA {d['id']}: {d['p']} -> {u['p']} ({u.get('data')}: {u.get('perche', '')})")
    sys.exit(2 if err else 0)


if __name__ == "__main__":
    main()
