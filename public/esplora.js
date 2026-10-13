/* Read Geopolitics · Esplora per area e per tema (versione di prova, inserita in beta.html da scripts/build_beta.py)
   Percorso: Esplora → area o tema → (paese) → storia o filone. Ogni passo ha un indirizzo (#esplora/...), quindi
   il tasto Indietro del telefono funziona, e quando si esce verso briefing, mappa o timeline compare «Torna a …».
   «Segui» vale per aree e temi, da qualunque pagina. «Per te oggi» nel briefing mostra le storie che li toccano.
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
const AIC=id=>(typeof AMBICO!=="undefined"&&AMBICO[id])||"";
if(typeof AMBITI!=="undefined"&&AMBITI.energia)AMBITI.energia.n="Energia e ambiente";

/* ---------- aree: ogni storia appartiene all'area del suo primo paese ---------- */
const AREE=[{id:"italia",n:"Italia",codes:["ITA"]}].concat(Object.keys(REG).map(r=>({id:r.toLowerCase().replace(/[^a-z]+/g,"-").replace(/-+$/,""),n:r,codes:REG[r].split(" ").filter(c=>c!=="ITA")})));
const AREA_OF={};AREE.forEach(a=>a.codes.forEach(c=>AREA_OF[c]=a.id));
const AREABY={};AREE.forEach(a=>AREABY[a.id]=a);
function areaOf(paesi){for(const p of paesi||[]){if(AREA_OF[p])return AREA_OF[p]}return null}
function storyArea(s){return areaOf(s&&s.paesi)}
function topics(x){return {a:(x.ambiti||(x.ambito?[x.ambito]:[]))||[],s:x.sottoambiti||(x.sottoambito?[x.sottoambito]:[])}}
function cName(iso){const c=S.countries[iso];return (c&&c.nome)||(typeof NAME_FIX!=="undefined"&&NAME_FIX[iso])||iso}

/* ---------- date ---------- */
function today(){const b=S.briefings&&S.briefings[0];return (b&&b.data)||new Date().toISOString().slice(0,10)}
function ago(n){const d=new Date(today()+"T12:00:00");d.setDate(d.getDate()-n);return d.toISOString().slice(0,10)}
function shortD(iso){const d=new Date(iso+"T12:00:00");return `${d.getDate()} ${MONTHS[d.getMonth()].slice(0,3)}`}
const LVT={1:"stabile",2:"attrito",3:"crisi",4:"crisi grave",5:"guerra"};
const LVC=l=>`var(--l${l||1})`;

/* ---------- seguiti (prova: in questo browser) ---------- */
const KEY="rg-segui";
let F=(()=>{try{const p=JSON.parse(localStorage.getItem(KEY)||"null");if(p&&Array.isArray(p.aree)&&Array.isArray(p.temi)){if(!Array.isArray(p.incroci))p.incroci=[];return p}}catch(e){}return {aree:[],temi:[],incroci:[]}})();
function saveF(){try{localStorage.setItem(KEY,JSON.stringify(F))}catch(e){}}
function follows(k,id){return F[k].includes(id)}
function toggleF(k,id){if(!F[k])F[k]=[];const i=F[k].indexOf(id);if(i>=0)F[k].splice(i,1);else F[k].push(id);saveF()}
function anyF(){return F.aree.length+F.temi.length+F.incroci.length>0}
function splitX(id){const i=id.indexOf("~");return [id.slice(0,i),id.slice(i+1)]}
function matchF(s){const a=storyArea(s),t=topics(s).a;return F.aree.includes(a)||t.some(x=>F.temi.includes(x))||F.incroci.some(id=>{const [xa,xt]=splitX(id);return xa===a&&t.includes(xt)})}
function fName(k,id){if(k==="aree")return AREABY[id]&&AREABY[id].n;if(k==="temi")return AMBN[id];const [a,t]=splitX(id);return AREABY[a]&&AMBN[t]?`${AMBN[t]} in ${AREABY[a].n}`:null}
function followBtn(k,id,label){const on=follows(k,id);return `<button type="button" class="xp-follow" data-follow="${k}|${esc(id)}" aria-pressed="${on}">${on?"★ Segui":"☆ Segui"}${label?` ${esc(label)}`:""}</button>`}

/* ---------- stile ---------- */
const css=document.createElement("style");
css.textContent=`
#esplora{padding-bottom:30px}
#esplora .xp-h1{font-family:var(--serif);font-size:28px;line-height:1.15;margin:4px 0 6px;font-weight:600}
#esplora .xp-lead{color:var(--muted);font-size:15.5px;line-height:1.5;margin:0 0 16px;max-width:60ch}
.xp-crumb{display:flex;flex-wrap:wrap;align-items:center;gap:4px;font-size:13.5px;color:var(--muted);margin:8px 0 6px}
.xp-crumb button{font:inherit;color:var(--accent);background:none;border:0;padding:2px 0;cursor:pointer}
.xp-crumb span[aria-current]{color:var(--ink)}
.xp-mine{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:12px 14px;margin:0 0 18px}
.xp-mine b{font-family:var(--serif);font-size:16px;font-weight:600}
.xp-mine p{font-size:13.5px;color:var(--muted);margin:4px 0 0;line-height:1.45}
.xp-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.xp-tag{display:inline-flex;align-items:center;font-size:13.5px;border:1px solid var(--accent);color:var(--ink);border-radius:999px;overflow:hidden}
.xp-tag button{font:inherit;background:none;border:0;color:inherit;cursor:pointer;padding:5px 4px 5px 12px}
.xp-tag button.x{color:var(--muted);padding:5px 10px 5px 6px}
.xp-tag button.x:hover{color:var(--low)}
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
.xp-star{color:var(--accent);font-size:12.5px}
.xp-note{font-size:12.5px;color:var(--faint);margin:12px 0 0;line-height:1.45}
.xp-hdr{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}
.xp-follow{font:inherit;font-size:14px;border:1px solid var(--accent);color:var(--accent);background:transparent;border-radius:999px;padding:6px 14px;white-space:nowrap;cursor:pointer;flex:none}
.xp-hdr .xp-follow{margin-top:6px}
.xp-follow[aria-pressed="true"]{background:var(--accent);color:var(--bg)}
.xp-pills{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 4px}
.xp-pill{font:inherit;font-size:13.5px;color:var(--ink);background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:5px 9px;display:inline-flex;gap:6px;align-items:center;cursor:pointer}
.xp-pill:hover{border-color:var(--accent)}
.xp-pill i{font-style:normal;font-size:11px;min-width:18px;text-align:center;border-radius:4px;padding:1px 4px;color:#fff}
.xp-pt{background:var(--accent-soft);border-radius:14px;padding:14px 16px;margin:6px 0 14px}
.xp-pt p{margin:0 0 10px;line-height:1.5}
.xp-cta{font:inherit;font-weight:600;background:var(--accent);color:#fff;border:0;border-radius:999px;padding:9px 16px;cursor:pointer;margin-top:4px}
.xp-ptsub{margin:0 0 2px;font-size:15px;color:var(--muted)}
.xp-ptsub .xp-lnk{font-size:15px}
.xp-jump{display:flex;flex-direction:column;gap:10px;margin:18px 0 6px}
.xp-jump>a{font-weight:600;color:var(--accent);text-decoration:none;font-size:15px}
.xp-map{display:flex;align-items:center;gap:12px;width:100%;text-align:left;font:inherit;color:inherit;background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:12px 14px;cursor:pointer}
.xp-map:hover{border-color:var(--accent)}
.xp-map-i{font-size:24px}
.xp-map>span:nth-child(2){flex:1;display:flex;flex-direction:column}
.xp-map>span:nth-child(2) span{color:var(--muted);font-size:14px}
.pt-open{display:block;margin-top:10px;font:inherit;font-weight:600;color:var(--accent);background:none;border:0;padding:0;cursor:pointer}
#esplora h2.xp-h2{font-family:var(--serif);font-size:20px;margin:26px 0 4px;font-weight:600}
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
.xp-filt{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;margin:2px 0 10px}
.xp-chips{display:flex;gap:6px;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding-bottom:2px;max-width:100%}
.xp-chips::-webkit-scrollbar{display:none}
.xp-chip{font:inherit;font-size:13.5px;border:1px solid var(--line);background:transparent;color:var(--ink);border-radius:999px;padding:6px 12px;white-space:nowrap;cursor:pointer;flex:none}
.xp-chip span{color:var(--faint);margin-left:3px}
.xp-chip[aria-pressed="true"]{background:var(--ink);color:var(--bg);border-color:var(--ink)}
.xp-chip[aria-pressed="true"] span{color:inherit;opacity:.7}
.xp-also{display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:13.5px;color:var(--muted);background:var(--accent-soft);border-radius:10px;padding:8px 12px;margin:0 0 8px}
.xp-also .xp-follow{font-size:13px;padding:4px 12px}
.xp-item.on{background:var(--surface);border-radius:12px;margin:6px -10px;padding:0 10px 10px}
.xp-item.on .xp-sv{border-top-color:transparent}
.xp-tog{float:right;color:var(--accent);font-size:12.5px}
.xp-open .story .sto-h{display:none}
.xp-open .story{margin:0;border:0;background:transparent;box-shadow:none;padding:0}
.xp-open-f{display:flex;flex-wrap:wrap;gap:16px;justify-content:space-between;margin-top:12px;padding-top:10px;border-top:1px solid var(--line)}
.xp-sv{display:block;width:100%;text-align:left;font:inherit;color:var(--ink);background:none;border:0;border-top:1px solid var(--line);padding:12px 0;cursor:pointer}
.xp-sv:hover .xp-stt{color:var(--accent)}
.xp-sd{display:block;font-size:12px;color:var(--faint)}
.xp-stt{display:block;font-size:15.5px;line-height:1.35;font-weight:500;margin:2px 0 4px}
.xp-sp{display:block;font-size:13.5px;color:var(--muted);line-height:1.4}
.xp-more{display:block;width:100%;text-align:center;font:inherit;color:var(--accent);background:none;border:0;border-top:1px solid var(--line);font-size:14.5px;padding:14px 0 6px;cursor:pointer}
.xp-empty{color:var(--muted);font-size:14.5px;padding:8px 0}
.xp-lnk{font:inherit;font-size:14px;color:var(--accent);background:none;border:0;padding:0;cursor:pointer;text-decoration:underline;text-underline-offset:3px}
.xp-dyn{list-style:none;padding:0;margin:4px 0 0}
.xp-dyn li{font-size:14.5px;line-height:1.4;padding:7px 0;border-top:1px solid var(--line)}
.xp-dyn li button{font:inherit;color:var(--accent);background:none;border:0;padding:0;cursor:pointer}
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
.pt-sub{font-size:12.5px;color:var(--muted);margin:12px 0 2px;padding-top:8px;border-top:1px solid color-mix(in srgb,var(--accent) 25%,transparent)}
.pt-br{font-size:14px;line-height:1.45;margin:6px 0 0;color:var(--ink)}
.pt-br a{color:var(--accent);font-size:12.5px}
.pt-n{font-size:14px;color:var(--muted);margin:6px 0 0;line-height:1.45}
#intPanel{position:fixed;inset:0;z-index:210;background:rgba(7,12,17,.55);display:flex;align-items:flex-end;justify-content:center}
#intPanel[hidden]{display:none}
.ip-box{background:var(--bg);color:var(--ink);width:100%;max-width:560px;max-height:90vh;overflow:auto;border-radius:18px 18px 0 0;padding:16px 16px 22px;box-shadow:0 -8px 30px rgba(0,0,0,.3)}
@media (min-width:700px){#intPanel{align-items:center}.ip-box{border-radius:18px}}
.ip-top{display:flex;justify-content:space-between;align-items:center;gap:10px;position:sticky;top:-16px;background:var(--bg);padding:6px 0 8px;z-index:1}
.ip-top h2{font-family:var(--serif);font-size:22px;margin:0}
.ip-hint{font-size:14px;color:var(--muted);line-height:1.45;margin:2px 0 6px}
.ip-box h3{font-family:var(--serif);font-size:17px;margin:20px 0 4px;font-weight:600}
.ia{border:1px solid var(--line);border-radius:12px;margin:0 0 8px;background:var(--surface)}
.ia.on{border-color:color-mix(in srgb,var(--accent) 60%,var(--line))}
.ia-h{display:grid;grid-template-columns:5px 1fr auto;gap:10px;align-items:center;width:100%;font:inherit;color:var(--ink);background:none;border:0;padding:11px 12px;cursor:pointer;text-align:left}
.ia-bar{align-self:stretch;border-radius:3px}
.ia-t{display:flex;flex-direction:column;gap:2px;min-width:0}
.ia-n{font-family:var(--serif);font-size:16.5px;font-weight:600}
.ia-now{font-size:13px;color:var(--muted)}
.ia-s{font-size:13px;color:var(--muted);display:flex;gap:6px;align-items:center;text-align:right;max-width:40vw}
.ia.on .ia-s{color:var(--accent);font-weight:600}
.ia-b{padding:0 12px 12px}
.ia-b .xp-seg{max-width:none}
.ia-chips{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0 2px}
.ip-prev{list-style:none;margin:6px 0 0;padding:0}
.ip-prev li{font-size:14.5px;line-height:1.35;padding:7px 0;border-top:1px solid var(--line)}
.ip-prev li.m{color:var(--muted);font-size:13.5px}
.ip-sum{margin:18px 0 0;font-size:14px;color:var(--muted);background:var(--accent-soft);border-radius:10px;padding:10px 12px}
#xpBack{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:160;font:inherit;font-size:14.5px;background:var(--ink);color:var(--bg);border:0;border-radius:999px;padding:10px 18px;box-shadow:0 6px 20px rgba(0,0,0,.35);cursor:pointer;max-width:calc(100vw - 32px);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#xpBack[hidden]{display:none}
`;
document.head.appendChild(css);

/* ---------- vista e indirizzi ---------- */
const nav=document.querySelector("nav.tabs");
if(nav&&!document.getElementById("tab-esplora")){
  const b=document.createElement("button");b.setAttribute("role","tab");b.id="tab-esplora";b.dataset.view="esplora";b.setAttribute("aria-selected","false");
  b.innerHTML='<span class="ic" aria-hidden="true">🧭</span>Esplora';
  nav.insertBefore(b,document.getElementById("tab-mappa"));
}
const main=document.querySelector("main.wrap");
if(main&&!document.getElementById("v-esplora")){
  const sec=document.createElement("section");sec.id="v-esplora";sec.className="view";sec.hidden=true;
  sec.innerHTML='<div class="read" id="esplora"></div>';
  main.insertBefore(sec,document.getElementById("v-mappa"));
}
const X={mode:"area",page:null,chip:"",lim:4,ret:null,open:null};
function pathOf(p){return p?`esplora/${p.k}/${encodeURIComponent(p.id)}`:"esplora"}
function parse(h){h=(h||"").replace(/^#/,"");if(!h.startsWith("esplora"))return undefined;const m=h.split("/");return m.length>=3?{k:m[1],id:decodeURIComponent(m[2])}:null}
function labelOf(p){if(!p)return"Per te";if(p.k==="area")return (AREABY[p.id]||{}).n||"Esplora";if(p.k==="tema")return AMBN[p.id]||"Esplora";if(p.k==="paese")return cName(p.id);return"Esplora"}
const _show=show;
show=function(v,push){
  if(v==="esplora"){_show("esplora",false);renderEx();updBack();return}
  const r=_show(v,push);updBack();return r;
};
function go(p,push){
  X.page=p;X.chip="";X.lim=4;X.open=null;
  if(p&&p.k==="area")X.mode="area";if(p&&p.k==="tema")X.mode="tema";
  const h="#"+pathOf(p);
  try{if(push===false)history.replaceState(null,"",h);else if(location.hash!==h)history.pushState(null,"",h)}catch(e){}
  show("esplora");window.scrollTo({top:0});
}
const tabBtn=document.getElementById("tab-esplora");if(tabBtn)tabBtn.addEventListener("click",()=>{X.ret=null;go(null)});
if(nav)nav.addEventListener("click",e=>{const b=e.target.closest("button[data-view]");if(b&&b.dataset.view!=="esplora"){X.ret=null;updBack()}});
window.addEventListener("popstate",()=>{
  const p=parse(location.hash);
  if(p!==undefined){X.page=p;X.chip="";X.lim=4;if(p&&p.k==="area")X.mode="area";if(p&&p.k==="tema")X.mode="tema";_show("esplora",false);renderEx();X.ret=null;updBack();return}
  const v=(location.hash||"").slice(1);
  if(["briefing","mappa","protagonisti","radar","dossier","timeline","archivio"].includes(v))_show(v,false);
  updBack();
});
/* uscendo da Esplora verso storia, filone o mappa: una voce in più nella cronologia e il bottone «Torna a …» */
document.addEventListener("click",e=>{
  if(!e.target.closest("#esplora"))return;
  const out=e.target.closest("[data-story],[data-thread],[data-country]");if(!out)return;
  X.ret={page:X.page,label:labelOf(X.page)};
  try{history.pushState(null,"",location.hash)}catch(_){}
},true);
document.addEventListener("click",e=>{
  if(e.target.closest("[data-xjump]")){e.preventDefault();const t=document.getElementById("xpExplore");if(t)t.scrollIntoView({behavior:"smooth",block:"start"});return}
  if(e.target.closest("[data-xmap]")){X.ret={page:X.page,label:labelOf(X.page)};try{history.pushState(null,"",location.hash)}catch(_){}show("mappa");window.scrollTo({top:0});updBack();return}
  if(e.target.closest("[data-pt-open]")){X.ret=null;go(null);return}
});
const backBtn=document.createElement("button");backBtn.id="xpBack";backBtn.type="button";backBtn.hidden=true;document.body.appendChild(backBtn);
backBtn.addEventListener("click",()=>{const r=X.ret;X.ret=null;go(r?r.page:null)});
function updBack(){const on=!!X.ret&&S.view!=="esplora";backBtn.hidden=!on;if(on)backBtn.textContent=`‹ Torna a ${X.ret.label}`}

/* ---------- dati ---------- */
function lvArea(a){return Math.max(0,...a.codes.map(c=>(S.countries[c]&&+S.countries[c].livello)||0))}
function storiesWhere(fn){return Object.values(S.stories||{}).filter(s=>s&&s.data&&s.titolo&&fn(s)).sort((x,y)=>y.data.localeCompare(x.data)||String(y.id).localeCompare(String(x.id)))}
function rankThreads(st){const c={};st.forEach(s=>{if(s.filone_id&&S.threads[s.filone_id]&&S.threads[s.filone_id].stato!=="chiuso")c[s.filone_id]=(c[s.filone_id]||0)+1});return Object.entries(c).sort((x,y)=>y[1]-x[1])}
function tName(id){const t=S.threads[id]||{};return t.breve||t.titolo||id}
function sentence(t){t=String(t||"").replace(/\s*\[\d+\]/g,"");const i=t.indexOf(". ");return (i>0?t.slice(0,i):t).replace(/\.$/,"")+"."}

/* ---------- pezzi riusati ---------- */
function crumb(items){return `<nav class="xp-crumb" aria-label="Sei qui">${items.map((it,i)=>i<items.length-1?`<button type="button" data-go="${it.p?esc(it.p.k+"|"+it.p.id):""}">${esc(it.l)}</button><span aria-hidden="true">›</span>`:`<span aria-current="page">${esc(it.l)}</span>`).join("")}</nav>`}
function threadCards(ranked,all){
  return ranked.map(([id,n])=>{const t=S.threads[id];const last=all.find(s=>s.filone_id===id);
    const nx=(S.agenda||[]).filter(a=>a.filone_id===id&&a.data>=today()).sort((x,y)=>x.data.localeCompare(y.data))[0];
    return `<button type="button" class="xp-th" data-thread="${esc(id)}"><span class="xp-tt">${typeof thFlags==="function"?thFlags(t):""} ${esc(t.breve||t.titolo)}</span>
      ${t.descrizione?`<span class="xp-td">${esc(t.descrizione)}</span>`:""}
      ${last?`<span class="xp-last"><span class="xp-ld">${esc(shortD(last.data))}</span>${esc(last.titolo)}</span>`:""}
      ${nx?`<span class="xp-nx">Prossima scadenza: ${esc(shortD(nx.data))}, ${esc(nx.titolo)}</span>`:""}
      <span class="xp-tn">${n} ${n===1?"storia":"storie"} negli ultimi 30 giorni</span></button>`}).join("");
}
function storyList(list){
  const shown=list.slice(0,X.lim);
  return (shown.map(s=>{const open=X.open===s.id;
    return `<div class="xp-item${open?" on":""}" id="xpi-${esc(s.id)}"><button type="button" class="xp-sv" data-xs="${esc(s.id)}" aria-expanded="${open}"><span class="xp-sd">${esc(fmtDate(s.data))}<span class="xp-tog">${open?"Chiudi ▴":"Leggi ▾"}</span></span><span class="xp-stt">${(s.paesi||[]).slice(0,3).map(flag).join("")} ${esc(s.titolo)}</span>${!open&&s.perche_conta?`<span class="xp-sp">${esc(sentence(s.perche_conta))}</span>`:""}</button>${open?`<div class="xp-open">${storyHTML(s,0).replace(/id="st-/g,'id="xst-')}<div class="xp-open-f"><button type="button" class="xp-lnk" data-xs="${esc(s.id)}">Chiudi la storia</button>${S.briefings.some(b=>(b.storie_mondo||[]).concat(b.storie_italia||[]).includes(s.id))?`<button type="button" class="xp-lnk" data-story="${esc(s.id)}">Vedi nel briefing del ${esc(fmtDate(s.data))}</button>`:""}</div></div>`:""}</div>`}).join("")||`<p class="xp-empty">Nessuna storia in questa selezione. Prova «Tutto».</p>`)
   +(list.length>shown.length?`<button type="button" class="xp-more" data-more="1">${X.lim<=4?`Tutte le ${list.length} storie`:`Altre ${Math.min(20,list.length-shown.length)}`}</button>`:"");
}
function myInterests(){
  const tags=F.aree.map(id=>["aree",id]).concat(F.temi.map(id=>["temi",id]),F.incroci.map(id=>["incroci",id])).filter(([k,id])=>fName(k,id));
  const goOf=(k,id)=>k==="aree"?`area|${id}`:k==="temi"?`tema|${id}`:`areachip|${id}`;
  return `<div class="xp-mine"><div class="pt-h"><b>Quello che segui</b><button type="button" data-int-open="1">Modifica</button></div>${tags.length?`<div class="xp-tags">${tags.map(([k,id])=>`<span class="xp-tag"><button type="button" data-go="${esc(goOf(k,id))}">${k==="temi"?AIC(id)+" ":""}${esc(fName(k,id))}</button><button type="button" class="x" data-follow="${k}|${esc(id)}" aria-label="Smetti di seguire ${esc(fName(k,id))}">✕</button></span>`).join("")}</div><p>Le storie del giorno su questi temi e aree compaiono in «Per te oggi», in cima al briefing.</p>`:`<p>Ancora niente. Apri un’area o un tema e tocca «Segui», oppure scegli tutto in un colpo da «Modifica».</p>`}</div>`;
}

/* ---------- pagine ---------- */
function mapCard(){return `<button type="button" class="xp-map" data-xmap="1"><span class="xp-map-i" aria-hidden="true">🗺</span><span><b>Vedi la mappa del mondo</b><span>I paesi colorati per livello di tensione, con le dinamiche tra loro</span></span><span aria-hidden="true">›</span></button>`}
function forYou(){
  const b=typeof currentBrief==="function"?currentBrief():null;
  const nav=`<div class="xp-jump"><a href="#xpExplore" data-xjump="1">Esplora per area o tema ↓</a>${mapCard()}</div>`;
  if(!anyF()){
    const sug=AREE.map(a=>({a,lv:lvArea(a)})).sort((x,y)=>y.lv-x.lv).slice(0,3);
    return `<h1 class="xp-h1" style="margin-top:12px">Per te</h1>
    <div class="xp-pt"><p>Scegli le aree e i temi che ti interessano: qui trovi ogni giorno le storie che li riguardano, anche quelle dei giorni passati.</p>
    <div class="pt-sug">${sug.map(x=>`<button type="button" data-follow="aree|${esc(x.a.id)}">☆ ${esc(x.a.n)}</button>`).join("")}</div>
    <button type="button" class="xp-cta" data-int-open="1">Scegli aree e temi</button></div><div class="xp-jump">${mapCard()}</div>`;
  }
  const names=F.aree.map(a=>fName("aree",a)).concat(F.temi.map(t=>fName("temi",t)),F.incroci.map(x=>fName("incroci",x))).filter(Boolean);
  const list=storiesWhere(s=>s.data>=ago(7)&&matchF(s));
  const br=b?(S.brevi||[]).filter(x=>(x.data===b.data||x.briefing===b.id)&&matchF(x)):[];
  return `<h1 class="xp-h1" style="margin-top:12px">Per te</h1>
  <p class="xp-ptsub">Segui ${esc(names.join(", "))} · <button type="button" class="xp-lnk" data-int-open="1">Modifica i tuoi interessi</button></p>
  <p class="xp-hs">Le storie degli ultimi 7 giorni su quello che segui, dalla più recente.</p>
  ${list.length?storyList(list):`<p class="xp-empty">Negli ultimi 7 giorni niente su quello che segui. Puoi aggiungere aree o temi da «Modifica i tuoi interessi».</p>`}
  ${br.length?`<p class="pt-sub">In breve, oggi</p>${br.map(x=>`<p class="pt-br"><span class="pt-f">${(x.paesi||[]).slice(0,2).map(flag).join("")}</span> ${esc(x.testo)}${x.fonte&&x.fonte.url?` <a href="${esc(x.fonte.url)}" target="_blank" rel="noopener">${esc(x.fonte.nome||"fonte")}</a>`:""}</p>`).join("")}`:""}
  ${nav}`;
}
function landing(){
  const st14=storiesWhere(s=>s.data>=ago(14)),st7=st14.filter(s=>s.data>=ago(7));
  let rows;
  if(X.mode==="area"){
    rows=AREE.map(a=>{const mine=st14.filter(s=>storyArea(s)===a.id);const top=rankThreads(mine).slice(0,2).map(([id])=>tName(id));
      return {k:"area",id:a.id,n:a.n,lv:lvArea(a),now:top.join(" · ")||"Nessun tema aperto nelle ultime due settimane",c:st7.filter(s=>storyArea(s)===a.id).length,f:follows("aree",a.id)}})
      .sort((x,y)=>y.lv-x.lv||y.c-x.c);
  }else{
    rows=TAX.map(a=>{const mine=st14.filter(s=>topics(s).a.includes(a.id));const top=rankThreads(mine).slice(0,2).map(([id])=>tName(id));
      return {k:"tema",id:a.id,n:a.n,lv:0,now:top.join(" · ")||"Nessun tema aperto nelle ultime due settimane",c:st7.filter(s=>topics(s).a.includes(a.id)).length,f:follows("temi",a.id),ic:AIC(a.id)}})
      .sort((x,y)=>y.c-x.c);
  }
  const mx=Math.max(1,...rows.map(r=>r.c));
  return `${forYou()}
  <h2 class="xp-h2" id="xpExplore">Esplora per area o per tema</h2>
  <p class="xp-lead">Scegli un’area o un tema: trovi il punto della settimana, le partite aperte e gli ultimi sviluppi, dal quadro generale alla singola storia.</p>
  <div class="xp-seg" role="group" aria-label="Esplora per"><button type="button" data-mode="area" aria-pressed="${X.mode==="area"}">Per area</button><button type="button" data-mode="tema" aria-pressed="${X.mode==="tema"}">Per tema</button></div>
  ${rows.map(r=>`<button type="button" class="xp-row" data-go="${r.k}|${esc(r.id)}"><span class="xp-bar" style="${r.k==="area"?`background:${LVC(r.lv)}`:`background:var(--accent);opacity:${(0.25+0.75*r.c/mx).toFixed(2)}`}"></span>
    <span class="xp-body"><span class="xp-n">${r.ic?r.ic+" ":""}${esc(r.n)}</span><span class="xp-now">${esc(r.now)}</span></span>
    <span class="xp-meta">${r.k==="area"&&r.lv?`<span class="xp-lv" style="background:color-mix(in srgb,${LVC(r.lv)} 40%,transparent)">${LVT[r.lv]}</span>`:""}<span class="xp-c">${r.c} ${r.c===1?"storia":"storie"} in 7 giorni</span>${r.f?`<span class="xp-star">★ segui</span>`:""}</span></button>`).join("")}
  <p class="xp-note">${X.mode==="area"?"La barra a sinistra ha il colore del paese più teso dell’area, sulla stessa scala della mappa (da 1, stabile, a 5, guerra).":"La barra è più intensa per i temi con più storie negli ultimi 7 giorni."}</p>
  <h2 class="xp-h2">Le tue preferenze</h2>
  ${myInterests()}`;
}

function areaPage(A){
  const all=storiesWhere(s=>storyArea(s)===A.id),st30=all.filter(s=>s.data>=ago(30));
  const hot=A.codes.filter(c=>S.countries[c]).sort((x,y)=>(+S.countries[y].livello||0)-(+S.countries[x].livello||0)).slice(0,6);
  const ranked=rankThreads(st30).slice(0,3);
  const pb=(S.briefings||[]).find(b=>b.punto_aree&&b.punto_aree.aree&&b.punto_aree.aree[A.id]);
  const pa=pb?pb.punto_aree.aree[A.id]:null;
  const inb=pa?"":ranked.map(([id])=>sentence((S.threads[id]||{}).descrizione)).filter(x=>x.length>2).join(" ");
  const tc={};st30.forEach(s=>topics(s).a.forEach(a=>{if(AMBN[a])tc[a]=(tc[a]||0)+1}));
  const chips=Object.entries(tc).sort((x,y)=>y[1]-x[1]);
  const list=X.chip?all.filter(s=>topics(s).a.includes(X.chip)):all;
  return `${crumb([{l:"Esplora",p:null},{l:A.n}])}
  <div class="xp-hdr"><h1 class="xp-h1">${esc(A.n)}</h1>${followBtn("aree",A.id)}</div>
  ${hot.length?`<div class="xp-pills">${hot.map(c=>{const l=+S.countries[c].livello||0;return `<button type="button" class="xp-pill" data-go="paese|${c}">${flag(c)} ${esc(cName(c))}<i style="background:${LVC(l)}">${l}</i></button>`}).join("")}</div>`:""}
  ${pa?`<h2 class="xp-h2">Il punto della settimana</h2><p class="xp-hs">Aggiornato ${esc(fmtDate(pb.punto_aree.aggiornato||pb.data))}</p><p class="xp-ib">${refText(pa.testo,pa.fonti)}</p>`:inb?`<h2 class="xp-h2">In breve</h2><p class="xp-ib">${esc(inb)}</p>`:""}
  ${ranked.length?`<h2 class="xp-h2">Le partite aperte</h2><p class="xp-hs">Dalla più attiva nell’ultimo mese. Tocca per la storia completa del tema.</p>${threadCards(ranked,all)}`:""}
  <h2 class="xp-h2">Ultimi sviluppi</h2>
  ${chips.length>1?`<div class="xp-filt"><div class="xp-chips" role="group" aria-label="Restringi per tema"><button type="button" class="xp-chip" data-chip="" aria-pressed="${!X.chip}">Tutti i temi</button>${chips.map(([k,c])=>`<button type="button" class="xp-chip" data-chip="${esc(k)}" aria-pressed="${X.chip===k}">${AIC(k)} ${esc(AMBN[k])}<span>${c}</span></button>`).join("")}</div></div>`:""}
  ${X.chip?`<div class="xp-also"><span>Vuoi ritrovare ${esc(AMBN[X.chip])} ogni mattina in «Per te»?</span>${followBtn("incroci",A.id+"~"+X.chip,"solo in quest’area")}${followBtn("temi",X.chip,"in tutte le aree")}<button type="button" class="xp-lnk" data-go="tema|${esc(X.chip)}">Apri il tema</button></div>`:""}
  ${storyList(list)}`;
}

function temaPage(T){
  const all=storiesWhere(s=>topics(s).a.includes(T.id)),st30=all.filter(s=>s.data>=ago(30));
  const ac={};st30.forEach(s=>{const a=storyArea(s);if(a)ac[a]=(ac[a]||0)+1});
  const areas=Object.entries(ac).sort((x,y)=>y[1]-x[1]);
  const ranked=rankThreads(st30).slice(0,3);
  const inb=ranked.map(([id])=>sentence((S.threads[id]||{}).descrizione)).filter(x=>x.length>2).join(" ");
  const subc={};all.forEach(s=>topics(s).s.forEach(k=>{if(T.sotto.some(([x])=>x===k))subc[k]=(subc[k]||0)+1}));
  const list=X.chip?all.filter(s=>X.chip.startsWith("a:")?storyArea(s)===X.chip.slice(2):topics(s).s.includes(X.chip)):all;
  const ach=X.chip&&X.chip.startsWith("a:")?X.chip.slice(2):"";
  return `${crumb([{l:"Esplora",p:null},{l:T.n}])}
  <div class="xp-hdr"><h1 class="xp-h1">${AIC(T.id)} ${esc(T.n)}</h1>${followBtn("temi",T.id)}</div>
  ${areas.length?`<p class="xp-hs" style="margin:2px 0 4px">Dove se ne parla di più nell’ultimo mese</p><div class="xp-pills">${areas.map(([a,n])=>`<button type="button" class="xp-pill" data-go="area|${esc(a)}">${esc(AREABY[a].n)}<i style="background:var(--accent);color:var(--bg)">${n}</i></button>`).join("")}</div>`:""}
  ${inb?`<h2 class="xp-h2">In breve</h2><p class="xp-ib">${esc(inb)}</p>`:""}
  ${ranked.length?`<h2 class="xp-h2">Le partite aperte</h2><p class="xp-hs">Dalla più attiva nell’ultimo mese. Tocca per la storia completa del tema.</p>${threadCards(ranked,all)}`:""}
  <h2 class="xp-h2">Ultimi sviluppi</h2>
  <div class="xp-filt"><div class="xp-chips" role="group" aria-label="Restringi"><button type="button" class="xp-chip" data-chip="" aria-pressed="${!X.chip}">Tutto</button>${areas.map(([a,n])=>`<button type="button" class="xp-chip" data-chip="a:${esc(a)}" aria-pressed="${X.chip==="a:"+a}">${esc(AREABY[a].n)}<span>${n}</span></button>`).join("")}${Object.entries(subc).sort((x,y)=>y[1]-x[1]).map(([k,n])=>`<button type="button" class="xp-chip" data-chip="${esc(k)}" aria-pressed="${X.chip===k}">${esc(SUBN[k])}<span>${n}</span></button>`).join("")}</div></div>
  ${ach?`<div class="xp-also"><span>Vuoi ritrovare ${esc(T.n)} in ${esc(AREABY[ach].n)} ogni mattina in «Per te»?</span>${followBtn("incroci",ach+"~"+T.id,"solo quest’incrocio")}${followBtn("aree",ach,"tutta l’area")}<button type="button" class="xp-lnk" data-go="area|${esc(ach)}">Apri l’area</button></div>`:""}
  ${storyList(list)}`;
}

function paesePage(iso){
  const c=S.countries[iso];const A=AREABY[AREA_OF[iso]];
  const all=storiesWhere(s=>(s.paesi||[]).includes(iso));
  const ranked=rankThreads(all.filter(s=>s.data>=ago(30))).slice(0,3);
  const lv=c?+c.livello||0:0;
  const dyn=(c&&Array.isArray(c.dinamiche))?c.dinamiche.slice(0,4):[];
  return `${crumb([{l:"Esplora",p:null}].concat(A?[{l:A.n,p:{k:"area",id:A.id}}]:[]).concat([{l:cName(iso)}]))}
  <div class="xp-hdr"><h1 class="xp-h1">${flag(iso)} ${esc(cName(iso))}</h1>${A?followBtn("aree",A.id,"l’area"):""}</div>
  ${lv?`<div class="xp-pills"><span class="xp-pill" style="cursor:default">Livello di tensione<i style="background:${LVC(lv)}">${lv}</i>${esc(LVT[lv]||"")}</span></div>`:""}
  ${c&&c.sintesi?`<h2 class="xp-h2">La situazione</h2><p class="xp-ib">${esc(String(c.sintesi).replace(/\s*\[\d+\]/g,""))}</p>`:""}
  ${dyn.length?`<h2 class="xp-h2">Con chi è in gioco</h2><ul class="xp-dyn">${dyn.map(d=>`<li>${d.con?`<button type="button" data-go="paese|${esc(d.con)}">${flag(d.con)} ${esc(cName(d.con))}</button>: `:""}${esc(d.testo||"")}</li>`).join("")}</ul>`:""}
  ${ranked.length?`<h2 class="xp-h2">Le partite aperte</h2>${threadCards(ranked,all)}`:""}
  <h2 class="xp-h2">Ultimi sviluppi</h2>${storyList(all)}
  <p style="margin:18px 0 0"><button type="button" class="xp-lnk" data-country="${esc(iso)}">Vedi ${esc(cName(iso))} sulla mappa</button></p>`;
}

function renderEx(){
  const el=document.getElementById("esplora");if(!el)return;
  const p=X.page;let h="";
  if(p&&p.k==="area"&&AREABY[p.id])h=areaPage(AREABY[p.id]);
  else if(p&&p.k==="tema"&&TAX.find(t=>t.id===p.id))h=temaPage(TAX.find(t=>t.id===p.id));
  else if(p&&p.k==="paese")h=paesePage(p.id);
  else{X.page=null;h=landing()}
  el.innerHTML=h;
}

document.addEventListener("click",e=>{
  const root=e.target.closest("#esplora");if(!root)return;
  const f=e.target.closest("[data-follow]");if(f){const [k,id]=f.dataset.follow.split("|");toggleF(k,id);renderEx();try{perTe()}catch(_){}return}
  const m=e.target.closest("[data-mode]");if(m){X.mode=m.dataset.mode;renderEx();return}
  const g=e.target.closest("[data-go]");if(g){const v=g.dataset.go;if(!v){go(null);return}const i=v.indexOf("|");const k=v.slice(0,i),id=v.slice(i+1);
    if(k==="areachip"){const [a,t]=splitX(id);go({k:"area",id:a});X.chip=t;renderEx();return}
    go({k,id});return}
  const xs=e.target.closest("[data-xs]");if(xs){const id=xs.dataset.xs;
    if(S.guest&&X.open!==id){const b0=S.briefings[0];const mi=b0?(b0.storie_mondo||[]).indexOf(id):-1;if(!(b0&&mi>=0&&mi<3)){if(typeof showLock==="function")showLock({what:"storie"});return}}
    X.open=X.open===id?null:id;renderEx();
    const it=document.getElementById("xpi-"+id);if(it){const off=document.querySelector("header.top").offsetHeight+8;window.scrollTo({top:it.getBoundingClientRect().top+window.scrollY-off,behavior:"smooth"})}
    return}
  const c=e.target.closest("[data-chip]");if(c){X.chip=c.dataset.chip;X.open=null;renderEx();return}
  if(e.target.closest("[data-more]")){X.lim=X.lim<=4?20:X.lim+20;renderEx();return}
});

/* ---------- pannello «I tuoi interessi» ---------- */
const panel=document.createElement("div");panel.id="intPanel";panel.hidden=true;panel.setAttribute("role","dialog");panel.setAttribute("aria-modal","true");panel.setAttribute("aria-labelledby","intPTitle");
document.body.appendChild(panel);
const PE={open:null,some:{}};
function areaMode(id){if(F.aree.includes(id))return "tutto";if(F.incroci.some(x=>splitX(x)[0]===id)||PE.some[id])return "alcuni";return "no"}
function areaTemi(id){return F.incroci.filter(x=>splitX(x)[0]===id).map(x=>splitX(x)[1])}
function setMode(id,m){
  F.aree=F.aree.filter(x=>x!==id);
  if(m!=="alcuni"){F.incroci=F.incroci.filter(x=>splitX(x)[0]!==id);delete PE.some[id]}else PE.some[id]=true;
  if(m==="tutto")F.aree.push(id);
  saveF();
}
function nowOf(a){const st=storiesWhere(s=>s.data>=ago(14)&&storyArea(s)===a.id);return rankThreads(st).slice(0,2).map(([id])=>tName(id)).join(" · ")}
function todayMatches(){
  const b=S.briefings&&S.briefings[0];if(!b)return {st:[],br:[]};
  const st=(b.storie_mondo||[]).concat(b.storie_italia||[]).map(id=>S.stories[id]).filter(Boolean).filter(matchF);
  const br=(S.brevi||[]).filter(x=>(x.data===b.data||x.briefing===b.id)&&matchF(x));
  return {st,br};
}
function renderPanel2(){
  const rows=AREE.map(a=>{const m=areaMode(a.id),lv=lvArea(a),open=PE.open===a.id,ts=areaTemi(a.id);
    const state=m==="tutto"?"Tutto":m==="alcuni"?(ts.length?ts.map(t=>AMBN[t]).join(", "):"Scegli i temi"):"Non segui";
    return `<div class="ia${open?" open":""}${m!=="no"?" on":""}">
      <button type="button" class="ia-h" data-pa="${esc(a.id)}" aria-expanded="${open}">
        <span class="ia-bar" style="background:${LVC(lv)}"></span>
        <span class="ia-t"><span class="ia-n">${esc(a.n)}</span><span class="ia-now">${esc(nowOf(a)||"Poche novità nelle ultime due settimane")}</span></span>
        <span class="ia-s">${esc(state)}<span aria-hidden="true">${open?"▴":"▾"}</span></span></button>
      ${open?`<div class="ia-b"><div class="xp-seg" role="group" aria-label="Cosa seguire in ${esc(a.n)}">${[["no","Niente"],["tutto","Tutto"],["alcuni","Solo alcuni temi"]].map(([k,l])=>`<button type="button" data-pm="${esc(a.id)}|${k}" aria-pressed="${m===k}">${l}</button>`).join("")}</div>
        ${m==="alcuni"?`<div class="ia-chips">${TAX.map(t=>`<button type="button" class="xp-chip" data-pt2="${esc(a.id)}|${t.id}" aria-pressed="${ts.includes(t.id)}">${AIC(t.id)} ${esc(t.n)}</button>`).join("")}</div>`:""}
        ${m==="tutto"?`<p class="ip-hint">Ogni storia e ogni breve di quest’area compare in «Per te».</p>`:""}</div>`:""}
    </div>`}).join("");
  const {st,br}=todayMatches();
  panel.innerHTML=`<div class="ip-box">
   <div class="ip-top"><h2 id="intPTitle">I tuoi interessi</h2><button type="button" class="xp-follow" data-pclose="1" aria-pressed="true">Fatto</button></div>
   <p class="ip-hint">Scegli cosa vuoi trovare ogni mattina in «Per te oggi», in cima al briefing. Il briefing resta completo per tutti.</p>
   <h3>Le aree del mondo</h3><p class="ip-hint" style="margin-top:0">Tocca un’area: puoi seguirla tutta o solo per alcuni temi.</p>${rows}
   <h3>Temi da seguire ovunque</h3><p class="ip-hint" style="margin-top:0">Questi li ritrovi qualunque sia l’area.</p>
   <div class="ia-chips">${TAX.map(t=>`<button type="button" class="xp-chip" data-pf="temi|${t.id}" aria-pressed="${follows("temi",t.id)}">${AIC(t.id)} ${esc(t.n)}</button>`).join("")}</div>
   <h3>Con queste scelte, oggi vedresti</h3>
   ${anyF()?(st.length||br.length?`<ul class="ip-prev">${st.slice(0,5).map(s=>`<li>${(s.paesi||[]).slice(0,3).map(flag).join("")} ${esc(s.titolo)}</li>`).join("")}${st.length>5?`<li class="m">e altre ${st.length-5} storie</li>`:""}${br.length?`<li class="m">più ${br.length} ${br.length===1?"breve":"brevi"} dalle tue aree e dai tuoi temi</li>`:""}</ul>`:`<p class="ip-hint">Oggi niente su queste scelte. Lo trovi in «Per te» quando succede.</p>`):`<p class="ip-hint">Non segui ancora niente.</p>`}
  </div>`;
}
function openPanel(){renderPanel2();panel.hidden=false;document.body.style.overflow="hidden";const f=panel.querySelector("[data-pclose]");if(f)f.focus()}
function closePanel(){panel.hidden=true;document.body.style.overflow="";Object.keys(PE.some).forEach(id=>{if(!areaTemi(id).length)delete PE.some[id]});try{perTe()}catch(_){}if(S.view==="esplora")renderEx()}
panel.addEventListener("click",e=>{
  if(e.target===panel||e.target.closest("[data-pclose]")){closePanel();return}
  const h=e.target.closest("[data-pa]");if(h){PE.open=PE.open===h.dataset.pa?null:h.dataset.pa;renderPanel2();return}
  const m=e.target.closest("[data-pm]");if(m){const [id,k]=m.dataset.pm.split("|");setMode(id,k);renderPanel2();return}
  const c=e.target.closest("[data-pt2]");if(c){const [id,t]=c.dataset.pt2.split("|");toggleF("incroci",id+"~"+t);if(areaTemi(id).length)delete PE.some[id];else PE.some[id]=true;renderPanel2();return}
  const r=e.target.closest("[data-pf]");if(r){const v=r.dataset.pf;const i=v.indexOf("|");toggleF(v.slice(0,i),v.slice(i+1));renderPanel2();return}
});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!panel.hidden)closePanel()});
document.addEventListener("click",e=>{if(e.target.closest("[data-int-open]")){e.preventDefault();openPanel()}});
{const g=document.getElementById("guideBtn");if(g&&!document.getElementById("intBtn")){const b=document.createElement("button");b.className="prefbtn";b.id="intBtn";b.type="button";b.setAttribute("data-int-open","1");b.textContent="★ Interessi";g.parentNode.insertBefore(b,g)}}

/* ---------- "Per te oggi" nel briefing ---------- */
function perTe(){
  const el=document.getElementById("briefing");if(!el)return;
  const old=el.querySelector(".pt-box");if(old)old.remove();
  const b=typeof currentBrief==="function"?currentBrief():null;if(!b)return;
  const box=document.createElement("div");box.className="pt-box";
  if(anyF()){
    const ids=(b.storie_mondo||[]).concat(b.storie_italia||[]);
    const st=ids.map(id=>S.stories[id]).filter(Boolean).filter(matchF);
    const br=(S.brevi||[]).filter(x=>(x.data===b.data||x.briefing===b.id)&&matchF(x));
    const names=F.aree.map(a=>fName("aree",a)).concat(F.temi.map(t=>fName("temi",t)),F.incroci.map(x=>fName("incroci",x))).filter(Boolean);
    box.innerHTML=`<div class="pt-h"><b>Per te oggi</b><button type="button" data-pt-manage="1">Gestisci</button></div>
      <p class="pt-seg">Segui ${esc(names.join(", "))}</p>
      ${st.map(s=>`<button type="button" class="pt-st" data-story="${esc(s.id)}"><span class="pt-f">${(s.paesi||[]).slice(0,3).map(flag).join("")}</span><span>${esc(s.titolo)}</span></button>`).join("")}
      ${br.length?`<p class="pt-sub">In breve</p>${br.map(x=>`<p class="pt-br"><span class="pt-f">${(x.paesi||[]).slice(0,2).map(flag).join("")}</span> ${esc(x.testo)}${x.fonte&&x.fonte.url?` <a href="${esc(x.fonte.url)}" target="_blank" rel="noopener">${esc(x.fonte.nome||"fonte")}</a>`:""}</p>`).join("")}`:""}
      ${!st.length&&!br.length?`<p class="pt-n">Oggi niente su quello che segui, né tra le storie né tra le brevi.</p>`:""}
      <button type="button" class="pt-open" data-pt-open="1">Apri «Per te» in Esplora: anche i giorni passati ›</button>`;
  }else{
    const sug=AREE.map(a=>({a,lv:lvArea(a)})).sort((x,y)=>y.lv-x.lv).slice(0,3);
    box.innerHTML=`<div class="pt-h"><b>Per te oggi</b></div>
      <p class="pt-n">Segui un’area o un tema e qui trovi ogni mattina le storie che ti riguardano. Per esempio:</p>
      <div class="pt-sug">${sug.map(x=>`<button type="button" data-pt-follow="${esc(x.a.id)}">☆ ${esc(x.a.n)}</button>`).join("")}<button type="button" data-pt-manage="1" style="border:0">Scegli aree e temi</button></div>
      <button type="button" class="pt-open" data-pt-open="1">Oppure esplora per area o per tema ›</button>`;
  }
  const in60=el.querySelector(".in60");
  if(in60&&in60.parentNode)in60.parentNode.insertBefore(box,in60.nextSibling);else{const sub=el.querySelector("#subtabs");if(sub)sub.parentNode.insertBefore(box,sub);else el.prepend(box)}
}
document.addEventListener("click",e=>{
  if(e.target.closest("[data-pt-manage]")){openPanel();return}
  const f=e.target.closest("[data-pt-follow]");if(f){toggleF("aree",f.dataset.ptFollow);perTe();return}
});
const _rb=renderBriefing;
renderBriefing=function(){const r=_rb.apply(this,arguments);try{perTe()}catch(e){console.warn("per te",e)}return r};
const _ra=renderAll;
renderAll=function(){const r=_ra.apply(this,arguments);try{if(S.view==="esplora")renderEx()}catch(e){console.warn("esplora",e)}return r};
{const p=parse(location.hash);if(p!==undefined){X.page=p;if(p&&p.k==="tema")X.mode="tema";_show("esplora",false);renderEx();const top0=()=>window.scrollTo(0,0);setTimeout(top0,0);window.addEventListener("load",()=>setTimeout(top0,50),{once:true})}}
})();
