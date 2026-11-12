# PROVA (12/11/2026): la stessa storia letta con Eleven v4 e con v4 Turbo, per confrontare qualità e crediti.
# Uso: python3 prova.py   (serve ELEVENLABS_API_KEY). Scrive /tmp/prova_voce/v4.mp3 e /tmp/prova_voce/v4_turbo.mp3.
# Non stampa mai la chiave. Non è parte del prodotto: il ramo non va unito.
import os, sys, json, time, subprocess, urllib.request, urllib.error

KEY = os.environ.get("ELEVENLABS_API_KEY", "").strip()
if not KEY: sys.exit("manca ELEVENLABS_API_KEY")
VID = os.environ.get("ELEVENLABS_VOICE_ID", "").strip() or "CBomCrEu5ntWbrwkEBIm"
BASE = "https://api.elevenlabs.io"
OUT = "/tmp/prova_voce"; os.makedirs(OUT, exist_ok=True)
TESTO = (
 "L'Ucraina. Ieri si sono chiusi i colloqui a tre di Abu Dhabi. Russia e Ucraina hanno concordato in linea di principio un grande scambio di prigionieri. "
 "Su territori e cessate il fuoco, nessuna intesa. Oggi gli inviati americani Witkoff e Kushner sono atterrati a Mosca per incontrare Putin. "
 "Droni ucraini hanno colpito il porto di Ust-Luga e la raffineria di Omsk. La Russia ha colpito sei grandi sottostazioni ucraine. "
 "Perché è importante? È il primo risultato concreto del negoziato diretto da nove mesi. E la risposta di Mosca alla tregua su energia e Mar Nero decide quanti blackout porterà l'inverno. "
 "Le posizioni. Kushner parla del più grande rilascio umanitario della guerra, e il Cremlino definisce i colloqui sostanziali. Ma lo stesso Kushner ammette che tra le parti non c'è fiducia. "
 "E Zelensky giudica impossibile il ritiro dal Donbass chiesto a Kiev. "
 "Le fonti non concordano sui numeri dello scambio. Per il generale russo Zorin, citato dall'agenzia di Stato TASS, oltre mille per parte. Per Zelensky, mille o milleduecento. "
 "Da tenere d'occhio: se Mosca risponderà sulla tregua entro mercoledì 18 novembre."
)

def call(path, body=None, accept="application/json"):
    h = {"xi-api-key": KEY, "accept": accept}
    if body is not None: h["content-type"] = "application/json"
    req = urllib.request.Request(BASE + path, data=json.dumps(body).encode() if body is not None else None, headers=h)
    try:
        r = urllib.request.urlopen(req, timeout=300)
        return r.status, dict(r.headers), r.read()
    except urllib.error.HTTPError as e:
        return e.code, dict(e.headers), e.read()

def usati():
    s, _, b = call("/v1/user/subscription")
    return json.loads(b).get("character_count") if s == 200 else None

# 1) quali modelli v4 esistono (per non indovinare il nome di Turbo)
s, _, b = call("/v1/models")
modelli = []
if s == 200:
    for m in json.loads(b):
        if "v4" in str(m.get("model_id", "")).lower() or "v4" in str(m.get("name", "")).lower():
            modelli.append({"id": m.get("model_id"), "nome": m.get("name"), "tts": m.get("can_do_text_to_speech"),
                            "costo": (m.get("model_rates") or {}).get("character_cost_multiplier")})
else:
    print(json.dumps({"elenco_modelli": "non leggibile", "http": s, "risposta": b.decode(errors="replace")[:200]}, ensure_ascii=False))
print(json.dumps({"modelli_v4": modelli}, ensure_ascii=False))
turbo = [m["id"] for m in modelli if "turbo" in (str(m["id"]) + str(m["nome"])).lower() and m.get("tts") is not False]
candidati = turbo or ["eleven_v4_turbo", "eleven_turbo_v4"]   # se l'elenco non si legge: tentativi, dichiarati nel risultato

def genera(model, nome):
    prima = usati()
    s, h, b = call(f"/v1/text-to-speech/{VID}?output_format=mp3_44100_128",
                   {"text": TESTO, "model_id": model, "language_code": "it", "voice_settings": {"stability": 0.5, "similarity_boost": 0.9}}, "audio/mpeg")
    if s != 200: return {"modello": model, "ok": False, "http": s, "errore": b.decode(errors="replace")[:300]}
    f = f"{OUT}/{nome}.mp3"; open(f, "wb").write(b)
    time.sleep(4); dopo = usati()
    dur = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], capture_output=True, text=True).stdout.strip()
    hl = {k.lower(): v for k, v in h.items()}
    return {"modello": model, "ok": True, "file": f, "secondi": round(float(dur), 1) if dur else None, "caratteri": len(TESTO),
            "crediti_da_intestazione": hl.get("character-cost") or hl.get("x-character-count"),
            "crediti_da_contatore": (dopo - prima) if (prima is not None and dopo is not None) else None}

ris = [genera("eleven_v4", "v4")]
t = None
for c in candidati:
    t = genera(c, "v4_turbo")
    if t["ok"]: break
ris.append(t)
print(json.dumps({"risultati": ris, "turbo_trovato_in_elenco": bool(turbo)}, ensure_ascii=False))
