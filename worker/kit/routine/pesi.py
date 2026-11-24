#!/usr/bin/env python3
"""Calcolo dei pesi A/B di una dinamica dal bilancio delle prove (metodo: pesi.md).

Uso:
  python3 /tmp/routine/pesi.py tesi.json            # stampa il calcolo, non scrive nulla
  python3 /tmp/routine/pesi.py tesi.json --scrivi   # aggiorna "peso" e "calcolo" nel file

tesi.json puo' essere un documento ai_tesi (con "dinamiche") oppure una singola dinamica.
Ogni prova deve avere: tipo, diag, livello, data, origine, forza, debolezza, ragionamento.
Se manca qualcosa lo script si ferma e dice cosa: il peso non si inventa.
"""
import json, math, sys, datetime

DIAG = {1: 1.0, 1.5: 1.5, 2: 2.0, 3: 3.0, 5: 5.0}
TIPO = {"misurato": 1.0, "calcolo": 0.7, "inferito": 0.4}
LIVELLO = {"primaria": 1.0, "testata": 0.8, "secondaria": 0.6}
CAMPI = ("tipo", "diag", "livello", "data", "origine", "forza", "debolezza", "ragionamento")


def eta(data, oggi):
    try:
        p = [int(x) for x in str(data)[:10].split("-")]
        d = datetime.date(p[0], p[1] if len(p) > 1 else 6, p[2] if len(p) > 2 else 15)
    except Exception:
        raise ValueError(f"data non leggibile: {data!r} (serve AAAA-MM o AAAA-MM-GG)")
    mesi = (oggi - d).days / 30.4
    return 1.0 if mesi < 3 else 0.7 if mesi <= 12 else 0.4


def calcola(din, oggi):
    errori, voci = [], []
    for ip in din.get("ipotesi", []):
        verso = 1 if ip.get("id") == "A" else -1
        for i, p in enumerate(ip.get("prove", [])):
            nome = f"{ip.get('id')}{i + 1} «{str(p.get('testo', ''))[:40]}»"
            manca = [c for c in CAMPI if p.get(c) in (None, "")]
            if manca:
                errori.append(f"{nome}: mancano {', '.join(manca)}"); continue
            try:
                dg = float(p["diag"])
                if dg not in DIAG: raise ValueError(f"diag {p['diag']} non ammesso (1, 1.5, 2, 3, 5)")
                if p["tipo"] not in TIPO: raise ValueError(f"tipo {p['tipo']!r} non ammesso ({', '.join(TIPO)})")
                if p["livello"] not in LIVELLO: raise ValueError(f"livello {p['livello']!r} non ammesso ({', '.join(LIVELLO)})")
                c = verso * math.log(DIAG[dg]) * TIPO[p["tipo"]] * LIVELLO[p["livello"]] * eta(p["data"], oggi)
            except ValueError as e:
                errori.append(f"{nome}: {e}"); continue
            voci.append({"prova": nome, "origine": str(p["origine"]).strip().lower(), "c": c})
    if errori:
        return None, errori
    # indipendenza: prove con la stessa fonte d'origine contano una volta, la piu' forte
    tenute = {}
    for v in voci:
        k = v["origine"]
        if k not in tenute or abs(v["c"]) > abs(tenute[k]["c"]):
            tenute[k] = v
    scartate = [v["prova"] for v in voci if tenute.get(v["origine"]) is not v]
    s = sum(v["c"] for v in tenute.values())
    pa = 100 / (1 + math.exp(-s))
    pa = int(min(80, max(20, 5 * round(pa / 5))))
    return {
        "peso_A": pa,
        "punteggio": round(s, 2),
        "contributi": [{"prova": v["prova"], "c": round(v["c"], 2)} for v in sorted(tenute.values(), key=lambda v: -abs(v["c"]))],
        "non_contate": scartate,
        "data": oggi.isoformat(),
    }, []


def main():
    if len(sys.argv) < 2:
        print(__doc__); sys.exit(1)
    path, scrivi = sys.argv[1], "--scrivi" in sys.argv
    doc = json.load(open(path))
    dins = doc["dinamiche"] if "dinamiche" in doc else [doc]
    oggi = datetime.date.today()
    ko = False
    for d in dins:
        r, err = calcola(d, oggi)
        print(f"== {d.get('meccanismo', '?')}")
        if err:
            ko = True
            for e in err: print("  ERRORE", e)
            continue
        vecchio = (d.get("ipotesi") or [{}])[0].get("peso")
        print(f"  peso A {vecchio} -> {r['peso_A']}  (punteggio {r['punteggio']:+})")
        for c in r["contributi"]: print(f"    {c['c']:+.2f}  {c['prova']}")
        for n in r["non_contate"]: print(f"    non contata (stessa origine): {n}")
        if r["peso_A"] == 50: print("  PAREGGIO: peso_perche deve cominciare con «Pareggio:»")
        if scrivi:
            d["ipotesi"][0]["peso"] = r["peso_A"]
            if len(d["ipotesi"]) > 1: d["ipotesi"][1]["peso"] = 100 - r["peso_A"]
            d["calcolo"] = r
    if scrivi and not ko:
        json.dump(doc, open(path, "w"), ensure_ascii=False, indent=1)
        print("scritto", path)
    sys.exit(2 if ko else 0)


if __name__ == "__main__":
    main()
