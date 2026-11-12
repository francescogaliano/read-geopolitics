#!/usr/bin/env python3
"""fai.py SCENEGGIATURA.json USCITA.mp4 — dal copione al video, con i controlli.

1) controlli sulla sceneggiatura (lunghezze, campi)  2) costruisci.py (tempi, index.html)
3) hyperframes check: se non è «ok» si ferma e stampa gli errori  4) render
5) compressione e controllo finale (durata <= 45 s, peso <= 9,5 MB).
Stampa una riga JSON con l'esito; esce con 0 solo se il video è pronto.
"""
import glob, json, os, subprocess, sys

QUI = os.path.dirname(os.path.abspath(__file__))
HF = "hyperframes@0.9.33"

def fine(ok, **k):
    print(json.dumps({"ok": ok, **k}, ensure_ascii=False)); sys.exit(0 if ok else 2)

if len(sys.argv) < 3: fine(False, errore="uso: python3 fai.py sceneggiatura.json uscita.mp4")
src, out = os.path.abspath(sys.argv[1]), os.path.abspath(sys.argv[2])
SC = json.load(open(src, encoding="utf-8"))
err = []
puro = lambda t: str(t or "").replace("*", "")
if not SC.get("apertura") or not SC.get("scene"): err.append("mancano apertura o scene")
for i, f in enumerate(SC.get("frasi", [])):
    if SC.get("muto") and len(puro(f[0])) > 80: err.append(f"frase {i} troppo lunga ({len(puro(f[0]))} > 80 caratteri): spezzala in due")
for s in SC.get("scene", []):
    if len(puro(s.get("titolo"))) > 26: err.append(f"titolo di scena troppo lungo: «{puro(s.get('titolo'))}» (max 26)")
    if len(str(s.get("fonte") or "")) > 40: err.append(f"fonte troppo lunga: «{s.get('fonte')}» (max 40 caratteri, sta su una riga)")
    for b in s.get("blocchi", []):
        if b.get("tipo") == "timbro" and len(str(b.get("testo", ""))) > 18: err.append(f"timbro troppo lungo: «{b.get('testo')}» (max 18)")
ap = SC.get("apertura") or {}
if len(puro(ap.get("titolo"))) > 26 or len(puro(ap.get("oro"))) > 30: err.append("titolo d'apertura: max 26 caratteri la prima riga, 30 la riga in oro")
if err: fine(False, fase="sceneggiatura", errori=err)

r = subprocess.run([sys.executable, os.path.join(QUI, "costruisci.py"), src], capture_output=True, text=True, cwd=QUI)
if r.returncode != 0: fine(False, fase="costruisci", errori=[(r.stderr or r.stdout).strip()[-600:]])
info = json.loads(r.stdout.strip().splitlines()[-1])
if info["video_s"] > 45: fine(False, fase="durata", errori=[f"il video dura {info['video_s']} s: massimo 45 (la musica finisce). Togli una frase o accorcia le tenute."])

subprocess.run(["npx", "-y", HF, "check", "--json"], capture_output=True, text=True, cwd=QUI, timeout=600)
cks = glob.glob(os.path.join(QUI, ".hyperframes/artifacts/checks/*.json"))
if not cks: fine(False, fase="check", errori=["hyperframes check non ha prodotto il rapporto"])
ck = json.load(open(max(cks, key=os.path.getmtime)))
if not ck.get("ok"):
    E = []
    for k in ("lint", "layout", "contrast", "craft", "motion", "runtime"):
        for e in (ck.get(k) or {}).get("findings", []):
            if e.get("severity") == "error": E.append(f"{e.get('code')} a {e.get('time', '?')} s: {str(e.get('message', ''))[:160]} {e.get('text', '')}".strip())
    fine(False, fase="check", errori=E[:12] or ["check non ok"])

env = dict(os.environ)
if not env.get("HYPERFRAMES_BROWSER_PATH"):
    c = sorted(glob.glob("/opt/pw-browsers/chromium-*/chrome-linux*/chrome") + glob.glob(os.path.expanduser("~/.cache/ms-playwright/chromium-*/chrome-linux*/chrome")))
    if c: env["HYPERFRAMES_BROWSER_PATH"] = c[-1]
raw = os.path.join(QUI, "_grezzo.mp4")
r = subprocess.run(["npx", "-y", HF, "render", "-o", raw], capture_output=True, text=True, cwd=QUI, env=env, timeout=1500)
if not os.path.exists(raw): fine(False, fase="render", errori=[(r.stderr or r.stdout).strip()[-600:]])
subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-i", raw, "-c:v", "libx264", "-preset", "slow", "-crf", "23", "-pix_fmt", "yuv420p",
                "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", out], check=True)
os.remove(raw)
mb = round(os.path.getsize(out) / 1048576, 2)
dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", out], capture_output=True, text=True).stdout.strip())
if mb > 9.5: fine(False, fase="peso", errori=[f"{mb} MB: massimo 9,5"], file=out)
fine(True, file=out, secondi=round(dur, 1), mb=mb, motore=info["motore_tempi"], promessa=f"IN {int(5 * round(dur / 5))} SECONDI")
