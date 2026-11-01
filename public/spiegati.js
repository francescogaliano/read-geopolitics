/* Spiegati: le notizie che tornano, spiegate da zero.
   Elenco in /spiegati.json. Questo file aggiunge gli Spiegati alle parti del sito che esistono già:
   riga nella storia, puntini sulla mappa, riga nella scheda paese, voce «Spiegati» in Esplora,
   «Da zero» nei Temi, rimando nel glossario. Legge i dati del sito da S (stories, threads, briefings). */
(function(){
"use strict";
var SP=[];var G="#E8B050";
var MESI=["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto","settembre","ottobre","novembre","dicembre"];
function e(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function st(){try{return window.RG_SP?window.RG_SP.dati():null}catch(_){return null}}
function dl(iso){var p=String(iso||"").split("-");return p.length===3?(+p[2])+" "+MESI[+p[1]-1]:""}
function prog(x){try{return Math.max(0,Math.min(1,+(localStorage.getItem("rg-sp-"+x.id)||0)))}catch(_){return 0}}
function temaNome(x){var s=st();var t=s&&s.threads&&s.threads[x.tema];return (t&&t.titolo)||x.temaNome||""}
function hot(x){var s=st();if(!s||!s.briefings||!s.briefings[0]||!s.stories)return false;var b=s.briefings[0];
 var ids=[].concat(b.storie_mondo||[],b.storie_italia||[],b.storie||[]);
 return ids.some(function(id){var y=s.stories[id];if(!y)return false;if(y.filone_id===x.tema)return true;var t=s.threads&&s.threads[y.filone_id];return !!(t&&t.padre===x.tema)})}
function track(n){try{if(window.RG_SP)window.RG_SP.traccia(n)}catch(_){}}

var css=document.createElement("style");css.textContent=
".sp-lab{display:inline-flex;align-items:center;gap:4px;margin:8px 0 2px;font:600 13px var(--sans);color:"+G+";text-decoration:none}"+
".sp-prow{display:flex;justify-content:space-between;gap:10px;align-items:center;padding:12px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);margin:10px 0;color:inherit;text-decoration:none}"+
".sp-prow .k{display:block;font:600 10.5px var(--mono);letter-spacing:.1em;text-transform:uppercase;color:"+G+"}.sp-prow b{font-weight:600;font-size:15px}.sp-prow small{display:block;color:var(--muted);font-size:12.5px}"+
"@keyframes spPulse{0%{r:6px;opacity:.9}100%{r:22px;opacity:0}}"+
".sp-dot .halo,.sp-dot .core{fill:"+G+"}.sp-dot .core{stroke:#0E151B;stroke-width:2px}.spx .sp-dot .halo{animation:spPulse 1.8s ease-out infinite}"+
"#mapBox svg.sp-on path,#mapBox svg.sp-on line{opacity:.35}#mapBox svg.sp-on .sp-dot circle{opacity:1}"+
"@media (prefers-reduced-motion:reduce){.sp-dot .halo{animation:none;opacity:.3}}"+
".sp-lens[aria-pressed=true]{color:"+G+";font-weight:600}"+
".sp-gl{display:block;margin-top:8px;padding-top:8px;border-top:1px solid var(--line);font-size:13.5px;color:"+G+";text-decoration:none}"+
".sp-path ol{list-style:none;margin:6px 0 10px;padding:0}.sp-path li{display:grid;grid-template-columns:30px minmax(0,1fr);gap:10px;padding:10px 0;border-bottom:1px solid var(--line)}.sp-path li:last-child{border-bottom:0}"+
".sp-path .n{width:24px;height:24px;border-radius:50%;border:2px solid var(--line);color:var(--muted);display:flex;align-items:center;justify-content:center;font:600 12px var(--mono)}"+
".sp-path li.rd .n{border-color:#7FD1A0;color:#7FD1A0}.sp-path li.nx .n{border-color:"+G+";color:"+G+"}.sp-path li.nx b{color:"+G+"}"+
".sp-path a{color:inherit;text-decoration:none}.sp-path b{font-size:15px;font-weight:600}.sp-path small{display:block;color:var(--muted);font-size:12.5px}"+
".spx h2{font:600 26px/1.15 var(--serif);margin:14px 0 4px}.spx .prom{margin:0 0 12px;color:var(--muted)}"+
".spx .srch{display:flex;gap:8px;align-items:center;border:1px solid var(--line);background:var(--surface);border-radius:10px;padding:0 12px;margin:8px 0 4px}"+
".spx .srch input{flex:1;min-width:0;border:0;background:none;color:var(--ink);font:16px var(--sans);padding:12px 0;outline:none}"+
".spx .hint{font-size:13px;color:var(--muted);margin:0 0 4px}.spx .hint button{all:unset;cursor:pointer;color:var(--accent);margin-right:12px}"+
".spx .sec{font:600 11px var(--mono);letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin:22px 0 2px;padding-bottom:8px;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;gap:8px}"+
".spx .sec .t{color:var(--ink);font:600 18px var(--serif);letter-spacing:0;text-transform:none}"+
".spx .card{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:4px 14px;margin-top:10px}"+
".spx .card .ph{display:flex;justify-content:space-between;gap:8px;padding:10px 0 2px}.spx .card .ph b{font:600 16px var(--serif)}.spx .card .ph span{font:500 11px var(--mono);color:var(--muted);text-transform:uppercase;letter-spacing:.08em}"+
".spx .sit{border-bottom:1px solid var(--line)}.spx .sit>button{all:unset;box-sizing:border-box;width:100%;cursor:pointer;display:grid;grid-template-columns:44px minmax(0,1fr) 16px;gap:12px;padding:12px 0}"+
".spx .sth{width:44px;height:44px;border-radius:8px;background:var(--surface);border:1px solid var(--line);display:flex;align-items:center;justify-content:center;font-size:20px}"+
".spx .sit .sq{display:block;font-weight:600;font-size:15.5px;line-height:1.3}.spx .sit .sm{display:block;font-size:12.5px;color:var(--muted);margin-top:3px}.spx .sit .sm .live{color:"+G+"}.spx .sit .sm .done{color:#7FD1A0}"+
".spx .schev{color:var(--muted);transition:transform .2s}.spx .sit.open .schev{transform:rotate(90deg)}"+
".spx .sbar{display:block;height:3px;background:var(--line);margin-top:6px;border-radius:2px;overflow:hidden}.spx .sbar i{display:block;height:100%;background:"+G+"}"+
".spx .sdet{display:none;padding:0 0 14px 56px}.spx .sit.open .sdet{display:block}.spx .sdet p{margin:0 0 8px;font-size:14.5px}.spx .sdet ol{margin:0 0 10px;padding-left:18px;font-size:14px;color:var(--muted)}"+
".spx .sdet a{display:flex;justify-content:space-between;min-height:44px;align-items:center;border-top:1px solid var(--line);color:"+G+";text-decoration:none;font-weight:600;font-size:14.5px}.spx .sdet a span{color:var(--muted);font-weight:400;font-size:12.5px}"+
"@media(max-width:420px){.spx .sdet{padding-left:0}}"+
".spx .fil{display:flex;justify-content:space-between;align-items:center;gap:10px;border-bottom:1px solid var(--line);flex-wrap:wrap}"+
".spx .tabs2{display:flex;gap:16px;overflow-x:auto;scrollbar-width:none}.spx .tabs2 button,.spx .vw button{all:unset;cursor:pointer;flex:none;padding:10px 0 8px;color:var(--muted);border-bottom:2px solid transparent;font-size:14px}"+
".spx .tabs2 button.on,.spx .vw button.on{color:var(--ink);border-bottom-color:var(--accent)}.spx .vw{display:flex;gap:14px}"+
".spx .mapv{border-bottom:1px solid var(--line);padding:8px 0}.spx .mapv svg{width:100%;height:auto;display:block;border-radius:10px;background:var(--surface)}"+
".spx .ask{display:flex;justify-content:space-between;gap:12px;align-items:center;padding:16px 0;border-bottom:1px solid var(--line)}.spx .ask b{font:600 16px var(--serif)}.spx .ask p{margin:2px 0 0;font-size:13.5px;color:var(--muted)}.spx .ask button{all:unset;cursor:pointer;color:"+G+";font-weight:600;white-space:nowrap}"+
".spx .empty{padding:16px 0;color:var(--muted)}";
document.head.appendChild(css);

/* ---------- sezione in Esplora ---------- */
function itHTML(x){var p=prog(x);var stt=p>=0.97?'<span class="done">✓ letto</span>':p>0?'letto al '+Math.round(p*100)+'%':'';
 var meta=[temaNome(x),'al '+dl(x.data),x.min+' min'].filter(Boolean).join(' · ')+(hot(x)?' · <span class="live">● si muove oggi</span>':'')+(stt?' · '+stt:'');
 return '<div class="sit" data-id="'+e(x.id)+'"><button type="button"><span class="sth">'+e(x.ico||"📖")+'</span><span><span class="sq">'+e(x.q)+'</span><span class="sm">'+meta+'</span>'+(p>0&&p<0.97?'<span class="sbar"><i style="width:'+Math.round(p*100)+'%"></i></span>':'')+'</span><span class="schev">›</span></button>'+
 '<div class="sdet"><p>'+e(x.breve)+'</p><ol>'+(x.cap||[]).map(function(c){return '<li>'+e(c)+'</li>'}).join('')+'</ol><a href="'+e(x.url)+'">'+(p>0&&p<0.97?'Riprendi da dove eri':'Leggi lo Spiegato')+' <span>'+x.min+' min ›</span></a></div></div>'}
function percorsi(){var by={};SP.forEach(function(x){(by[x.tema]=by[x.tema]||[]).push(x)});
 return Object.keys(by).map(function(t){var L=by[t].slice().sort(function(a,b){return a.data<b.data?-1:1});var lt=L.filter(function(x){return prog(x)>=0.97}).length;var nx=L.filter(function(x){return prog(x)<0.97})[0];
  return '<div class="card sp-path"><div class="ph"><b>'+e(temaNome(L[0]))+'</b><span>'+lt+' di '+L.length+' letti</span></div>'+pathOl(L,nx)+'</div>'}).join("")}
function pathOl(L,nx){return '<ol>'+L.map(function(x,i){var rd=prog(x)>=0.97;return '<li class="'+(rd?'rd':x===nx?'nx':'')+'"><span class="n">'+(rd?'✓':i+1)+'</span><a href="'+e(x.url)+'"><b>'+e(x.q)+'</b><small>'+(x===nx?'il prossimo da leggere · ':'')+'al '+dl(x.data)+' · '+x.min+' min</small></a></li>'}).join('')+'</ol>'}
var ST={q:"",a:"",view:"list"};
function section(){var ex=document.getElementById("esplora");if(!ex)return;
 var areas=[];SP.forEach(function(x){if(x.area&&areas.indexOf(x.area)<0)areas.push(x.area)});
 var short=function(a){return a.replace(" e Nord Africa","").replace(" ed Europa orientale","")};
 ex.innerHTML='<div class="spx">'+
 '<h2>💡 Spiegati</h2><p class="prom">Le notizie che tornano ogni giorno, spiegate da zero. Una domanda, pochi minuti, con la mappa. Ogni Spiegato è fermo alla sua data; nella pagina trovi cosa è successo da allora.</p>'+
 '<div class="srch"><span aria-hidden="true">🔍</span><input id="spQ" type="search" placeholder="Cosa vuoi capire? Es. tregua, Oleshky…" autocomplete="off" value="'+e(ST.q)+'"></div>'+
 '<div id="spTop">'+
 '<div class="sec"><span class="t">Si muovono oggi</span><span>il tema ha novità di oggi</span></div><div id="spHot"></div>'+
 '<div class="sec"><span class="t">Percorsi</span><span>un tema dall\'inizio</span></div>'+percorsi()+
 '</div>'+
 '<div class="sec"><span class="t">Tutti gli Spiegati</span><span id="spCnt"></span></div>'+
 '<div class="fil"><div class="tabs2" id="spTabs"><button type="button" data-a="" class="'+(ST.a?'':'on')+'">Tutti</button>'+areas.map(function(a){return '<button type="button" data-a="'+e(a)+'" class="'+(ST.a===a?'on':'')+'">'+e(short(a))+'</button>'}).join('')+'</div><div class="vw"><button type="button" data-v="list" class="'+(ST.view==="list"?"on":"")+'">Elenco</button><button type="button" data-v="map" class="'+(ST.view==="map"?"on":"")+'">Mappa</button></div></div>'+
 '<div class="mapv" id="spMap" style="display:'+(ST.view==="map"?"block":"none")+'"><svg viewBox="0 0 760 400" id="spSvg"></svg><p class="hint" style="margin-top:6px">Tocca un punto per vedere lo Spiegato di quel luogo.</p></div>'+
 '<div id="spList"></div>'+
 '<div class="ask"><span><b>Non trovi quello che vuoi capire?</b><p>Scrivi la tua domanda: le più richieste diventano uno Spiegato.</p></span><button type="button" data-sp-ask="1">Proponi ›</button></div></div>';
 fill();track("vista-spiegati")}
function fill(){var q=ST.q.trim().toLowerCase();
 var L=SP.filter(function(x){return (!ST.a||x.area===ST.a)&&(!q||(x.q+" "+x.tit+" "+(x.kw||"")+" "+temaNome(x)).toLowerCase().indexOf(q)>=0)});
 var hb=document.getElementById("spHot");if(!hb)return;var H=SP.filter(hot);
 hb.innerHTML=H.length?H.map(itHTML).join(""):'<div class="empty">Oggi nessuno dei temi spiegati ha novità.</div>';
 document.getElementById("spTop").style.display=q?"none":"";
 document.getElementById("spList").innerHTML=L.length?L.map(itHTML).join(""):'<div class="empty">Nessuno Spiegato su «'+e(ST.q)+'» per ora. <button type="button" data-sp-ask="1" style="all:unset;cursor:pointer;color:'+G+'">Proponi questa domanda ›</button></div>';
 document.getElementById("spCnt").textContent=L.length+(L.length===1?" spiegato":" spiegati");
 if(ST.view==="map")drawMini(L)}
var TOPO=null;
function drawMini(L){var svg=document.getElementById("spSvg");if(!svg||typeof d3==="undefined"||typeof topojson==="undefined")return;
 function go(){var fc=topojson.feature(TOPO,TOPO.objects.countries);var pr=d3.geoMercator().fitExtent([[10,10],[750,390]],{type:"MultiPoint",coordinates:[[-20,14],[62,58]]}),pa=d3.geoPath(pr);
  var byId={};fc.features.forEach(function(f){byId[f.id]=f});
  var h=fc.features.map(function(f){return '<path d="'+(pa(f)||"")+'" fill="var(--line)" stroke="var(--bg)" stroke-width=".6"/>'}).join("");
  L.forEach(function(x){(x.paesi||[]).slice(0,1).forEach(function(iso){var f=byId[iso];if(!f)return;var c=pr(d3.geoCentroid(f));if(!c)return;h+='<g class="sp-dot" data-id="'+e(x.id)+'" style="cursor:pointer"><circle class="halo" cx="'+c[0]+'" cy="'+c[1]+'" r="8"/><circle class="core" cx="'+c[0]+'" cy="'+c[1]+'" r="6"/></g>'})});
  svg.innerHTML=h;svg.querySelectorAll(".sp-dot").forEach(function(g){g.onclick=function(){var it=document.querySelector('#spList .sit[data-id="'+g.getAttribute("data-id")+'"]');if(it){it.classList.add("open");it.scrollIntoView({behavior:"smooth",block:"center"})}}})}
 if(TOPO)go();else fetch("/geo.json").then(function(r){return r.json()}).then(function(t){TOPO=t;go()}).catch(function(){})}
function ask(){try{window.RG_SP.scrivici("idea")}catch(_){return}
 setTimeout(function(){var t=document.querySelector(".fbk textarea");if(t&&!t.value){t.value="Vorrei uno Spiegato su: "+(ST.q||"");t.focus()}},60)}

document.addEventListener("input",function(ev){if(ev.target&&ev.target.id==="spQ"){ST.q=ev.target.value;fill()}});
document.addEventListener("click",function(ev){var t=ev.target;if(!t.closest)return;
 var b=t.closest(".spx .sit>button");if(b){b.parentElement.classList.toggle("open");return}
 if(t.closest("[data-sp-ask]")){ask();return}
 var ta=t.closest("#spTabs button");if(ta){ST.a=ta.getAttribute("data-a");document.querySelectorAll("#spTabs button").forEach(function(x){x.classList.toggle("on",x===ta)});fill();return}
 var vw=t.closest(".spx .vw button");if(vw){ST.view=vw.getAttribute("data-v");document.querySelectorAll(".spx .vw button").forEach(function(x){x.classList.toggle("on",x===vw)});document.getElementById("spMap").style.display=ST.view==="map"?"block":"none";fill();return}
 var g=t.closest("button.gl[data-gl]");if(g){var x=SP.filter(function(s){return (s.gl||[]).indexOf(g.getAttribute("data-gl"))>=0})[0];
  if(x)setTimeout(function(){var box=document.getElementById("gloss");if(box&&!box.querySelector(".sp-gl")){var a=document.createElement("a");a.className="sp-gl";a.href=x.url;a.textContent="📖 Negli Spiegati: "+x.tit+" ›";box.insertBefore(a,box.querySelector(".gl-actions"))}},40)}
 if(t.closest("[data-sv]")){var o=document.querySelector("[data-sp-sv]");if(o)o.setAttribute("aria-current","false")}
 var sl=t.closest(".sp-lab,.sp-prow,.sp-gl,.spx .sdet a,.sp-path a");if(sl)track("spiegato-aperto");
},true);

/* ---------- innesti nelle viste esistenti ---------- */
function deco(){if(!SP.length)return;
 SP.forEach(function(x){(x.storie||[]).forEach(function(id){[document.getElementById("st-"+id),document.getElementById("xst-"+id)].forEach(function(stc){if(!stc||stc.querySelector(".sp-lab"))return;
  var l=document.createElement("a");l.className="sp-lab";l.href=x.url;l.textContent="📖 C'è lo Spiegato: "+x.tit+" ›";var pt=stc.querySelector("#pt-"+id)||document.getElementById("pt-"+id);
  if(pt&&stc.contains(pt))pt.parentNode.insertBefore(l,pt.nextSibling);else{var h=stc.querySelector(".sto-h");if(h)h.appendChild(l);else stc.insertBefore(l,stc.firstChild)}})})});
 document.querySelectorAll(".lay2").forEach(function(l){var b=l.querySelector("[data-lay-t]");if(!b||l.querySelector(".sp-lay"))return;var tema=b.getAttribute("data-lay-t");
  var L=SP.filter(function(x){return x.tema===tema}).sort(function(a,c){return a.data<c.data?-1:1});if(!L.length)return;
  var x=document.createElement("button");x.type="button";x.className="sp-lay";x.setAttribute("aria-pressed","false");x.innerHTML="📖 Da zero<small>gli Spiegati in ordine</small>";l.insertBefore(x,l.firstChild);
  x.onclick=function(){var box=l.parentNode;l.querySelectorAll("button").forEach(function(y){y.setAttribute("aria-pressed",y===x?"true":"false")});
   [].forEach.call(box.children,function(c){if(c!==l&&!c.classList.contains("th-ds")&&!c.classList.contains("acc-close")&&!c.classList.contains("sp-path"))c.style.display="none"});
   var p=box.querySelector(":scope > .sp-path");if(!p){p=document.createElement("div");p.className="sp-path";l.parentNode.insertBefore(p,l.nextSibling)}
   p.innerHTML=pathOl(L,L.filter(function(y){return prog(y)<0.97})[0]);p.style.display=""};
  l.querySelectorAll("button[data-lay]").forEach(function(y){y.addEventListener("click",function(){var box=l.parentNode;[].forEach.call(box.children,function(c){c.style.display=""});var p=box.querySelector(":scope > .sp-path");if(p)p.style.display="none";x.setAttribute("aria-pressed","false")})})});
 var mp=document.getElementById("mapPulse");if(mp&&!mp.querySelector(".sp-lens")){var lb=document.createElement("button");lb.type="button";lb.className="xp-lnk sp-lens";lb.setAttribute("aria-pressed",LENS?"true":"false");lb.textContent="💡 Spiegati sulla mappa";mp.appendChild(lb);
  lb.onclick=function(){var on=lb.getAttribute("aria-pressed")!=="true";lb.setAttribute("aria-pressed",on?"true":"false");mapLens(on)}}
 var pn=document.getElementById("panel");var s=st();if(pn&&s&&s.selCountry){var h2=pn.querySelector("h2");if(h2&&!pn.querySelector(".sp-prow")){var y=SP.filter(function(z){return (z.paesi||[]).indexOf(s.selCountry)>=0})[0];
  if(y)(pn.querySelector(".lvl")||h2).insertAdjacentHTML("afterend",'<a class="sp-prow" href="'+e(y.url)+'"><span><span class="k">💡 Spiegato</span><b>'+e(y.q)+'</b><small>al '+dl(y.data)+' · '+y.min+' min</small></span><span style="color:'+G+'">›</span></a>')}}
 var sv=document.querySelector('[data-sv="glossario"]');if(sv&&!document.querySelector("[data-sp-sv]")){var nb=document.createElement("button");nb.type="button";nb.setAttribute("data-sp-sv","1");nb.setAttribute("aria-current","false");nb.innerHTML='<span class="sn-ic" aria-hidden="true">💡</span>Spiegati';sv.parentNode.insertBefore(nb,sv.nextSibling);
  nb.onclick=openSection}
 if(LENS&&!document.querySelector("#mapBox .sp-dot"))mapLens(true);
}
function openSection(){var s=st();if(!s||s.view!=="esplora"){var t=document.querySelector('[data-view="esplora"]');if(t)t.click();deco()}
 var nb=document.querySelector("[data-sp-sv]");document.querySelectorAll("[data-sv]").forEach(function(b){b.setAttribute("aria-current","false")});if(nb)nb.setAttribute("aria-current","page");
 section();try{history.replaceState(null,"","#spiegati")}catch(_){}window.scrollTo({top:0})}
var LENS=false;
function mapLens(on){LENS=on;var svg=document.querySelector("#mapBox svg");if(!svg)return;svg.querySelectorAll(".sp-dot").forEach(function(n){n.remove()});svg.classList.toggle("sp-on",!!on);if(!on)return;
 var k=1;try{var tg=svg.querySelector("g[transform]");var m=tg&&tg.getAttribute("transform").match(/scale\(([\d.]+)/);if(m)k=+m[1]}catch(_){}
 svg.querySelectorAll("path.country").forEach(function(p){var d=p.__data__;var x=d&&SP.filter(function(s){return (s.paesi||[]).indexOf(d.id)>=0})[0];if(!x)return;
  var bb=p.getBBox();var cx=bb.x+bb.width/2,cy=bb.y+bb.height/2;
  var gg=document.createElementNS("http://www.w3.org/2000/svg","g");gg.setAttribute("class","sp-dot");gg.style.cursor="pointer";
  gg.innerHTML='<circle class="halo" cx="'+cx+'" cy="'+cy+'" r="'+(9/k)+'"><animate attributeName="r" values="'+(9/k)+';'+(30/k)+'" dur="1.8s" repeatCount="indefinite"/><animate attributeName="opacity" values=".9;0" dur="1.8s" repeatCount="indefinite"/></circle><circle class="core" cx="'+cx+'" cy="'+cy+'" r="'+(7/k)+'" style="stroke-width:'+(2/k)+'px"/>';
  gg.addEventListener("click",function(ev){ev.stopPropagation();p.dispatchEvent(new MouseEvent("click",{bubbles:true}))});
  var top=p.parentNode;while(top.parentNode&&top.parentNode.tagName&&top.parentNode.tagName.toLowerCase()==="g")top=top.parentNode;top.appendChild(gg)})}

fetch("/spiegati.json",{cache:"no-cache"}).then(function(r){return r.ok?r.json():null}).then(function(j){
 SP=(j&&j.spiegati)||[];if(!SP.length)return;
 var mo=new MutationObserver(function(){clearTimeout(mo.t);mo.t=setTimeout(deco,60)});mo.observe(document.body,{childList:true,subtree:true});deco();
 if((location.hash||"")==="#spiegati"){var n=0;var tick=function(){var b=document.querySelector("[data-sp-sv]");if(b){b.click();return}if(n===4){var t=document.querySelector('[data-view="esplora"]');if(t)t.click()}if(++n<40)setTimeout(tick,250)};setTimeout(tick,300)}
}).catch(function(){});
})();
