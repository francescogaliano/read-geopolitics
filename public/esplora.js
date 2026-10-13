/* Read Geopolitics · Esplora per area e per tema (versione di prova, inserita in beta.html da scripts/build_beta.py)
   Percorso: scegli un'area o un tema → pagina con paesi o aree, in breve, partite aperte, ultimi sviluppi → storia o filone.
   "Segui" salva aree e temi del lettore; "Per te oggi" nel briefing mostra le storie del giorno che li toccano.
   Le preferenze non toccano la selezione del briefing. */
(function(){
"use strict";

/* ---------- tassonomia (copia di config/tassonomia) ---------- */
const TAX=[
 {id:"geopolitica",n:"Geopolitica",sotto:[["conflitti","Conflitti e guerre"],["diplomazia","Diplomazia e negoziati"],["difesa","Difesa e sicurezza"],["sanzioni","Sanzioni"],["alleanze","Alleanze e organizzazioni"]]},
 {id:"politica",n:"Politica e istituzioni",sotto:[["elezioni","Elezioni"],["governi","Governi e riforme"],["ue","Unione europea"],["diritti","Diritti e giustizia"]]},
 {id:"economia",n:"Economia e mercati",sotto:[["commercio","Commercio e dazi"],["conti-pubblici","Debito e conti pubblici"],["mercati","Banche centrali e mercati"],["imprese","Imprese e investimenti"]]},
 {id:"energia",n:"Energia e ambiente",sotto:[["petrolio-gas","Petrolio e gas"],["transizione","Rinnovabili e transizione"],["materie-prime","Materie prime critiche"],["clima","Clima"],["ambiente","Ambiente e risorse"]]},
 {id:"tecnologia",n:"Tecnologia, IA e cyber",sotto:[["ia","Intelligenza artificiale"],["chip","Chip e semiconduttori"],["cyber","Cyber"],["spazio","Spazio"]]},
 {id:"societa",n:"Società e demografia",sotto:[["migrazioni","Migrazioni"],["lavoro","Demografia e lavoro"],["salute","Salute"],["umanitario","Crisi umanitarie"]]}
];
const SUBN={};TAX.forEach(a=>a.sotto.forEach(([id,n])=>SUBN[id]=n));
const AMBN={};TAX.forEach(a=>AMBN[a.id]=a.n);
if(typeof AMBITI!=="undefined"&&AMBITI.energia)AMBITI.energia.n="Energia e ambiente";

/* ---------- aree: ogni storia appartiene all'area del suo primo paese ---------- */
const AREE=[{id:"italia",n:"Italia",codes:["ITA"]}].concat(Object.keys(REG).map(r=>({id:r.toLowerCase().replace(/[^a-z]+/g,"-").replace(/-+$/,""),n:r,codes:REG[r].split(" ").filter(c=>c!=="ITA")})));
const AREA_OF={};AREE.forEach(a=>a.codes.forEach(c=>AREA_OF[c]=a.id));
const AREABY={};AREE.forEach(a=>AREABY[a.id]=a);
function areaOf(paesi){for(const p of paesi||[]){if(AREA_OF[p])return AREA_OF[p]}return null}
function storyArea(s){return areaOf(s&&s.paesi)}
function threadArea(t,id){
  const st=threadStories(id);const c={};st.forEach(s=>{const a=storyArea(s);if(a)c[a]=(c[a]||0)+1});
  const best=Object.entries(c).sort((x,y)=>y[1]-x[1])[0];if(best)return best[0];
  return areaOf(t.bandiere);
}
function threadStories(id){return Object.values(S.stories).filter(s=>s&&s.filone_id===id)}
function topics(x){return {a:(x.ambiti||(x.ambito?[x.ambito]:[]))||[],s:x.sottoambiti||(x.sottoambito?[x.sottoambito]:[])}}

/* ---------- date ---------- */
function today(){const b=S.briefings&&S.briefings[0];return (b&&b.data)||new Date().toISOString().slice(0,10)}
function ago(n){const d=new Date(today()+"T12:00:00");d.setDate(d.getDate()-n);return d.toISOString().slice(0,10)}
function shortD(iso){const d=new Date(iso+"T12:00:00");return `${d.getDate()} ${MONTHS[d.getMonth()].slice(0,3)}`}
const LVT={1:"stabile",2:"attrito",3:"crisi",4:"crisi grave",5:"guerra"};

/* ---------- seguiti (prova: in questo browser) ---------- */
const KEY="rg-segui";
let F=(()=>{try{const p=JSON.parse(localStorage.getItem(KEY)||"null");if(p&&Array.isArray(p.aree)&&Array.isArray(p.temi))return p}catch(e){}return {aree:[],temi:[]}})();
function saveF(){try{localStorage.setItem(KEY,JSON.stringify(F))}catch(e){}}
function follows(k,id){return F[k].includes(id)}
function toggleF(k,id){const i=F[k].indexOf(id);if(i>=0)F[k].splice(i,1);else F[k].push(id);saveF()}
function anyF(){return F.aree.length+F.temi.length>0}
function matchF(s){return F.aree.includes(storyArea(s))||topics(s).a.some(a=>F.temi.includes(a))}

/* ---------- stile ---------- */
const css=document.createElement("style");
css.textContent=`
#esplora{padding-bottom:30px}
#esplora .xp-h1{font-family:var(--serif);font-size:28px;line-height:1.15;margin:10px 0 6px;font-weight:600}
#esplora .xp-lead{color:var(--muted);font-size:15.5px;line-height:1.5;margin:0 0 16px;max-width:60ch}
.xp-seg{display:flex;background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:3px;margin:0 0 6px;max-width:420px}
.xp-seg button{flex:1;font:inherit;font-size:14.5px;border:0;background:transparent;color:var(--muted);padding:8px;border-radius:9px;cursor:pointer}
.xp-seg button[aria-pressed="true"]{background:var(--surface-2);color:var(--ink);font-weight:600}
.xp-row{display:grid;grid-template-columns:6px 1fr auto;gap:12px;align-items:center;width:100%;text-align:left;font:inherit;color:var(--ink);background:none;border:0;border-bottom:1px solid var(--line);padding:14px 0;cursor:pointer}
.xp-row:hover .xp-n{color:var(--accent)}
.xp-bar{align-self:stretch;border-radius:3px;background:var(--l1)}
.xp-body{display:flex;flex-direction:column;gap:3px;min-width:0}
.xp-n{font-family:var(--serif);font-size:18.5px;font-weight:600;line-height:1.2}
.xp-now{font-size:14px;color:var(--muted);line-height:1.35}
.xp-meta{display:flex;flex-direction:column;align-items:flex-end;gap:4px;text-align:right}
.xp-lv{font-size:12px;padding:2px 9px;border-radius:999px;background:var(--surface-2);color:var(--ink);white-space:nowrap}
.xp-c{font-size:11.5px;color:var(--faint);white-space:nowrap}
.xp-star{color:var(--accent);font-size:13px}
.xp-note{font-size:12.5px;color:var(--faint);margin:12px 0 0;line-height:1.45}
.xp-back{font:inherit;font-size:14px;color:var(--accent);background:none;border:0;padding:0;cursor:pointer;margin:6px 0 4px}
.xp-hdr{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}
.xp-follow{font:inherit;font-size:14px;border:1px solid var(--accent);color:var(--accent);background:transparent;border-radius:999px;padding:6px 14px;white-space:nowrap;margin-top:14px;cursor:pointer}
.xp-follow[aria-pressed="true"]{background:var(--accent);color:var(--bg)}
.xp-pills{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 4px}
.xp-pill{font:inherit;font-size:13px;color:var(--ink);background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:4px 8px;display:inline-flex;gap:6px;align-items:center;cursor:pointer}
.xp-pill i{font-style:normal;font-size:11px;min-width:18px;text-align:center;border-radius:4px;padding:1px 4px;color:#fff}
#esplora h2.xp-h2{font-family:var(--serif);font-size:20px;margin:24px 0 4px;font-weight:600}
.xp-hs{font-size:13.5px;color:var(--muted);margin:0 0 10px}
.xp-ib{font-size:15.5px;line-height:1.55;margin:0;max-width:65ch}
.xp-th{display:block;width:100%;text-align:left;font:inherit;color:var(--ink);background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:14px;margin:0 0 10px;cursor:pointer}
.xp-th:hover{border-color:var(--accent)}
.xp-tt{display:block;font-family:var(--serif);font-size:18px;font-weight:600;margin-bottom:4px}
.xp-td{display:block;font-size:13.5px;color:var(--muted);line-height:1.4;margin-bottom:10px}
.xp-last{display:block;font-size:14.5px;line-height:1.4;padding-left:10px;border-left:2px solid var(--accent)}
.xp-ld{display:block;font-size:12px;color:var(--accent);margin-bottom:2px}
.xp-nx{display:block;font-size:13px;color:var(--mid);margin:10px 0 0}
.xp-tn{display:block;font-size:12px;color:var(--faint);margin-top:10px}
.xp-chips{display:flex;gap:6px;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;margin:2px 0 10px;padding-bottom:2px}
.xp-chips::-webkit-scrollbar{display:none}
.xp-chip{font:inherit;font-size:13.5px;border:1px solid var(--line);background:transparent;color:var(--ink);border-radius:999px;padding:6px 12px;white-space:nowrap;cursor:pointer;flex:none}
.xp-chip span{color:var(--faint);margin-left:3px}
.xp-chip[aria-pressed="true"]{background:var(--ink);color:var(--bg);border-color:var(--ink)}
.xp-chip[aria-pressed="true"] span{color:inherit;opacity:.7}
.xp-sv{display:block;width:100%;text-align:left;font:inherit;color:var(--ink);background:none;border:0;border-top:1px solid var(--line);padding:12px 0;cursor:pointer}
.xp-sv:hover .xp-stt{color:var(--accent)}
.xp-sd{display:block;font-size:12px;color:var(--faint)}
.xp-stt{display:block;font-size:15.5px;line-height:1.35;font-weight:500;margin:2px 0 4px}
.xp-sp{display:block;font-size:13.5px;color:var(--muted);line-height:1.4}
.xp-more{display:block;width:100%;text-align:center;font:inherit;color:var(--accent);background:none;border:0;border-top:1px solid var(--line);font-size:14.5px;padding:14px 0 6px;cursor:pointer}
.xp-empty{color:var(--muted);font-size:14.5px;padding:8px 0}
.pt-box{border-radius:14px;padding:14px 16px;margin:16px 0;background:var(--accent-soft)}
.pt-h{display:flex;justify-content:space-between;align-items:baseline;gap:10px}
.pt-h b{font-family:var(--serif);font-size:17px}
.pt-h button,.pt-sug button{font:inherit;font-size:13.5px;color:var(--accent);background:none;border:0;padding:0;cursor:pointer}
.pt-seg{font-size:13px;color:var(--muted);margin:3px 0 8px}
.pt-st{display:grid;grid-template-columns:auto 1fr;gap:8px;width:100%;text-align:left;font:inherit;color:var(--ink);background:none;border:0;border-top:1px solid color-mix(in srgb,var(--accent) 25%,transparent);padding:9px 0;font-size:15px;line-height:1.35;cursor:pointer}
.pt-st:hover{color:var(--accent)}
.pt-f{white-space:nowrap}
.pt-sug{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.pt-sug button{border:1px solid var(--accent);border-radius:999px;padding:5px 12px}
.pt-n{font-size:14px;color:var(--muted);margin:6px 0 0;line-height:1.45}
`;
document.head.appendChild(css);
const LVC=l=>`var(--l${l||1})`;

/* ---------- vista ---------- */
const nav=document.querySelector("nav.tabs");
if(nav&&!document.getElementById("tab-esplora")){
  const b=document.createElement("button");b.setAttribute("role","tab");b.id="tab-esplora";b.dataset.view="esplora";b.setAttribute("aria-selected","false");
  b.innerHTML='<span class="ic" aria-hidden="true">🧭</span>Esplora';
  nav.insertBefore(b,document.getElementById("tab-mappa"));
  b.addEventListener("click",()=>{X.page=null;show("esplora");renderEx()});
}
const main=document.querySelector("main.wrap");
if(main&&!document.getElementById("v-esplora")){
  const sec=document.createElement("section");sec.id="v-esplora";sec.className="view";sec.hidden=true;
  sec.innerHTML='<div class="read" id="esplora"></div>';
  main.insertBefore(sec,document.getElementById("v-mappa"));
}
const X={mode:"area",page:null,chip:"",lim:4};

function lvArea(a){return Math.max(0,...a.codes.map(c=>(S.countries[c]&&+S.countries[c].livello)||0))}
function openThreads(){return Object.entries(S.threads||{}).map(([id,t])=>Object.assign({id},t)).filter(t=>t&&t.titolo&&t.stato!=="chiuso")}
function storiesWhere(fn){return Object.values(S.stories||{}).filter(s=>s&&s.data&&s.titolo&&fn(s))}
function rankThreads(st){const c={};st.forEach(s=>{if(s.filone_id&&S.threads[s.filone_id]&&S.threads[s.filone_id].stato!=="chiuso")c[s.filone_id]=(c[s.filone_id]||0)+1});return Object.entries(c).sort((x,y)=>y[1]-x[1])}
function tName(id){const t=S.threads[id]||{};return t.breve||t.titolo||id}
function sentence(t){t=String(t||"").replace(/\s*\[\d+\]/g,"");const i=t.indexOf(". ");return (i>0?t.slice(0,i):t).replace(/\.$/,"")+"."}

function landing(){
  const st14=storiesWhere(s=>s.data>=ago(14)),st7=st14.filter(s=>s.data>=ago(7));
  let rows;
  if(X.mode==="area"){
    rows=AREE.map(a=>{const mine=st14.filter(s=>storyArea(s)===a.id);const top=rankThreads(mine).slice(0,2).map(([id])=>tName(id));
      return {k:"area",id:a.id,n:a.n,lv:lvArea(a),now:top.join(" · ")||"Nessun tema aperto nelle ultime due settimane",c:st7.filter(s=>storyArea(s)===a.id).length,f:follows("aree",a.id)}})
      .sort((x,y)=>y.lv-x.lv||y.c-x.c);
  }else{
    rows=TAX.map(a=>{const mine=st14.filter(s=>topics(s).a.includes(a.id));const top=rankThreads(mine).slice(0,2).map(([id])=>tName(id));
      return {k:"tema",id:a.id,n:a.n,lv:0,now:top.join(" · ")||"Nessun tema aperto nelle ultime due settimane",c:st7.filter(s=>topics(s).a.includes(a.id)).length,f:follows("temi",a.id),ic:(typeof AMBICO!=="undefined"&&AMBICO[a.id])||""}})
      .sort((x,y)=>y.c-x.c);
  }
  return `<h1 class="xp-h1">Da dove vuoi partire?</h1>
  <p class="xp-lead">Scegli un’area o un tema: trovi le partite aperte e gli ultimi sviluppi, dal quadro generale alla singola storia.</p>
  <div class="xp-seg" role="group" aria-label="Esplora per"><button type="button" data-mode="area" aria-pressed="${X.mode==="area"}">Per area</button><button type="button" data-mode="tema" aria-pressed="${X.mode==="tema"}">Per tema</button></div>
  ${rows.map(r=>`<button type="button" class="xp-row" data-go="${r.k}|${esc(r.id)}"><span class="xp-bar" style="background:${r.k==="area"?LVC(r.lv):"var(--accent)"};${r.k==="tema"?`opacity:${0.25+0.75*Math.min(1,r.c/Math.max(1,rows[0].c))}`:""}"></span>
    <span class="xp-body"><span class="xp-n">${r.ic?r.ic+" ":""}${esc(r.n)}</span><span class="xp-now">${esc(r.now)}</span></span>
    <span class="xp-meta">${r.k==="area"&&r.lv?`<span class="xp-lv" style="background:color-mix(in srgb,${LVC(r.lv)} 40%,transparent)">${LVT[r.lv]}</span>`:""}<span class="xp-c">${r.c} ${r.c===1?"storia":"storie"} in 7 giorni</span>${r.f?`<span class="xp-star">★ segui</span>`:""}</span></button>`).join("")}
  <p class="xp-note">${X.mode==="area"?"La barra a sinistra ha il colore del paese più teso dell’area, sulla stessa scala della mappa (da 1, stabile, a 5, guerra).":"La barra è più intensa per i temi con più storie negli ultimi 7 giorni."}</p>`;
}

function detail(){
  const P=X.page;const isA=P.k==="area";
  const A=isA?AREABY[P.id]:null;const T=isA?null:TAX.find(t=>t.id===P.id);
  if(!A&&!T){X.page=null;return landing()}
  const all=storiesWhere(s=>isA?storyArea(s)===A.id:topics(s).a.includes(T.id)).sort((x,y)=>y.data.localeCompare(x.data)||String(y.id).localeCompare(String(x.id)));
  const st30=all.filter(s=>s.data>=ago(30));
  const ranked=rankThreads(st30).slice(0,4);
  const fk=isA?"aree":"temi";const fol=follows(fk,P.id);
  /* testa: paesi più tesi (area) oppure aree coinvolte (tema) */
  let pills="";
  if(isA){const hot=A.codes.filter(c=>S.countries[c]).sort((x,y)=>(+S.countries[y].livello||0)-(+S.countries[x].livello||0)).slice(0,5);
    pills=hot.map(c=>{const l=+S.countries[c].livello||0;return `<button type="button" class="xp-pill" data-country="${c}">${flag(c)} ${esc(S.countries[c].nome||c)}<i style="background:${LVC(l)}">${l}</i></button>`}).join("")}
  else{const c={};st30.forEach(s=>{const a=storyArea(s);if(a)c[a]=(c[a]||0)+1});
    pills=Object.entries(c).sort((x,y)=>y[1]-x[1]).slice(0,5).map(([a,n])=>`<button type="button" class="xp-pill" data-go="area|${esc(a)}">${esc(AREABY[a].n)}<i style="background:var(--accent);color:var(--bg)">${n}</i></button>`).join("")}
  const inb=ranked.slice(0,3).map(([id])=>sentence((S.threads[id]||{}).descrizione)).filter(x=>x.length>2).join(" ");
  const cards=ranked.slice(0,3).map(([id,n])=>{const t=S.threads[id];const last=all.find(s=>s.filone_id===id);
    const nx=(S.agenda||[]).filter(a=>a.filone_id===id&&a.data>=today()).sort((x,y)=>x.data.localeCompare(y.data))[0];
    return `<button type="button" class="xp-th" data-thread="${esc(id)}"><span class="xp-tt">${typeof thFlags==="function"?thFlags(t):""} ${esc(t.breve||t.titolo)}</span>
      ${t.descrizione?`<span class="xp-td">${esc(t.descrizione)}</span>`:""}
      ${last?`<span class="xp-last"><span class="xp-ld">${esc(shortD(last.data))}</span>${esc(last.titolo)}</span>`:""}
      ${nx?`<span class="xp-nx">Prossima scadenza: ${esc(shortD(nx.data))}, ${esc(nx.titolo)}</span>`:""}
      <span class="xp-tn">${n} ${n===1?"storia":"storie"} negli ultimi 30 giorni</span></button>`}).join("");
  /* restringi: sottoambiti (area) o aree (tema) */
  let chips=[],flt=s=>true;
  if(isA){const c={};st30.forEach(s=>topics(s).s.forEach(x=>c[x]=(c[x]||0)+1));chips=Object.entries(c).sort((x,y)=>y[1]-x[1]).slice(0,6).map(([k,n])=>[k,SUBN[k]||k,n]);if(X.chip)flt=s=>topics(s).s.includes(X.chip)}
  else{const c={};T.sotto.forEach(([k,n])=>{const m=all.filter(s=>topics(s).s.includes(k)).length;if(m)c[k]=m});chips=Object.entries(c).sort((x,y)=>y[1]-x[1]).map(([k,n])=>[k,SUBN[k],n]);if(X.chip)flt=s=>topics(s).s.includes(X.chip)}
  const list=all.filter(flt);
  const shown=list.slice(0,X.lim);
  return `<button type="button" class="xp-back" data-back="1">‹ ${isA?"Tutte le aree":"Tutti i temi"}</button>
  <div class="xp-hdr"><h1 class="xp-h1">${isA?"":((typeof AMBICO!=="undefined"&&AMBICO[T.id])||"")+" "}${esc(isA?A.n:T.n)}</h1><button type="button" class="xp-follow" data-follow="${fk}|${esc(P.id)}" aria-pressed="${fol}">${fol?"★ Segui già":"☆ Segui"}</button></div>
  ${pills?`<div class="xp-pills">${pills}</div>`:""}
  ${inb?`<h2 class="xp-h2">In breve</h2><p class="xp-ib">${esc(inb)}</p>`:""}
  ${cards?`<h2 class="xp-h2">Le partite aperte</h2><p class="xp-hs">Dalla più attiva nell’ultimo mese. Tocca per la storia completa del tema.</p>${cards}`:""}
  <h2 class="xp-h2">Ultimi sviluppi</h2>
  ${chips.length>1?`<div class="xp-chips" role="group" aria-label="Restringi"><button type="button" class="xp-chip" data-chip="" aria-pressed="${!X.chip}">Tutto</button>${chips.map(([k,n,c])=>`<button type="button" class="xp-chip" data-chip="${esc(k)}" aria-pressed="${X.chip===k}">${esc(n)}<span>${c}</span></button>`).join("")}</div>`:""}
  ${shown.map(s=>`<button type="button" class="xp-sv" data-story="${esc(s.id)}"><span class="xp-sd">${esc(fmtDate(s.data))}</span><span class="xp-stt">${(s.paesi||[]).slice(0,3).map(flag).join("")} ${esc(s.titolo)}</span>${s.perche_conta?`<span class="xp-sp">${esc(sentence(s.perche_conta))}</span>`:""}</button>`).join("")||`<p class="xp-empty">Nessuna storia ancora in questa selezione.</p>`}
  ${list.length>shown.length?`<button type="button" class="xp-more" data-more="1">${X.lim<=4?`Tutte le ${list.length} storie`:`Altre ${Math.min(20,list.length-shown.length)}`}</button>`:""}`;
}
function renderEx(){const el=document.getElementById("esplora");if(!el)return;el.innerHTML=X.page?detail():landing()}

document.addEventListener("click",e=>{
  const root=e.target.closest("#esplora");if(!root)return;
  const m=e.target.closest("[data-mode]");if(m){X.mode=m.dataset.mode;renderEx();return}
  const g=e.target.closest("[data-go]");if(g){const [k,id]=g.dataset.go.split("|");X.page={k,id};X.chip="";X.lim=4;renderEx();window.scrollTo({top:0});return}
  if(e.target.closest("[data-back]")){X.page=null;renderEx();window.scrollTo({top:0});return}
  const f=e.target.closest("[data-follow]");if(f){const [k,id]=f.dataset.follow.split("|");toggleF(k,id);renderEx();try{perTe()}catch(_){}return}
  const c=e.target.closest("[data-chip]");if(c){X.chip=c.dataset.chip;X.lim=Math.max(X.lim,4);renderEx();return}
  if(e.target.closest("[data-more]")){X.lim=X.lim<=4?20:X.lim+20;renderEx();return}
});

/* ---------- "Per te oggi" nel briefing ---------- */
function perTe(){
  const el=document.getElementById("briefing");if(!el)return;
  const old=el.querySelector(".pt-box");if(old)old.remove();
  const b=typeof currentBrief==="function"?currentBrief():null;if(!b)return;
  const box=document.createElement("div");box.className="pt-box";
  if(anyF()){
    const ids=(b.storie_mondo||[]).concat(b.storie_italia||[]);
    const st=ids.map(id=>S.stories[id]).filter(Boolean).filter(matchF);
    const names=F.aree.map(a=>AREABY[a]&&AREABY[a].n).concat(F.temi.map(t=>AMBN[t])).filter(Boolean);
    box.innerHTML=`<div class="pt-h"><b>Per te oggi</b><button type="button" data-pt-manage="1">Gestisci</button></div>
      <p class="pt-seg">Segui ${esc(names.join(", "))}</p>
      ${st.length?st.map(s=>`<button type="button" class="pt-st" data-story="${esc(s.id)}"><span class="pt-f">${(s.paesi||[]).slice(0,3).map(flag).join("")}</span><span>${esc(s.titolo)}</span></button>`).join(""):`<p class="pt-n">Oggi nessuna storia del briefing tocca quello che segui.</p>`}`;
  }else{
    const sug=AREE.map(a=>({a,lv:lvArea(a)})).sort((x,y)=>y.lv-x.lv).slice(0,3);
    box.innerHTML=`<div class="pt-h"><b>Per te oggi</b></div>
      <p class="pt-n">Segui un’area o un tema e qui trovi ogni mattina le storie che ti riguardano. Per esempio:</p>
      <div class="pt-sug">${sug.map(x=>`<button type="button" data-pt-follow="${esc(x.a.id)}">☆ ${esc(x.a.n)}</button>`).join("")}<button type="button" data-pt-manage="1" style="border:0">Altre aree e temi</button></div>`;
  }
  const in60=el.querySelector(".in60");
  if(in60&&in60.parentNode)in60.parentNode.insertBefore(box,in60.nextSibling);else{const sub=el.querySelector("#subtabs");if(sub)sub.parentNode.insertBefore(box,sub);else el.prepend(box)}
}
document.addEventListener("click",e=>{
  if(e.target.closest("[data-pt-manage]")){X.page=null;show("esplora");renderEx();return}
  const f=e.target.closest("[data-pt-follow]");if(f){toggleF("aree",f.dataset.ptFollow);perTe();return}
});
const _rb=renderBriefing;
renderBriefing=function(){const r=_rb.apply(this,arguments);try{perTe()}catch(e){console.warn("per te",e)}return r};
const _ra=renderAll;
renderAll=function(){const r=_ra.apply(this,arguments);try{if(S.view==="esplora")renderEx()}catch(e){console.warn("esplora",e)}return r};
if((location.hash||"")==="#esplora"){show("esplora");renderEx()}
})();
