import * as THREE from 'three';

/* Escena del hero: cuatro estaciones de operación en una nube de puntos.
   Adaptada del prototipo de Héctor; sin la silueta del operador. */
const root = document.documentElement;
const hero = document.querySelector('.hero-w');
const host = document.getElementById('hero-scene');
const layer = document.getElementById('hero-labels');
const chipLayer = document.getElementById('hero-chips');
const intro = document.querySelector('.hero-w-left');

if (hero && host && layer && chipLayer && intro) {
  const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE = matchMedia('(pointer: fine)').matches;
  const FOV = 34, ELEV = THREE.MathUtils.degToRad(25), CENTER_X = -0.28, CONTENT_W = 16.6;
  const TARGET = new THREE.Vector3(0, -0.25, 0);

  (function main() {
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch (e) {
      root.classList.add('no-webgl');
      return;
    }
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 200);
    const world = new THREE.Group();
    world.position.x = -CENTER_X;
    scene.add(world);

    // Aleatorio determinista: la composición es idéntica en cada carga.
    let seed = 20261123;
    const rand = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    const sgn = () => rand() < .5 ? -1 : 1;
    const gauss = () => (rand() + rand() + rand() - 1.5) / 1.5;

    /* ---------- Material de puntos (discos suaves, niebla, barrido) ---------- */
    const U = {
      uTime: { value: 0 }, uScale: { value: 800 }, uMinPx: { value: 1.5 }, uFogNear: { value: 15 }, uFogFar: { value: 40 },
      uScanX: { value: -99 }, uScanAmt: { value: REDUCE ? 0 : 1 }, uAssemble: { value: REDUCE ? 1 : 0 }, uFadeIn: { value: REDUCE ? 1 : 0 }, uAccent: { value: new THREE.Color(0x00a99e) }
    };
    const VERT = `
      attribute float aSize;attribute float aSeed;attribute vec3 aFrom;
      uniform float uAssemble;
      uniform float uTime,uSize,uScale,uMinPx,uFogNear,uFogFar,uScanX,uScanAmt,uScanMul,uTwinkle,uWave;
      varying float vA;varying float vScan;
      void main(){
        vec3 p=position;float a=1.;
        #ifdef ASSEMBLE
          float k=clamp((uAssemble-aSeed*.4)/.6,0.,1.);k=1.-pow(1.-k,3.);
          vec3 from=aFrom+vec3(sin(uTime*.7+aSeed*31.),cos(uTime*.55+aSeed*17.),sin(uTime*.6+aSeed*11.))*.45*(1.-k);
          p=mix(from,p,k);a*=mix(.6,1.,k);
        #endif
        #ifdef WAVE
          a*=.15+.85*smoothstep(.1,.9,uAssemble);
          p.y+=uWave*sin(p.x*.42+uTime*.5)*cos(p.z*.38-uTime*.35);
          vec2 q=(p.xz-vec2(.6,-1.))/vec2(16.,10.);
          a*=1.-smoothstep(.4,1.,length(q));
        #endif
        #ifdef RING
          float f=fract(uTime*.2+aSeed);
          p=vec3(position.x*mix(1.5,3.3,f),0.,position.z*mix(1.5,3.3,f));
          a*=(1.-f)*smoothstep(0.,.12,f);
        #endif
        #ifdef GLOW
          a*=aSeed;
        #elif !defined(RING)
          a*=1.-uTwinkle+uTwinkle*(.5+.5*sin(uTime*1.3+aSeed*43.));
        #endif
        vec4 w=modelMatrix*vec4(p,1.);
        vScan=exp(-pow((w.x-uScanX)/1.1,2.))*uScanAmt*uScanMul;
        vec4 mv=viewMatrix*w;
        a*=mix(1.,.38,smoothstep(uFogNear,uFogFar,-mv.z));
        float s=uSize*aSize*uScale/-mv.z;
        a*=clamp(s/uMinPx,.3,1.);
        gl_PointSize=max(s,uMinPx);
        vA=a;
        gl_Position=projectionMatrix*mv;
      }`;
    const FRAG = `
      uniform vec3 uColor,uAccent;uniform float uOpacity,uFadeIn,uLate;
      varying float vA;varying float vScan;
      void main(){
        float d=length(gl_PointCoord-.5);
        #ifdef GLOW
          float m=pow(max(0.,1.-d*2.),1.6);
        #else
          float m=1.-smoothstep(.3,.5,d);
        #endif
        float a=m*vA*uOpacity*(1.+vScan*1.2)*mix(1.,uFadeIn,uLate);
        if(a<.004)discard;
        gl_FragColor=vec4(mix(uColor,uAccent,clamp(vScan,0.,1.)),min(a,1.));
        #include <colorspace_fragment>
      }`;
    const mats = [];
    function pointsMat({ size = .045, opacity = 1, role = 'cloud', defines = {}, twinkle = 0, scan = 1, wave = 0, late = 0 }) {
      const m = new THREE.ShaderMaterial({
        vertexShader: VERT, fragmentShader: FRAG, defines, transparent: true, depthWrite: false,
        uniforms: { ...U, uSize: { value: size }, uOpacity: { value: opacity }, uTwinkle: { value: twinkle }, uScanMul: { value: scan }, uWave: { value: wave }, uLate: { value: late }, uColor: { value: new THREE.Color() } }
      });
      m.userData = { role, baseOpacity: opacity, target: new THREE.Color(), targetOpacity: opacity };
      mats.push(m); return m;
    }
    function pointsGeo(buf) {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(buf.p, 3));
      g.setAttribute('aSize', new THREE.Float32BufferAttribute(buf.s, 1));
      g.setAttribute('aSeed', new THREE.Float32BufferAttribute(buf.r, 1));
      if (buf.from) g.setAttribute('aFrom', new THREE.Float32BufferAttribute(buf.from(buf.p.length / 3), 3));
      return g;
    }
    const newBuf = () => ({ p: [], s: [], r: [] });
    const add = (b, x, y, z, s = .8 + rand() * .45, r = rand()) => { b.p.push(x, y, z); b.s.push(s); b.r.push(r); };

    /* ---------- Geometría ---------- */
    function boxCloud(b, cx, cy, cz, w, h, d, count) {
      const edges = Math.floor(count * .36);
      for (let i = 0; i < count; i++) {
        let x = (rand() - .5) * w, y = (rand() - .5) * h, z = (rand() - .5) * d;
        if (i < edges) { const ax = i % 3; if (ax === 0) { y = sgn() * h / 2; z = sgn() * d / 2 } else if (ax === 1) { x = sgn() * w / 2; z = sgn() * d / 2 } else { x = sgn() * w / 2; y = sgn() * h / 2 } }
        else { const f = i % 6; if (f === 0) x = -w / 2; if (f === 1) x = w / 2; if (f === 2) y = -h / 2; if (f === 3) y = h / 2; if (f === 4) z = -d / 2; if (f === 5) z = d / 2 }
        add(b, cx + x, cy + y, cz + z);
      }
    }
    const BOX_EDGES = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
    function wireBox(list, x, y, z, w, h, d) {
      const c = [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]].map(([a, b, e]) => [x + a * w / 2, y + b * h / 2, z + e * d / 2]);
      for (const [a, b] of BOX_EDGES) list.push(...c[a], ...c[b]);
    }
    const segs = (list, mat) => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(list, 3)); return new THREE.LineSegments(g, mat); };

    const wireMat = new THREE.LineBasicMaterial({ transparent: true, opacity: .22, depthWrite: false });
    const accentLineMat = new THREE.LineBasicMaterial({ transparent: true, opacity: .6, depthWrite: false });
    const pathMat = new THREE.LineBasicMaterial({ transparent: true, opacity: .5, depthWrite: false });
    const lineMats = { wire: wireMat, accentLine: accentLineMat, path: pathMat };

    const STATIONS_BY_LANG = {
      es: [
        { x: -7.1, z: .2, top: 1.33, base: [-.9, 2.9, 1.15, 2.2], k: '01', name: 'Ingreso de solicitudes', detail: 'Web · Formularios · Integraciones', lift: 62 },
        { x: -2.25, z: -1.2, top: 1.49, base: [-.8, 3.2, 1.25, 2.2], k: '02', name: 'Clasificación y reglas', detail: 'Prioridades · Asignación · Contexto', lift: 100 },
        { x: 2.55, z: .55, top: .42, base: [-.85, 3.4, 1.15, 2.4], k: '03', name: 'Ejecución del proceso', detail: 'Tareas · CRM · Automatizaciones', lift: 58 },
        { x: 7, z: -.6, top: 1.15, base: [-.88, 3.45, 1.17, 2.5], k: '04', name: 'Supervisión humana', detail: 'Excepciones · Validación · Control', lift: 162, flip: true }
      ],
      en: [
        { x: -7.1, z: .2, top: 1.33, base: [-.9, 2.9, 1.15, 2.2], k: '01', name: 'Request intake', detail: 'Web · Forms · Integrations', lift: 62 },
        { x: -2.25, z: -1.2, top: 1.49, base: [-.8, 3.2, 1.25, 2.2], k: '02', name: 'Classification and rules', detail: 'Priorities · Assignment · Context', lift: 100 },
        { x: 2.55, z: .55, top: .42, base: [-.85, 3.4, 1.15, 2.4], k: '03', name: 'Process execution', detail: 'Tasks · CRM · Automations', lift: 58 },
        { x: 7, z: -.6, top: 1.15, base: [-.88, 3.45, 1.17, 2.5], k: '04', name: 'Human oversight', detail: 'Exceptions · Validation · Control', lift: 162, flip: true }
      ]
    };
    const STATIONS = STATIONS_BY_LANG[document.documentElement.lang === 'en' ? 'en' : 'es'];

    const cloud = newBuf(), wires = [], accents = [];
    for (const s of STATIONS) { const [y, w, h, d] = s.base; boxCloud(cloud, s.x, y, s.z, w, h, d, Math.round(w * h * d * 170 + 520)); wireBox(wires, s.x, y, s.z, w, h, d) }
    // 01 · pantalla de entrada
    boxCloud(cloud, -7.1, .5, .2, 2.3, 1.65, .16, 900); wireBox(wires, -7.1, .5, .2, 2.3, 1.65, .16);
    for (let i = 0; i < 4; i++) accents.push(-7.95, .98 - i * .27, .3, -6.45 - i * .22, .98 - i * .27, .3);
    // 02 · capas de reglas
    for (let i = 0; i < 4; i++) { boxCloud(cloud, -2.25, .13 + i * .42, -1.2, 2.2, .19, 1.45, 440); wireBox(wires, -2.25, .13 + i * .42, -1.2, 2.2, .19, 1.45) }
    accents.push(-3.35, .13 + 3 * .42 + .095, -.475, -1.15, .13 + 3 * .42 + .095, -.475);
    // 04 · consola de supervisión
    boxCloud(cloud, 6.55, .35, -.52, 2.2, 1.6, .15, 900); wireBox(wires, 6.55, .35, -.52, 2.2, 1.6, .15);
    for (let i = 0; i < 3; i++) accents.push(5.7, .78 - i * .27, -.43, 6.9 - i * .3, .78 - i * .27, -.43);

    const scatter = (ox = 0, oy = 0, oz = 0) => n => { const a = []; for (let i = 0; i < n; i++) a.push((rand() - .5) * 30 - ox, -1.2 + rand() * 6.5 - oy, (rand() - .5) * 13 - 1 - oz); return a };
    cloud.from = scatter();
    world.add(new THREE.Points(pointsGeo(cloud), pointsMat({ size: .05, opacity: .72, twinkle: .18, defines: { ASSEMBLE: '' } })));
    world.add(segs(wires, wireMat));
    world.add(segs(accents, accentLineMat));

    // 03 · tareas: tres cubos que flotan suavemente
    const cubeMat = pointsMat({ size: .048, opacity: .82, twinkle: .2, defines: { ASSEMBLE: '' } });
    const cubes = [];
    for (let i = 0; i < 3; i++) {
      const g = new THREE.Group(), b = newBuf(), w = [];
      boxCloud(b, 0, 0, 0, .64, .68, .65, 300); wireBox(w, 0, 0, 0, .64, .68, .65); b.from = scatter(1.55 + i, -.02, .55);
      g.add(new THREE.Points(pointsGeo(b), cubeMat), segs(w, wireMat));
      g.position.set(1.55 + i, -.02, .55); world.add(g); cubes.push(g);
    }

    // Terreno: malla ondulada con bordes que se desvanecen
    {
      const b = newBuf(), cols = 136, rows = 86;
      for (let zi = 0; zi < rows; zi++) for (let xi = 0; xi < cols; xi++) {
        const x = (xi / (cols - 1) - .5) * 34 + (rand() - .5) * .08, z = (zi / (rows - 1) - .5) * 22 - 1 + (rand() - .5) * .08;
        add(b, x, -3.1 + .35 * Math.sin(x * .64 + z * .7) + .23 * Math.cos(x * .42 - z * .9), z, .75 + rand() * .5);
      }
      world.add(new THREE.Points(pointsGeo(b), pointsMat({ size: .042, opacity: .42, role: 'terrain', defines: { WAVE: '' }, wave: .12, scan: .55 })));
    }

    // Rutas entre estaciones (salen del frente de cada base, no atraviesan pantallas)
    const paths = [];
    for (let i = 0; i < 3; i++) {
      const a = STATIONS[i], b = STATIONS[i + 1], ya = a.base[0] + a.base[2] / 2 + .04, yb = b.base[0] + b.base[2] / 2 + .04;
      const fa = a.z + a.base[3] / 2 - .35, fb = b.z + b.base[3] / 2 - .35;
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(a.x + .2, ya, fa), new THREE.Vector3(a.x + a.base[1] / 2 - .15, ya, fa),
        new THREE.Vector3((a.x + b.x) / 2, Math.max(ya, yb) + .55, (fa + fb) / 2 + .7),
        new THREE.Vector3(b.x - b.base[1] / 2 + .15, yb, fb), new THREE.Vector3(b.x - .2, yb, fb)
      ], false, 'centripetal');
      paths.push(curve);
      world.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getSpacedPoints(140)), pathMat));
    }

    // Pulsos con estela que recorren las rutas
    const COMETS = 3, TAIL = 10, pulseBuf = newBuf(), tailAlpha = [];
    for (let p = 0; p < paths.length; p++) for (let c = 0; c < COMETS; c++) for (let k = 0; k < TAIL; k++) { const f = 1 - k / TAIL; add(pulseBuf, 0, 0, 0, .25 + .75 * f * f, 0); tailAlpha.push(f * f) }
    const pulseGeo = pointsGeo(pulseBuf);
    world.add(new THREE.Points(pulseGeo, pointsMat({ size: .42, opacity: 1, role: 'accent', defines: { GLOW: '' }, scan: 0, late: 1 })));
    const pPos = pulseGeo.attributes.position, pAlpha = pulseGeo.attributes.aSeed, tmp = new THREE.Vector3();

    // Balizas: anillos que se expanden bajo cada estación + punto de anclaje de la etiqueta
    const ringBuf = newBuf();
    for (let ph = 0; ph < 2; ph++) for (let i = 0; i < 90; i++) { const t = i / 90 * Math.PI * 2; add(ringBuf, Math.cos(t), 0, Math.sin(t), 1, ph * .5) }
    const ringGeo = pointsGeo(ringBuf), ringMat = pointsMat({ size: .05, opacity: .55, role: 'accent', defines: { RING: '' }, scan: 0, late: 1 });
    const anchors = [], glowBuf = newBuf();
    STATIONS.forEach((s) => {
      const r = new THREE.Points(ringGeo, ringMat); r.position.set(s.x, s.base[0] - s.base[2] / 2 - .02, s.z); world.add(r);
      add(glowBuf, s.x, s.top + .1, s.z, 1, 1);
      anchors.push(new THREE.Vector3(s.x - CENTER_X, s.top + .1, s.z));
    });
    world.add(new THREE.Points(pointsGeo(glowBuf), pointsMat({ size: .5, opacity: 1, role: 'accent', defines: { GLOW: '' }, scan: 0, late: 1 })));

    /* ---------- Caos inicial: canales sueltos ---------- */
    const CHIPS_BY_LANG = {
      es: ['WhatsApp', 'Correo sin responder', 'Formulario web', 'Llamada perdida', 'Excel compartido', 'DM de Instagram', 'Nota de voz', 'Factura pendiente'],
      en: ['WhatsApp', 'Unanswered email', 'Web form', 'Missed call', 'Shared spreadsheet', 'Instagram DM', 'Voice note', 'Pending invoice']
    };
    const CHIPS = CHIPS_BY_LANG[document.documentElement.lang === 'en' ? 'en' : 'es'];
    const chips = CHIPS.map((txt, i) => {
      const el = document.createElement('span'); el.className = 'hw-chip';
      const dot = document.createElement('i'); el.append(dot, txt); chipLayer.append(el);
      return { el, pos: new THREE.Vector3(-8 + i * 2.35 + (rand() - .5) * .8 - CENTER_X, 1.15 + (i % 3) * 1.05 + rand() * .25, (i % 2 ? .95 : -.95) + (rand() - .5) * .5), ph: rand() * 6.28 };
    });

    /* ---------- Etiquetas ---------- */
    const labels = STATIONS.map(s => {
      const el = document.createElement('div'); el.className = 'hw-node' + (s.flip ? ' flip' : ''); el.style.setProperty('--lift', s.lift + 'px');
      const card = document.createElement('div'); card.className = 'hw-card';
      const k = document.createElement('span'); k.className = 'hw-kicker'; k.textContent = `${s.k} / ${document.documentElement.lang === 'en' ? 'PROCESS' : 'PROCESO'}`;
      const n = document.createElement('strong'); n.textContent = s.name;
      const d = document.createElement('small'); d.textContent = s.detail;
      card.append(k, n, d); el.append(card); layer.append(el); return el;
    });

    /* ---------- Paleta fija del hero oscuro ---------- */
    const PAL = { cloud: 0xa6d0d8, terrain: 0x8fbfca, accent: 0x35e0d0, wire: 0x9ec2cb, cloudO: .68, terrainO: .34, wireO: .2, accentLineO: .7, pathO: .55, ringO: .6 };
    const accentTarget = new THREE.Color(), lineTargets = { wire: new THREE.Color(), accentLine: new THREE.Color(), path: new THREE.Color() }, lineOp = {};
    function setTheme() {
      accentTarget.setHex(PAL.accent);
      for (const m of mats) {
        const r = m.userData.role;
        m.userData.target.setHex(r === 'terrain' ? PAL.terrain : r === 'accent' ? PAL.accent : PAL.cloud);
        m.userData.targetOpacity = r === 'terrain' ? PAL.terrainO : r === 'accent' ? (m === ringMat ? PAL.ringO : 1) : PAL.cloudO * (m.userData.baseOpacity / .72);
        m.uniforms.uColor.value.copy(m.userData.target);
        m.uniforms.uOpacity.value = m.userData.targetOpacity;
      }
      lineTargets.wire.setHex(PAL.wire); lineTargets.accentLine.setHex(PAL.accent); lineTargets.path.setHex(PAL.accent);
      lineOp.wire = PAL.wireO; lineOp.accentLine = PAL.accentLineO; lineOp.path = PAL.pathO;
      wireMat.color.copy(lineTargets.wire); wireMat.opacity = PAL.wireO;
      accentLineMat.color.copy(lineTargets.accentLine); accentLineMat.opacity = PAL.accentLineO;
      pathMat.color.copy(lineTargets.path); pathMat.opacity = PAL.pathO;
      U.uAccent.value.copy(accentTarget);
    }

    /* ---------- Layout: encuadre en el espacio libre a la derecha del texto ---------- */
    let dist = 28, W = 1, H = 1, regionLeft = 0;
    function layout() {
      W = hero.clientWidth; H = hero.clientHeight; if (!W || !H) return;
      const pr = Math.min(window.devicePixelRatio || 1, 1.75);
      renderer.setPixelRatio(pr); renderer.setSize(W, H, false);
      const hr = hero.getBoundingClientRect(), ir = intro.getBoundingClientRect(), t = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
      let left, right, cy, span;
      if (W <= 1180) {
        const top = Math.max(ir.bottom - hr.top + 10, H * 0.5);
        hero.style.setProperty('--scene-top', top + 'px');
        left = W * .02; right = W * .98; cy = (top + H - 30) / 2; span = CONTENT_W * 1.08;
      } else {
        const ix = ir.right - hr.left; hero.style.setProperty('--fade-x', ix + 'px');
        left = Math.min(ix + W * .015, W * .56); right = W * .925; cy = H * .58; span = CONTENT_W * .9;
      }
      regionLeft = left;
      const rw = right - left, cx = (left + right) / 2 - W * .014;
      dist = THREE.MathUtils.clamp(span * H / (rw * 2 * t), 15, 90);
      camera.aspect = W / H; camera.setViewOffset(W, H, W / 2 - cx, H / 2 - cy, W, H); camera.updateProjectionMatrix();
      U.uScale.value = H * pr / (2 * t); U.uMinPx.value = 1.5 * pr; U.uFogNear.value = dist - 9; U.uFogFar.value = dist + 13;
      kick();
    }

    /* ---------- Interacción ---------- */
    let yaw = 0, pitch = 0, tYaw = 0, tPitch = 0;
    if (FINE && !REDUCE) window.addEventListener('pointermove', e => { tYaw = (e.clientX / window.innerWidth - .5) * .12; tPitch = (e.clientY / window.innerHeight - .5) * -.05; kick() }, { passive: true });

    /* ---------- Render ---------- */
    let active = -1, start = -1;
    const sstep = (a, b, x) => { x = Math.min(1, Math.max(0, (x - a) / (b - a))); return x * x * (3 - 2 * x) };
    function render(now) {
      const t = REDUCE ? 11.5 : now / 1000;
      if (start < 0) start = now;
      const since = (now - start) / 1000;
      let assemble = REDUCE ? 1 : 0, fadeIn = REDUCE ? 1 : 0, wireFade = REDUCE ? 1 : 0;
      if (!REDUCE) { assemble = Math.min(1, Math.max(0, (since - 1.1) / 3)); fadeIn = sstep(.75, 1, assemble); wireFade = sstep(.45, .95, assemble) }
      U.uAssemble.value = assemble; U.uFadeIn.value = fadeIn; U.uScanAmt.value = REDUCE ? 0 : fadeIn;
      U.uTime.value = t;
      U.uScanX.value = REDUCE ? -99 : ((t * 2.6) % 36) - 18;

      yaw += (tYaw - yaw) * .05; pitch += (tPitch - pitch) * .05;
      const y = yaw + (REDUCE ? 0 : Math.sin(t * .13) * .035), e = ELEV + pitch;
      camera.position.set(Math.sin(y) * Math.cos(e) * dist, TARGET.y + Math.sin(e) * dist, Math.cos(y) * Math.cos(e) * dist);
      camera.lookAt(TARGET);

      let idx = 0;
      for (let p = 0; p < paths.length; p++) for (let c = 0; c < COMETS; c++) {
        const head = (t * .1 + c / COMETS + p * .17) % 1, edge = Math.min(1, head * 10, (1 - head) * 10);
        for (let k = 0; k < TAIL; k++) {
          paths[p].getPointAt(Math.max(0, head - k * .013), tmp);
          pPos.setXYZ(idx, tmp.x, tmp.y, tmp.z); pAlpha.setX(idx, tailAlpha[idx] * edge); idx++;
        }
      }
      pPos.needsUpdate = true; pAlpha.needsUpdate = true;
      cubes.forEach((c, i) => { c.position.y = -.02 + (REDUCE ? 0 : Math.sin(t * 1.5 + i * 1.1) * .07); c.rotation.y = REDUCE ? 0 : Math.sin(t * .6 + i) * .12 });

      renderer.render(scene, camera);

      for (let i = 0; i < labels.length; i++) {
        tmp.copy(anchors[i]).project(camera);
        const x = (tmp.x + 1) * .5 * W, yy = (1 - tmp.y) * .5 * H, hide = tmp.z > 1 || x < regionLeft - 30 || x > W - 60;
        labels[i].style.transform = `translate3d(${x.toFixed(1)}px,${yy.toFixed(1)}px,0)`;
        labels[i].style.opacity = hide ? '0' : String(fadeIn);
      }
      const chipO = REDUCE ? 0 : sstep(0, .5, since) * (1 - sstep(.05, .45, assemble));
      for (const c of chips) {
        if (chipO <= 0) { c.el.style.opacity = '0'; continue }
        tmp.copy(c.pos); tmp.x += Math.sin(t * .6 + c.ph) * .25; tmp.y += Math.cos(t * .5 + c.ph) * .18 - assemble * 1.2; tmp.project(camera);
        c.el.style.transform = `translate3d(${((tmp.x + 1) * .5 * W).toFixed(1)}px,${((1 - tmp.y) * .5 * H).toFixed(1)}px,0) translate(-50%,-50%) scale(${(1 - assemble * .4).toFixed(3)})`;
        c.el.style.opacity = chipO.toFixed(3);
      }
      const a = REDUCE || fadeIn < 1 ? -1 : Math.floor(t / 2.6) % 4;
      if (a !== active) { active = a; labels.forEach((l, i) => l.classList.toggle('is-active', i === a)) }
    }

    // Un único bucle: nunca se duplica, se pausa fuera de pantalla o con la pestaña oculta.
    let raf = 0, onscreen = true;
    const shouldLoop = () => !REDUCE && onscreen && !document.hidden;
    function frame(now) { raf = 0; render(now); if (shouldLoop()) raf = requestAnimationFrame(frame) }
    function kick() { if (!raf) raf = requestAnimationFrame(frame) }
    document.addEventListener('visibilitychange', kick);
    new IntersectionObserver(([en]) => { onscreen = en.isIntersecting; kick() }).observe(hero);
    new ResizeObserver(layout).observe(hero);
    if (document.fonts) document.fonts.ready.then(layout);
    layer.style.transition = 'none';

    setTheme(); layout();
    requestAnimationFrame(() => host.classList.add('ready'));
  })();
}
