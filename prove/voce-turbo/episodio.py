# PROVA (12/11/2026): la puntata intera di una data, con la voce di Francesco su Eleven v4 Turbo. NON pubblica nulla.
# Uso: python3 episodio.py [AAAA-MM-GG]   (servono ELEVENLABS_API_KEY, RG_TOKEN e RG_API; non stampa mai le chiavi)
# Prende il copione già salvato (podcast_copioni), monta con una COPIA del kit in /tmp/podturbo in cui cambia solo il modello,
# e misura i crediti: somma delle intestazioni «character-cost» e differenza del contatore dell'account.
import os, sys, json, subprocess, tarfile, time, urllib.request, shutil

DATA = sys.argv[1] if len(sys.argv) > 1 else "2026-11-12"
QUI = os.path.dirname(os.path.abspath(__file__)); REPO = os.path.dirname(os.path.dirname(QUI))
W = "/tmp/podturbo"; shutil.rmtree(W, ignore_errors=True); os.makedirs(W + "/kit")
KEY = os.environ.get("ELEVENLABS_API_KEY", "").strip()
if not KEY: sys.exit("manca ELEVENLABS_API_KEY")

def contatore():
    try:
        r = json.load(urllib.request.urlopen(urllib.request.Request("https://api.elevenlabs.io/v1/user/subscription", headers={"xi-api-key": KEY}), timeout=30))
        return {"usati": r["character_count"], "tetto": r["character_limit"]}
    except Exception as e:
        return {"errore": str(e)[:120]}

# 1) copione del giorno, dal database (sola lettura)
rgdb = "/tmp/rgdb.py" if os.path.exists("/tmp/rgdb.py") else os.path.join(REPO, "worker/kit/rgdb.py")
r = subprocess.run([sys.executable, rgdb, "get", "podcast_copioni", DATA], capture_output=True, text=True)
if r.returncode: sys.exit("copione non letto: " + (r.stderr or r.stdout)[-300:])
def trova(o):
    if isinstance(o, dict):
        if isinstance(o.get("testo"), str): return o["testo"]
        for v in o.values():
            t = trova(v)
            if t: return t
    return None
testo = trova(json.loads(r.stdout))
if not testo: sys.exit("nel documento non c'è il campo testo")
open(W + "/copione.md", "w", encoding="utf-8").write(testo)

# 2) copia del kit, con il solo cambio di modello e il registro dei crediti
tarfile.open(os.path.join(REPO, "worker/kit/podkit.tgz")).extractall(W + "/kit")
for f in ("pod.py", "el_tts.py"):
    p = W + "/kit/" + f; s = open(p, encoding="utf-8").read()
    if "eleven_v4" not in s: sys.exit(f + ": modello non trovato, il kit è cambiato")
    s = s.replace("eleven_v4", "eleven_v4_turbo")
    if f == "el_tts.py":
        a = "data=urllib.request.urlopen(req,timeout=300).read();break"
        if a not in s: sys.exit("el_tts.py: riga della chiamata non trovata, il kit è cambiato")
        s = s.replace(a, "r_=urllib.request.urlopen(req,timeout=300);data=r_.read();open('" + W + "/costi.txt','a').write(str(r_.headers.get('character-cost'))+' '+str(len(txt))+'\\n');break")
    open(p, "w", encoding="utf-8").write(s)

# 3) montaggio (come il passo 7 delle istruzioni), senza caricamento
prima = contatore()
t0 = time.time()
m = subprocess.run([sys.executable, "pod.py", W + "/copione.md", W + "/puntata_turbo.mp3", "Francesco"], cwd=W + "/kit", capture_output=True, text=True)
if m.returncode: sys.exit("montaggio non riuscito: " + (m.stderr or m.stdout)[-600:])
esito = json.loads(m.stdout.strip().splitlines()[-1])
time.sleep(90); dopo = contatore()   # il contatore dell'account si aggiorna in ritardo
costi = [l.split() for l in open(W + "/costi.txt")] if os.path.exists(W + "/costi.txt") else []
som = sum(int(c[0]) for c in costi if c[0].isdigit()); car = sum(int(c[1]) for c in costi)
print(json.dumps({"data": DATA, "file": W + "/puntata_turbo.mp3", "montaggio": esito, "minuti_di_lavoro": round((time.time() - t0) / 60, 1),
                  "chiamate_voce": len(costi), "caratteri_generati": car, "crediti_da_intestazioni": som,
                  "contatore_prima": prima, "contatore_dopo_90s": dopo,
                  "crediti_da_contatore": (dopo["usati"] - prima["usati"]) if "usati" in prima and "usati" in dopo else None,
                  "avvisi": m.stderr.strip()[-300:] or None}, ensure_ascii=False))
