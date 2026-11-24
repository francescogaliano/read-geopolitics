<!-- Metodo della LETTURA delle chiavi (pilota dal 25/11/2026 su t1, t2, t7). Lo usano le routine «dinamiche» e «aggiornamenti_ai». -->

LETTURA DI UNA CHIAVE (solo le chiavi che hanno il campo "lettura": oggi t1, t2, t7)

Scopo: chi apre la chiave capisce in pochi secondi la domanda, da che parte pendono i fatti, quale dinamica regge e dove si interrompe, cosa è successo oggi e quando lo sapremo. Il calcolo resta dietro: in pagina niente percentuali.

FORMA (campo "lettura" dentro ai_tesi/<id>):
{"domanda": una domanda semplice con due risposte che si escludono (max 90 caratteri),
 "frase": 2 frasi semplici, max 45 parole: da che parte pende oggi e cosa la farebbe cambiare. Parole di tutti i giorni, nessun termine tecnico, «per ora» quando la bilancia è leggera,
 "dinamiche": [{"meccanismo": id di una dinamica della chiave, "A_sostiene": "A" o "B" (quale risposta della lettura sostiene l'ipotesi A di quella dinamica)}],
 "A": {"nome": la risposta in 1-3 parole, "meccanismo": il nome semplice della dinamica che la spiega, "anelli": [2-4 anelli]},
 "B": {… stessa forma},
 "anelli": ogni anello {"t": max 22 caratteri, "stato": "ok" | "half" | "no", "dato": max 50 caratteri, "fonte": {"nome","url"}, "data"},
 "oggi": una frase sul fatto di oggi che tocca la chiave, o «Nessun fatto nuovo oggi.»,
 "verifica": {"quando": es. «fine gennaio 2027», "cosa": la verifica lunga in una frase},
 "previsioni": [previsioni brevi, vedi sotto],
 "prove_extra": [prove che non stanno in una dinamica, es. un'obiezione del revisore che poggia su un dato: scheda completa come in pesi.md più "lato":"A"|"B"]}

ANELLI (la catena della dinamica, dal primo passo all'effetto):
- "ok" solo se un fatto con fonte aperta da te mostra quel passo; "half" se lo mostra in parte o con una misura indiretta (scrivi perché nel "dato"); "no" se nessun fatto lo mostra ancora (senza fonte).
- Un anello acceso resta acceso finché un fatto nuovo non lo smentisce; allora torna "half" o "no" e lo scrivi nel resoconto.
- Gli anelli non spostano il peso: lo spostano solo le prove. Servono a far vedere dove la dinamica regge e dove si interrompe.

PREVISIONI BREVI (il modo per sapere, in settimane, se la lettura vede giusto):
- Ogni lettura ha sempre almeno 1 previsione aperta, con scadenza fra 2 e 4 settimane. Il lunedì ne aggiungi una se ne restano meno di 2.
- {"id": "<chiave>-<AAAAMMGG>-<n>", "testo": un fatto preciso e verificabile leggendo un titolo (chi, cosa, quanto, entro quando), "lato": quale risposta rende più probabile se si avvera, "creata": oggi, "scadenza": AAAA-MM-GG, "p": la probabilità che si avveri secondo la lettura di oggi (0-100; se "lato" è la risposta che pende, il suo peso interno; altrimenti 100 meno quello)}.
- Congelate: dopo la creazione non si cambiano (lo script lo controlla). Alla scadenza scrivi "esito": "si" | "no" con "fonte_esito": {"nome","url"} e "nota" di una riga. Se l'esito non si può stabilire, "esito": "no" e nella nota «non verificabile».
- Vietate le previsioni ovvie (che si avverano in ogni caso) e quelle su morti o tragedie.

CALCOLO: `python3 /tmp/routine/lettura.py <file ai_tesi>`; se dice ERRORE correggi; poi `--scrivi`. Unisce le prove di tutte le dinamiche collegate (ogni fonte d'origine una volta), dice da che parte pende e quanto (netta, leggera, equilibrio), se il verdetto è FRAGILE (dipende da una prova sola) e il punteggio delle previsioni chiuse. Non cambiare a mano "pende" né "calcolo".
Se il verdetto cambia lato o quanto, riscrivi la "frase".
