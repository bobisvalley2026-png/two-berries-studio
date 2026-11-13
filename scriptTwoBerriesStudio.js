/* Two Berries Studio – interazioni
   1 Navbar e footer · 2 Vetro · 3 Titolo e testi · 4 Luce e materiali 3D · 5 Bacche (home) · 6 Felpa (prodotti) */
(function () {
'use strict';
var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
var page = document.body.dataset.page;
var IG = 'https://www.instagram.com/bobisvalley/', TT = 'https://www.tiktok.com/@two_berries_studio?_r=1&_t=ZN-9BIfDu1Xidi';
var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

/* ---------- 1. Navbar e footer ---------- */
var nav = [['home', 'index.html', 'Home'], ['about', 'about.html', 'About'], ['prodotti', 'prodotti.html', 'Prodotti']];
function cur(k) { return page === k ? ' aria-current="page"' : ''; }
var header = document.createElement('header');
header.className = 'site-header glass';
header.innerHTML = '<div class="header-inner"><a class="brand" href="index.html" aria-label="Two Berries Studio, home">' +
 '<img src="logo-bacche.png" alt="" width="42" height="39"><span class="brand-name">Two Berries Studio</span></a>' +
 '<button class="nav-toggle" aria-expanded="false" aria-controls="menu" aria-label="Apri il menu"><span></span><span></span><span></span></button>' +
 '<nav class="navbar" id="menu" aria-label="Navigazione principale">' +
 nav.map(function (n) { return '<a href="' + n[1] + '"' + cur(n[0]) + '>' + n[2] + '</a>'; }).join('') +
 '<div class="has-sub"><a href="socialMedia.html"' + cur('social') + '>Social Media</a>' +
 '<button class="sub-toggle" type="button" aria-expanded="false" aria-label="Mostra i social">▾</button>' +
 '<ul class="submenu glass"><li><a href="' + IG + '" target="_blank" rel="noopener">Instagram</a></li>' +
 '<li><a href="' + TT + '" target="_blank" rel="noopener">TikTok</a></li></ul></div></nav></div>';
document.body.insertBefore(header, document.body.firstChild);
var footer = document.createElement('footer');
footer.className = 'footer';
footer.innerHTML = '<div class="container"><div class="footer-top"><a class="marchio" href="index.html"><img src="logo-bacche.png" alt="">Two Berries Studio</a>' +
 '<nav aria-label="Link del footer"><a href="#">Privacy</a><a href="#">Contatti</a><a href="' + IG + '" target="_blank" rel="noopener">Instagram</a>' +
 '<a href="' + TT + '" target="_blank" rel="noopener">TikTok</a></nav></div>' +
 '<div class="footer-row"><p>&copy; ' + new Date().getFullYear() + ' Two Berries Studio</p><p>Gianluca \\ Vanessa</p></div></div>';
document.body.appendChild(footer);
var toggle = header.querySelector('.nav-toggle'), menu = header.querySelector('#menu'),
    sub = header.querySelector('.has-sub'), subBtn = header.querySelector('.sub-toggle');
function setMenu(o) { toggle.setAttribute('aria-expanded', o); menu.classList.toggle('open', o); }
function setSub(o) { sub.classList.toggle('open', o); subBtn.setAttribute('aria-expanded', o); }
toggle.onclick = function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); };
subBtn.onclick = function () { setSub(!sub.classList.contains('open')); };
menu.addEventListener('click', function (e) { if (e.target.closest('a')) { setMenu(false); setSub(false); } });
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { setMenu(false); setSub(false); } });

/* ---------- 2. Riflesso del vetro ---------- */
document.addEventListener('pointermove', function (e) {
  var g = e.target.closest && e.target.closest('.glass'); if (!g) return;
  var r = g.getBoundingClientRect();
  g.style.setProperty('--mx', (e.clientX - r.left) + 'px'); g.style.setProperty('--my', (e.clientY - r.top) + 'px');
}, { passive: true });

/* ---------- 3. Titolo reattivo e testo che si accende allo scroll ---------- */
var mouse = { x: -999, y: -999, nx: 0, ny: 0 };
addEventListener('pointermove', function (e) {
  mouse.x = e.clientX; mouse.y = e.clientY; mouse.nx = e.clientX / innerWidth * 2 - 1; mouse.ny = e.clientY / innerHeight * 2 - 1;
}, { passive: true });
var letters = [], idx = 0;
document.querySelectorAll('[data-split]').forEach(function (w) {
  var t = w.textContent; w.setAttribute('aria-hidden', 'true'); w.textContent = '';
  t.split('').forEach(function (ch) {
    var l = document.createElement('span'); l.className = 'l'; l.style.setProperty('--i', idx++);
    var i = document.createElement('i'); i.textContent = ch === ' ' ? '\u00a0' : ch; l.appendChild(i); w.appendChild(l);
    letters.push({ el: i, x: 0, y: 0 });
  });
});
function moveLetters(t) {
  for (var k = 0; k < letters.length; k++) {
    var L = letters[k], b = L.el.parentNode.getBoundingClientRect();
    var dx = b.left + b.width / 2 - mouse.x, dy = b.top + b.height / 2 - mouse.y, d = Math.hypot(dx, dy) || 1;
    var f = Math.max(0, 1 - d / 240), tx = dx / d * f * 26, ty = dy / d * f * 26 + Math.sin(t / 900 + k * .5) * 3;
    L.x += (tx - L.x) * .1; L.y += (ty - L.y) * .1;
    L.el.style.transform = 'translate(' + L.x.toFixed(1) + 'px,' + L.y.toFixed(1) + 'px)';
  }
}
var scrubs = [];
document.querySelectorAll('.scrub').forEach(function (el) {
  var words = el.textContent.trim().split(/\s+/); el.textContent = '';
  var spans = words.map(function (w) { var s = document.createElement('span'); s.className = 'wd'; s.textContent = w + ' '; el.appendChild(s); return s; });
  scrubs.push({ el: el, spans: spans });
});
function scrub() {
  scrubs.forEach(function (s) {
    var r = s.el.getBoundingClientRect(), p = clamp((innerHeight * .85 - r.top) / (r.height + innerHeight * .3), 0, 1);
    s.spans.forEach(function (sp, i) { sp.classList.toggle('on', i < p * (s.spans.length + 1)); });
  });
}
if (scrubs.length) { addEventListener('scroll', scrub, { passive: true }); scrub(); }

/* Titolo: il più grande possibile senza uscire dallo schermo */
var tit = document.querySelector('.titolo');
function fitTitle() {
  if (!tit) return;
  var fs = Math.min(innerWidth * .2, innerHeight * .34), r1 = tit.querySelector('.r1 [data-split]');
  tit.style.setProperty('--fs', fs + 'px');
  for (var i = 0; i < 25 && r1.getBoundingClientRect().width > innerWidth * .92; i++) { fs *= .95; tit.style.setProperty('--fs', fs + 'px'); }
}
if (tit) { fitTitle(); addEventListener('resize', fitTitle); if (document.fonts) document.fonts.ready.then(fitTitle); }

/* ---------- 4. Luce e materiali 3D ---------- */
function setup(canvas, fov, z) {
  var R = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  R.setPixelRatio(Math.min(devicePixelRatio, 2)); R.outputEncoding = THREE.sRGBEncoding;
  R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.05;
  var S = new THREE.Scene(), C = new THREE.PerspectiveCamera(fov, 1, .1, 60); C.position.set(0, 0, z);
  function fit() { var p = canvas.parentNode, w = p.clientWidth, h = p.clientHeight; R.setSize(w, h, false); C.aspect = w / h; C.updateProjectionMatrix(); }
  fit(); addEventListener('resize', fit);
  S.environment = studioEnv(R);
  return { R: R, S: S, C: C, fit: fit };
}
/* "Studio fotografico" virtuale: pannelli luminosi che si riflettono su bacche e tessuto */
function studioEnv(R) {
  var es = new THREE.Scene();
  es.add(new THREE.Mesh(new THREE.SphereGeometry(30, 32, 16), new THREE.MeshBasicMaterial({ color: 0x0b0b1c, side: THREE.BackSide })));
  function panel(w, h, x, y, z, c, k) {
    var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(k), side: THREE.DoubleSide }));
    m.position.set(x, y, z); m.lookAt(0, 0, 0); es.add(m);
  }
  panel(9, 5, -7, 8, 7, 0xffffff, 7); panel(3, 12, 11, 0, 3, 0xaab4ff, 5);
  panel(12, 2.5, 0, -9, 5, 0xff9aa8, 3); panel(8, 8, 0, 5, -12, 0xffffff, 4); panel(3, 10, -12, 0, -3, 0xc7a6ff, 3);
  var pm = new THREE.PMREMGenerator(R), tex = pm.fromScene(es, .02).texture; pm.dispose(); return tex;
}
function grain(w, h, n, rmin, rmax, light, a) {
  var c = document.createElement('canvas'); c.width = w; c.height = h; var g = c.getContext('2d');
  return { c: c, g: g, scatter: function (col, count) {
    for (var i = 0; i < count; i++) { g.fillStyle = col; g.globalAlpha = Math.random() * a; g.beginPath(); g.arc(Math.random() * w, Math.random() * h, rmin + Math.random() * (rmax - rmin), 0, 7); g.fill(); }
    g.globalAlpha = 1; return this; } };
}

/* ---------- 5. Bacche in vetro liquido (home) ---------- */
function rimMat(hex, k) {   // bordo luminoso tipo vetro (Fresnel)
  return new THREE.ShaderMaterial({ uniforms: { c: { value: new THREE.Color(hex) }, k: { value: k } }, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
    vertexShader: 'varying vec3 n;varying vec3 v;void main(){n=normalize(normalMatrix*normal);vec4 m=modelViewMatrix*vec4(position,1.);v=normalize(-m.xyz);gl_Position=projectionMatrix*m;}',
    fragmentShader: 'uniform vec3 c;uniform float k;varying vec3 n;varying vec3 v;void main(){float f=pow(1.-abs(dot(normalize(n),normalize(v))),2.4);gl_FragColor=vec4(c*f*k,f);}' });
}
function glassShell(group, tint, rim) {   // guscio trasparente intorno alla bacca: tinta + riflessi dello studio + bordo
  var sg = new THREE.SphereGeometry(1, 96, 64);
  var body = new THREE.Mesh(sg, new THREE.MeshPhysicalMaterial({ color: tint, transparent: true, opacity: .2, roughness: .08, clearcoat: 1, depthWrite: false })); body.renderOrder = 1;
  var spec = new THREE.Mesh(sg, new THREE.MeshStandardMaterial({ color: 0x9aa0c0, metalness: 1, roughness: .03, envMapIntensity: 1.7, transparent: true, opacity: .6, blending: THREE.AdditiveBlending, depthWrite: false })); spec.renderOrder = 2;
  var edge = new THREE.Mesh(sg, rimMat(rim, 1.5)); edge.scale.setScalar(1.02); edge.renderOrder = 3;
  group.add(body, spec, edge);
}
var canvas = document.getElementById('hero3d');
if (canvas && window.THREE) {
  var T = setup(canvas, 30, 10), S = T.S;
  S.add(new THREE.AmbientLight(0xffffff, .3));
  var key = new THREE.DirectionalLight(0xffffff, 1.5); key.position.set(-4, 6, 6); S.add(key);
  var rimL = new THREE.DirectionalLight(0x8fa0ff, 1.2); rimL.position.set(6, 1, -4); S.add(rimL);

  // Interno blu: mirtillo con buccia cerosa e corona di sepali
  var bt = grain(512, 256); bt.g.fillStyle = '#1f2a8c'; bt.g.fillRect(0, 0, 512, 256); bt.scatter('#8c9bff', 2600);
  var bumpB = grain(512, 256); bumpB.g.fillStyle = '#808080'; bumpB.g.fillRect(0, 0, 512, 256); bumpB.scatter('#ffffff', 900); bumpB.scatter('#000000', 900);
  var mapB = new THREE.CanvasTexture(bt.c); mapB.encoding = THREE.sRGBEncoding;
  var mBlu = new THREE.MeshPhysicalMaterial({ map: mapB, bumpMap: new THREE.CanvasTexture(bumpB.c), bumpScale: .6, roughness: .4, clearcoat: .6, clearcoatRoughness: .3, emissive: 0x0a1050, envMapIntensity: 1.1 });
  var bluIn = new THREE.Group(), bs = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 64), mBlu); bs.scale.set(1, .9, 1); bluIn.add(bs);
  var mCal = new THREE.MeshStandardMaterial({ color: 0x0f1452, roughness: .65 });
  var ring = new THREE.Mesh(new THREE.TorusGeometry(.2, .05, 16, 32), mCal); ring.rotation.x = Math.PI / 2; ring.position.y = .86; bluIn.add(ring);
  for (var k = 0; k < 5; k++) {
    var cone = new THREE.Mesh(new THREE.ConeGeometry(.09, .3, 10), mCal), a = k / 5 * 6.283;
    cone.position.set(Math.cos(a) * .2, .93, Math.sin(a) * .2); cone.rotation.set(Math.sin(a) * .75, 0, -Math.cos(a) * .75); bluIn.add(cone);
  }
  bluIn.scale.setScalar(.66);
  var blu = new THREE.Group(); blu.add(bluIn); glassShell(blu, 0x5a6bff, 0x7b88ff);

  // Interno rosso: bacca lucida; gambo e foglie escono dal vetro come nel logo
  var br = grain(512, 256); br.g.fillStyle = '#808080'; br.g.fillRect(0, 0, 512, 256); br.scatter('#ffffff', 700); br.scatter('#000000', 700);
  var mRosso = new THREE.MeshPhysicalMaterial({ color: 0xc8112c, emissive: 0x3a0310, roughness: .2, clearcoat: 1, clearcoatRoughness: .03, bumpMap: new THREE.CanvasTexture(br.c), bumpScale: .25, envMapIntensity: 1.5 });
  var rosIn = new THREE.Group(), rs = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 64), mRosso); rs.scale.set(1, .96, 1); rosIn.add(rs); rosIn.scale.setScalar(.66);
  var rosso = new THREE.Group(); rosso.add(rosIn); glassShell(rosso, 0xff3d5a, 0xff6b80);
  var curve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, .6, 0), new THREE.Vector3(.03, .95, 0), new THREE.Vector3(.12, 1.32, 0)]);
  rosso.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 16, .035, 8), new THREE.MeshStandardMaterial({ color: 0x5a3a22, roughness: .55 })));
  var shape = new THREE.Shape(); shape.moveTo(0, 0); shape.bezierCurveTo(.15, .38, .7, .42, 1, 0); shape.bezierCurveTo(.7, -.34, .15, -.3, 0, 0);
  var lg = new THREE.ExtrudeGeometry(shape, { depth: .02, bevelEnabled: true, bevelThickness: .012, bevelSize: .012, bevelSegments: 2, curveSegments: 20 });
  var lp = lg.attributes.position; for (var q = 0; q < lp.count; q++) { var lx = lp.getX(q); lp.setZ(q, lp.getZ(q) + .28 * lx * lx); } lg.computeVertexNormals();
  var mFoglia = new THREE.MeshPhysicalMaterial({ color: 0x3f9a47, roughness: .4, clearcoat: .4, clearcoatRoughness: .3, side: THREE.DoubleSide });
  [1, -1].forEach(function (d) {
    var f = new THREE.Mesh(lg, mFoglia); f.scale.set(d * .5, .5, .5); f.position.set(.12, 1.32, 0); f.rotation.set(-.35, d * -.25, d * .45); rosso.add(f);
  });
  var G = new THREE.Group(); blu.position.set(-.98, .05, 0); rosso.position.set(.98, -.1, .1); G.add(blu, rosso); S.add(G);

  // Pulviscolo in sospensione
  var N = 260, pa = new Float32Array(N * 3);
  for (var n = 0; n < N; n++) { pa[n * 3] = (Math.random() - .5) * 20; pa[n * 3 + 1] = (Math.random() - .5) * 11; pa[n * 3 + 2] = -7 + Math.random() * 9; }
  var pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pa, 3));
  var dust = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0xffffff, size: .035, transparent: true, opacity: .55, sizeAttenuation: true })); S.add(dust);

  var wrap = document.querySelector('.hero-wrap'), on = true, running = false, prog = 0, ps = 0, rx = 0, ry = 0, t0 = performance.now();
  function readScroll() { prog = clamp(scrollY / (wrap.offsetHeight - innerHeight), 0, 1); wrap.style.setProperty('--p', prog.toFixed(3)); }
  addEventListener('scroll', readScroll, { passive: true }); readScroll();
  new IntersectionObserver(function (e) { on = e[0].isIntersecting; if (on && !running) loop(performance.now()); }).observe(wrap);
  function ease(x) { return x >= 1 ? 1 : 1 - Math.pow(2, -10 * x) * Math.cos(x * 12); }
  function loop(now) {
    if (!on) { running = false; return; }
    running = true;
    var t = (now - t0) / 1000, kk = reduced ? 1 : ease(Math.min(t / 2, 1)), narrow = innerWidth < 700 ? .55 : .72;
    ps += (prog - ps) * .14;
    var s = ps * ps * (3 - 2 * ps);
    ry += (mouse.nx * .5 - ry) * .05; rx += (mouse.ny * .25 - rx) * .05;
    G.rotation.set(rx, ry + s * 2.2, Math.sin(t * .5) * .05);
    G.position.set(0, Math.sin(t * 1.1) * .1, s * 3);
    G.scale.setScalar(kk * narrow * (1 + s * .8));
    blu.position.x = -.98 - s * 3.6; rosso.position.x = .98 + s * 3.6;
    bluIn.rotation.set(t * .25, t * .35, 0); rosIn.rotation.set(-t * .2, -t * .3, 0);
    dust.rotation.y = t * .02 + mouse.nx * .08; dust.position.y = ps * 2 + Math.sin(t * .3) * .2;
    canvas.style.opacity = 1 - clamp((ps - .8) * 5, 0, 1);
    T.R.render(S, T.C); moveLetters(now);
    if (!reduced) requestAnimationFrame(loop); else running = false;
  }
  loop(performance.now());
}

/* ---------- Riquadri About: inclinazione e parallasse degli oggetti ---------- */
document.querySelectorAll('.cartello, .gioco').forEach(function (c) {
  c.addEventListener('pointermove', function (e) {
    var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    c.style.setProperty('--px', x.toFixed(3)); c.style.setProperty('--py', y.toFixed(3));
    c.style.setProperty('--rx', (x * 7).toFixed(2)); c.style.setProperty('--ry', (-y * 7).toFixed(2));
  });
  c.addEventListener('pointerleave', function () { ['--px', '--py', '--rx', '--ry'].forEach(function (k) { c.style.removeProperty(k); }); });
});

/* ---------- Carosello dei giochi ---------- */
var trk = document.getElementById('carTrack');
if (trk) {
  var sl = [].slice.call(trk.children), dots = document.getElementById('cDots'), dragged = false;
  sl.forEach(function (el, i) {
    var b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Vai al riquadro ' + (i + 1));
    b.onclick = function () { go(i); }; dots.appendChild(b);
  });
  function go(i) { trk.scrollTo({ left: sl[clamp(i, 0, sl.length - 1)].offsetLeft - trk.offsetLeft - (trk.clientWidth - sl[clamp(i, 0, sl.length - 1)].offsetWidth) / 2, behavior: 'smooth' }); }
  function cur2() { var c = trk.scrollLeft + trk.clientWidth / 2, best = 0, bd = 1e9; sl.forEach(function (el, i) { var d = Math.abs(el.offsetLeft - trk.offsetLeft + el.offsetWidth / 2 - c); if (d < bd) { bd = d; best = i; } }); return best; }
  function mark() { var c = cur2(); sl.forEach(function (el, i) { el.classList.toggle('act', i === c); }); [].forEach.call(dots.children, function (d, i) { d.classList.toggle('act', i === c); }); }
  trk.addEventListener('scroll', mark, { passive: true }); mark();
  document.getElementById('cPrev').onclick = function () { go(cur2() - 1); };
  document.getElementById('cNext').onclick = function () { go(cur2() + 1); };
  trk.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') go(cur2() + 1); if (e.key === 'ArrowLeft') go(cur2() - 1); });
  var sx = 0, sl0 = 0, down = false;   // trascinamento col mouse (col dito è già nativo)
  trk.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') return; down = true; dragged = false; sx = e.clientX; sl0 = trk.scrollLeft; });
  addEventListener('pointermove', function (e) { if (!down) return; var dx = e.clientX - sx; if (Math.abs(dx) > 5) { dragged = true; trk.classList.add('drag'); trk.style.scrollSnapType = 'none'; trk.scrollLeft = sl0 - dx; } });
  addEventListener('pointerup', function () { if (!down) return; down = false; trk.classList.remove('drag'); trk.style.scrollSnapType = ''; if (dragged) go(cur2()); });
  trk.addEventListener('click', function (e) { if (dragged) { e.preventDefault(); e.stopPropagation(); dragged = false; } }, true);
}

/* ---------- 6. Felpa 3D, costruita dal disegno dello studio ---------- */
var box = document.getElementById('felpa3d');
function felpaFallback() {   // se il 3D non parte, mostra il disegno piatto con gli stessi pulsanti
  var im = document.createElement('img'); im.className = 'fb'; im.alt = 'Disegno della felpa nera'; im.src = (window.FELPA || {}).fronte || 'felpa-fronte.png'; box.appendChild(im);
  document.querySelectorAll('[data-vista]').forEach(function (b) { b.addEventListener('click', function () {
    im.src = (window.FELPA || {})[b.dataset.vista] || im.src; document.querySelectorAll('[data-vista]').forEach(function (o) { o.setAttribute('aria-pressed', o === b); }); }); });
}
if (box && !window.THREE) felpaFallback();
if (box && window.THREE) {
  var cv = document.createElement('canvas'); box.insertBefore(cv, box.firstChild);
  var H = setup(cv, 30, 12);
  H.S.add(new THREE.AmbientLight(0xffffff, .7));
  [[2, 4, 7, 1.5, 0xffffff], [-2, 3, -7, 1.5, 0xffffff], [-7, 0, 3, .8, 0x9aa8ff], [7, -1, 3, .7, 0xff9aa8]].forEach(function (l) {
    var d = new THREE.DirectionalLight(l[4], l[3]); d.position.set(l[0], l[1], l[2]); H.S.add(d);
  });
  var hood = new THREE.Group(); H.S.add(hood);
  function img(src, cb) { var i = new Image(); i.onload = function () { cb(i); }; i.src = src; return i; }
  var FP = window.FELPA || {};
  img(FP.fronte || 'felpa-fronte.png', function (fi) { img(FP.retro || 'felpa-retro.png', function (bi) {
    try { build(fi, bi); } catch (err) { console.error(err); if (cv.parentNode) cv.parentNode.removeChild(cv); felpaFallback(); }
  }); });

  function build(fi, bi) {
    var FP2 = window.FELPA || {}, GX = FP2.gx || 120, GY = FP2.gy || 126, W = GX + 1, WD = FP2.wd || 4.2, HT = FP2.ht || 4.22, ZB = FP2.zb, ZF = FP2.zf;
    var c = document.createElement('canvas'); c.width = W; c.height = GY + 1;
    var cx = c.getContext('2d'); cx.drawImage(fi, 0, 0, W, GY + 1);
    var px = cx.getImageData(0, 0, W, GY + 1).data, n = W * (GY + 1), d = new Float32Array(n), ins = new Uint8Array(n);
    for (var i = 0; i < n; i++) { ins[i] = px[i * 4 + 3] > 128 ? 1 : 0; d[i] = ins[i] ? 1e3 : 0; }
    function at(x, y) { return x < 0 || y < 0 || x >= W || y > GY ? 0 : d[y * W + x]; }
    for (var y = 0; y <= GY; y++) for (var x = 0; x < W; x++) d[y * W + x] = Math.min(d[y * W + x], at(x - 1, y) + 1, at(x, y - 1) + 1, at(x - 1, y - 1) + 1.41, at(x + 1, y - 1) + 1.41);
    for (y = GY; y >= 0; y--) for (x = W - 1; x >= 0; x--) d[y * W + x] = Math.min(d[y * W + x], at(x + 1, y) + 1, at(x, y + 1) + 1, at(x + 1, y + 1) + 1.41, at(x - 1, y + 1) + 1.41);
    for (var it = 0; it < 3; it++) { var e = d.slice(); for (y = 1; y < GY; y++) for (x = 1; x < W - 1; x++) if (ins[y * W + x]) d[y * W + x] = (e[y * W + x] * 4 + e[y * W + x - 1] + e[y * W + x + 1] + e[(y - 1) * W + x] + e[(y + 1) * W + x]) / 8; }

    // Texture: disegno + grana del tessuto
    var tf = new THREE.CanvasTexture(fi), tb = new THREE.CanvasTexture(bi); tf.encoding = tb.encoding = THREE.sRGBEncoding;
    tf.anisotropy = tb.anisotropy = 8;
    var fw = fi.width, fh = fi.height, bc = document.createElement('canvas'); bc.width = fw / 2; bc.height = fh / 2;
    var bg = bc.getContext('2d'), id = bg.createImageData(bc.width, bc.height);
    for (var p = 0; p < id.data.length; p += 4) { var q = p / 4, xx = q % bc.width, yy = (q / bc.width) | 0;
      var v = 128 + Math.sin(xx * 1.9) * Math.sin(yy * 1.9) * 38 + (Math.random() - .5) * 60; id.data[p] = id.data[p + 1] = id.data[p + 2] = v; id.data[p + 3] = 255; }
    bg.putImageData(id, 0, 0); var bump = new THREE.CanvasTexture(bc);

    function sheet(sign, tex) {
      var pos = [], uv = [], ind = [];
      for (var j = 0; j <= GY; j++) for (var i2 = 0; i2 <= GX; i2++) {
        var u = i2 / GX, v2 = 1 - j / GY, x2 = (u - .5) * WD, y2 = (v2 - .5) * HT, k = j * W + i2, zm = (ZB[j] + ZF[j]) / 2, z = zm;
        if (ins[k]) {   // spessore dal profilo laterale del modello: dietro il cappuccio sporge, il busto è più sottile
          var t = Math.min(d[k] / 22, 1), prof = Math.sqrt(1 - (1 - t) * (1 - t)), arm = 1 - .5 * clamp((Math.abs(u - .5) - .27) / .07, 0, 1);
          z = zm + ((sign > 0 ? ZF[j] : ZB[j]) - zm) * prof * arm + sign * prof * (.02 * Math.sin(y2 * 3.3 + x2 * 1.7) + .018 * Math.sin(x2 * 6.1 - y2 * 1.2));
        }
        pos.push(x2, y2, z); uv.push(sign > 0 ? u : 1 - u, v2);
      }
      for (j = 0; j < GY; j++) for (i2 = 0; i2 < GX; i2++) {
        var a = j * W + i2, b = a + 1, c2 = a + W, e2 = c2 + 1;
        if (!(ins[a] || ins[b] || ins[c2] || ins[e2])) continue;
        if (sign > 0) ind.push(a, c2, b, b, c2, e2); else ind.push(a, b, c2, b, e2, c2);
      }
      var g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
      g.setIndex(ind); g.computeVertexNormals();
      return new THREE.Mesh(g, new THREE.MeshStandardMaterial({ map: tex, bumpMap: bump, bumpScale: 1.1, roughness: .86, metalness: 0, alphaTest: .5, envMapIntensity: .6 }));
    }
    hood.add(sheet(1, tf), sheet(-1, tb));
  }
  var dragging = false, lastX = 0, vel = 0, ang = -.4, hold = 0, vis = false;
  box.addEventListener('pointerdown', function (e) { dragging = true; hold = null; lastX = e.clientX; box.setPointerCapture(e.pointerId); });
  box.addEventListener('pointermove', function (e) { if (dragging) { vel = (e.clientX - lastX) * .012; ang += vel; lastX = e.clientX; } });
  ['pointerup', 'pointercancel'].forEach(function (nm) { box.addEventListener(nm, function () { dragging = false; }); });
  document.querySelectorAll('[data-vista]').forEach(function (b) {
    b.addEventListener('click', function () {
      hold = b.dataset.vista === 'retro' ? Math.PI : 0;
      document.querySelectorAll('[data-vista]').forEach(function (o) { o.setAttribute('aria-pressed', o === b); });
    });
  });
  new IntersectionObserver(function (e) { vis = e[0].isIntersecting; if (vis) { H.fit(); if (!ticking) tick(); } }).observe(box);
  var ticking = false;
  function tick() {
    if (!vis) { ticking = false; return; }
    ticking = true;
    var now = performance.now();
    if (!dragging) {
      var face = hold === null ? Math.round(ang / Math.PI) * Math.PI : hold + Math.round((ang - hold) / (2 * Math.PI)) * 2 * Math.PI;
      ang += (face + (reduced ? 0 : Math.sin(now / 1400) * .22) - ang) * .06 + vel; vel *= .9;
    }
    hood.rotation.y = ang; hood.position.y = reduced ? 0 : Math.sin(now / 1100) * .05;
    H.R.render(H.S, H.C); requestAnimationFrame(tick);
  }
}

/* ---------- Puntini bianchi sullo sfondo (About) ---------- */
if (document.body.hasAttribute('data-polvere')) {
  var pv = document.createElement('canvas'); pv.id = 'polvere'; pv.setAttribute('aria-hidden', 'true'); document.body.insertBefore(pv, document.body.firstChild);
  var pc = pv.getContext('2d'), dots = [], dpr = Math.min(devicePixelRatio || 1, 2), pw = 0, ph = 0;
  function rs() { pw = innerWidth; ph = innerHeight; pv.width = pw * dpr; pv.height = ph * dpr; pc.setTransform(dpr, 0, 0, dpr, 0, 0); }
  rs(); addEventListener('resize', rs);
  for (var di = 0; di < 130; di++) dots.push({ x: Math.random(), y: Math.random(), z: .25 + Math.random() * .75, s: .5 + Math.random() * 1.4, p: Math.random() * 6.28, v: .004 + Math.random() * .01 });
  (function pf(now) {
    pc.clearRect(0, 0, pw, ph); var t = now / 1000, sy = scrollY;
    dots.forEach(function (d) {
      d.y -= d.v * .016 * (reduced ? 0 : 1); if (d.y < -.02) { d.y = 1.02; d.x = Math.random(); }
      var px = d.x * pw + Math.sin(t * .4 + d.p) * 14 * d.z - mouse.nx * 26 * d.z, py = ((d.y * ph - sy * .12 * d.z) % ph + ph) % ph - mouse.ny * 16 * d.z;
      pc.globalAlpha = (.22 + .5 * d.z) * (.65 + .35 * Math.sin(t * 1.2 + d.p)); pc.fillStyle = '#fff'; pc.beginPath(); pc.arc(px, py, d.s * d.z * 1.5, 0, 6.2832); pc.fill();
    });
    pc.globalAlpha = 1; requestAnimationFrame(pf);
  })(performance.now());
}

/* ---------- Cursore di vetro iridescente ---------- */
if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
  var cur = document.createElement('div'); cur.className = 'cursore'; cur.setAttribute('aria-hidden', 'true');
  cur.innerHTML = '<svg viewBox="0 0 48 48"><defs>' +
    '<linearGradient id="cF" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9aa8ff"/><stop offset=".45" stop-color="#3a3de0"/><stop offset="1" stop-color="#190f6a"/></linearGradient>' +
    '<linearGradient id="cE" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7fe9ff"/><stop offset=".35" stop-color="#8e6bff"/><stop offset=".65" stop-color="#ff7ad9"/><stop offset="1" stop-color="#6fd8ff"/></linearGradient>' +
    '<linearGradient id="cH" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".8"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>' +
    '<path d="M5 4L5 38L14 30L21 44L28 41L21 27L33 27Z" fill="url(#cF)" stroke="url(#cE)" stroke-width="2.4" stroke-linejoin="round"/>' +
    '<path d="M7.6 9.5L7.6 32L14.4 26M22.8 29.8L28.6 29.8" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M5.6 5.4L30.6 26.4L21.6 26.4L5.6 12Z" fill="url(#cH)" opacity=".55"/></svg>';
  document.body.appendChild(cur);
  var cx = -100, cy = -100, ctx2 = -100, cty = -100, crot = 0, csc = 1, ctgt = 1, cdown = false, con = false;
  addEventListener('pointermove', function (e) {
    if (e.pointerType === 'touch') return; ctx2 = e.clientX; cty = e.clientY;
    if (!con) { con = true; cx = ctx2; cy = cty; document.documentElement.classList.add('cur-on'); cur.style.opacity = 1; }
    ctgt = (e.target.closest && e.target.closest('a,button,.car-track,#felpa3d,[role=button]')) ? 1.3 : 1;
  }, { passive: true });
  addEventListener('pointerdown', function () { cdown = true; }); addEventListener('pointerup', function () { cdown = false; });
  document.documentElement.addEventListener('mouseleave', function () { cur.style.opacity = 0; });
  document.documentElement.addEventListener('mouseenter', function () { if (con) cur.style.opacity = 1; });
  (function cf() {
    var dx = ctx2 - cx, dy = cty - cy; cx += dx * .4; cy += dy * .4; crot += (clamp(dx * .5, -20, 20) - crot) * .15; csc += ((cdown ? .85 : ctgt) - csc) * .2;
    cur.style.transform = 'translate3d(' + (cx - 4).toFixed(1) + 'px,' + (cy - 3).toFixed(1) + 'px,0) rotate(' + crot.toFixed(1) + 'deg) scale(' + csc.toFixed(3) + ')';
    requestAnimationFrame(cf);
  })();
}
})();
