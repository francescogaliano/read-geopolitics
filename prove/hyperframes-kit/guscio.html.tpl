<!doctype html>
<html lang="it">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=1080, height=1920" />
<script src="assets/gsap.min.js"></script>
<script src="assets/d3geo.min.js"></script>
<script src="assets/mondo.js"></script>
<script src="assets/tabler.js"></script>
<script src="assets/regione.js"></script>
<script src="assets/sceneggiatura.js"></script>
<script src="assets/tempi.js"></script>
<link rel="stylesheet" href="assets/rg.css" />
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="{{END}}" data-width="1080" data-height="1920">
  <div id="cam" class="clip" data-start="0" data-duration="{{END}}" data-track-index="0"><svg id="map" viewBox="0 0 1080 1920"></svg><svg id="ov" viewBox="0 0 1080 1920"></svg></div>
  <svg id="globe" class="clip" data-start="0" data-duration="{{D_GLOBO}}" data-track-index="1" viewBox="0 0 1080 1920"></svg>
  <div id="shade" class="clip" data-start="0" data-duration="{{D_GLOBO}}" data-track-index="1"></div>
  <div id="dim" class="clip" data-start="0" data-duration="{{END}}" data-track-index="1"></div>
  <div id="scrim" class="clip" data-start="0" data-duration="{{END}}" data-track-index="1"></div>
  <div id="kick" class="clip" data-start="0" data-duration="{{END}}" data-track-index="2"><span id="dots"></span><span id="kt"></span></div>
  <div id="titoli" class="clip" data-start="0" data-duration="{{END}}" data-track-index="3"></div>
  <div id="prom" class="clip" data-start="0" data-duration="{{D_GLOBO}}" data-track-index="4"></div>
  <div id="stage" class="clip" data-start="0" data-duration="{{END}}" data-track-index="5"></div>
  <div id="src" class="clip" data-start="0" data-duration="{{END}}" data-track-index="6"></div>
  <div id="caps" class="clip" data-start="0" data-duration="{{END}}" data-track-index="7" data-track-kind="captions"></div>
  <audio id="mus" src="assets/musica.opus" data-start="0" data-duration="{{END}}" data-volume="0.16" data-fade-out="1.5" data-track-index="9"></audio>
  <audio id="voce" src="assets/voce.mp3" data-start="{{LEAD}}" data-volume="1" data-track-index="10"></audio>
</div>
<script src="assets/rg.js"></script>
</body>
</html>
