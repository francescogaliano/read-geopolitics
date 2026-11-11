<!doctype html>
<html lang="it">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=1080, height=1920" />
<script src="assets/gsap.min.js"></script>
<script src="assets/d3geo.min.js"></script>
<script src="assets/mondo.js"></script>
<script src="assets/tempi.js"></script>
<style>
@font-face{font-family:"Plex Serif RG";font-weight:600;src:url('assets/fonts/ibm-plex-serif-latin-600-normal.woff2')}
@font-face{font-family:"Plex Sans RG";font-weight:400;src:url('assets/fonts/ibm-plex-sans-latin-400-normal.woff2')}
@font-face{font-family:"Plex Sans RG";font-weight:600;src:url('assets/fonts/ibm-plex-sans-latin-600-normal.woff2')}
@font-face{font-family:"Plex Mono RG";font-weight:500;src:url('assets/fonts/ibm-plex-mono-latin-500-normal.woff2')}
:root{--bg:#0a0f1c;--ink:#EEF2F6;--oro:#E8A33D;--azz:#86B4EA;--muto:#8FA0AE;--ard:#4a5b74;--rosso:#E0705F}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden;background:var(--bg)}
#root{position:relative;width:1080px;height:1920px;overflow:hidden;background:radial-gradient(circle at 50% 46%,#15223b 0,#0c1424 45%,#0a0f1c 80%);color:var(--ink);font-family:"Plex Sans RG"}
.abs{position:absolute}
/* mappa persistente */
#cam{position:absolute;inset:0;transform-origin:50% 50%}
#map{position:absolute;left:0;top:0;width:1080px;height:1920px}
#map path{fill:#16223a;stroke:#24324a;stroke-width:1.2}
#map path.it{fill:#2a3b5c;stroke:#86B4EA;stroke-width:2.5}
#globe .oc{fill:#111a2b;stroke:#3a4c66;stroke-width:3}#globe .gr{fill:none;stroke:#1c2840;stroke-width:1.2}#globe .c{fill:#1f2b40;stroke:#2c3d5a;stroke-width:1}#globe .it{fill:#E8A33D;stroke:#ffd38a;stroke-width:2}
#dim{position:absolute;inset:0;background:#0a0f1c;opacity:0}
/* testata */
#kick{left:90px;top:190px;font:500 28px "Plex Mono RG";letter-spacing:.16em;color:var(--azz);display:flex;gap:16px;align-items:center}
#dots{display:flex;gap:8px}#dots i{width:13px;height:13px;border-radius:50%;background:#24324a;display:block}
.tit{left:90px;right:90px;top:250px;font:600 66px/1.12 "Plex Serif RG";color:var(--ink)}
.tit b{color:var(--oro);font-weight:600}
#src{left:90px;top:1318px;font:500 28px "Plex Mono RG";letter-spacing:.06em;color:var(--muto)}
/* sottotitoli */
.cap{left:60px;right:60px;top:1150px;text-align:center;font:600 62px/1.15 "Plex Sans RG";color:var(--ink)}
.cap span{display:inline-block;margin:0 .14em;opacity:0}
.cap span.k{color:var(--oro)}
/* scena 0 */
#pin{left:0;top:0;width:60px;height:60px;margin:-30px 0 0 -30px;border-radius:50%;border:5px solid var(--ink);opacity:0}
#pinlab{font:500 30px "Plex Mono RG";color:var(--ink);opacity:0;letter-spacing:.08em}
#prom{left:0;right:0;top:1440px;text-align:center;font:500 32px "Plex Mono RG";color:var(--oro);letter-spacing:.12em}
/* scena 1 */
#s1{left:0;top:470px;width:1080px;height:650px;opacity:0}
#pump{left:150px;top:40px;width:230px;height:230px}
#n49{left:410px;top:40px;font:600 230px/1 "Plex Serif RG";color:var(--oro);font-variant-numeric:tabular-nums}
#n49u{left:420px;top:285px;font:600 46px "Plex Serif RG";color:var(--ink)}
#days{left:150px;top:440px;width:780px;height:60px;display:flex;gap:10px}
#days i{flex:1;background:#1f2b40;border-radius:6px;display:block;position:relative;overflow:hidden}
#days i u{position:absolute;inset:0;background:var(--azz);transform:scaleY(0);transform-origin:bottom;display:block}
#dl,#dr{top:520px;font:500 28px "Plex Mono RG";color:var(--muto);letter-spacing:.08em}
#dl{left:150px}#dr{right:150px;text-align:right}
#dmid{left:0;right:0;top:390px;text-align:center;font:500 28px "Plex Mono RG";color:var(--azz);letter-spacing:.1em}
/* scene 2-3: la barra dell'IVA */
#s2{left:0;top:470px;width:1080px;height:650px;opacity:0}
#ivalab{left:90px;top:30px;font:500 28px "Plex Mono RG";color:var(--azz);letter-spacing:.12em}
#n170{left:90px;top:70px;font:600 210px/1 "Plex Serif RG";color:var(--ink);font-variant-numeric:tabular-nums}
#n170u{left:470px;top:180px;font:600 54px "Plex Serif RG";color:var(--ink)}
#bar{left:90px;top:360px;width:900px;height:130px;border-radius:14px;background:var(--azz);transform-origin:left center;overflow:hidden}
#gold{position:absolute;left:0;top:0;bottom:0;width:205px;background:var(--oro);transform-origin:left center}
.q{position:absolute;top:-14px;bottom:-14px;width:4px;background:var(--bg);opacity:0}
#gl{left:90px;top:520px;opacity:0}#gl b{display:block;font:600 58px "Plex Serif RG";color:var(--oro)}#gl span{font:500 28px "Plex Mono RG";color:var(--muto);letter-spacing:.06em}
#rl{right:90px;top:520px;text-align:right;opacity:0}#rl b{display:block;font:600 58px "Plex Serif RG";color:var(--azz)}#rl span{font:500 28px "Plex Mono RG";color:var(--muto);letter-spacing:.06em}
.stamp{font:600 64px "Plex Mono RG";letter-spacing:.06em;color:var(--rosso);border:7px solid var(--rosso);border-radius:14px;padding:8px 26px;opacity:0;white-space:nowrap}
#st1{left:300px;top:120px}
/* scena 4: storia dello sconto */
#s4{left:0;top:470px;width:1080px;height:650px;opacity:0}
.bcol{position:absolute;bottom:90px;width:130px}
.bcol .r{position:absolute;bottom:0;left:0;right:0;background:var(--oro);border-radius:10px 10px 0 0;transform:scaleY(0);transform-origin:bottom}
.bcol .v{position:absolute;left:-20px;right:-20px;text-align:center;font:600 50px "Plex Serif RG";color:var(--ink);opacity:0}
.bcol .d{position:absolute;bottom:-62px;left:-20px;right:-20px;text-align:center;font:500 28px "Plex Mono RG";color:var(--muto);letter-spacing:.06em}
#s4u{left:90px;top:0;font:500 28px "Plex Mono RG";color:var(--azz);letter-spacing:.1em}
#st2{left:600px;top:70px}
/* chiusura */
#s5{left:0;top:470px;width:1080px;height:900px;opacity:0}
.opt{left:90px;right:90px;height:150px;border-top:2px solid #24324a;display:flex;align-items:center;gap:30px;font:600 52px "Plex Serif RG";opacity:0}
.opt i{font:500 34px "Plex Mono RG";color:var(--bg);background:var(--oro);width:62px;height:62px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-style:normal}
#o1{top:0px}#o2{top:150px;border-bottom:2px solid #24324a}
#brand{left:0;right:0;top:360px;text-align:center;opacity:0}
#brand b{display:block;font:600 76px "Plex Serif RG"}
#brand span{display:block;margin-top:10px;font:500 30px "Plex Mono RG";color:var(--oro);letter-spacing:.14em}
#brand em{display:block;margin-top:34px;font:400 36px "Plex Sans RG";color:var(--muto);font-style:normal}
#mock{right:40px;bottom:40px;font:500 28px "Plex Mono RG";color:#8FA0AE;letter-spacing:.1em}
</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="{{END}}" data-width="1080" data-height="1920">
  <div id="cam" class="clip" data-start="0" data-duration="{{END}}" data-track-index="0">
    <svg id="map" viewBox="0 0 1080 1920"></svg>
    <div id="pin" class="abs"></div>
    <div id="pinlab" class="abs">ITALIA</div>
  </div>
  <svg id="globe" class="clip" data-start="0" data-duration="{{D_globe}}" data-track-index="1" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0;width:1080px;height:1920px"></svg>
  <div id="shade" class="clip" data-start="0" data-duration="{{D_globe}}" data-track-index="1" style="position:absolute;left:0;top:0;width:1080px;height:820px;background:linear-gradient(180deg,rgba(10,15,28,.95),rgba(10,15,28,0))"></div>
  <div id="dim" class="clip" data-start="0" data-duration="{{END}}" data-track-index="1"></div>

  <div id="kick" class="abs clip" data-start="0" data-duration="{{END}}" data-track-index="2"><span id="dots"><i></i><i></i><i></i><i></i><i></i></span><span id="kt">SPIEGATO DA ZERO</span></div>
  <div id="t0" class="abs tit clip" data-start="0" data-duration="{{D_t0}}" data-track-index="3">Lo sconto sul gasolio:<br><b>perché è così piccolo?</b></div>
  <div id="t1" class="abs tit clip" data-start="{{B1}}" data-duration="{{D_t1}}" data-track-index="3">Lo sconto <b>di adesso</b></div>
  <div id="t2" class="abs tit clip" data-start="{{B2}}" data-duration="{{D_t2}}" data-track-index="3">Chi lo <b>paga</b></div>
  <div id="t3" class="abs tit clip" data-start="{{B3}}" data-duration="{{D_t3}}" data-track-index="3">Quanto va <b>allo sconto</b></div>
  <div id="t4" class="abs tit clip" data-start="{{B4}}" data-duration="{{D_t4}}" data-track-index="3">Sempre <b>più piccolo</b></div>
  <div id="t5" class="abs tit clip" data-start="{{B5}}" data-duration="{{D_t5}}" data-track-index="3">E <b>tu?</b></div>
  <div id="prom" class="abs clip" data-start="0" data-duration="{{B1}}" data-track-index="4">IN {{PROM}} SECONDI</div>

  <div id="s1" class="abs clip" data-start="{{B1}}" data-duration="{{D_s1}}" data-track-index="5">
    <svg id="pump" class="abs" viewBox="0 0 96 96" fill="none" stroke="#86B4EA" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 82V22h36v60"/><path d="M20 42h36"/><path d="M56 32l14 8v28c0 6 8 6 8 0V36l-8-8"/></svg>
    <div id="n49" class="abs">0,0</div>
    <div id="n49u" class="abs">centesimi al litro</div>
    <div id="dmid" class="abs">11 GIORNI</div>
    <div id="days" class="abs"><i><u></u></i><i><u></u></i><i><u></u></i><i><u></u></i><i><u></u></i><i><u></u></i><i><u></u></i><i><u></u></i><i><u></u></i><i><u></u></i><i><u></u></i></div>
    <div id="dl" class="abs">28 OTT</div><div id="dr" class="abs">7 NOV</div>
  </div>

  <div id="s2" class="abs clip" data-start="{{B2}}" data-duration="{{D_s2}}" data-track-index="5">
    <div id="ivalab" class="abs">IVA IN PIÙ INCASSATA A SETTEMBRE</div>
    <div id="n170" class="abs">0</div><div id="n170u" class="abs">milioni circa</div>
    <div id="bar" class="abs"><div id="gold"></div><i class="q" style="left:225px"></i><i class="q" style="left:450px"></i><i class="q" style="left:675px"></i></div>
    <div id="gl" class="abs"><b>38,7 mln</b><span>ALLO SCONTO</span></div>
    <div id="rl" class="abs"><b>≈ 131 mln</b><span>IL RESTO</span></div>
    <div id="st1" class="abs stamp">MENO DI 1/4</div>
  </div>

  <div id="s4" class="abs clip" data-start="{{B4}}" data-duration="{{D_s4}}" data-track-index="5">
    <div id="s4u" class="abs">SCONTO SULLE ACCISE · CENTESIMI AL LITRO</div>
    <div class="bcol" id="b0" style="left:105px"><div class="r" style="height:420px"></div><div class="v" style="bottom:432px">25</div><div class="d">18 MAR</div></div>
    <div class="bcol" id="b1" style="left:290px"><div class="r" style="height:286px"></div><div class="v" style="bottom:298px">≈17</div><div class="d">28 LUG</div></div>
    <div class="bcol" id="b2" style="left:475px"><div class="r" style="height:205px"></div><div class="v" style="bottom:217px">12,2</div><div class="d">16 SET</div></div>
    <div class="bcol" id="b3" style="left:660px"><div class="r" style="height:102px"></div><div class="v" style="bottom:114px">6,1</div><div class="d">26 SET</div></div>
    <div class="bcol" id="b4" style="left:845px"><div class="r" style="height:82px"></div><div class="v" style="bottom:94px">4,9</div><div class="d">28 OTT</div></div>
    <div id="st2" class="abs stamp">SCADUTO</div>
  </div>

  <div id="s5" class="abs clip" data-start="{{B5}}" data-duration="{{D_s5}}" data-track-index="5">
    <div id="o1" class="abs opt"><i>A</i>Sconti brevi</div>
    <div id="o2" class="abs opt"><i>B</i>Un taglio stabile</div>
    <div id="brand" class="abs"><b>Read Geopolitics</b><span>TU LEGGI, TU DECIDI</span><em>Lo Spiegato completo: link nel profilo</em></div>
  </div>

  <div id="src" class="abs clip" data-start="{{B1}}" data-duration="{{D_src}}" data-track-index="6"></div>
  <div id="caps" class="clip" data-start="0" data-duration="{{END}}" data-track-index="7" data-track-kind="captions"></div>
  <audio id="mus" src="assets/musica.opus" data-start="0" data-duration="{{END}}" data-volume="0.16" data-fade-out="1.5" data-track-index="9"></audio>
  <audio id="voce" src="assets/voce.mp3" data-start="{{LEAD}}" data-volume="1" data-track-index="10"></audio>
</div>
<script>
const T=window.TEMPI,K=T.k,B=T.b;
/* ---- mappa ---- */
const proj=d3.geoMercator().center([12.5,42]).scale(2600).translate([540,860]);
const path=d3.geoPath(proj);const svg=document.getElementById("map");
let h="";for(const f of window.MONDO){const d=path(f);if(d&&d.length<400000)h+='<path class="'+(f.id==="ITA"?"it":"")+'" d="'+d+'"/>'}svg.innerHTML=h;
const ro=proj([12.5,41.9]);const pin=document.getElementById("pin");pin.style.left=ro[0]+"px";pin.style.top=ro[1]+"px";
const pl=document.getElementById("pinlab");pl.style.left=(ro[0]+48)+"px";pl.style.top=(ro[1]-56)+"px";
/* ---- sottotitoli: i gruppi seguono i tempi veri della voce ---- */
const G=T.g;const caps=document.getElementById("caps");
G.forEach((g,i)=>{const d=document.createElement("div");d.className="abs cap";d.id="c"+i;
  d.innerHTML=g.s.split(" ").map(w=>'<span class="'+(w.includes("*")?"k":"")+'">'+w.replace(/\*/g,"")+'</span>').join(" ");caps.appendChild(d)});
const tl=gsap.timeline({paused:true});
gsap.set(["#bar","#gold"],{scaleX:0});
const dots=[...document.querySelectorAll("#dots i")];[B[1],B[2],B[3],B[4],B[5]].forEach((t,i)=>tl.to(dots[i],{backgroundColor:"#E8A33D",duration:0.2},t));
tl.set("#kt",{textContent:"CARBURANTI · IN BREVE"},B[1]);
["#t0","#t1","#t2","#t3","#t4","#t5"].forEach((s,i)=>{const el=document.querySelector(s);const st=+el.dataset.start,du=+el.dataset.duration;
  if(i>0)tl.fromTo(el,{opacity:0,filter:"blur(8px)"},{opacity:1,filter:"blur(0px)",duration:0.2,ease:"power3.out"},st);
  if(i<5)tl.to(el,{opacity:0,filter:"blur(6px)",duration:0.15,ease:"power2.in"},st+du-0.2)});
G.forEach((g,i)=>{const sp=[...document.querySelectorAll("#c"+i+" span")];const W=sp.map(x=>x.textContent.length+1),tot=W.reduce((a,b)=>a+b,0);let acc=0;
  sp.forEach((w,j)=>{const t=g.a+(g.e-g.a)*acc/tot;acc+=W[j];tl.fromTo(w,{opacity:0,filter:"blur(6px)",y:10},{opacity:1,filter:"blur(0px)",y:0,duration:0.13,ease:"power3.out"},t)});
  const out=i<G.length-1?Math.min(g.b+0.25,G[i+1].a):T.end-0.3;tl.to("#c"+i,{opacity:0,duration:0.12,ease:"power2.in"},out-0.12);tl.set("#c"+i,{visibility:"hidden"},out)});
/* S0 */
/* apertura standard: il globo gira fino all'Italia e si avvicina (come aperturaGlobo del motore: zoom 2400 per un solo paese) */
const gsvg=document.getElementById("globe"),CTR=[12.5,41.9],ZOOM=2000,EI=x=>{x=Math.max(0,Math.min(1,x));return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2};
const gra=d3.geoGraticule10();
function drawGlobe(t){const k=EI(t/2.2),lon=CTR[0]-70*(1-k),lat=CTR[1]*k+8*(1-k),R=430+(ZOOM-430)*EI((t-1.6)/1.6);
  const pr=d3.geoOrthographic().rotate([-lon,-lat]).scale(R).translate([540,880]).clipAngle(90);const pa=d3.geoPath(pr);
  let o='<circle class="oc" cx="540" cy="880" r="'+R.toFixed(1)+'"/><path class="gr" d="'+(pa(gra)||"")+'"/>';
  for(const f of window.MONDO){const d=pa(f);if(d)o+='<path class="'+(f.id==="ITA"?"it":"c")+'" d="'+d+'"/>'}
  const q=pr([12.5,41.9]);if(q&&t>1.9){const pu=Math.min(1,(t-1.9)/0.5);o+='<circle cx="'+q[0]+'" cy="'+q[1]+'" r="'+(16*pu)+'" fill="#EEF2F6"/><circle cx="'+q[0]+'" cy="'+q[1]+'" r="'+(40*pu)+'" fill="none" stroke="rgba(238,242,246,.85)" stroke-width="4"/>';
    if(pu>0.3)o+='<text x="'+(q[0]+52)+'" y="'+(q[1]-34)+'" fill="#EEF2F6" opacity="'+pu+'" style="font:500 32px \'Plex Mono RG\';letter-spacing:.08em">ITALIA</text>'}
  gsvg.innerHTML=o}
const og={t:0};drawGlobe(0);tl.to(og,{t:3.4,duration:3.4,ease:"none",onUpdate:()=>drawGlobe(og.t)},0);
gsap.set("#cam",{opacity:0,scale:1.6,y:60});
tl.to(["#globe","#shade"],{opacity:0,duration:0.4,ease:"power2.in"},B[1]-0.3);tl.to("#cam",{opacity:1,duration:0.4},B[1]-0.3);
tl.to("#dim",{opacity:0.72,duration:0.5,ease:"power2.inOut"},B[1]-0.2);
tl.to("#cam",{scale:1.75,duration:T.end-B[1],ease:"none"},B[1]);
/* S1 */
tl.to("#s1",{opacity:1,duration:0.25},B[1]);
tl.fromTo("#pump",{scale:0.4,opacity:0},{scale:1,opacity:1,duration:0.5,ease:"back.out(1.5)"},B[1]+0.1);
document.querySelectorAll("#days u").forEach((u,i)=>tl.to(u,{scaleY:1,duration:0.18,ease:"power2.out"},B[1]+0.3+i*0.12));
tl.fromTo(["#dl","#dr","#dmid"],{opacity:0},{opacity:1,duration:0.3,stagger:0.1},B[1]+0.3);
tl.fromTo("#n49",{opacity:0},{opacity:1,duration:0.15},K.k49-0.05);const o49={v:0};
tl.to(o49,{v:4.9,duration:1.2,ease:"power3.out",onUpdate:()=>{document.getElementById("n49").textContent=o49.v.toFixed(1).replace(".",",")}},K.k49);
tl.fromTo("#n49u",{opacity:0},{opacity:1,duration:0.3},K.k49+0.5);
tl.to("#s1",{opacity:0,y:-30,filter:"blur(8px)",duration:0.2,ease:"power3.in"},B[2]-0.2);
/* S2 */
tl.to("#s2",{opacity:1,duration:0.25},B[2]);tl.fromTo("#ivalab",{opacity:0},{opacity:1,duration:0.3},B[2]+0.2);
const o170={v:0};tl.to(o170,{v:170,duration:1.4,ease:"power3.out",onUpdate:()=>{document.getElementById("n170").textContent=Math.round(o170.v)}},K.k170);
tl.fromTo("#n170u",{opacity:0},{opacity:1,duration:0.3},K.k170+0.7);tl.to("#bar",{scaleX:1,duration:1.6,ease:"expo.out"},K.k170);
/* S3 */
tl.to(["#n170","#n170u","#ivalab"],{opacity:0.35,duration:0.3},B[3]);
tl.to("#gold",{scaleX:1,duration:0.9,ease:"expo.out"},K.k387);
tl.to("#gl",{opacity:1,duration:0.3},K.k387+0.4);tl.to("#rl",{opacity:1,duration:0.3},K.k387+0.8);
tl.to(".q",{opacity:1,duration:0.15,stagger:0.08},K.k387+1.0);
tl.to(["#n170","#n170u","#ivalab"],{opacity:0,duration:0.2},K.meno-0.3);
tl.fromTo("#st1",{opacity:0,scale:2.4,rotation:-14},{opacity:1,scale:1,rotation:-8,duration:0.28,ease:"power4.in"},K.meno-0.1);
tl.to("#s2",{opacity:0,y:-30,filter:"blur(8px)",duration:0.2,ease:"power3.in"},B[4]-0.2);
/* S4 */
tl.to("#s4",{opacity:1,duration:0.25},B[4]);tl.fromTo("#s4u",{opacity:0},{opacity:1,duration:0.3},B[4]+0.1);
const step=Math.max(0.3,Math.min(0.55,(K.piccolo-B[4]-0.9)/5));
["#b0","#b1","#b2","#b3","#b4"].forEach((b,i)=>{const t=B[4]+0.3+i*step;tl.to(b+" .r",{scaleY:1,duration:0.6,ease:"expo.out"},t);tl.to(b+" .v",{opacity:1,duration:0.2},t+0.3)});
tl.to(["#b0 .r","#b1 .r","#b2 .r","#b3 .r"],{backgroundColor:"#4a5b74",duration:0.4},K.piccolo-0.7);
tl.fromTo("#st2",{opacity:0,scale:2.4,rotation:10},{opacity:1,scale:1,rotation:6,duration:0.28,ease:"power4.in"},K.piccolo-0.1);
tl.to("#s4",{opacity:0,y:-30,filter:"blur(8px)",duration:0.2,ease:"power3.in"},B[5]-0.2);
/* S5 */
tl.to("#s5",{opacity:1,duration:0.2},B[5]);
tl.fromTo("#o1",{opacity:0,x:-60},{opacity:1,x:0,duration:0.4,ease:"expo.out"},K.brevi-0.2);
tl.fromTo("#o2",{opacity:0,x:-60},{opacity:1,x:0,duration:0.4,ease:"expo.out"},K.taglio-0.2);
tl.fromTo("#brand",{opacity:0,filter:"blur(8px)"},{opacity:1,filter:"blur(0px)",duration:0.3},G[G.length-1].b+0.1);
[[B[1],"FONTE · ANSA, Open"],[B[2],"FONTE · HDmotori, Open"],[B[4],"FONTE · Sicurauto; Edotto, ANSA, Open"]].forEach(([t,s])=>tl.set("#src",{textContent:s},t));
tl.fromTo("#src",{opacity:0},{opacity:1,duration:0.3},B[1]+0.2);
window.__timelines=window.__timelines||{};window.__timelines["main"]=tl;tl.seek(0);
</script>
</body>
</html>
