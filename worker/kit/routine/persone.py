#!/usr/bin/env python3
"""Controllo di un profilo ai_persone prima del salvataggio (routine «persone», dal 26/11/2026).
Uso: python3 persone.py <file con UN profilo>   — stampa ERRORE … e esce con 2 se qualcosa non va, OK altrimenti."""
import json, re, sys

GRUPPI = {"laboratori", "bigtech", "chip", "scienza", "regole"}
TIPI = {"ruolo", "soldi", "prodotto", "regole", "alleanza", "dichiarazione"}
DATA = re.compile(r"^\d{4}-\d{2}(-\d{2})?$")
GIUDIZI = re.compile(r"\b(geniale|visionari[oa]|controvers[oa]|leggendari[oa]|brillante|discutibile|carismatic[oa])\b", re.I)


def fonte_ok(f):
    return isinstance(f, dict) and str(f.get("url", "")).startswith("http") and f.get("nome")


def main():
    d = json.load(open(sys.argv[1]))
    if isinstance(d, dict) and isinstance(d.get("data"), dict):
        d = d["data"]
    E = []
    for c in ("nome", "gruppo", "ruolo", "perche", "famoso", "ora", "aggiornato"):
        if not str(d.get(c) or "").strip():
            E.append(f"manca «{c}»")
    if d.get("gruppo") and d["gruppo"] not in GRUPPI:
        E.append("gruppo: " + " | ".join(sorted(GRUPPI)))
    if len(str(d.get("ruolo") or "")) > 140: E.append("ruolo oltre 140 caratteri")
    if len(str(d.get("perche") or "")) > 220: E.append("perche oltre 220 caratteri")
    if d.get("wikidata") and not re.match(r"^Q\d+$", str(d["wikidata"])): E.append("wikidata: Q seguito da cifre")
    if "foto" in d: E.append("non scrivere «foto»: la prende il server da Wikidata")
    P = d.get("percorso") or []
    if not (3 <= len(P) <= 12): E.append("percorso: da 5 a 10 tappe")
    for x in P:
        if not x.get("quando") or not x.get("testo"): E.append("tappa del percorso senza quando o testo")
    for x in d.get("posizioni") or []:
        if not fonte_ok(x.get("fonte")): E.append("posizione senza fonte con link: " + str(x.get("testo", ""))[:50])
        if not DATA.match(str(x.get("data", ""))): E.append("posizione senza data AAAA-MM: " + str(x.get("testo", ""))[:50])
        if len(str(x.get("testo", ""))) > 260: E.append("posizione troppo lunga (parafrasa)")
    N = d.get("notizie") or []
    for x in N:
        if not DATA.match(str(x.get("data", ""))): E.append("notizia senza data: " + str(x.get("testo", ""))[:50])
        if x.get("tipo") not in TIPI: E.append("tipo notizia: " + " | ".join(sorted(TIPI)))
        if not any(fonte_ok(f) for f in x.get("fonti") or []): E.append("notizia senza fonte con link: " + str(x.get("testo", ""))[:50])
    if [x.get("data") for x in N] != sorted([x.get("data") for x in N], reverse=True): E.append("notizie: dalla più recente alla più vecchia")
    if len(N) > 20: E.append("notizie: al massimo 20")
    S = d.get("stima")
    if S:
        for x in S.get("punti") or []:
            if not fonte_ok(x.get("fonte")) or not DATA.match(str(x.get("data", ""))) or not isinstance(x.get("min"), (int, float)): E.append("stima: ogni punto ha data, min numerico e fonte")
    if not any(fonte_ok(f) for f in d.get("fonti") or []): E.append("fonti: almeno una con link")
    testo = " ".join(str(d.get(c, "")) for c in ("perche", "famoso", "ora"))
    m = GIUDIZI.search(testo)
    if m: E.append("parola di giudizio da togliere: " + m.group(0))
    for e in dict.fromkeys(E):
        print("ERRORE", e)
    if E: sys.exit(2)
    print("OK", d.get("nome"))


if __name__ == "__main__":
    main()
