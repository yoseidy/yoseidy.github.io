/* Escenas Three.js: portada (teléfono), foto (profundidad + partículas) y proyectos. */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import * as S from './screens.js';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const mouse = { x: 0, y: 0, sx: 0, sy: 0, cx: -1, cy: -1, t: 0 };
addEventListener('pointermove', e => { mouse.x = e.clientX / innerWidth * 2 - 1; mouse.y = e.clientY / innerHeight * 2 - 1;
  if (e.pointerType === 'mouse') { mouse.cx = e.clientX; mouse.cy = e.clientY; mouse.t = performance.now(); } }, { passive: true });

function renderer(canvas) {
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  r.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  r.outputColorSpace = THREE.SRGBColorSpace; r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.05;
  return r;
}
function fit(r, cam, canvas) {
  const w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h) return;
  if (canvas.width !== Math.round(w * r.getPixelRatio()) || canvas.height !== Math.round(h * r.getPixelRatio())) { r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }
}
function visible(el) { const o = { on: true }; new IntersectionObserver(es => { o.on = es[0].isIntersecting; }, { rootMargin: '100px' }).observe(el); return o; }
function texOf(canvas) { const t = new THREE.CanvasTexture(canvas); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; }
function envFor(r) { const pm = new THREE.PMREMGenerator(r); return pm.fromScene(new RoomEnvironment(), .04).texture; }

/* brillo de borde con degradado de marca (violeta → rosa → cian) */
function rimMaterial() {
  return new THREE.ShaderMaterial({
    side: THREE.BackSide, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 } },
    vertexShader: 'varying vec3 vP; void main(){ vP=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader: 'uniform float uTime; varying vec3 vP; void main(){ float t=clamp(vP.y*.18+.5+sin(uTime*.6)*.15,0.,1.); vec3 a=vec3(.545,.361,.965), b=vec3(.925,.282,.6), c=vec3(.133,.827,.933); vec3 col=mix(a,vec3(.655,.545,.98),t); gl_FragColor=vec4(col,.55); }'
  });
}

/* ---------- dispositivos ---------- */
function device(w, h, d, radius, screenCanvas, { bezel = .07, rim = true } = {}) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 6, radius),
    new THREE.MeshPhysicalMaterial({ color: 0x14111c, metalness: .75, roughness: .28, clearcoat: 1, clearcoatRoughness: .15 }));
  g.add(body);
  if (rim) { const r = new THREE.Mesh(new RoundedBoxGeometry(w * 1.018 + .02, h * 1.01 + .02, d * 1.05, 6, radius * 1.02), rimMaterial()); g.add(r); g.userData.rim = r.material; }
  const sw = w - bezel * 2, sh = h - bezel * 2;
  const tex = texOf(screenCanvas);
  screenCanvas.addEventListener('update', () => { tex.needsUpdate = true; });
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(sw, sh), new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false }));
  screen.position.z = d / 2 + .002; g.add(screen);
  g.userData.tex = tex; return g;
}
/* Pantalla a partir de una captura real: recorta [x,y,w,h] de la imagen y la pinta con esquinas redondeadas. */
const shot = (src, crop, radius = 60) => cv => {
  const img = new Image(); img.onload = () => {
    const x = cv.getContext('2d'), [sx, sy, sw, sh] = crop || [0, 0, img.width, img.height];
    x.save(); x.beginPath(); x.roundRect(0, 0, cv.width, cv.height, radius); x.clip();
    x.fillStyle = '#0B0A11'; x.fillRect(0, 0, cv.width, cv.height);
    const s = Math.max(cv.width / sw, cv.height / sh), dw = sw * s, dh = sh * s;
    x.drawImage(img, sx, sy, sw, sh, (cv.width - dw) / 2, (cv.height - dh) / 2, dw, dh); x.restore();
    cv.dispatchEvent(new Event('update'));
  }; img.src = src; return cv; };
const PH = [1.6, 3.3, .16, .24];
function phone(drawer) { const sw = PH[0] - .14, sh = PH[1] - .14; return device(...PH, drawer(S.canvasFor(600, Math.round(600 * sh / sw)))); }
function tablet(drawer) { const w = 4, h = 2.7, sw = w - .2, sh = h - .2; return device(w, h, .14, .2, drawer(S.canvasFor(1200, Math.round(1200 * sh / sw))), { bezel: .1 }); }
function kioskTotem(drawer) { // kiosko vertical sobre pie
  const g = new THREE.Group(), w = 2.5, h = 4.2, sw = w - .2, sh = h - .2;
  const scr = device(w, h, .16, .16, drawer(S.canvasFor(700, Math.round(700 * sh / sw))), { bezel: .1 }); scr.position.y = .5; g.add(scr);
  const mat = new THREE.MeshPhysicalMaterial({ color: 0x1a1624, metalness: .85, roughness: .3, clearcoat: .8 });
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(.09, .09, 1.6, 24), mat); pole.position.set(0, -2.3, -.1); g.add(pole);
  const foot = new THREE.Mesh(new THREE.CylinderGeometry(.8, .9, .1, 48), mat); foot.position.set(0, -3.1, -.1); g.add(foot);
  g.userData.rim = scr.userData.rim; return g; }
function laptop(drawer) {
  const g = new THREE.Group(); const w = 4.2, h = 2.7;
  const lid = device(w, h, .08, .1, drawer(S.canvasFor(1400, Math.round(1400 * (h - .2) / (w - .2)))), { bezel: .1 });
  lid.position.set(0, h / 2, 0); const hinge = new THREE.Group(); hinge.add(lid); hinge.rotation.x = -.12; g.add(hinge);
  const base = new THREE.Mesh(new RoundedBoxGeometry(w, .1, 2.8, 4, .05), new THREE.MeshPhysicalMaterial({ color: 0x1a1624, metalness: .8, roughness: .3, clearcoat: .8 }));
  base.position.set(0, -.05, 1.4); g.add(base);
  const pad = new THREE.Mesh(new THREE.PlaneGeometry(1.3, .8), new THREE.MeshBasicMaterial({ color: 0x2a2436 })); pad.rotation.x = -Math.PI / 2; pad.position.set(0, .002, 2.1); g.add(pad);
  g.userData.rim = lid.userData.rim; return g;
}
function particles(n, spread, size = .035) {
  const geo = new THREE.BufferGeometry(), pos = new Float32Array(n * 3), col = new Float32Array(n * 3), pal = [[.545, .361, .965], [.925, .282, .6], [.133, .827, .933]];
  for (let i = 0; i < n; i++) { pos[i * 3] = (Math.random() - .5) * spread; pos[i * 3 + 1] = (Math.random() - .5) * spread * .7; pos[i * 3 + 2] = (Math.random() - .5) * spread * .6 - 2; const c = pal[i % 3]; col.set(c, i * 3); }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  return new THREE.Points(geo, new THREE.PointsMaterial({ size, vertexColors: true, transparent: true, opacity: .7, depthWrite: false, blending: THREE.AdditiveBlending }));
}
function lights(scene) {
  scene.add(new THREE.AmbientLight(0xffffff, .35));
  const key = new THREE.DirectionalLight(0xffffff, 1.2); key.position.set(3, 4, 6); scene.add(key);
  const v = new THREE.PointLight(0x8b5cf6, 40, 20); v.position.set(-4, 2, 3); scene.add(v);
  const p = new THREE.PointLight(0xec4899, 35, 20); p.position.set(4, -2, 3); scene.add(p);
  const c = new THREE.PointLight(0x22d3ee, 18, 20); c.position.set(0, 3, -4); scene.add(c);
}

/* ---------- PORTADA ---------- */
function heroScene() {
  const canvas = document.getElementById('heroGL'); if (!canvas) return;
  const r = renderer(canvas), scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(30, 1, .1, 100);
  scene.environment = envFor(r); cam.position.set(0, 0, 11.5); lights(scene);
  const ph = phone(shot('assets/salome-home.webp', [86, 317, 493, 1083])); ph.scale.setScalar(1.18); scene.add(ph); // captura real (Fajas Salomé)
  /* v3 sobrio: sin anillos, orbes ni partículas */
  const vis = visible(canvas), t0 = performance.now();
  (function loop() {
    requestAnimationFrame(loop); if (!vis.on) return; fit(r, cam, canvas);
    const t = (performance.now() - t0) / 1000;
    const idle = reduce ? 0 : 1;
    ph.rotation.y = -.38 + mouse.sx * .45 + Math.sin(t * .5) * .08 * idle;
    ph.rotation.x = .08 + mouse.sy * .25; ph.rotation.z = .1;
    ph.position.y = Math.sin(t * .9) * .12 * idle;
    if (ph.userData.rim) ph.userData.rim.uniforms.uTime.value = t;
    r.render(scene, cam);
  })();
}

/* ---------- FOTO (profundidad + partículas que te forman) ---------- */
async function photoScene() {
  const canvas = document.getElementById('photoGL'); if (!canvas) return;
  const load = src => new Promise((ok, ko) => { const i = new Image(); i.onload = () => ok(i); i.onerror = ko; i.src = src; });
  const [img, dep] = await Promise.all([load('assets/avatar-cutout.png'), load('assets/avatar-depth.png')]);
  const r = renderer(canvas), scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(30, 1, .1, 100);
  const A = img.width / img.height, H = 4, W = H * A; cam.position.z = 7.55; // más cerca: avatar más grande
  // Sin conversión sRGB→lineal: el ShaderMaterial escribe el color tal cual (antes se veía oscuro)
  const tImg = new THREE.Texture(img); tImg.colorSpace = THREE.NoColorSpace; tImg.needsUpdate = true;
  const tDep = new THREE.Texture(dep); tDep.needsUpdate = true;
  const uni = { uImg: { value: tImg }, uDep: { value: tDep }, uMouse: { value: new THREE.Vector2() }, uLook: { value: new THREE.Vector2() },
    uShow: { value: 0 }, uTime: { value: 0 }, uBlink: { value: 0 } };
  /* Animación del avatar: profundidad con el cursor, ojos que siguen al ratón (o al scroll),
     parpadeo, cabello que se mece y barrido de luz. Ojos en coordenadas UV de avatar.jpg (1047x1008). */
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(W, H), new THREE.ShaderMaterial({
    uniforms: uni, transparent: true, depthWrite: false,
    vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader: `uniform sampler2D uImg,uDep; uniform vec2 uMouse,uLook; uniform float uShow,uTime,uBlink; varying vec2 vUv;
      vec4 eye(vec4 c, vec2 uv, vec2 e){
        vec2 R=vec2(.038,.025); vec2 q=(uv-e)/R; float L=length(q); if(L>1.15) return c;
        // iris y pupila se desplazan hacia donde mira (máscara suave para no mover el borde del ojo)
        vec2 sh=uLook*vec2(R.x*.42,R.y*.34); float m=1.-smoothstep(.5,.92,L);
        c=mix(c,texture2D(uImg,uv-sh),m);
        float lid=1.-2.2*uBlink;                       // párpado: baja de +1 a -1.2
        if(q.y>lid){ vec4 skin=texture2D(uImg,vec2(uv.x,e.y+R.y*1.6)); skin.rgb*=.93+.07*q.y; c=vec4(skin.rgb,c.a); }
        float lash=1.-smoothstep(.0,.16,abs(q.y-lid)); c.rgb=mix(c.rgb,vec3(.10,.06,.06),lash*step(.02,uBlink)*step(L,1.05));
        return c; }
      void main(){ float d=texture2D(uDep,vUv).r; vec2 uv=vUv - uMouse*d*.018;
        float side=smoothstep(.10,.16,abs(vUv.x-.5))*(1.-smoothstep(.30,.36,abs(vUv.x-.5)));
        float below=1.-smoothstep(.35,.62,vUv.y);
        uv.x+=sin(uTime*1.3+vUv.y*5.)*.0045*side*below;          // cabello que se mece
        vec4 c=texture2D(uImg,uv);
        c=eye(c,uv,vec2(.445,.662)); c=eye(c,uv,vec2(.569,.662));
        c.rgb*=1.06;                                              // un poco más de luz
        float t=fract(uTime/6.5); float band=exp(-pow((vUv.x*.7+vUv.y-(t*3.2-.8))*9.,2.));
        c.rgb+=vec3(1.,.86,1.)*band*.22;                          // barrido de luz cada 6.5 s
        float rim=smoothstep(.0,.35,c.a)*(1.-smoothstep(.35,.9,c.a));
        c.rgb+=vec3(.6,.5,.95)*rim*.25;  // borde luminoso
        gl_FragColor=vec4(c.rgb, c.a*uShow); }`
  }));
  // destellos que flotan alrededor
  const spN = 46, spPos = new Float32Array(spN * 3), spR = new Float32Array(spN);
  for (let i = 0; i < spN; i++) { const a = Math.random() * 6.283, rr = 1.6 + Math.random() * 1.1; spPos.set([Math.cos(a) * rr * 1.05, Math.sin(a) * rr * .95 + .2, (Math.random() - .5) * 1.5], i * 3); spR[i] = Math.random(); }
  const spGeo = new THREE.BufferGeometry(); spGeo.setAttribute('position', new THREE.BufferAttribute(spPos, 3)); spGeo.setAttribute('aR', new THREE.BufferAttribute(spR, 1));
  const spU = { uTime: uni.uTime, uShow: uni.uShow, uSize: { value: 9 * r.getPixelRatio() } };
  const sparks = new THREE.Points(spGeo, new THREE.ShaderMaterial({ uniforms: spU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: 'attribute float aR; uniform float uTime,uSize; varying float vA; varying float vR; void main(){ vec3 p=position; p.y+=sin(uTime*.6+aR*20.)*.12; p.x+=cos(uTime*.5+aR*14.)*.08; vA=.35+.65*pow(.5+.5*sin(uTime*2.2+aR*30.),3.); vR=aR; vec4 mv=modelViewMatrix*vec4(p,1.); gl_PointSize=uSize*(.5+aR)*(6./-mv.z); gl_Position=projectionMatrix*mv; }',
    fragmentShader: 'uniform float uShow; varying float vA; varying float vR; void main(){ vec2 q=gl_PointCoord-.5; float s=max(0.,1.-length(q)*2.); float star=max(0.,1.-abs(q.x)*14.)*max(0.,1.-abs(q.y)*2.)+max(0.,1.-abs(q.y)*14.)*max(0.,1.-abs(q.x)*2.); vec3 col=mix(vec3(.75,.6,1.),vec3(1.,.6,.85),vR); gl_FragColor=vec4(col,(s*s*.6+star*.8)*vA*uShow); }' }));
  /* v3 sobrio: destellos desactivados */
  // hacia dónde mira: ratón (escritorio) o posición en pantalla al hacer scroll (móvil / sin ratón)
  const look = new THREE.Vector2();
  const lookTick = () => {
    const rc = canvas.getBoundingClientRect(), fx = rc.left + rc.width * .507, fy = rc.top + rc.height * .36;
    let tx, ty;
    if (performance.now() - mouse.t < 5000 && mouse.cx >= 0) { tx = (mouse.cx - fx) / (innerWidth * .32); ty = (fy - mouse.cy) / (innerHeight * .32); }
    else { tx = Math.sin(performance.now() / 2600) * .35; ty = (fy - innerHeight * .5) / (innerHeight * .5); }
    const len = Math.hypot(tx, ty); if (len > 1) { tx /= len; ty /= len; }
    look.x += (tx - look.x) * .12; look.y += (ty - look.y) * .12; uni.uLook.value.copy(look); };
  // parpadeo natural cada 2.5–5 s (a veces doble)
  let nextBlink = performance.now() + 1800, blinkStart = 0;
  const blinkTick = now => { if (reduce) return; if (now > nextBlink) { blinkStart = now; nextBlink = now + 2500 + Math.random() * 2500; if (Math.random() < .2) nextBlink = now + 320; }
    const k = (now - blinkStart) / 170; uni.uBlink.value = k >= 0 && k <= 1 ? Math.sin(k * Math.PI) : 0; };
  scene.add(plane);
  // partículas muestreadas de la foto
  const sw = 170, sh = Math.round(sw / A), sc = S.canvasFor(sw, sh), sx = sc.getContext('2d', { willReadFrequently: true }); sx.drawImage(img, 0, 0, sw, sh);
  const px = sx.getImageData(0, 0, sw, sh).data; const dc = S.canvasFor(sw, sh).getContext('2d', { willReadFrequently: true }); dc.drawImage(dep, 0, 0, sw, sh); const dp = dc.getImageData(0, 0, sw, sh).data;
  const tgt = [], col = [], start = [], rnd = [];
  for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) { const i = (y * sw + x) * 4; if (px[i + 3] < 140) continue;
    tgt.push((x / sw - .5) * W, (.5 - y / sh) * H, dp[i] / 255 * .5); col.push(px[i] / 255, px[i + 1] / 255, px[i + 2] / 255);
    const a = Math.random() * 6.283, rad = 3 + Math.random() * 5; start.push(Math.cos(a) * rad, Math.sin(a) * rad * .7, (Math.random() - .5) * 6); rnd.push(Math.random()); }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(tgt, 3)); geo.setAttribute('aStart', new THREE.Float32BufferAttribute(start, 3)); geo.setAttribute('aCol', new THREE.Float32BufferAttribute(col, 3)); geo.setAttribute('aRnd', new THREE.Float32BufferAttribute(rnd, 1));
  const pu = { uP: { value: 0 }, uMouse: uni.uMouse, uSize: { value: 2.6 * r.getPixelRatio() }, uTime: uni.uTime };
  const pts = new THREE.Points(geo, new THREE.ShaderMaterial({
    uniforms: pu, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `attribute vec3 aStart,aCol; attribute float aRnd; uniform float uP,uSize,uTime; uniform vec2 uMouse; varying vec3 vC; varying float vA;
      void main(){ float p=clamp((uP*1.6-aRnd*.6),0.,1.); p=p*p*(3.-2.*p); vec3 pos=mix(aStart,position,p);
        pos.xy -= uMouse*position.z*.25; pos.z += sin(uTime*2.+aRnd*20.)*.03*(1.-p);
        vec3 brand=mix(vec3(.545,.361,.965),vec3(.925,.282,.6),aRnd); vC=mix(brand,aCol,p); vA=1.-smoothstep(.82,1.,uP);
        vec4 mv=modelViewMatrix*vec4(pos,1.); gl_PointSize=uSize*(1.+(1.-p)*1.5)*(6./-mv.z); gl_Position=projectionMatrix*mv; }`,
    fragmentShader: 'varying vec3 vC; varying float vA; void main(){ float d=length(gl_PointCoord-.5); if(d>.5) discard; gl_FragColor=vec4(vC,(1.-d*2.)*vA); }'
  }));
  scene.add(pts);
  const vis = visible(canvas); let played = false, t0 = performance.now();
  const play = () => { if (played) return; played = true; const s = performance.now(), dur = reduce ? 1 : 2600;
    (function tick() { const k = Math.min(1, (performance.now() - s) / dur); pu.uP.value = k; uni.uShow.value = Math.max(0, (k - .7) / .3); if (k < 1) requestAnimationFrame(tick); else scene.remove(pts); })(); };
  new IntersectionObserver(es => { if (es[0].isIntersecting) play(); }, { threshold: .35 }).observe(canvas);
  (function loop() { requestAnimationFrame(loop); if (!vis.on) return; fit(r, cam, canvas);
    const now = performance.now(); uni.uTime.value = (now - t0) / 1000; blinkTick(now); lookTick();
    plane.rotation.y += (look.x * .32 - plane.rotation.y) * .08; plane.rotation.x += (-look.y * .16 - plane.rotation.x) * .08; uni.uMouse.value.set(look.x * .9, look.y * .7); pts.rotation.copy(plane.rotation);    if (!reduce) { const br = Math.sin(uni.uTime.value * 1.6); plane.scale.set(1 + br * .003, 1 + br * .006, 1); plane.position.y = br * .015; plane.rotation.z = Math.sin(uni.uTime.value * .45) * .012 - look.x * .03; }
    r.render(scene, cam); })();
}

/* ---------- PROYECTOS ---------- */
function workScene() {
  const canvas = document.getElementById('workGL'); if (!canvas) return;
  const r = renderer(canvas), scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(32, 1, .1, 100);
  scene.environment = envFor(r); cam.position.set(0, .2, 13.5); lights(scene);
  const GAP = 12, groups = [];
  const add = (i, parts) => { const g = new THREE.Group(); parts.forEach(p => g.add(p)); g.position.x = i * GAP; scene.add(g); groups.push(g); };
  // SCREEN: fotograma real del kiosko (imagen fija; el video es de la empresa y no se publica)
  const k = kioskTotem(shot('assets/screen-frame.jpg', [47, 90, 379, 723], 24)); k.rotation.set(-.04, .25, 0); k.position.set(0, .55, 0); k.scale.setScalar(.92);
  add(0, [k]);
  // STEII: capturas reales de Google Play
  const b1 = phone(shot('assets/steii-play.webp', [100, 190, 468, 1080])); b1.rotation.set(0, .35, .06); b1.position.set(-1.15, 0, 0);
  const b2 = phone(shot('assets/apps/steii-1.webp', [92, 480, 486, 960])); b2.rotation.set(0, -.3, -.06); b2.position.set(1.15, -.2, .6);
  add(1, [b1, b2]);
  // Apps para tiendas (Shopify): capturas reales de Snatched Body y Fajas Salomé en Google Play
  const s1 = phone(shot('assets/snatched-home.webp', [86, 302, 493, 1066])); s1.rotation.set(0, .45, .06); s1.position.set(-2, .1, -.4);
  const s2 = phone(shot('assets/salome-home.webp', [86, 317, 493, 1083])); s2.rotation.set(0, 0, 0); s2.position.set(0, -.1, .5);
  const s3 = phone(shot('assets/salome-category.webp', [91, 317, 488, 1037])); s3.rotation.set(0, -.45, -.06); s3.position.set(2, .1, -.4);
  add(2, [s1, s2, s3]);
  // Cata1og (multitienda mayorista): capturas reales de Google Play
  const c1 = phone(shot('assets/catalog-splash.webp')); c1.rotation.set(0, .3, .05); c1.position.set(-1.1, .05, 0);
  const c2 = phone(shot('assets/catalog-product.webp', [86, 324, 499, 1067])); c2.rotation.set(0, -.3, -.05); c2.position.set(1.1, -.2, .6);
  add(3, [c1, c2]);
  const pts = particles(400, 60, .04); pts.position.x = GAP * 1.5; scene.add(pts);
  // estado
  let active = 0, camX = 0, drag = { on: false, x: 0, rot: 0, vel: 0 }; const spin = groups.map(() => 0);
  const steps = [...document.querySelectorAll('.step')], dots = [...document.querySelectorAll('#workDots i')];
  const setActive = i => { active = i; steps.forEach((s, j) => s.classList.toggle('on', j === i)); dots.forEach((d, j) => d.classList.toggle('on', j === i)); };
  // en móvil el escenario ocupa la parte de arriba: el paso activo es el que cruza el 70% de la pantalla
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) setActive(+e.target.dataset.step); }), { rootMargin: innerWidth < 1100 ? '-68% 0px -28% 0px' : '-45% 0px -45% 0px' });
  steps.forEach(s => io.observe(s));
  canvas.addEventListener('pointerdown', e => { drag.on = true; drag.x = e.clientX; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', e => { if (!drag.on) return; const dx = (e.clientX - drag.x) / canvas.clientWidth * 4; drag.x = e.clientX; spin[active] += dx; drag.vel = dx; });
  canvas.addEventListener('pointerup', () => { drag.on = false; });
  const vis = visible(canvas), t0 = performance.now();
  (function loop() { requestAnimationFrame(loop); if (!vis.on) return; fit(r, cam, canvas);
    const t = (performance.now() - t0) / 1000;
    camX += (active * GAP - camX) * .06; cam.position.x = camX + mouse.sx * .4; cam.position.y = .2 - mouse.sy * .3; cam.lookAt(camX, 0, 0);
    if (!drag.on) { drag.vel *= .94; spin[active] += drag.vel; }
    groups.forEach((g, i) => { const on = i === active; g.rotation.y += ((on ? spin[i] : 0) + (reduce ? 0 : Math.sin(t * .5 + i) * .08) - g.rotation.y) * .08; g.position.y = reduce ? 0 : Math.sin(t * .8 + i) * .1;
      const s = on ? 1 : .85; g.scale.lerp(new THREE.Vector3(s, s, s), .06);
      g.traverse(o => { if (o.material && o.material.uniforms && o.material.uniforms.uTime) o.material.uniforms.uTime.value = t; }); });
    // compensar ancho en móvil
    cam.fov = canvas.clientWidth < 600 ? 39 : 32; cam.updateProjectionMatrix();
    r.render(scene, cam); })();
}

/* ---------- arranque ---------- */
function hasGL() { try { const c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl'))); } catch (e) { return false; } }
(async () => {
  if (!hasGL()) { document.documentElement.classList.add('no-gl'); return; }
  try { await document.fonts.ready; } catch (e) {}
  (function m() { mouse.sx += (mouse.x - mouse.sx) * .05; mouse.sy += (mouse.y - mouse.sy) * .05; requestAnimationFrame(m); })();
  try { heroScene(); } catch (e) { console.error(e); }
  try { workScene(); } catch (e) { console.error(e); }
  try { await photoScene(); } catch (e) { console.error(e); document.documentElement.classList.add('no-gl'); }
})();
