"""Invia al sito pubblico (Worker + D1) i dati gia' filtrati da build_data.py.
usage: python3 push_site.py DATA_JSON
Richiede le variabili d'ambiente RG_API (es. https://rg-api.xxx.workers.dev) e RG_TOKEN.
Idempotente: rieseguirlo non cambia nulla se i dati sono uguali."""
import json, os, sys, time, urllib.request, urllib.error
api = os.environ["RG_API"].rstrip("/"); tok = os.environ["RG_TOKEN"]
d = json.load(open(sys.argv[1]))
docs = [{"type": "pubblico", "key": "main", "data": d.get("pubblico") or {}}]
for c, items in d["collections"].items():
    for it in items:
        docs.append({"type": c, "key": str(it["id"]), "data": it["data"]})
def post(batch):
    body = json.dumps({"docs": batch}, ensure_ascii=False).encode()
    for n in range(4):
        try:
            r = urllib.request.Request(api + "/v1/batch", body, {"authorization": "Bearer " + tok, "content-type": "application/json", "user-agent": "rg-push/1"})
            return json.load(urllib.request.urlopen(r, timeout=60))
        except urllib.error.HTTPError as e:
            if e.code < 500: sys.exit("ERRORE %s: %s" % (e.code, e.read().decode()[:300]))
        except Exception: pass
        time.sleep(2 * (n + 1))
    sys.exit("ERRORE: Worker non raggiungibile dopo 4 tentativi")
tot = {"created": 0, "updated": 0, "unchanged": 0}
i = 0
while i < len(docs):
    batch = docs[i:i + 25]  # blocchi piccoli: restano sotto il limite di dimensione
    r = post(batch)
    for k in tot: tot[k] += r.get(k, 0)
    i += 25
print("push ok", tot, "totale", len(docs))
