/* rg.js — kit «iconografiche Read Geopolitics» su HyperFrames (v1, 11/11/2026).
   Legge window.SC (sceneggiatura), window.TEMPI (tempi veri della voce), window.REGIONE (paesi ad alta risoluzione)
   e costruisce cornice, mappa, scene e blocchi su un'unica timeline in pausa (contratto HyperFrames).
   Tutto ciò che si muove sulla mappa è funzione pura del tempo (render(t)), così ogni fotogramma è riproducibile.
   Riferimenti di tempo: numero (s) | "g3" inizio del gruppo 3 | "g3.b" fine | "k:nome" parola chiave | "s" inizio scena; più "+0.4"/"-0.2". */
(function(){
const SC=window.SC,T=window.TEMPI,G=T.g,K=T.k,END=T.end;
const $=s=>document.querySelector(s),mk=(tag,cls,html)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e};
const NS="http://www.w3.org/2000/svg",sv=(tag,at)=>{const e=document.createElementNS(NS,tag);for(const k in at)e.setAttribute(k,at[k]);return e};
const EI=x=>{x=Math.max(0,Math.min(1,x));return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2},EO=x=>1-Math.pow(1-Math.max(0,Math.min(1,x)),3);
const COL={oro:"#E8A33D",azz:"#86B4EA",rosso:"#E0705F",verde:"#5fbf8f",bianco:"#EEF2F6",grigio:"#4a5b74",muto:"#8FA0AE"};
const col=c=>COL[c]||c||COL.oro;
const oro=s=>String(s||"").replace(/\*([^*]+)\*/g,"<b>$1</b>");
function R(x,base){if(x==null)return base;if(typeof x==="number")return x;const m=String(x).match(/^(g\d+(?:\.b)?|k:[\w]+|s)?\s*([+-]\s*[\d.]+)?$/);if(!m)throw new Error("tempo non valido: "+x);
  let t=base;const a=m[1];if(a){if(a==="s")t=base;else if(a.startsWith("k:")){t=K[a.slice(2)];if(t==null)throw new Error("parola chiave mancante: "+a)}else{const i=+a.slice(1).replace(".b",""),g=G[i];if(!g)throw new Error("gruppo mancante: "+a);t=a.endsWith(".b")?g.b:g.a}}
  return t+(m[2]?+m[2].replace(/\s/g,""):0)}
function icona(nome,colore,sw){const p=(window.TABLER||{})[nome];if(!p)throw new Error("icona Tabler mancante: "+nome);
  return '<svg viewBox="0 0 24 24" fill="none" stroke="'+col(colore||"azz")+'" stroke-width="'+(sw||1.6)+'" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>'}
const tl=gsap.timeline({paused:true});

/* ---------- scene: tempi ---------- */
const S=SC.scene.map((s,i)=>({...s,i,t0:R("g"+s.da)-0.1}));
/* un timbro resta leggibile almeno 1,7 s: se serve, la scena dopo aspetta (la voce no, i sottotitoli sì) */
const parole=x=>String(x||"").replace(/\*/g,"").trim().split(/\s+/).length;
S.forEach((s,i)=>{(s.blocchi||[]).forEach(b=>{if(!S[i+1])return;let need=0;
  if(b.tipo==="timbro")need=R(b.quando,s.t0)+0.5+0.3*parole(b.testo)+0.3;
  if(b.tipo==="fila"&&b.etichetta)need=R(b.quando,s.t0)+0.5+0.5+0.3*parole(b.etichetta);
  if(need)S[i+1].t0=Math.max(S[i+1].t0,need)})});
S.forEach((s,i)=>{s.t1=S[i+1]?S[i+1].t0:END});
const B1=S.length?S[0].t0:END;

/* ---------- cornice ---------- */
const dots=$("#dots");S.forEach(()=>dots.appendChild(mk("i")));
$("#kt").textContent=SC.kicker||"SPIEGATO DA ZERO";
tl.set("#kt",{textContent:SC.etichetta||"IN BREVE"},B1);
S.forEach((s,i)=>tl.to(dots.children[i],{backgroundColor:COL.oro,duration:0.2},s.t0));
const tit=$("#titoli");
const t0=mk("div","tit",oro(SC.apertura.titolo)+(SC.apertura.oro?'<br><b>'+SC.apertura.oro+'</b>':''));t0.style.opacity=1;tit.appendChild(t0);
tl.to(t0,{opacity:0,filter:"blur(6px)",duration:0.15,ease:"power2.in"},B1-0.2);
S.forEach(s=>{if(!s.titolo)return;const e=mk("div","tit",oro(s.titolo));tit.appendChild(e);
  tl.fromTo(e,{opacity:0,filter:"blur(8px)"},{opacity:1,filter:"blur(0px)",duration:0.2,ease:"power3.out"},s.t0);
  if(s.t1<END)tl.to(e,{opacity:0,filter:"blur(6px)",duration:0.15,ease:"power2.in"},s.t1-0.2)});
$("#prom").textContent="IN "+(5*Math.round(END/5))+" SECONDI";
/* fonti */
S.forEach(s=>{if(s.fonte!=null)tl.set("#src",{textContent:s.fonte?"FONTE · "+s.fonte:""},s.t0)});tl.fromTo("#src",{opacity:0},{opacity:1,duration:0.3},B1+0.2);
if(SC.nota_fatti){const n=mk("div","nota",SC.nota_fatti);n.style.top="1362px";n.style.left="90px";n.style.right="auto";$("#root").appendChild(n);tl.to(n,{opacity:1,duration:0.3},B1+0.2)}

/* ---------- sottotitoli: gruppi sui tempi veri della voce ---------- */
const caps=$("#caps");
G.forEach((g,i)=>{const d=mk("div","cap",g.s.split(" ").map(w=>'<span class="'+(w.includes("*")?"k":"")+'">'+w.replace(/\*/g,"")+'</span>').join(" "));d.id="c"+i;caps.appendChild(d);
  const sp=[...d.children],W=sp.map(x=>x.textContent.length+1),tot=W.reduce((a,b)=>a+b,0);let acc=0;
  sp.forEach((w,j)=>{const t=g.a+(g.e-g.a)*acc/tot;acc+=W[j];tl.fromTo(w,{opacity:0,filter:"blur(6px)",y:10},{opacity:1,filter:"blur(0px)",y:0,duration:0.13,ease:"power3.out"},t)});
  const out=i<G.length-1?Math.min(g.b+0.25,G[i+1].a):END-0.3;tl.to(d,{opacity:0,duration:0.12,ease:"power2.in"},out-0.12);tl.set(d,{visibility:"hidden"},out)});

/* ---------- mappa piatta (resta dietro a tutte le scene) ---------- */
const M=SC.mappa||{centro:[12.5,42],scala:2600};
const proj=d3.geoMercator().center(M.centro).scale(M.scala).translate([540,640]);const path=d3.geoPath(proj);
const feats=(window.REGIONE&&window.REGIONE.length?window.REGIONE:window.MONDO);
const mapSvg=$("#map");const PATHS={};let h="";
feats.forEach(f=>{const d=path(f);if(d&&d.length<900000)h+='<path data-id="'+f.id+'" d="'+d+'"/>'});mapSvg.innerHTML=h;
mapSvg.querySelectorAll("path").forEach(p=>{(PATHS[p.dataset.id]=PATHS[p.dataset.id]||[]).push(p)});
(M.accesi||[]).forEach(id=>(PATHS[id]||[]).forEach(p=>p.classList.add("on")));
/* camera: chiavi {t, centro, zoom}; zoom 1 = scala della mappa; il punto centro va in (540,640) */
const CAM=[{t:0,c:M.centro,z:1}];
S.forEach(s=>{if(s.camera)CAM.push({t:s.t0,c:s.camera.centro||CAM[CAM.length-1].c,z:s.camera.zoom||1,d:s.camera.durata||1.2})});
function camAt(t){let a=CAM[0];for(const k of CAM)if(t>=k.t)a=k;const i=CAM.indexOf(a),prev=CAM[i-1];if(!prev||!a.d)return a;const u=EI((t-a.t)/a.d);
  if(u>=1)return a;const pa=proj(prev.c),pb=proj(a.c);return {p:[pa[0]+(pb[0]-pa[0])*u,pa[1]+(pb[1]-pa[1])*u],z:Math.exp(Math.log(prev.z)+(Math.log(a.z)-Math.log(prev.z))*u)}}
let CS={s:1,tx:0,ty:0};const scr=pt=>{const p=proj(pt);return [CS.tx+p[0]*CS.s,CS.ty+p[1]*CS.s]};
const OV=$("#ov");const DRAW=[];const CACHE=new Map();let USED=null;
/* gli elementi sulla mappa restano gli stessi da un fotogramma all'altro (chiave fissa): cambiano solo gli attributi */
function E(key,tag,at,txt){let e=CACHE.get(key);if(!e){e=sv(tag,{});CACHE.set(key,e);OV.appendChild(e)}for(const k in at)e.setAttribute(k,at[k]);if(txt!=null&&e.textContent!==txt)e.textContent=txt;e.style.display="";USED.add(key);return e}/* funzioni (t) che disegnano le sovrapposizioni */
function render(t){const c=camAt(t);const p=c.p||proj(c.c);CS={s:c.z,tx:540-p[0]*c.z,ty:640-p[1]*c.z};
  mapSvg.style.transform="translate("+CS.tx+"px,"+CS.ty+"px) scale("+CS.s+")";mapSvg.style.transformOrigin="0 0";
  USED=new Set();DRAW.forEach((f,i)=>{CUR=i;f(t)});CACHE.forEach((e,k)=>{if(!USED.has(k))e.style.display="none"})}
let CUR=0;

/* ---------- apertura standard: il globo gira fino al luogo e si avvicina ---------- */
const A=SC.apertura,gsvg=$("#globe"),gra=d3.geoGraticule10(),EV=new Set(A.evidenzia||[]);
function drawGlobe(t){const ctr=A.centro,k=EI(t/2.2),lon=ctr[0]-70*(1-k),lat=ctr[1]*k+8*(1-k),R0=430+((A.zoom||2400)-430)*EI((t-1.6)/1.6);
  const pr=d3.geoOrthographic().rotate([-lon,-lat]).scale(R0).translate([540,880]).clipAngle(90);const pa=d3.geoPath(pr);
  let o='<circle class="oc" cx="540" cy="880" r="'+R0.toFixed(1)+'"/><path class="gr" d="'+(pa(gra)||"")+'"/>';
  for(const f of window.MONDO){const d=pa(f);if(d)o+='<path class="'+(EV.has(f.id)?"ev":"c")+'" d="'+d+'"/>'}
  const q=pr(A.punto||ctr);if(q&&t>1.9){const pu=Math.min(1,(t-1.9)/0.5);o+='<circle cx="'+q[0]+'" cy="'+q[1]+'" r="'+(16*pu)+'" fill="#EEF2F6"/><circle cx="'+q[0]+'" cy="'+q[1]+'" r="'+(40*pu)+'" fill="none" stroke="rgba(238,242,246,.85)" stroke-width="4"/>';
    if(A.etichetta&&pu>0.3)o+='<text x="'+(q[0]+52)+'" y="'+(q[1]-34)+'" fill="#EEF2F6" opacity="'+pu+'" style="font:500 32px \'Plex Mono RG\';letter-spacing:.08em">'+A.etichetta+'</text>'}
  gsvg.innerHTML=o}
drawGlobe(0);const og={t:0};tl.to(og,{t:3.4,duration:3.4,ease:"none",onUpdate:()=>drawGlobe(og.t)},0);
gsap.set("#cam",{opacity:0});
tl.to(["#globe","#shade","#prom"],{opacity:0,duration:0.4,ease:"power2.in"},B1-0.3);tl.to("#cam",{opacity:1,duration:0.4},B1-0.3);
tl.to("#dim",{opacity:M.scura==null?0.35:M.scura,duration:0.5},B1-0.2);tl.to("#scrim",{opacity:1,duration:0.5},B1-0.2);

/* ---------- blocchi ---------- */
const stage=$("#stage");
const pos=(e,b,y)=>{e.style.top=(b.y!=null?b.y:y)+"px";if(b.x!=null)e.style.left=b.x+"px"};
const TIPI={
 numero(b,s,box){const v=String(b.valore),num=parseFloat(v.replace(/\./g,"").replace(",",".")),dec=(v.split(",")[1]||"").length;
   const e=mk("div","blk num",(b.icona?icona(b.icona,b.colore_icona||"azz"):"")+'<div class="v"><span>'+(b.prima||"")+'</span><span class="cnt">'+v+'</span><small>'+(b.dopo||"")+'</small></div>'+(b.etichetta?'<div class="l">'+oro(b.etichetta)+'</div>':'')+(b.nota?'<div class="n">'+b.nota+'</div>':''));
   pos(e,b,900);box.appendChild(e);const q=R(b.quando,s.t0+0.3);const c=e.querySelector(".cnt");
   tl.fromTo(e,{opacity:0,y:20},{opacity:1,y:0,duration:0.3,ease:"expo.out"},q-0.1);
   if(!isNaN(num)&&b.conta!==false){const o={v:0};c.textContent=(0).toFixed(dec).replace(".",",");tl.to(o,{v:num,duration:1.3,ease:"power3.out",onUpdate:()=>{c.textContent=o.v.toLocaleString("it-IT",{minimumFractionDigits:dec,maximumFractionDigits:dec})}},q)}
   if(b.esce)tl.to(e,{opacity:0,duration:0.2},R(b.esce,s.t0))},
 giorni(b,s,box){const e=mk("div","blk gg",'<div class="t">'+(b.testo||b.n+" GIORNI")+'</div><div class="row">'+'<i><u></u></i>'.repeat(b.n)+'</div><div class="e"><span>'+(b.da||"")+'</span><span>'+(b.a||"")+'</span></div>');
   pos(e,b,960);box.appendChild(e);const q=R(b.quando,s.t0+0.3);tl.fromTo(e,{opacity:0},{opacity:1,duration:0.3},q);
   e.querySelectorAll("u").forEach((u,i)=>{gsap.set(u,{scaleY:0});tl.to(u,{scaleY:1,duration:0.18,ease:"power2.out"},q+0.1+i*Math.min(0.12,1.6/b.n))})},
 barra(b,s,box){const e=mk("div","blk bar",'<div class="lab">'+(b.titolo||"")+'</div><div class="tot"><span class="cnt">0</span><small>'+(b.unita||"")+'</small></div><div class="b"><div class="p"></div>'+(b.quarti?'<i class="q" style="left:25%"></i><i class="q" style="left:50%"></i><i class="q" style="left:75%"></i>':'')+'</div><div class="ls"><div style="opacity:0"><b style="color:var(--oro)">'+b.parte_testo+'</b><span>'+b.parte_etichetta+'</span></div><div style="opacity:0;text-align:right"><b style="color:var(--azz)">'+b.resto_testo+'</b><span>'+b.resto_etichetta+'</span></div></div>');
   pos(e,b,560);box.appendChild(e);const q=R(b.quando,s.t0+0.3),qp=R(b.quando_parte,q+2);const bb=e.querySelector(".b"),pp=e.querySelector(".p"),[l1,l2]=e.querySelectorAll(".ls>div");
   pp.style.width=(100*b.parte/b.totale)+"%";gsap.set([bb,pp],{scaleX:0});tl.fromTo(e,{opacity:0},{opacity:1,duration:0.3},q-0.2);
   const o={v:0},c=e.querySelector(".cnt");tl.to(o,{v:b.totale,duration:1.4,ease:"power3.out",onUpdate:()=>{c.textContent=Math.round(o.v)}},q);tl.to(bb,{scaleX:1,duration:1.6,ease:"expo.out"},q);
   tl.to(pp,{scaleX:1,duration:0.9,ease:"expo.out"},qp);tl.to(l1,{opacity:1,duration:0.3},qp+0.4);tl.to(l2,{opacity:1,duration:0.3},qp+0.8);
   if(b.quarti)tl.to(e.querySelectorAll(".q"),{opacity:1,duration:0.15,stagger:0.08},qp+1.0);
   if(b.spegni_totale)tl.to([e.querySelector(".lab"),e.querySelector(".tot")],{opacity:0,duration:0.2},R(b.spegni_totale,qp))},
 barre(b,s,box){const n=b.voci.length,mx=Math.max(...b.voci.map(v=>v.v)),w=Math.min(150,(900-(n-1)*40)/n),H=b.altezza||420;
   const e=mk("div","blk brr",'<div class="ti">'+(b.titolo||"")+'</div>');pos(e,b,470);box.appendChild(e);const q=R(b.quando,s.t0+0.3),step=b.passo||0.5;
   tl.fromTo(e.querySelector(".ti"),{opacity:0},{opacity:1,duration:0.3},q-0.2);
   b.voci.forEach((v,i)=>{const hh=Math.max(8,H*v.v/mx),c=mk("div","c",'<div class="r" style="height:'+hh+'px"></div><div class="v" style="bottom:'+(hh+12)+'px">'+(v.t||v.v)+'</div><div class="d">'+(v.d||"")+'</div>');
     c.style.left=(i*(w+(900-n*w)/(n-1||1)))+"px";c.style.width=w+"px";e.appendChild(c);const r=c.querySelector(".r");gsap.set(r,{scaleY:0});
     tl.to(r,{scaleY:1,duration:0.6,ease:"expo.out"},q+i*step);tl.to(c.querySelector(".v"),{opacity:1,duration:0.2},q+i*step+0.3)});
   if(b.evidenzia_ultima)tl.to([...e.querySelectorAll(".r")].slice(0,-1),{backgroundColor:COL.grigio,duration:0.4},R(b.evidenzia_ultima,q))},
 fila(b,s,box){const e=mk("div","blk fila",'<div class="ic">'+Array.from({length:b.n},(_,i)=>'<span>'+icona(b.icona,i<(b.accese||0)?"oro":"grigio",1.5)+'</span>').join("")+'</div>'+(b.etichetta?'<div class="l">'+oro(b.etichetta)+'</div>':''));
   pos(e,b,920);box.appendChild(e);const q=R(b.quando,s.t0+0.3);tl.fromTo(e.querySelectorAll(".ic span"),{opacity:0,scale:0.5},{opacity:1,scale:1,duration:0.35,ease:"back.out(1.6)",stagger:0.08},q);
   if(b.etichetta)tl.fromTo(e.querySelector(".l"),{opacity:0},{opacity:1,duration:0.3},q+0.5)},
 timbro(b,s,box){const e=mk("div","blk stamp "+(b.colore||""),b.testo);e.style.left=(b.x!=null?b.x:300)+"px";e.style.top=(b.y!=null?b.y:520)+"px";box.appendChild(e);
   const r=b.ruota!=null?b.ruota:-8;tl.fromTo(e,{opacity:0,scale:2.4,rotation:r*1.8},{opacity:1,scale:1,rotation:r,duration:0.28,ease:"power4.in"},R(b.quando,s.t0+0.5))},
 scelta(b,s,box){(b.opzioni||[]).forEach((o,i,arr)=>{const e=mk("div","blk opt"+(i===arr.length-1?" ult":""),'<i>'+String.fromCharCode(65+i)+'</i><div><b>'+o.t+'</b>'+(o.chi?'<span>'+o.chi+'</span>':'')+'</div>');
   e.style.top=((b.y!=null?b.y:470)+i*150)+"px";box.appendChild(e);tl.fromTo(e,{opacity:0,x:-60},{opacity:1,x:0,duration:0.4,ease:"expo.out"},R(o.quando,s.t0+0.3+i*0.6))})},
 firma(b,s,box){const e=mk("div","blk brand",'<b>Read Geopolitics</b><span>TU LEGGI, TU DECIDI</span><em>'+(b.testo||"Lo Spiegato completo: link nel profilo")+'</em>');e.style.top=(b.y!=null?b.y:830)+"px";box.appendChild(e);
   tl.fromTo(e,{opacity:0,filter:"blur(8px)"},{opacity:1,filter:"blur(0px)",duration:0.3},R(b.quando,G[G.length-1].b+0.1))},
 /* --- sulla mappa: disegnati da render(t) in coordinate dello schermo, con elementi persistenti E(chiave) --- */
 accendi(b,s){const q=R(b.quando,s.t0),f=b.fino!=null?R(b.fino,s.t0):(b.resta?1e9:s.t1);const c=col(b.colore||"azz");
   DRAW.push(t=>{const on=t>=q&&t<f,k=on?Math.min(1,(t-q)/0.4):0;(b.paesi||[]).forEach(id=>(PATHS[id]||[]).forEach(p=>{p.style.fill=k>0?c:"";p.style.fillOpacity=k>0?(0.12+0.2*k):"";p.style.stroke=k>0?c:""}))})},
 nomi(b,s){const q=R(b.quando,s.t0),f=b.fino!=null?R(b.fino,s.t0):(b.resta?1e9:s.t1);DRAW.push(t=>{if(t<q||t>f)return;const a=Math.min(1,(t-q)/0.4);b.voci.forEach((v,i)=>{const p=scr(v.dove);E(CUR+":n"+i,"text",{x:p[0],y:p[1],"text-anchor":"middle",class:"nome",opacity:a},v.testo)})})},
 etichetta(b,s){const q=R(b.quando,s.t0),f=b.fino!=null?R(b.fino,s.t0):(b.resta?1e9:s.t1);DRAW.push(t=>{if(t<q||t>f)return;const a=Math.min(1,(t-q)/0.3),p=scr(b.dove);
   if(b.punto!==false)E(CUR+":p","circle",{cx:p[0],cy:p[1],r:10*a,fill:col(b.colore||"bianco")});
   E(CUR+":t","text",{x:p[0]+(b.dx||22),y:p[1]+(b.dy||-18),class:"lab",opacity:a,fill:col(b.colore||"bianco")},b.testo)})},
 rotta(b,s){const q=R(b.quando,s.t0),du=b.durata||1.4,f=b.fino!=null?R(b.fino,s.t0):(b.resta?1e9:s.t1),c=col(b.colore||"oro");
   DRAW.push(t=>{if(t<q||t>f)return;const u=EO((t-q)/du);const P=b.punti.map(scr);const d="M"+P.map(p=>p.join(",")).join("L");
     const pth=E(CUR+":r","path",{d,fill:"none",stroke:c,"stroke-width":b.spessore||7,"stroke-linecap":"round","stroke-linejoin":"round",opacity:1});
     if(b.tratteggio){pth.setAttribute("stroke-dasharray","22 14");pth.setAttribute("stroke-dashoffset",-t*40);pth.setAttribute("opacity",u)}
     else{const L=pth.getTotalLength();pth.setAttribute("stroke-dasharray",L);pth.setAttribute("stroke-dashoffset",L*(1-u))}
     if(b.etichetta&&u>0.6){const m=P[Math.floor(P.length/2)];E(CUR+":e","text",{x:m[0]+(b.dx||0),y:m[1]+(b.dy||-26),"text-anchor":"middle",class:"lab",fill:c},b.etichetta)}})},
 misura(b,s){const q=R(b.quando,s.t0),f=b.fino!=null?R(b.fino,s.t0):(b.resta?1e9:s.t1);DRAW.push(t=>{if(t<q||t>f)return;const u=EO((t-q)/0.6),a=scr(b.da),z=scr(b.a),m=[a[0]+(z[0]-a[0])*u,a[1]+(z[1]-a[1])*u],c=col(b.colore||"bianco");
   E(CUR+":l","line",{x1:a[0],y1:a[1],x2:m[0],y2:m[1],stroke:c,"stroke-width":5,"stroke-linecap":"round"});E(CUR+":a","circle",{cx:a[0],cy:a[1],r:9,fill:c});E(CUR+":b","circle",{cx:m[0],cy:m[1],r:9,fill:c});
   E(CUR+":t","text",{x:(a[0]+z[0])/2+(b.dx||30),y:(a[1]+z[1])/2+(b.dy||0),class:"lab",fill:c,style:"font-size:40px",opacity:Math.max(0,(u-0.6)/0.4)},b.testo)})},
 navi(b,s){/* navi lungo una rotta; "ferma": si bloccano dove sono; "torna": tornano indietro */
   const q=R(b.quando,s.t0),du=b.durata||6,n=b.n||4,c=col(b.colore||"bianco"),size=b.dimensione||58,f=b.fino!=null?R(b.fino,s.t0):s.t1;
   const stop=b.ferma?R(b.ferma.quando||b.ferma,s.t0):null,back=b.torna?R(b.torna.quando||b.torna,s.t0):null;const tmp=sv("path",{});
   DRAW.push(t=>{if(t<q||t>f)return;const P=b.punti.map(scr);tmp.setAttribute("d","M"+P.map(p=>p.join(",")).join("L"));OV.appendChild(tmp);const L=tmp.getTotalLength();
     for(let i=0;i<n;i++){const off=i/n,tt=stop!=null?Math.min(t,stop):t;let u=((tt-q)/du+off)%1,dir=1;
       if(back!=null&&t>=back){u=u-0.3*EO((t-back)/1.4);dir=-1}u=Math.max(0.01,Math.min(0.99,u));
       const p=tmp.getPointAtLength(L*u),p2=tmp.getPointAtLength(Math.min(L,L*u+4)),goesLeft=(p2.x<p.x)!==(dir<0);
       const a=Math.min(1,(t-q)/0.4),sc=stop!=null&&t>=stop&&b.ferma.colore?col(b.ferma.colore):c;
       const g=E(CUR+":s"+i,"g",{transform:"translate("+(p.x-size/2)+","+(p.y-size*0.8)+") scale("+(size/24)+")",opacity:a});
       const inner='<g transform="'+(goesLeft?"translate(24,0) scale(-1,1)":"")+'" fill="#0a0f1c" fill-opacity=".55" stroke="'+sc+'" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+window.TABLER[b.icona||"ship"]+'</g>';
       if(g._h!==inner){g.innerHTML=inner;g._h=inner}}
     tmp.remove()})},
 sbarramento(b,s){const q=R(b.quando,s.t0),f=b.fino!=null?R(b.fino,s.t0):(b.resta?1e9:s.t1),c=col(b.colore||"rosso");DRAW.push(t=>{if(t<q||t>f)return;const u=EO((t-q)/0.5),P=b.punti.map(scr);
   const a=P[0],z=P[P.length-1],m=[a[0]+(z[0]-a[0])*u,a[1]+(z[1]-a[1])*u];
   E(CUR+":l","line",{x1:a[0],y1:a[1],x2:m[0],y2:m[1],stroke:c,"stroke-width":b.tratteggio?8:12,"stroke-linecap":"round","stroke-dasharray":b.tratteggio?"18 14":""});
   if(b.x!==false){const cx=(a[0]+z[0])/2,cy=(a[1]+z[1])/2,k=Math.max(0,Math.min(1,(t-q-0.5)/0.3))*24;E(CUR+":x","path",{d:`M${cx-k} ${cy-k}L${cx+k} ${cy+k}M${cx+k} ${cy-k}L${cx-k} ${cy+k}`,stroke:"#fff","stroke-width":8,"stroke-linecap":"round"})}
   if(b.etichetta)E(CUR+":t","text",{x:z[0]+(b.dx||20),y:z[1]+(b.dy||0),class:"lab",fill:c,opacity:Math.max(0,(u-0.8)/0.2)},b.etichetta)})},
};
S.forEach(s=>{if(s.scura!=null)tl.to("#dim",{opacity:s.scura,duration:0.5},s.t0);});
S.forEach(s=>{const box=mk("div","sc");stage.appendChild(box);
  tl.fromTo(box,{opacity:0},{opacity:1,duration:0.25},s.t0);if(s.t1<END)tl.to(box,{opacity:0,y:-30,filter:"blur(8px)",duration:0.2,ease:"power3.in"},s.t1-0.2);
  (s.blocchi||[]).forEach(b=>{const f=TIPI[b.tipo];if(!f)throw new Error("blocco sconosciuto: "+b.tipo);f(b,s,box)})});

/* la mappa si ridisegna a ogni fotogramma da render(t) */
const ck={v:0};tl.to(ck,{v:1,duration:END,ease:"none",onUpdate:()=>render(tl.time())},0);render(0);
window.__timelines=window.__timelines||{};window.__timelines["main"]=tl;tl.seek(0);
})();
