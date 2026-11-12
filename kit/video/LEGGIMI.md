# Kit video Read Geopolitics (HyperFrames)

Dal copione (un file JSON) al video verticale 1080×1920, con i controlli. All'avvio di ogni sessione
`worker/kit/prepara.py` ne mette una copia di lavoro in `/tmp/rgkit`.

    cd /tmp/rgkit && python3 fai.py copione.json /tmp/reel.mp4

`fai.py` stampa una riga JSON. Con `"ok": true` il video è pronto (durata ≤ 45 s, peso ≤ 9,5 MB).
Con `"ok": false` dice la fase (`sceneggiatura`, `costruisci`, `durata`, `check`, `render`, `peso`) e gli
errori: si corregge il copione e si rilancia. Il motore è `npx -y hyperframes@0.9.33` (si scarica al primo uso).

## Il copione

Il modello è `esempi/due-letture.json` (reel del giovedì approvato il 12/11/2026: senza voce, globo da seguire).

- `muto: true` → niente voce: le frasi restano a schermo intere, il tempo di lettura si calcola dalle parole.
  Senza `muto` serve `ELEVENLABS_API_KEY` e il secondo elemento di ogni frase è il testo letto (`esempi/hormuz-voce.json`).
- `mappa.globo: true` → globo che ruota verso `camera.centro` [lon, lat] di ogni scena; `mappa.accesi` = paesi evidenziati (ISO a 3 lettere).
- `apertura`: `titolo`, `oro` (seconda riga), `centro`, `punto`, `evidenzia`, `etichetta`.
- `frasi`: `[testo, "", secondi facoltativi]`; `*parola*` va in oro. Le prime due ripetono il titolo d'apertura.
- `scene`: `da` (indice della frase da cui parte), `titolo`, `fonte`, `camera {centro, zoom}`, `scura`, `blocchi`.
- Blocchi: `numero`, `timbro`, `etichetta`, `nomi`, `rotta`, `navi`, `misura`, `sbarramento`, `barra`, `barre`, `giorni`, `fila`, `scelta`, `firma`.
  `quando`/`fino` sono tempi: `"g4"` (inizio della frase 4), `"g4+0.2"`, `"s+0.5"` (dall'inizio della scena).

## Limiti (li controlla fai.py)

Frase ≤ 80 caratteri · titolo di scena ≤ 26 · fonte ≤ 40 (una riga) · timbro ≤ 18 · video ≤ 45 s (la musica finisce lì).

## Equilibrio

Stesso spazio e stesso tono alle parti. Niente colore che indichi un colpevole (niente rosso su un paese),
niente «X attacca Y» senza contesto: i fatti di una parte e dell'altra si mostrano allo stesso modo.
