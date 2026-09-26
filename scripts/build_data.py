"""Build data.json for the public site from an export of the Pro database.
usage: python3 build_data.py EXPORT_DIR OUT_JSON CONFIG_JSON"""
import json, os, sys, datetime
from zoneinfo import ZoneInfo
src, out, cfg = sys.argv[1], sys.argv[2], sys.argv[3]
P = json.load(open(cfg))
OK = ["briefings","stories","threads","events","countries","sources","agenda","glossario","approfondimenti","brevi","settimanali","mercati","segnali","attori","attori_storico"]
now = datetime.datetime.now(ZoneInfo("Europe/Rome")); lim = (now - datetime.timedelta(days=90)).strftime("%Y-%m-%d")
res = {}
for c in OK:
    d = os.path.join(src, c)
    if not os.path.isdir(d): continue
    items = []
    for f in sorted(os.listdir(d)):
        if not f.endswith(".json"): continue
        x = json.load(open(os.path.join(d, f)))
        if isinstance(x, dict) and isinstance(x.get("data"), dict) and "id" in x: x = x["data"]
        if c == "approfondimenti":
            if x.get("stato") != "pronto": continue
            x = {k: v for k, v in x.items() if k != "risposta_rapida"}
        if c == "briefings": x = {k: v for k, v in x.items() if k not in ("selezione",)}
        if c in ("briefings","stories","brevi","settimanali") and str(x.get("data","")) < lim: continue
        items.append({"id": f[:-5], "data": x})
    res[c] = items
pub = {k: P.get(k) for k in ("aperta_fino","form_url","goatcounter","messaggio_chiusura") if P.get(k)}
json.dump({"generato": now.strftime("%d/%m/%Y %H:%M"), "pubblico": pub, "collections": res}, open(out, "w"), ensure_ascii=False, separators=(",",":"))
print("ok", {k: len(v) for k, v in res.items()}, os.path.getsize(out), "byte")
