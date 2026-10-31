# sala.py — il guardiano della sala di controllo.
#   python3 sala.py pacchetto [--rilanciati id,id]   SENZA RETE: stampa il rapporto da scrivere in D1 (kv, chiave sala:inbox)
#   python3 sala.py rapporto      legge dal registro di QUESTA sessione i risultati esatti di list_triggers (nessuna ricopiatura),
#                                 li manda al Worker (POST $RG_API/v1/sala/rapporto) e stampa le routine da rilanciare
#   python3 sala.py coda          stampa le routine in coda di rilancio
#   python3 sala.py fatto ID...   toglie dalla coda le routine già rilanciate
# Variabili d'ambiente: RG_API, RG_TOKEN (mai stampate).
import json, os, sys, glob, time, urllib.request, urllib.error
api = os.environ.get("RG_API", "").rstrip("/"); tok = os.environ.get("RG_TOKEN", "")

def call(method, path, body=None):
    for n in range(3):
        try:
            h = {"user-agent": "rg-sala/1", "authorization": "Bearer " + tok}
            data = None
            if body is not None:
                h["content-type"] = "application/json"; data = json.dumps(body).encode()
            return json.load(urllib.request.urlopen(urllib.request.Request(api + path, data, h, method=method), timeout=30))
        except urllib.error.HTTPError as e:
            if e.code < 500: sys.exit("ERRORE %s su %s: %s" % (e.code, path, e.read().decode()[:200]))
        except Exception:
            pass
        time.sleep(3 * (n + 1))
    sys.exit("ERRORE: Worker non raggiungibile su " + path)

def leggi(minuti=90):
    files = set()
    for base in {os.path.expanduser("~"), "/root", os.environ.get("CLAUDE_CONFIG_DIR", "")}:
        if base:
            files.update(glob.glob(os.path.join(base, ".claude", "projects", "**", "*.jsonl"), recursive=True))
            files.update(glob.glob(os.path.join(base, "projects", "**", "*.jsonl"), recursive=True))
    lim = time.time() - minuti * 60
    uses, trig, pagine = {}, {}, []
    for f in sorted(files):
        try:
            if os.path.getmtime(f) < lim: continue
            lines = open(f, encoding="utf-8").read().splitlines()
        except Exception:
            continue
        for line in lines:
            try: o = json.loads(line)
            except Exception: continue
            c = (o.get("message") or {}).get("content")
            if not isinstance(c, list): continue
            for b in c:
                if not isinstance(b, dict): continue
                if b.get("type") == "tool_use" and str(b.get("name", "")).endswith("list_triggers"):
                    uses[b.get("id")] = b.get("input") or {}
                elif b.get("type") == "tool_result" and b.get("tool_use_id") in uses and not b.get("is_error"):
                    cc = b.get("content")
                    txt = cc if isinstance(cc, str) else "".join(x.get("text", "") for x in (cc or []) if isinstance(x, dict) and x.get("text", "").lstrip().startswith("{"))
                    try: j = json.loads(txt[txt.index("{"): txt.rindex("}") + 1])
                    except Exception: continue
                    pagine.append((uses[b.get("tool_use_id")].get("cursor") or "", j.get("next_cursor") or "", bool(j.get("has_more"))))
                    for t in j.get("data") or []:
                        lr = t.get("last_run") or {}
                        trig[t["id"]] = {"id": t["id"], "name": t.get("name", ""), "cron_expression": t.get("cron_expression", ""),
                            "enabled": t.get("enabled", True), "next_run_at": t.get("next_run_at"), "run_once_at": t.get("run_once_at"),
                            "created_kind": t.get("created_kind", ""),
                            "_ds": t.get("derived_state") or {}, "_conn": len(t.get("mcp_connections") or []),
                            "last_run": {k: lr.get(k) for k in ("status", "fired_at", "finished_at", "session_id", "failure_reason")} if lr.get("fired_at") else None}
    chiesti = {p[0] for p in pagine}
    manca = [p[1] for p in pagine if p[2] and p[1] and p[1] not in chiesti]
    return list(trig.values()), manca

cmd = sys.argv[1] if len(sys.argv) > 1 else ""
if cmd == "pacchetto":
    # nessuna rete: prepara il rapporto per la riga sala:inbox di D1 (il guardiano lo scrive con il connettore Cloudflare)
    import hashlib, datetime
    a = sys.argv[2:]
    ril = [x for x in (a[a.index("--rilanciati") + 1].split(",") if "--rilanciati" in a else []) if x.startswith("trig_")]
    tr, manca = leggi()
    if manca:
        print("MANCANO PAGINE: chiama ancora list_triggers con cursor =", manca[0]); sys.exit(2)
    if not tr: sys.exit("ERRORE: nessun risultato di list_triggers in questa sessione negli ultimi 90 minuti")
    keep = [t for t in tr if t["enabled"] and "REMINDER" not in (t["created_kind"] or "") and not ("guardiano" in t["name"].lower()) and not (not t["cron_expression"] and t["run_once_at"])]
    import re
    cut = lambda x: re.sub(r"\.\d+Z$", "Z", x) if isinstance(x, str) else x
    for t in keep:
        t.pop("created_kind", None); t.pop("run_once_at", None); t.pop("enabled", None)
        ds = t.pop("_ds", {}) or {}; conn = t.pop("_conn", 0)
        pr = " ".join(str(ds.get("prompt") or "").split())
        t["info"] = {"auto": ds.get("permission_mode") == "auto", "modello": str(ds.get("model") or "").replace("claude-", ""), "conn": conn,
                     "prompt": pr[:110], "plen": len(pr)}
        t["next_run_at"] = cut(t["next_run_at"])
        lr = t["last_run"]
        if lr:
            lr.pop("session_id", None)
            lr["status"] = str(lr.get("status") or "").replace("ROUTINE_RUN_STATUS_", "")
            lr["fired_at"] = cut(lr["fired_at"]); lr["finished_at"] = cut(lr.get("finished_at"))
            if "UNSPECIFIED" in str(lr.get("failure_reason") or ""): lr.pop("failure_reason", None)
    t_json = json.dumps(keep, separators=(",", ":"), ensure_ascii=False)
    pk = {"v": 1, "at": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"), "h": hashlib.sha256(t_json.encode()).hexdigest()[:16], "rilanciati": ril, "t": keep}
    out = json.dumps(pk, separators=(",", ":"), ensure_ascii=False)
    open("/tmp/sala_pacchetto.json", "w").write(out)
    print("PACCHETTO (%d routine, %d caratteri):" % (len(keep), len(out)))
    print(out)
elif cmd == "rapporto":
    tr, manca = leggi()
    if manca:
        print("MANCANO PAGINE: chiama ancora list_triggers con cursor =", manca[0]); sys.exit(2)
    if not tr: sys.exit("ERRORE: nessun risultato di list_triggers in questa sessione negli ultimi 90 minuti")
    for t in tr: t.pop("_ds", None); t.pop("_conn", None)
    r = call("POST", "/v1/sala/rapporto", {"triggers": tr})
    print("rapporto ok: %d routine lette, %d seguite" % (len(tr), r.get("routine", 0)))
    print("DA RILANCIARE:", " ".join(r.get("coda") or []) or "nessuna")
elif cmd == "coda":
    print("DA RILANCIARE:", " ".join(c["id"] for c in call("GET", "/v1/sala/coda").get("coda") or []) or "nessuna")
elif cmd == "fatto":
    r = call("POST", "/v1/sala/coda", {"fatti": sys.argv[2:]}); print("coda:", len(r.get("coda") or []), "rimaste")
else:
    sys.exit("uso: pacchetto [--rilanciati id,id] | rapporto | coda | fatto ID...")
