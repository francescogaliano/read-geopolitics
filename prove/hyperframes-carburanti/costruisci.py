# costruisci.py — PROVA HyperFrames (11/11/2026): voce di Francesco su ElevenLabs con i tempi parola per parola,
# poi index.html dal modello modello.html.tpl con i tempi veri. Uso: python3 costruisci.py  (serve ELEVENLABS_API_KEY)
# Ordine dei tentativi per i tempi: 1) text-to-speech/with-timestamps  2) forced-alignment  3) stima dai caratteri.
import os, sys, json, base64, re, subprocess, urllib.request, urllib.error, uuid, time

LEAD = 0.8  # la voce parte dopo 0,8 s: il primo fotogramma è già pieno (titolo e globo)
GRUPPI = [  # [testo a schermo (*parola* = oro), testo letto]
 ["Lo sconto sul *gasolio*", "Lo sconto sul gasolio:"],
 ["perché è così *piccolo?*", "perché è così piccolo?"],
 ["Dal 28 ottobre al 7 novembre", "Dal ventotto ottobre al sette novembre,"],
 ["*4,9* centesimi al litro", "lo sconto è di quattro virgola nove centesimi al litro."],
 ["Si paga con l'IVA *in più*", "Si paga con l'IVA in più:"],
 ["a settembre circa *170 milioni*", "a settembre, circa centosettanta milioni."],
 ["Allo sconto ne vanno", "Allo sconto ne vanno"],
 ["*38,7* milioni", "trentotto virgola sette milioni:"],
 ["meno di *un quarto*", "meno di un quarto."],
 ["Il conto si fa *mese per mese*", "Il conto si fa mese per mese:"],
 ["per questo lo sconto", "per questo lo sconto"],
 ["è *piccolo* e dura *poco*", "è piccolo, e dura poco."],
 ["Sconti brevi o un taglio stabile?", "Sconti brevi, o un taglio stabile?"],
 ["Tu cosa *preferisci?*", "Tu cosa preferisci?"],
]
# parole chiave: (nome, gruppo, parola letta) -> istante in cui la voce la dice
CHIAVI = [("piccolo0", 1, "piccolo"), ("k49", 3, "quattro"), ("k170", 5, "centosettanta"), ("k387", 7, "trentotto"),
          ("meno", 8, "meno"), ("quarto", 8, "quarto"), ("piccolo", 11, "piccolo"), ("poco", 11, "poco"),
          ("brevi", 12, "brevi"), ("taglio", 12, "taglio")]
BEAT = {1: 2, 2: 4, 3: 6, 4: 9, 5: 12}  # la scena n parte con il gruppo indicato

key = os.environ.get("ELEVENLABS_API_KEY", "").strip()
SENZA = os.environ.get("PROVA_SENZA_VOCE") == "1"  # solo per provare il montaggio: voce muta, tempi stimati
if not key and not SENZA: sys.exit("manca ELEVENLABS_API_KEY")
VID = os.environ.get("ELEVENLABS_VOICE_ID", "").strip() or "CBomCrEu5ntWbrwkEBIm"
BASE = "https://api.elevenlabs.io"
TESTO = " ".join(g[1] for g in GRUPPI)
SETT = {"stability": 0.5, "similarity_boost": 0.9}

def call(req, tries=3):
    for t in range(tries):
        try: return urllib.request.urlopen(req, timeout=300).read()
        except urllib.error.HTTPError as e:
            m = e.read().decode()[:300]
            if e.code in (429, 500, 502, 503, 504) and t < tries - 1: time.sleep(10 * (t + 1)); continue
            raise RuntimeError(f"ElevenLabs {e.code}: {m}")

motore, chars = None, None
os.makedirs("assets", exist_ok=True)
# 1) voce con i tempi
if SENZA:
    subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono", "-t", str(round(len(" ".join(g[1] for g in GRUPPI)) / 14.5, 2)), "assets/voce.mp3"], check=True)
try:
    if SENZA: raise RuntimeError("prova senza voce")
    body = {"text": TESTO, "model_id": "eleven_v4", "language_code": "it", "voice_settings": SETT}
    r = json.loads(call(urllib.request.Request(BASE + f"/v1/text-to-speech/{VID}/with-timestamps?output_format=mp3_44100_128",
        data=json.dumps(body).encode(), headers={"xi-api-key": key, "content-type": "application/json"})))
    open("assets/voce.mp3", "wb").write(base64.b64decode(r["audio_base64"]))
    al = r.get("alignment") or r.get("normalized_alignment")
    chars = list(zip(al["characters"], al["character_start_times_seconds"], al["character_end_times_seconds"]))
    if "".join(c[0] for c in chars) != TESTO: chars = None; motore = "with-timestamps (testo diverso: riallineo)"
    else: motore = "with-timestamps"
except Exception as e:
    print("with-timestamps non riuscito:", e, file=sys.stderr)
# voce senza tempi, se serve
if not os.path.exists("assets/voce.mp3") and not SENZA:
    body = {"text": TESTO, "model_id": "eleven_v4", "language_code": "it", "voice_settings": SETT}
    open("assets/voce.mp3", "wb").write(call(urllib.request.Request(BASE + f"/v1/text-to-speech/{VID}?output_format=mp3_44100_128",
        data=json.dumps(body).encode(), headers={"xi-api-key": key, "content-type": "application/json", "accept": "audio/mpeg"})))
# 2) allineamento forzato
if chars is None and not SENZA:
    try:
        bd = uuid.uuid4().hex
        parts = [f"--{bd}\r\nContent-Disposition: form-data; name=\"text\"\r\n\r\n{TESTO}\r\n".encode(),
                 f"--{bd}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"voce.mp3\"\r\nContent-Type: audio/mpeg\r\n\r\n".encode()
                 + open("assets/voce.mp3", "rb").read() + b"\r\n", f"--{bd}--\r\n".encode()]
        r = json.loads(call(urllib.request.Request(BASE + "/v1/forced-alignment", data=b"".join(parts),
            headers={"xi-api-key": key, "content-type": f"multipart/form-data; boundary={bd}"})))
        cs = [(c["text"], c["start"], c["end"]) for c in r["characters"]]
        if "".join(c[0] for c in cs) == TESTO: chars, motore = cs, "forced-alignment"
        else: print("forced-alignment: testo diverso", file=sys.stderr)
    except Exception as e:
        print("forced-alignment non riuscito:", e, file=sys.stderr)
dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", "assets/voce.mp3"],
                           capture_output=True, text=True).stdout.strip())
# 3) stima: tempo proporzionale ai caratteri
if chars is None:
    motore = "stima dai caratteri (nessun allineamento)"
    n = len(TESTO); chars = [(ch, dur * i / n, dur * (i + 1) / n) for i, ch in enumerate(TESTO)]

# gruppi: intervallo di caratteri nel testo letto
g, pos = [], 0
for s_, v in GRUPPI:
    a = pos; b = pos + len(v); pos = b + 1
    ta = chars[a][1] + LEAD; tb = chars[b - 1][2] + LEAD
    g.append({"s": s_, "a": round(ta - 0.05, 3), "b": round(tb, 3), "e": round(ta + (tb - ta) * 0.85, 3)})
K = {}
for nome, gi, parola in CHIAVI:
    a = sum(len(x[1]) + 1 for x in GRUPPI[:gi]); i = GRUPPI[gi][1].find(parola); assert i >= 0, nome
    K[nome] = round(chars[a + i][1] + LEAD, 3)
Bt = {0: 0}
for n_, gi in BEAT.items(): Bt[n_] = round(g[gi]["a"] - 0.1, 3)
# i timbri restano leggibili: la scena dopo aspetta (la voce no, i sottotitoli sì)
Bt[4] = round(max(Bt[4], K["meno"] + 1.7), 3); Bt[5] = round(max(Bt[5], K["piccolo"] + 1.1), 3)
END = round(max(g[-1]["b"] + 2.4, dur + LEAD + 1.5), 2)
open("assets/tempi.js", "w").write("window.TEMPI=" + json.dumps({"g": g, "k": K, "b": [Bt[i] for i in range(6)], "end": END}, ensure_ascii=False) + ";")
D = {"END": END, "LEAD": LEAD, "PROM": int(5 * round(END / 5)), "D_globe": round(Bt[1] + 0.2, 2)}
for i in range(1, 6): D[f"B{i}"] = Bt[i]
nxt = lambda i: Bt[i + 1] if i < 5 else END
D["D_t0"] = round(Bt[1] + 0.2, 2)
for i in range(1, 6): D[f"D_t{i}"] = round(nxt(i) - Bt[i] + (0.2 if i < 5 else 0), 2)
D["D_s1"] = round(Bt[2] - Bt[1] + 0.2, 2); D["D_s2"] = round(Bt[4] - Bt[2] + 0.2, 2)
D["D_s4"] = round(Bt[5] - Bt[4] + 0.2, 2); D["D_s5"] = round(END - Bt[5], 2); D["D_src"] = round(Bt[5] - Bt[1], 2)
h = open("modello.html.tpl").read()
for k_, v in D.items(): h = h.replace("{{" + k_ + "}}", str(v))
left = re.findall(r"\{\{\w+\}\}", h)
if left: sys.exit("segnaposto non riempiti: " + ", ".join(sorted(set(left))))
open("index.html", "w").write(h)
print(json.dumps({"ok": True, "motore_tempi": motore, "voce_s": round(dur, 2), "video_s": END, "caratteri": len(TESTO),
                  "scene": [Bt[i] for i in range(6)], "chiavi": K}, ensure_ascii=False))
