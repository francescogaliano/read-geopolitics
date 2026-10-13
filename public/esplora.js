/* Read Geopolitics · Esplora per tema e area (versione di prova, caricata da beta.html)
   Preferenze del lettore: temi (ambiti e sottoambiti) e aree geografiche.
   Non toccano la selezione del briefing: cambiano solo come il lettore naviga. */
(function(){
"use strict";
if(typeof S==="undefined"||typeof renderBriefing!=="function")return;

/* ---------- tassonomia (copia di config/tassonomia) ---------- */
const TAX=[
 {id:"geopolitica",n:"Geopolitica",sotto:[["conflitti","Conflitti e guerre"],["diplomazia","Diplomazia e negoziati"],["difesa","Difesa e sicurezza"],["sanzioni","Sanzioni"],["alleanze","Alleanze e organizzazioni"]]},
 {id:"politica",n:"Politica e istituzioni",sotto:[["elezioni","Elezioni"],["governi","Governi e riforme"],["ue","Unione europea"],["diritti","Diritti e giustizia"]]},
 {id:"economia",n:"Economia e mercati",sotto:[["commercio","Commercio e dazi"],["conti-pubblici","Debito e conti pubblici"],["mercati","Banche centrali e mercati"],["imprese","Imprese e investimenti"]]},
 {id:"energia",n:"Energia e ambiente",sotto:[["petrolio-gas","Petrolio e gas"],["transizione","Rinnovabili e transizione"],["materie-prime","Materie prime critiche"],["clima","Clima"],["ambiente","Ambiente e risorse"]]},
 {id:"tecnologia",n:"Tecnologia, IA e cyber",sotto:[["ia","Intelligenza artificiale"],["chip","Chip e semiconduttori"],["cyber","Cyber"],["spazio","Spazio"]]},
 {id:"societa",n:"Società e demografia",sotto:[["migrazioni","Migrazioni"],["lavoro","Demografia e lavoro"],["salute","Salute"],["umanitario","Crisi umanitarie"]]},
 {id:"sport",n:"Sport",sotto:[]}
];
const SUBN={},SUBP={};TAX.forEach(a=>a.sotto.forEach(([id,n])=>{SUBN[id]=n;SUBP[id]=a.id}));
const AMBN={};TAX.forEach(a=>AMBN[a.id]=a.n);
if(typeof AMBITI!=="undefined"&&AMBITI.energia)AMBITI.energia.n="Energia e ambiente";
const ICO=(typeof AMBICO!=="undefined"?AMBICO:{});

/* ---------- aree ---------- */
const AREE=[{id:"ITA",n:"Italia",e:"🇮🇹"}].concat(Object.keys(REG).map(r=>({id:r,n:r,e:{"Europa":"🇪🇺","Russia ed Europa orientale":"🧭","Medio Oriente e Nord Africa":"🕌","Africa subsahariana":"🌍","Asia e Pacifico":"🌏","Americhe":"🌎"}[r]||"🌐"})));
const AREAN={};AREE.forEach(a=>AREAN[a.id]=a.n);
const SHORT={"ITA":"Italia","Europa":"Europa","Russia ed Europa orientale":"Russia/Est","Medio Oriente e Nord Africa":"MO e Nord Africa","Africa subsahariana":"Africa","Asia e Pacifico":"Asia-Pacifico","Americhe":"Americhe"};
function areasOf(paesi){const o=new Set();(paesi||[]).forEach(iso=>{if(iso==="ITA")o.add("ITA");else if(REGOF[iso])o.add(REGOF[iso])});return o}

/* ---------- profilo del lettore (prova: salvato in questo browser) ---------- */
const KEY="rg-interessi";
function load(){try{const p=JSON.parse(localStorage.getItem(KEY)||"null");if(p&&Array.isArray(p.temi)&&Array.isArray(p.aree))return p}catch(e){}return null}
function save(p){try{localStorage.setItem(KEY,JSON.stringify(p))}catch(e){}}
let P=load();
function hasP(){return !!(P&&(P.temi.length||P.aree.length))}

/* ---------- confronto ---------- */
function topicsOf(x){const a=(x.ambiti||(x.ambito?[x.ambito]:[]))||[];const s=x.sottoambiti||(x.sottoambito?[x.sottoambito]:[]);return {a,s}}
function matchTema(x,temi){if(!temi.length)return true;const t=topicsOf(x);return temi.some(k=>k.startsWith("a:")?t.a.includes(k.slice(2)):t.s.includes(k.slice(2)))}
function matchArea(x,aree){if(!aree.length)return true;const A=areasOf(x.paesi);return aree.some(a=>A.has(a))}
function matches(x,sel){return matchTema(x,sel.temi)&&matchArea(x,sel.aree)}
function labelK(k){return k.startsWith("a:")?(AMBN[k.slice(2)]||k):(SUBN[k.slice(2)]||k)}

/* ---------- stile ---------- */
const css=document.createElement("style");
css.textContent=`
.ex-chips{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 10px}
.ex-chip{font:inherit;font-size:13.5px;border:1px solid var(--line);background:var(--surface);color:var(--ink);border-radius:999px;padding:5px 12px;cursor:pointer;line-height:1.3}
.ex-chip:hover{border-color:var(--accent)}
.ex-chip[aria-pressed="true"]{background:var(--accent);border-color:var(--accent);color:#fff}
.ex-chip.sub{font-size:12.5px;padding:4px 10px}
.ex-subrow{margin:-4px 0 10px 10px;padding-left:10px;border-left:2px solid var(--line)}
.ex-sublab{font-size:12px;color:var(--muted);margin:2px 0 -2px}
.ex-lab{font-family:var(--mono);font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin:14px 0 2px}
.ex-bar{display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center;margin:4px 0 6px}
.ex-seg{display:inline-flex;border:1px solid var(--line);border-radius:999px;overflow:hidden}
.ex-seg button{font:inherit;font-size:13px;border:0;background:transparent;color:var(--muted);padding:5px 11px;cursor:pointer}
.ex-seg button[aria-pressed="true"]{background:var(--accent-soft);color:var(--accent);font-weight:600}
.ex-btn{font:inherit;font-size:13.5px;border:1px solid var(--accent);color:var(--accent);background:transparent;border-radius:999px;padding:5px 12px;cursor:pointer}
.ex-btn.solid{background:var(--accent);color:#fff}
.ex-link{font:inherit;font-size:13px;border:0;background:none;color:var(--accent);cursor:pointer;padding:0;text-decoration:underline}
.ex-count{font-size:13px;color:var(--muted)}
.ex-grid-w{overflow-x:auto;-webkit-overflow-scrolling:touch;margin:8px 0 4px;border:1px solid var(--line);border-radius:10px}
.ex-grid{border-collapse:collapse;font-size:12.5px;min-width:560px;width:100%}
.ex-grid th,.ex-grid td{padding:6px 6px;text-align:center;border-bottom:1px solid var(--line)}
.ex-grid thead th{font-weight:500;color:var(--muted);font-size:11.5px;line-height:1.2;vertical-align:bottom}
.ex-grid th.rh{text-align:left;position:sticky;left:0;background:var(--bg);font-weight:500;white-space:nowrap;z-index:1}
.ex-grid td button{font:inherit;min-width:34px;border:0;border-radius:6px;padding:4px 6px;cursor:pointer;color:var(--ink);background:transparent}
.ex-grid td button.z{color:var(--faint);cursor:default}
.ex-grid td button.on{outline:2px solid var(--accent)}
.ex-res h3{font-size:15px;margin:18px 0 6px}
.ex-th{display:flex;flex-wrap:wrap;gap:6px}
.ex-th button{font:inherit;font-size:13px;border:1px solid var(--line);background:var(--surface);color:var(--ink);border-radius:8px;padding:5px 10px;cursor:pointer;text-align:left}
.ex-th button:hover{border-color:var(--accent)}
.ex-day{font-family:var(--mono);font-size:11px;letter-spacing:.05em;text-transform:uppercase;color:var(--muted);margin:14px 0 4px}
.ex-st{display:block;width:100%;text-align:left;font:inherit;border:0;border-top:1px solid var(--line);background:none;color:var(--ink);padding:9px 2px;cursor:pointer}
.ex-st:hover .t{color:var(--accent)}
.ex-st .t{font-size:15px;line-height:1.35;display:block}
.ex-st .m{display:block;font-size:12px;color:var(--muted);margin-top:3px}
.ex-empty{color:var(--muted);font-size:14px;padding:10px 0}
.pt-box{border:1px solid var(--line);border-left:3px solid var(--accent);border-radius:10px;padding:10px 14px;margin:14px 0 16px;background:var(--surface)}
.pt-box .pt-h{display:flex;justify-content:space-between;align-items:baseline;gap:10px;flex-wrap:wrap}
.pt-box .pt-k{font-family:var(--mono);font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--accent)}
.pt-box ul{list-style:none;margin:6px 0 0;padding:0}
.pt-box li button{font:inherit;font-size:14.5px;text-align:left;border:0;background:none;color:var(--ink);cursor:pointer;padding:5px 0;line-height:1.35}
.pt-box li button:hover{color:var(--accent)}
.pt-box .pt-n{font-size:13px;color:var(--muted);margin:6px 0 0}
#intDlg{position:fixed;inset:0;z-index:200;background:rgba(7,12,17,.55);display:flex;align-items:flex-end;justify-content:center}
#intDlg[hidden]{display:none}
#intDlg .box{background:var(--bg);color:var(--ink);width:100%;max-width:640px;max-height:88vh;overflow:auto;border-radius:16px 16px 0 0;padding:18px 16px 16px;box-shadow:0 -8px 30px rgba(0,0,0,.25)}
@media (min-width:700px){#intDlg{align-items:center}#intDlg .box{border-radius:16px}}
#intDlg h2{font-size:20px;margin:0 0 4px}
#intDlg .hint{font-size:13.5px;color:var(--muted);margin:0 0 6px}
#intDlg .act{display:flex;gap:8px;justify-content:flex-end;margin-top:14px;position:sticky;bottom:-16px;background:var(--bg);padding:10px 0 4px}
`;
document.head.appendChild(css);

/* ---------- vista Esplora ---------- */
const nav=document.querySelector("nav.tabs");
if(nav&&!document.getElementById("tab-esplora")){
  const b=document.createElement("button");b.setAttribute("role","tab");b.id="tab-esplora";b.dataset.view="esplora";b.setAttribute("aria-selected","false");
  b.innerHTML='<span class="ic" aria-hidden="true">🧭</span>Esplora';
  const ref=document.getElementById("tab-mappa");nav.insertBefore(b,ref);
  b.addEventListener("click",()=>{show("esplora");renderEx()});
}
const main=document.querySelector("main.wrap");
if(main&&!document.getElementById("v-esplora")){
  const sec=document.createElement("section");sec.id="v-esplora";sec.className="view";sec.hidden=true;
  sec.innerHTML='<div class="read" id="esplora"></div>';
  const ref=document.getElementById("v-mappa");main.insertBefore(sec,ref);
}
const X={temi:[],aree:[],per:30,init:false,all:false};
function initX(){if(X.init)return;X.init=true;if(hasP()){X.temi=P.temi.slice();X.aree=P.aree.slice()}}
function storiesIn(per){
  const all=Object.values(S.stories||{}).filter(s=>s&&s.data&&s.titolo);
  if(!per)return all;
  const d=new Date();d.setDate(d.getDate()-per);const from=d.toISOString().slice(0,10);
  return all.filter(s=>s.data>=from);
}
function chip(k,on,label,cls){return `<button type="button" class="ex-chip${cls?" "+cls:""}" data-x="${esc(k)}" aria-pressed="${on}">${label}</button>`}
function temiChips(sel,prefix){
  let h=`<div class="ex-chips">${TAX.filter(a=>a.id!=="sport").map(a=>chip(prefix+"a:"+a.id,sel.includes("a:"+a.id),`${ICO[a.id]||""} ${esc(a.n)}`)).join("")}</div>`;
  const open=TAX.filter(a=>a.sotto.length&&(sel.includes("a:"+a.id)||a.sotto.some(([s])=>sel.includes("s:"+s))));
  open.forEach(a=>{h+=`<div class="ex-subrow"><div class="ex-sublab">${ICO[a.id]||""} ${esc(a.n)} · più in dettaglio</div><div class="ex-chips">${a.sotto.map(([s,n])=>chip(prefix+"s:"+s,sel.includes("s:"+s),esc(n),"sub")).join("")}</div></div>`});
  return h;
}
function areeChips(sel,prefix){return `<div class="ex-chips">${AREE.map(a=>chip(prefix+"r:"+a.id,sel.includes(a.id),`${a.e} ${esc(a.n)}`)).join("")}</div>`}
function toggle(arr,v){const i=arr.indexOf(v);if(i>=0)arr.splice(i,1);else arr.push(v)}
function toggleTema(arr,k){
  /* se scelgo un sottoambito, l'ambito intero si toglie (vince il dettaglio); se scelgo l'ambito, tolgo i suoi sottoambiti */
  if(k.startsWith("s:")){const a="a:"+SUBP[k.slice(2)];const ia=arr.indexOf(a);if(ia>=0&&!arr.includes(k)){arr.splice(ia,1)}toggle(arr,k);return}
  const am=k.slice(2);const subs=(TAX.find(a=>a.id===am)||{sotto:[]}).sotto.map(([s])=>"s:"+s);
  if(arr.includes(k)){arr.splice(arr.indexOf(k),1);return}
  if(subs.some(s=>arr.includes(s))){for(let i=arr.length-1;i>=0;i--)if(subs.includes(arr[i]))arr.splice(i,1);return}
  arr.push(k);
}
function renderEx(){
  const el=document.getElementById("esplora");if(!el)return;initX();
  const base=storiesIn(X.per);
  const res=base.filter(s=>matches(s,X)).sort((a,b)=>b.data.localeCompare(a.data)||String(a.id).localeCompare(String(b.id)));
  const ths=Object.entries(S.threads||{}).map(([id,t])=>Object.assign({id},t)).filter(t=>t&&t.titolo&&t.stato!=="chiuso");
  const thMatch=(X.temi.length||X.aree.length)?ths.filter(t=>{const tp=Object.assign({},t,{paesi:t.bandiere&&t.bandiere.length?t.bandiere:paesiOfThread(t)});return matches(tp,X)}):[];
  /* griglia ambito x area sul periodo */
  const rows=TAX.filter(a=>a.id!=="sport");
  const cnt={};let mx=0;
  base.forEach(s=>{const am=new Set(topicsOf(s).a);const ar=areasOf(s.paesi);am.forEach(a=>ar.forEach(r=>{const k=a+"|"+r;cnt[k]=(cnt[k]||0)+1;if(cnt[k]>mx)mx=cnt[k]}))});
  const shade=n=>n?`background:color-mix(in srgb,var(--accent) ${Math.round(12+60*n/Math.max(1,mx))}%,transparent)`:"";
  const cellOn=(a,r)=>X.temi.length===1&&X.temi[0]==="a:"+a&&X.aree.length===1&&X.aree[0]===r;
  const grid=`<div class="ex-grid-w"><table class="ex-grid"><thead><tr><th class="rh">Tema \\ Area</th>${AREE.map(a=>`<th scope="col">${a.e}<br>${esc(SHORT[a.id]||a.n)}</th>`).join("")}</tr></thead><tbody>${rows.map(a=>`<tr><th class="rh" scope="row">${ICO[a.id]||""} ${esc(a.n)}</th>${AREE.map(r=>{const n=cnt[a.id+"|"+r.id]||0;return `<td><button type="button" class="${n?"":"z"}${cellOn(a.id,r.id)?" on":""}" ${n?`data-cell="${a.id}|${esc(r.id)}"`:"disabled"} style="${shade(n)}" aria-label="${esc(a.n)} in ${esc(r.n)}: ${n} storie">${n||"·"}</button></td>`}).join("")}</tr>`).join("")}</tbody></table></div>`;
  const active=X.temi.length||X.aree.length;
  const sum=active?[X.temi.map(labelK).join(" o "),X.aree.map(a=>AREAN[a]).join(" o ")].filter(Boolean).join(" · in "):"";
  const lim=X.all?res.length:40;
  let lastD="",list="";
  res.slice(0,lim).forEach(s=>{if(s.data!==lastD){lastD=s.data;list+=`<div class="ex-day">${esc(fmtDate(s.data,true))}</div>`}
    const fl=(s.paesi||[]).slice(0,4).map(flag).join("");const t=topicsOf(s);const tags=(t.s.length?t.s.map(x=>SUBN[x]):t.a.map(x=>AMBN[x])).filter(Boolean).join(" · ");
    const th=s.filone_id&&S.threads[s.filone_id]?` · ${esc(S.threads[s.filone_id].breve||S.threads[s.filone_id].titolo)}`:"";
    list+=`<button type="button" class="ex-st" data-story="${esc(s.id)}"><span class="t">${fl?fl+" ":""}${esc(s.titolo)}</span><span class="m">${esc(tags)}${th}</span></button>`});
  el.innerHTML=`
  <h2 style="margin:6px 0 4px">Esplora</h2>
  <p class="hint" style="margin:0 0 10px">Incrocia <b>temi</b> e <b>aree</b> per ritrovare le storie e i temi che ti interessano. Il briefing del mattino resta uguale per tutti: qui scegli tu da dove entrare.</p>
  <div class="ex-bar">
    <button type="button" class="ex-btn${hasP()?"":" solid"}" data-int-open="1">🎯 ${hasP()?"I miei interessi":"Scegli i tuoi interessi"}</button>
    <span class="ex-seg" role="group" aria-label="Periodo">${[[7,"7 giorni"],[30,"30 giorni"],[0,"Tutto"]].map(([v,l])=>`<button type="button" data-per="${v}" aria-pressed="${X.per===v}">${l}</button>`).join("")}</span>
    ${hasP()?`<button type="button" class="ex-link" data-use-p="1">Usa i miei interessi</button>`:""}
    ${active?`<button type="button" class="ex-link" data-clear="1">Togli i filtri</button>`:""}
  </div>
  <div class="ex-lab">Temi</div>${temiChips(X.temi,"")}
  <div class="ex-lab">Aree</div>${areeChips(X.aree,"")}
  <details class="ex-gd"${window.innerWidth>=700?" open":""}><summary class="ex-lab" style="cursor:pointer">▸ Griglia tema × area · ${X.per?("ultimi "+X.per+" giorni"):"tutto l'archivio"}</summary>${grid}<p class="hint" style="margin:4px 0 0;font-size:12.5px">Ogni numero è quante storie toccano quel tema in quell'area. Tocca un numero per filtrare.</p></details>
  <div class="ex-res">
    <p class="ex-count" style="margin:14px 0 0">${res.length} ${res.length===1?"storia":"storie"}${sum?" · "+esc(sum):""}</p>
    ${thMatch.length?`<h3>Temi aperti</h3><div class="ex-th">${thMatch.map(t=>`<button type="button" data-thread="${esc(t.id)}">${(typeof thFlags==="function"?thFlags(t):"")} ${esc(t.breve||t.titolo)}</button>`).join("")}</div>`:""}
    <h3>Storie</h3>
    ${list||`<p class="ex-empty">Nessuna storia con questi filtri nel periodo scelto. Prova ad allargare il periodo o a togliere un filtro.</p>`}
    ${res.length>lim?`<p><button type="button" class="ex-link" data-more="1">Mostra le altre ${res.length-lim}</button></p>`:""}
  </div>`;
}
function paesiOfThread(t){const out=new Set();(t.storie||[]).forEach(x=>{const s=S.stories[x.id||x];if(s)(s.paesi||[]).forEach(p=>out.add(p))});return [...out]}

document.addEventListener("click",e=>{
  const root=e.target.closest("#esplora");if(!root)return;
  const c=e.target.closest("[data-x]");if(c){const k=c.dataset.x;if(k.startsWith("r:"))toggle(X.aree,k.slice(2));else toggleTema(X.temi,k);X.all=false;renderEx();return}
  const p=e.target.closest("[data-per]");if(p){X.per=+p.dataset.per;renderEx();return}
  const g=e.target.closest("[data-cell]");if(g){const [a,r]=g.dataset.cell.split("|");X.temi=["a:"+a];X.aree=[r];X.all=false;renderEx();const r0=document.querySelector("#esplora .ex-res");if(r0)r0.scrollIntoView({behavior:"smooth",block:"start"});return}
  if(e.target.closest("[data-clear]")){X.temi=[];X.aree=[];renderEx();return}
  if(e.target.closest("[data-use-p]")&&hasP()){X.temi=P.temi.slice();X.aree=P.aree.slice();renderEx();return}
  if(e.target.closest("[data-more]")){X.all=true;renderEx();return}
});

/* ---------- finestra "I miei interessi" ---------- */
const dlg=document.createElement("div");dlg.id="intDlg";dlg.hidden=true;dlg.setAttribute("role","dialog");dlg.setAttribute("aria-modal","true");dlg.setAttribute("aria-labelledby","intTitle");
document.body.appendChild(dlg);
let D={temi:[],aree:[]};
function renderDlg(first){
  dlg.innerHTML=`<div class="box">
   <h2 id="intTitle">🎯 I tuoi interessi</h2>
   <p class="hint">${first?"Due tocchi e Read Geopolitics ti mette in cima quello che ti interessa. ":""}Il briefing resta completo: in alto trovi «Per te», sotto tutto il resto. Puoi cambiarli quando vuoi.</p>
   <div class="ex-lab">Quali temi ti interessano?</div>${temiChips(D.temi,"d")}
   <div class="ex-lab">Quali aree?</div>${areeChips(D.aree,"d")}
   <p class="hint" style="font-size:12.5px">Versione di prova: gli interessi sono salvati in questo browser.</p>
   <div class="act"><button type="button" class="ex-link" data-int-skip="1">${first?"Non ora":"Annulla"}</button><button type="button" class="ex-btn solid" data-int-save="1">Salva</button></div>
  </div>`;
}
function openDlg(first){D={temi:hasP()?P.temi.slice():[],aree:hasP()?P.aree.slice():[]};renderDlg(first);dlg.hidden=false;document.body.style.overflow="hidden"}
function closeDlg(){dlg.hidden=true;document.body.style.overflow="";try{localStorage.setItem("rg-int-seen","1")}catch(e){}}
dlg.addEventListener("click",e=>{
  const c=e.target.closest("[data-x]");if(c){const k=c.dataset.x.slice(1);if(k.startsWith("r:"))toggle(D.aree,k.slice(2));else toggleTema(D.temi,k);renderDlg(false);return}
  if(e.target.closest("[data-int-skip]")||e.target===dlg){closeDlg();return}
  if(e.target.closest("[data-int-save]")){P={temi:D.temi.slice(),aree:D.aree.slice(),aggiornato:new Date().toISOString().slice(0,10)};save(P);X.temi=P.temi.slice();X.aree=P.aree.slice();X.init=true;closeDlg();safeRender();return}
});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!dlg.hidden)closeDlg()});
document.addEventListener("click",e=>{if(e.target.closest("[data-int-open]")){e.preventDefault();openDlg(false)}});

/* ---------- "Per te" in cima al briefing ---------- */
function perTe(){
  const el=document.getElementById("briefing");if(!el||!hasP())return;
  const old=el.querySelector(".pt-box");if(old)old.remove();
  const b=typeof currentBrief==="function"?currentBrief():null;if(!b)return;
  const ids=(b.storie_mondo||[]).concat(b.storie_italia||[]);
  const st=ids.map(id=>S.stories[id]).filter(Boolean).filter(s=>matches(s,P));
  const sum=[P.temi.map(labelK).join(", "),P.aree.map(a=>AREAN[a]).join(", ")].filter(Boolean).join(" · ");
  const box=document.createElement("div");box.className="pt-box";
  box.innerHTML=`<div class="pt-h"><span class="pt-k">🎯 Per te oggi</span><button type="button" class="ex-link" data-int-open="1">Modifica</button></div>
   ${st.length?`<ul>${st.map(s=>`<li><button type="button" data-story="${esc(s.id)}">${(s.paesi||[]).slice(0,3).map(flag).join("")} ${esc(s.titolo)}</button></li>`).join("")}</ul>`:`<p class="pt-n">Oggi nessuna storia del briefing tocca i tuoi interessi.</p>`}
   <p class="pt-n">${esc(sum)} · <button type="button" class="ex-link" data-goto-ex="1">Esplora tutto l'archivio</button></p>`;
  const sub=el.querySelector("#subtabs");
  if(sub&&sub.parentNode)sub.parentNode.insertBefore(box,sub);else el.insertBefore(box,el.firstChild);
}
document.addEventListener("click",e=>{if(e.target.closest("[data-goto-ex]")){X.init=false;show("esplora");renderEx()}});
const _rb=renderBriefing;
renderBriefing=function(){const r=_rb.apply(this,arguments);try{perTe()}catch(e){console.warn("per te",e)}return r};
function safeRender(){try{renderBriefing()}catch(e){}try{if(S.view==="esplora")renderEx()}catch(e){}}

/* ---------- avvio ---------- */
const _ra=typeof renderAll==="function"?renderAll:null;
if(_ra){renderAll=function(){const r=_ra.apply(this,arguments);try{if(S.view==="esplora")renderEx()}catch(e){}return r}}
if((location.hash||"")==="#esplora"){show("esplora");renderEx()}
try{perTe()}catch(e){}
setTimeout(()=>{let seen=null;try{seen=localStorage.getItem("rg-int-seen")}catch(e){}if(!hasP()&&!seen&&!document.body.classList.contains("gated"))openDlg(true)},1500);
})();
