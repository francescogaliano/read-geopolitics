<!-- Metodo dei pesi A/B delle dinamiche. Lo usano le routine; la griglia NON si mostra nelle pagine (lì c'è solo la spiegazione del metodo in parole, sezione «Come pesiamo le prove»). -->

METODO DEI PESI (valutazione basata su modello)

Idea: tu valuti ogni singola prova con una griglia fissa; il peso finale lo calcola lo script `python3 /tmp/routine/pesi.py`. Non scegli mai il peso a occhio.

1. SCHEDA DI OGNI PROVA (campi dentro la prova, oltre a testo, val, fonte):
   - "tipo": "misurato" (un numero pubblicato da una fonte che hai aperto) | "calcolo" (un nostro conto su dati misurati) | "inferito" (un nostro ragionamento).
   - "livello": "primaria" (bilanci, documenti ufficiali, statistiche, dati dell'autore) | "testata" (agenzia o giornale principale che riporta) | "secondaria" (blog, aggregatori, riprese).
   - "data": AAAA-MM-GG (o AAAA-MM) del dato, non dell'articolo che lo riprende.
   - "origine": chi ha prodotto il dato in origine (es. «alphabet», «genpact»). Due prove con la stessa origine contano una volta sola.
   - "diag" (diagnosticità): quanto la prova è più probabile se è vera l'ipotesi in cui la metti che se è vera l'altra. Solo 1, 1.5, 2, 3, 5:
       1 = probabile uguale con tutte e due (allora non è una prova: va in "neutro");
       1.5 = un po' più probabile; 2 = chiaramente più probabile; 3 = difficile da spiegare con l'altra; 5 = quasi impossibile con l'altra (rarissimo).
   - "forza": il punto di forza della prova, max 15 parole (es. «dato di bilancio certificato, trimestre più recente»).
   - "debolezza": il limite principale, max 15 parole (es. «include infrastruttura, non solo uso»). Obbligatoria: ogni prova ne ha una.
   - "ragionamento": perché quel valore di diag, max 25 parole, tenendo conto di forza e debolezza.
   La debolezza deve abbassare il diag quando tocca il punto che la prova dovrebbe dimostrare (es. un ricavo che misura anche altro: 2, non 3).
   - SCHEDA CONGELATA: la scheda si compila UNA volta, quando la prova entra. Ai giri successivi non si ritocca. Si cambia solo per un errore vero (data sbagliata, origine sbagliata, fonte che ha corretto il dato) e allora aggiungi alla prova "revisioni": [{"data":"<oggi>","prima":{i campi cambiati con il valore vecchio},"motivo":"max 20 parole"}]. Senza questa voce lo script si ferma con ERRORE. Mai rivedere una scheda per far tornare un peso.

1-bis. ARCHIVIO. Ogni ipotesi mostra al massimo 3 prove in "prove" (le più forti e recenti). Le altre NON si cancellano: si spostano in "archivio" (stessa forma, scheda compresa) e continuano a contare nel conto, con il peso che cala col tempo. Si toglie una prova solo se è sbagliata o smentita, e lo dici nel resoconto.

2. DOVE VA OGNI PROVA. Una prova sta nell'ipotesi che rende più probabile. Le obiezioni del revisore che poggiano su un dato diventano prove (di solito "calcolo") nell'ipotesi che favoriscono; in "neutro" restano solo i fatti con diag 1.

3. CALCOLO (lo fa lo script): contributo = ln(diag) × tipo (1 · 0,7 · 0,4) × livello (1 · 0,8 · 0,6) × età (calo graduale: il peso si dimezza ogni 6 mesi); + per A, − per B; somma → percentuale con la funzione logistica, arrotondata a 5, fra 20 e 80. Ogni giro ricalcola da capo su tutte le prove (mostrate e in archivio) con le schede congelate: il peso cambia solo per una prova nuova, una prova che invecchia o una revisione scritta.

4. USO:
   - Scrivi le dinamiche della chiave in un file JSON (/tmp/pesi_<id>.json), lancia `python3 /tmp/routine/pesi.py /tmp/pesi_<id>.json` (il file deve contenere anche il "calcolo" salvato dal giro precedente: serve a controllare le schede congelate): se dice ERRORE completa le schede; poi `--scrivi`, che aggiorna "peso" di A e B e aggiunge "calcolo" (punteggio e contributi, per verifica).
   - Rileggi i contributi: se il peso ti sembra sbagliato, NON cambiarlo a mano e non ritoccare le schede. Se manca una prova, cercala e aggiungila; se una scheda è davvero sbagliata, correggila con la voce in "revisioni".
   - STORICO: con --scrivi, quando il peso cambia lo script aggiunge una riga a "storico_pesi" ({quando, da, a, prova, ipotesi, stato: nuova|uscita|invecchiata|rivista}). Non modificarlo a mano. La pagina mostra l'ultimo spostamento.
   - "peso_perche" (una riga, max 20 parole, in parole semplici, senza numeri della griglia) racconta i contributi più grandi: es. «Due bilanci sostengono A; l'obiezione sui prezzi frena».
   - Pareggio (50): "peso_perche" comincia con «Pareggio:» e dice il dato che lo romperebbe.
