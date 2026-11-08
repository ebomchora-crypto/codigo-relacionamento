import * as THREE from "./node_modules/three/build/three.module.js";

/* ------------------------------------------------------------------ */
/*  Utilidades                                                         */
/* ------------------------------------------------------------------ */
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const seg = (t, a, b) => clamp((t - a) / (b - a));
const lerp = (a, b, k) => a + (b - a) * k;
const easeOut = (k) => 1 - Math.pow(1 - k, 3);
const easeInOut = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
const easeBack = (k) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); };
function rng(seed) { let a = seed; return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const R = rng(7);

const timeline = await (await fetch("./timeline.json")).json();
const L = timeline.lines.map((l) => l.t0);
const TOTAL = timeline.total;

const params = new URLSearchParams(location.search);
const W = window.innerWidth, H = window.innerHeight;

/* ------------------------------------------------------------------ */
/*  Renderer / cena                                                    */
/* ------------------------------------------------------------------ */
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(W, H);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById("stage").prepend(renderer.domElement);

const scene = new THREE.Scene();
const FOG = 0xf2c4a2;
scene.fog = new THREE.Fog(FOG, 46, 175);

// céu em gradiente (entardecer dourado)
{
  const c = document.createElement("canvas"); c.width = 4; c.height = 512;
  const g = c.getContext("2d"); const gr = g.createLinearGradient(0, 0, 0, 512);
  gr.addColorStop(0, "#2d3f8f"); gr.addColorStop(0.35, "#7a5fb0"); gr.addColorStop(0.62, "#e0799a"); gr.addColorStop(0.82, "#ffb878"); gr.addColorStop(1, "#ffd9a0");
  g.fillStyle = gr; g.fillRect(0, 0, 4, 512);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; scene.background = tex;
}

const camera = new THREE.PerspectiveCamera(52, W / H, 0.1, 400);
camera.setViewOffset(W, H, 0, H * 0.11, W, H);

const std = (color, o = {}) => new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.9, metalness: 0, ...o });

scene.add(new THREE.HemisphereLight(0xfff0dc, 0x6a8a68, 1.3));
const sun = new THREE.DirectionalLight(0xffdcb0, 1.9);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -22; sun.shadow.camera.right = 22; sun.shadow.camera.top = 26; sun.shadow.camera.bottom = -26;
sun.shadow.camera.near = 1; sun.shadow.camera.far = 80; sun.shadow.bias = -0.0006;
scene.add(sun); scene.add(sun.target);

/* ------------------------------------------------------------------ */
/*  Mundo: chão, hexágonos, árvores, colinas                            */
/* ------------------------------------------------------------------ */
const SP = 5.95, HEXR = 3.4;
const tz = (i) => -i * SP;

// chão
{
  const geo = new THREE.PlaneGeometry(420, 420, 60, 60); geo.rotateX(-Math.PI / 2);
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), z = p.getZ(i);
    const away = clamp((Math.abs(x) - 6) / 10);
    p.setY(i, (Math.sin(x * 0.21) * Math.cos(z * 0.17) * 0.5 + R() * 0.25) * away);
  }
  geo.computeVertexNormals();
  const ground = new THREE.Mesh(geo, std(0x4f9a52)); ground.position.set(0, -0.62, -100); ground.receiveShadow = true; scene.add(ground);
}

// hexágonos
const tiles = [];
for (let i = -1; i < 18; i++) {
  const grp = new THREE.Group();
  const top = new THREE.Mesh(new THREE.CylinderGeometry(HEXR, HEXR, 0.5, 6), std(0xf8f2e4));
  top.material.emissive.setRGB(0.16, 0.15, 0.13); top.rotation.y = Math.PI / 6; top.position.y = -0.25; top.receiveShadow = true; top.castShadow = false;
  const base = new THREE.Mesh(new THREE.CylinderGeometry(HEXR + 0.14, HEXR + 0.14, 0.4, 6), std(0xcdbf9c));
  base.rotation.y = Math.PI / 6; base.position.y = -0.62; base.receiveShadow = true;
  grp.add(top, base); grp.position.set(0, 0, tz(i)); scene.add(grp);
  tiles.push({ top, base: top.material.color.clone() });
}
const tileIndex = (i) => tiles[i + 1];
const YELLOW = new THREE.Color(0xffeb8f), CREAM = new THREE.Color(0xf8f2e4);
function highlight(i, k) { const t = tileIndex(i); t.top.material.color.copy(CREAM).lerp(YELLOW, k); t.top.material.emissive.setRGB(0.16 + 0.1 * k, 0.15 + 0.06 * k, 0.13 - 0.09 * k); }

// árvores (instanciadas)
{
  const N = 620;
  const leaf = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1.5, 0), std(0xffffff), N);
  const trunk = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.22, 0.3, 1.4, 5), std(0x7a4b2a), N);
  leaf.castShadow = true; trunk.castShadow = true;
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), pos = new THREE.Vector3(), col = new THREE.Color();
  const greens = [0x2f8f4a, 0x3fa04c, 0x5ab04a, 0x287a45, 0x6fb84e];
  for (let i = 0; i < N; i++) {
    const side = R() < 0.5 ? -1 : 1;
    const x = side * (7.5 + Math.pow(R(), 1.4) * 60), z = 30 - R() * 240;
    const sc = 0.8 + R() * 1.1;
    pos.set(x, 0.9 * sc + 0.2, z); q.setFromEuler(new THREE.Euler(0, R() * 6, 0)); s.set(sc, sc * (0.9 + R() * 0.4), sc);
    m.compose(new THREE.Vector3(x, 1.7 * sc + 0.6, z), q, s); leaf.setMatrixAt(i, m);
    col.setHex(greens[Math.floor(R() * greens.length)]); col.lerp(new THREE.Color(0xffd28a), 0.12); leaf.setColorAt(i, col);
    m.compose(new THREE.Vector3(x, 0.55 * sc, z), q, new THREE.Vector3(sc, sc, sc)); trunk.setMatrixAt(i, m);
  }
  scene.add(leaf, trunk);
}
// arbustos / pedras
{
  const N = 160; const bush = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.8, 0), std(0xffffff), N);
  const m = new THREE.Matrix4(), col = new THREE.Color();
  for (let i = 0; i < N; i++) {
    const side = R() < 0.5 ? -1 : 1; const x = side * (4.6 + R() * 14), z = 20 - R() * 150; const sc = 0.5 + R() * 0.9;
    m.compose(new THREE.Vector3(x, 0.2, z), new THREE.Quaternion(), new THREE.Vector3(sc * 1.3, sc, sc * 1.1));
    bush.setMatrixAt(i, m); col.setHex(R() < 0.7 ? 0x4fa650 : 0xb9b3a4); bush.setColorAt(i, col);
  }
  bush.castShadow = true; scene.add(bush);
}
// colinhas distantes e sol
for (let i = 0; i < 9; i++) {
  const h = new THREE.Mesh(new THREE.ConeGeometry(26 + R() * 18, 22 + R() * 20, 6), new THREE.MeshBasicMaterial({ color: new THREE.Color(0x7a64b4).lerp(new THREE.Color(0xe39bb0), 0.35 + R() * 0.2), fog: true }));
  h.position.set(-120 + i * 30 + R() * 10, 6, -215 - R() * 20); scene.add(h);
}
{ const sunDisc = new THREE.Mesh(new THREE.CircleGeometry(15, 32), new THREE.MeshBasicMaterial({ color: 0xffe9b0, fog: false })); sunDisc.position.set(-34, 26, -300); scene.add(sunDisc); }

// vaga-lumes
const flies = [];
for (let i = 0; i < 70; i++) { const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.09, 6, 6), new THREE.MeshBasicMaterial({ color: 0xffe28a })); scene.add(mesh); flies.push({ mesh, x: (R() < 0.5 ? -1 : 1) * (4 + R() * 12), y: 0.8 + R() * 5, z: 10 - R() * 130, ph: R() * 6 }); }

/* ------------------------------------------------------------------ */
/*  Personagens                                                        */
/* ------------------------------------------------------------------ */
function makeHuman({ shirt = 0x4a9be8, pants = 0x2e3a59, skin = 0xf0c8a0, hair = 0x4a2f20 } = {}) {
  const g = new THREE.Group();
  const mk = (geo, c) => { const m = new THREE.Mesh(geo, std(c)); m.castShadow = true; return m; };
  const mkLeg = (sx) => { const p = new THREE.Group(); p.position.set(sx * 0.22, 0.95, 0); const m = mk(new THREE.BoxGeometry(0.36, 0.95, 0.38), pants); m.position.y = -0.47; p.add(m); g.add(p); return p; };
  const legL = mkLeg(-1), legR = mkLeg(1);
  const torso = mk(new THREE.BoxGeometry(1.0, 1.05, 0.58), shirt); torso.position.y = 1.5; g.add(torso);
  const mkArm = (sx) => { const p = new THREE.Group(); p.position.set(sx * 0.66, 1.95, 0); const m = mk(new THREE.BoxGeometry(0.3, 0.95, 0.32), shirt); m.position.y = -0.4; const hand = mk(new THREE.BoxGeometry(0.28, 0.26, 0.3), skin); hand.position.y = -0.95; p.add(m, hand); g.add(p); return p; };
  const armL = mkArm(-1), armR = mkArm(1);
  const head = new THREE.Group(); head.position.y = 2.42; g.add(head);
  const skull = mk(new THREE.SphereGeometry(0.45, 12, 10), skin); head.add(skull);
  const hairM = mk(new THREE.SphereGeometry(0.49, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.58), hair); hairM.rotation.x = -0.2; hairM.position.y = 0.03; head.add(hairM);
  for (const sx of [-1, 1]) { const e = new THREE.Mesh(new THREE.SphereGeometry(0.055, 6, 6), new THREE.MeshBasicMaterial({ color: 0x1b1230 })); e.position.set(sx * 0.16, 0.04, -0.41); head.add(e); }
  return { g, legL, legR, armL, armR, head, torso };
}
function pose(h, { walk = 0, amp = 0, arms = "down", breathe = 0, t = 0 }) {
  h.legL.rotation.x = Math.sin(walk) * 0.75 * amp; h.legR.rotation.x = -Math.sin(walk) * 0.75 * amp;
  const sw = Math.sin(walk) * 0.7 * amp;
  if (arms === "down") { h.armL.rotation.set(-sw, 0, 0.06); h.armR.rotation.set(sw, 0, -0.06); }
  else if (arms === "phone") { h.armL.rotation.set(-sw * 0.3, 0, 0.06); h.armR.rotation.set(1.25, 0, -0.12); }
  else if (arms === "out") { h.armL.rotation.set(0, 0, 1.45); h.armR.rotation.set(0, 0, -1.45); }
  else if (arms === "up") { h.armL.rotation.set(0, 0, 2.7); h.armR.rotation.set(0, 0, -2.7 + Math.sin(t * 9) * 0.35); }
  else if (arms === "run") { h.armL.rotation.set(-sw * 1.3, 0, 0.1); h.armR.rotation.set(sw * 1.3, 0, -0.1); }
  h.g.children[0].position.y = 0; // noop
  h.torso.scale.y = 1 + Math.sin(t * 3.2) * 0.012 * breathe;
  h.head.position.y = 2.42 + Math.abs(Math.sin(walk)) * 0.07 * amp;
}

const hero = makeHuman({ shirt: 0x4a9be8, hair: 0x4a2f20 });
const other = makeHuman({ shirt: 0xe86fa0, pants: 0x3a2f52, hair: 0x2a1a14, skin: 0xe9b88e }); other.g.scale.setScalar(1.15);

scene.add(hero.g, other.g);

// celular
function makePhone() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.62, 1.05, 0.08), std(0x22232b)); body.castShadow = true; g.add(body);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.54, 0.94), new THREE.MeshBasicMaterial({ color: 0xbfe6ff })); screen.position.z = 0.045; g.add(screen);
  return g;
}
const phone = makePhone(); hero.armR.add(phone); phone.position.set(0, -1.0, -0.2); phone.rotation.set(-0.35, Math.PI, 0);
const phoneOther = makePhone(); other.armR.add(phoneOther); phoneOther.position.set(0, -1.0, -0.2); phoneOther.rotation.set(-0.35, Math.PI, 0);
const phoneDropped = makePhone(); phoneDropped.visible = false; scene.add(phoneDropped);

/* ------------------------------------------------------------------ */
/*  Adereços                                                           */
/* ------------------------------------------------------------------ */
function makeBubble(color = 0xffffff, lines = false) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 0.95, 4, 10), std(color, { roughness: 0.6, emissive: 0x555555 })); body.rotation.z = Math.PI / 2; body.castShadow = true; g.add(body);
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.4, 4), std(color)); tail.position.set(-0.55, -0.45, 0); tail.rotation.z = 0.5; g.add(tail);
  if (lines) { for (let i = 0; i < 3; i++) { const l = new THREE.Mesh(new THREE.BoxGeometry(1.1 - i * 0.25, 0.1, 0.05), new THREE.MeshBasicMaterial({ color: 0x9aa3b8 })); l.position.set(-0.15 * i, 0.22 - i * 0.22, 0.43); g.add(l); } }
  else { for (let i = -1; i <= 1; i++) { const d = new THREE.Mesh(new THREE.SphereGeometry(0.09, 6, 6), new THREE.MeshBasicMaterial({ color: 0x7c86a3 })); d.position.set(i * 0.28, 0, 0.43); g.add(d); } }
  return g;
}
function makeX() { const g = new THREE.Group(); for (const a of [Math.PI / 4, -Math.PI / 4]) { const b = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.0, 0.16), new THREE.MeshBasicMaterial({ color: 0xe5383b })); b.rotation.z = a; g.add(b); } return g; }
function makeCheck(color = 0x2ecc71) { const g = new THREE.Group(); const a = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.6, 0.16), new THREE.MeshBasicMaterial({ color })); a.position.set(-0.22, -0.1, 0); a.rotation.z = 0.78; const b = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.1, 0.16), new THREE.MeshBasicMaterial({ color })); b.position.set(0.2, 0.1, 0); b.rotation.z = -0.78; g.add(a, b); return g; }

// mensagens enviadas (3) e marcas X
const sent = [0, 1, 2].map((k) => { const b = makeBubble(0xffffff); b.visible = false; scene.add(b); const x = makeX(); x.visible = false; x.scale.setScalar(0.7); scene.add(x); return { b, x, send: L[1] + 0.12 + [0, 0.95, 1.6][k], dur: 1.05, land: new THREE.Vector3(-0.9 + k * 0.9, 0.62, tz(5) + 3.1 + k * 0.1) }; });

// pausa
const pause = new THREE.Group(); { for (const sx of [-0.35, 0.35]) { const b = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.5, 0.4), std(0xffc233)); b.position.x = sx; b.castShadow = true; pause.add(b); } } pause.visible = false; scene.add(pause);

// sopros
const puffs = Array.from({ length: 6 }, () => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 })); m.visible = false; scene.add(m); return m; });

// placas
const signs = [0, 1, 2].map((k) => { const g = new THREE.Group(); const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.8, 6), std(0x6b4a2b)); pole.position.y = 0.9; const board = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.9, 0.12), std(0xffb703)); board.position.y = 2.0; board.castShadow = true; const q = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.5, 0.05), new THREE.MeshBasicMaterial({ color: 0x1b1230 })); q.position.set(0, 2.0, 0.09); g.add(pole, board, q); g.visible = false; scene.add(g); return { g, board }; });
const SIGN_POS = [[1.5, -1.6], [2.35, 0.1], [1.2, 1.5]];

// lupa
const lens = new THREE.Group(); { const ring = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.1, 6, 16), std(0xffc233)); const glass = new THREE.Mesh(new THREE.CircleGeometry(0.58, 16), new THREE.MeshBasicMaterial({ color: 0x9fd8ff, transparent: true, opacity: 0.35 })); const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.9, 6), std(0x6b4a2b)); handle.position.set(0.55, -0.7, 0); handle.rotation.z = 0.7; lens.add(ring, glass, handle); lens.visible = false; scene.add(lens); }

// balança
const scale = new THREE.Group(); const beam = new THREE.Group(); const plates = [];
{
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 3.0, 6), std(0x8a6a44)); post.position.y = 1.5; post.castShadow = true; scene.add(scale); scale.add(post);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.0, 0.3, 6), std(0xb5925e)); base.position.y = 0.15; scale.add(base);
  beam.position.y = 3.0; scale.add(beam);
  const bar = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.2, 0.2), std(0xffc233)); bar.castShadow = true; beam.add(bar);
  for (const sx of [-1, 1]) { const pl = new THREE.Group(); pl.position.x = sx * 1.9; const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.12, 14), std(0xe8e0cc)); plate.position.y = -1.3; const strings = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.3, 4), std(0x6b4a2b)); strings.position.y = -0.65; pl.add(plate, strings); const coins = []; for (let i = 0; i < 5; i++) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.14, 12), std(0xffc233, { metalness: 0.2 })); c.position.set((i % 2) * 0.1, -1.18 + i * 0.15, 0); c.castShadow = true; pl.add(c); coins.push(c); } beam.add(pl); plates.push({ pl, coins }); }
  scale.visible = false;
}

// livro (capa)
const book = new THREE.Group();
{
  const tex = await new THREE.TextureLoader().loadAsync("/public/images/ebook-cover-hd.jpg"); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  const side = new THREE.MeshStandardMaterial({ color: 0xe9dfc6, roughness: 0.8 });
  const front = new THREE.MeshBasicMaterial({ map: tex });
  const mats = [side, side, side, side, front, front.clone()];
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(3.7, 3.7, 0.34), mats); mesh.castShadow = true; book.add(mesh);
  const glow = new THREE.Mesh(new THREE.CircleGeometry(3.4, 24), new THREE.MeshBasicMaterial({ color: 0xffd98a, transparent: true, opacity: 0.28 })); glow.position.z = -0.4; book.add(glow);
  book.visible = false; scene.add(book);
}
// brilhos
const sparks = Array.from({ length: 14 }, (_, i) => { const m = new THREE.Mesh(new THREE.OctahedronGeometry(0.2, 0), new THREE.MeshBasicMaterial({ color: 0xffe28a })); m.visible = false; scene.add(m); return { m, a: (i / 14) * Math.PI * 2, r: 2.4 + R() * 1.4, y: (R() - 0.5) * 3.4, ph: R() * 6 }; });
// confete
const CONF = 160; const confetti = new THREE.InstancedMesh(new THREE.BoxGeometry(0.22, 0.12, 0.02), new THREE.MeshBasicMaterial({ color: 0xffffff }), CONF); confetti.visible = false; scene.add(confetti);
const confData = Array.from({ length: CONF }, () => ({ vx: (R() - 0.5) * 11, vy: 5 + R() * 9, vz: (R() - 0.2) * 5, rot: R() * 8, c: [0xffd23f, 0xff6b9a, 0x58d68d, 0x5dade2, 0xffffff][Math.floor(R() * 5)] }));
{ const col = new THREE.Color(); confData.forEach((d, i) => { col.setHex(d.c); confetti.setColorAt(i, col); }); }

// grande balão com check (passo 3)
const bigBubble = makeBubble(0xffffff, true); bigBubble.scale.setScalar(1.35); bigBubble.visible = false; scene.add(bigBubble);
const bigCheck = makeCheck(); bigCheck.scale.setScalar(0.9); bigCheck.visible = false; scene.add(bigCheck);

// pílulas e títulos (DOM)
const ui = document.getElementById("ui");
const mkEl = (cls, html) => { const d = document.createElement("div"); d.className = cls; d.innerHTML = html; ui.appendChild(d); return d; };
const capEl = mkEl("", ""); capEl.id = "cap";
const ctaEl = mkEl("", `<div class="btn">Fazer análise grátis</div><div class="sub">8 perguntas · sem cadastro</div>`); ctaEl.id = "cta";

const v3 = new THREE.Vector3();
const heroPos = new THREE.Vector3(), otherPos = new THREE.Vector3();
const pills = []; const titles = [];
const COL = { blue: "#3b82f6", red: "#ef4444", green: "#22c55e", gray: "#8b8fa3", yellow: "#f5b301", pink: "#ec4899" };
function pill(text, color, a, b, anchor) { const el = mkEl("pill", `<i style="background:${COL[color]}"></i>${text}`); pills.push({ el, a, b, anchor }); }
function title(text, a, b, anchor, rot = -5) { const el = mkEl("title", text); titles.push({ el, a, b, anchor, rot }); }

/* ---- posições dos personagens -------------------------------------- */
const HERO_X = -1.45;
function heroX(t) { let x = HERO_X; x = lerp(x, -2.8, easeInOut(seg(t, L[6] + 0.9, L[6] + 1.5))); x = lerp(x, HERO_X, easeInOut(seg(t, L[7] - 0.05, L[7] + 0.6))); x = lerp(x, -3.0, easeInOut(seg(t, L[8] - 0.15, L[8] + 1.3))); return x; }
function heroState(t) {
  const segs = [
    { a: L[2] + 0.25, b: L[2] + 2.95, from: 0, to: 3, run: true },
    { a: L[4], b: L[4] + 1.3, from: 3, to: 4 },
    { a: L[5], b: L[5] + 1.3, from: 4, to: 5 },
    { a: L[6], b: L[6] + 1.3, from: 5, to: 6 },
    { a: L[7], b: L[7] + 1.3, from: 6, to: 7 },
    { a: L[8] - 0.15, b: L[8] + 1.3, from: 7, to: 9 },
  ];
  let tile = 0, moving = false, run = false;
  for (const s of segs) {
    if (t >= s.b) tile = s.to;
    else if (t > s.a) { tile = lerp(s.from, s.to, easeInOut(seg(t, s.a, s.b))); moving = true; run = !!s.run; break; }
    else break;
  }
  return { z: tz(tile), tile, moving, run };
}
function otherState(t) {
  const a = L[2], b = L[2] + 3.6; const k = seg(t, a, b);
  const tile = lerp(5, 11, easeInOut(k) * 0.95 + k * 0.05);
  return { z: tz(tile), moving: k > 0 && k < 1 };
}

/* ---- pills / títulos --------------------------------------------------- */
const aHero = (dy = 3.9) => () => v3.set(heroPos.x, heroPos.y + dy, heroPos.z);
const aOther = (dy = 3.9) => () => v3.set(otherPos.x, otherPos.y + dy, otherPos.z);
pill("Você", "blue", L[0] + 0.1, L[1] + 0.1, aHero(3.6));
pill("Visualizou", "blue", L[0] + 0.45, L[1] + 0.6, aOther(4.6));
pill("Sem resposta", "red", L[0] + 1.15, L[2] + 0.2, aOther(3.6));
pill("Impulso", "red", L[1] + 1.0, L[2] + 0.9, aHero(3.6));
pill("Correndo atrás", "red", L[2] + 0.6, L[3] - 0.2, aHero(3.6));
pill("Silêncio", "gray", L[2] + 1.2, L[3] - 0.1, () => v3.set(0, 4.5, tz(5) + 2.6 - 2.5 * 0));
title("1. Respire", L[3] + 0.1, L[4] + 0.9, () => v3.set(0.9, 5.4, tz(3)));
pill("Não envie", "red", L[3] + 0.95, L[4] + 0.3, aHero(3.6));
pill("Respire fundo", "green", L[3] + 1.6, L[4] + 0.3, () => v3.set(heroPos.x + 3.2, 4.6, heroPos.z));
title("2. Entenda o sinal", L[4] + 1.25, L[5] + 0.9, () => v3.set(0.6, 5.7, tz(4)));
pill("Ocupado?", "yellow", L[4] + 1.6, L[5] + 0.3, () => v3.set(SIGN_POS[0][0], 4.0, tz(4) + SIGN_POS[0][1]));
pill("Distante?", "yellow", L[4] + 2.1, L[5] + 0.3, () => v3.set(SIGN_POS[1][0], 4.0, tz(4) + SIGN_POS[1][1]));
pill("Mudou?", "yellow", L[4] + 2.6, L[5] + 0.3, () => v3.set(SIGN_POS[2][0], 4.0, tz(4) + SIGN_POS[2][1]));
pill("Silêncio ≠ desinteresse", "green", L[4] + 3.15, L[5] + 0.5, aHero(4.6));
title("3. Sem carência", L[5] + 1.25, L[6] + 0.9, () => v3.set(0.5, 6.2, tz(5)));
pill("Clara", "green", L[5] + 1.9, L[6] + 0.3, () => v3.set(heroPos.x + 3.0, 3.2, heroPos.z - 0.3));
pill("Calma", "blue", L[5] + 2.4, L[6] + 0.3, () => v3.set(heroPos.x + 3.0, 4.6, heroPos.z - 0.3));
title("4. Reciprocidade", L[6] + 1.2, L[7] + 0.9, () => v3.set(0.5, 6.6, tz(6)));
pill("Só você", "red", L[6] + 1.7, L[6] + 2.55, () => v3.set(scale.position.x - 1.5, 3.7, scale.position.z));
pill("Dos dois", "green", L[6] + 2.9, L[7] + 0.4, () => v3.set(scale.position.x, 5.0, scale.position.z));
pill("8 perguntas", "blue", L[7] + 0.9, L[8] + 2.6, () => v3.set(-2.8, 6.4, tz(8)));
pill("Sem cadastro", "green", L[7] + 1.5, L[8] + 2.6, () => v3.set(3.0, 5.4, tz(8)));
pill("Resultado personalizado", "pink", L[7] + 2.1, L[8] + 2.6, () => v3.set(0, 1.0, tz(8)));

/* ---- legendas palavra a palavra ----------------------------------------- */
const words = []; timeline.lines.forEach((l) => l.words.forEach((w) => words.push({ w: w.w, a: l.t0 + w.t0, b: l.t0 + w.t1, hi: w.hi })));

/* ------------------------------------------------------------------ */
/*  Quadro em função do tempo                                          */
/* ------------------------------------------------------------------ */
function project(vec) { const p = vec.clone().project(camera); return { x: (p.x * 0.5 + 0.5) * W, y: (-p.y * 0.5 + 0.5) * H, z: p.z }; }

function setTime(t) {
  const hs = heroState(t), os = otherState(t);
  const u = H / 1280;

  /* herói */
  hero.g.position.set(heroX(t), 0, hs.z);
  const walkPh = (-hs.z) * 1.9;
  let arms = "down", amp = 0;
  if (hs.moving) { arms = hs.run ? "run" : "down"; amp = hs.run ? 1.15 : 0.8; }
  else if (t < L[3] + 0.9) arms = "phone";
  else if (t >= L[5] + 1.3 && t < L[6]) arms = "out";
  else if (t >= L[8] + 1.6) arms = "up";
  if (hs.moving && !hs.run && t < L[3] + 0.9) arms = "phone";
  pose(hero, { walk: walkPh, amp, arms, breathe: 1, t });
  hero.g.rotation.y = lerp(0, Math.PI, easeOut(seg(t, L[8] + 1.3, L[8] + 1.7)));
  heroPos.set(hero.g.position.x, 0, hero.g.position.z);
  // ansiedade: tremidinha durante o envio
  if (t > L[1] && t < L[2] + 0.2) hero.g.position.x += Math.sin(t * 38) * 0.03;

  // celular do herói
  phone.visible = t < L[3] + 0.88;
  const dropK = seg(t, L[3] + 0.88, L[3] + 1.3);
  phoneDropped.visible = t >= L[3] + 0.88;
  phoneDropped.position.set(HERO_X + 0.7, lerp(2.2, 0.08, dropK * dropK), tz(3) - 1.1); phoneDropped.rotation.set(lerp(0, -Math.PI / 2, easeOut(dropK)), 0.4, 0.2);
  phoneDropped.visible = phoneDropped.visible && t < L[4] + 0.3;

  /* a outra pessoa */
  other.g.position.set(0.2, 0, os.z);
  pose(other, { walk: (-os.z) * 1.7, amp: os.moving ? 0.55 : 0, arms: "phone", breathe: 1, t });
  other.g.visible = os.z > tz(10.4);
  otherPos.set(0.2, 0, os.z);
  phoneOther.visible = true;

  /* mensagens enviadas */
  sent.forEach((s, k) => {
    const kk = (t - s.send) / s.dur;
    if (kk < 0) { s.b.visible = false; s.x.visible = false; return; }
    const kc = clamp(kk); const start = new THREE.Vector3(hero.g.position.x + 0.2, 2.6, heroPos.z - 0.8);
    const p = start.clone().lerp(s.land, easeInOut(kc)); p.y += Math.sin(kc * Math.PI) * 4.2 * (1 - 0.1 * k);
    const fade = 1 - seg(t, L[3] - 0.35, L[3] - 0.05);
    s.b.visible = fade > 0.01; s.b.position.copy(p); s.b.rotation.set(0, 0, kc < 1 ? kk * 1.4 : 0);
    const sc = (kc < 1 ? 0.8 + 0.2 * Math.sin(kc * 3) : 1) * fade; s.b.scale.setScalar(Math.max(0.001, sc));
    const xk = seg(t, s.send + s.dur, s.send + s.dur + 0.28);
    s.x.visible = xk > 0 && fade > 0.01; s.x.position.set(s.land.x, s.land.y + 1.5, s.land.z); s.x.scale.setScalar(0.75 * easeBack(xk) * fade);
  });

  /* passo 1 — respire */
  highlight(3, easeOut(seg(t, L[3] - 0.1, L[3] + 0.6)) * (1 - seg(t, L[4] - 0.1, L[4] + 0.5)));
  pause.visible = t > L[3] + 0.5 && t < L[4] + 0.2; pause.position.set(2.0, 2.4 + Math.sin(t * 2.4) * 0.12, tz(3) - 0.5); pause.scale.setScalar(easeBack(seg(t, L[3] + 0.5, L[3] + 0.85)));
  puffs.forEach((m, i) => {
    const per = 1.25, base = L[3] + 1.3 + i * per * 0.55; const k = (t - base) / 1.6;
    const on = t > L[3] + 1.2 && t < L[4] + 0.2 && k > 0 && k < 1;
    m.visible = on; if (on) { m.position.set(heroPos.x - 0.1, 2.5 + k * 1.1, heroPos.z - 1.0 - k * 0.8); m.scale.setScalar(0.6 + k * 1.5); m.material.opacity = (1 - k) * 0.75; }
  });

  /* passo 2 — entenda o sinal */
  highlight(4, easeOut(seg(t, L[4] + 0.9, L[4] + 1.5)) * (1 - seg(t, L[5] - 0.1, L[5] + 0.5)));
  signs.forEach((s, k) => {
    const a = L[4] + 1.5 + k * 0.5; const kk = seg(t, a, a + 0.35);
    s.g.visible = kk > 0 && t < L[5] + 0.6; s.g.position.set(SIGN_POS[k][0], 0, tz(4) + SIGN_POS[k][1]); s.g.scale.setScalar(Math.max(0.01, easeBack(kk))); s.g.rotation.y = -0.25;
    const g = seg(t, L[4] + 3.1, L[4] + 3.4); s.board.material.color.setHex(0xffb703).lerp(new THREE.Color(0x34c759), g);
  });
  lens.visible = t > L[4] + 1.4 && t < L[5] + 0.5;
  { const f = clamp((t - (L[4] + 1.5)) / 1.5) * 2; const i = Math.min(2, Math.floor(f)); const j = Math.min(2, i + 1); const kk = easeInOut(f - i);
    const px = lerp(SIGN_POS[i][0], SIGN_POS[j][0], kk) - 0.2, pz = lerp(SIGN_POS[i][1], SIGN_POS[j][1], kk);
    lens.position.set(px, 3.4 + Math.sin(t * 5) * 0.1, tz(4) + pz + 0.8); lens.rotation.y = -0.25; }

  /* passo 3 — sem carência */
  highlight(5, easeOut(seg(t, L[5] + 0.9, L[5] + 1.5)) * (1 - seg(t, L[6] - 0.1, L[6] + 0.5)));
  { const k = seg(t, L[5] + 1.4, L[5] + 1.85); const on = t > L[5] + 1.4 && t < L[6] + 0.5;
    bigBubble.visible = on; bigBubble.position.set(heroPos.x + 2.6, 4.0 + Math.sin(t * 2.2) * 0.12, heroPos.z - 0.6); bigBubble.scale.setScalar(Math.max(0.01, 1.35 * easeBack(k)));
    const ck = seg(t, L[5] + 1.75, L[5] + 2.1); bigCheck.visible = on && ck > 0; bigCheck.position.set(heroPos.x + 3.9, 5.1, heroPos.z - 0.2); bigCheck.scale.setScalar(Math.max(0.01, 1.0 * easeBack(ck))); }

  /* passo 4 — reciprocidade */
  highlight(6, easeOut(seg(t, L[6] + 0.9, L[6] + 1.5)) * (1 - seg(t, L[7] - 0.1, L[7] + 0.5)));
  { const on = t > L[6] + 1.1 && t < L[7] + 0.5; scale.visible = on; scale.position.set(0.75, 0, tz(6) - 0.2); scale.scale.setScalar(Math.max(0.01, 0.8 * easeBack(seg(t, L[6] + 1.1, L[6] + 1.5))));
    const lv = easeBack(seg(t, L[6] + 2.35, L[6] + 2.95)); beam.rotation.z = lerp(0.3, 0, lv);
    plates.forEach((p, i) => { p.pl.rotation.z = -beam.rotation.z; p.coins.forEach((c, ci) => { c.visible = i === 0 ? true : (ci < 1 || t > L[6] + 2.6 + ci * 0.06); }); }); }

  /* passo 5 — livro */
  { const rk = easeOut(seg(t, L[7] + 0.45, L[7] + 1.5)); const on = t > L[7] + 0.4; book.visible = on;
    const camK = seg(t, L[8], L[8] + 0.8);
    book.position.set(0.4, lerp(0.2, 3.7, rk) + Math.sin(t * 2) * 0.12, tz(8));
    book.rotation.y = lerp(Math.PI * 2, 0, rk) + Math.sin(t * 1.3) * 0.05; book.scale.setScalar(Math.max(0.01, rk * lerp(1, 1.2, easeInOut(seg(t, L[7] + 1.4, L[8] + 0.6)))));
    sparks.forEach((s) => { s.m.visible = on && rk > 0.6; const a = s.a + t * 0.8; s.m.position.set(book.position.x + Math.cos(a) * s.r, book.position.y + s.y + Math.sin(t * 2 + s.ph) * 0.2, book.position.z + Math.sin(a) * 0.6 + 0.5); s.m.rotation.set(t * 2, t * 3, 0); s.m.scale.setScalar(0.6 + 0.5 * Math.sin(t * 5 + s.ph)); }); }
  highlight(7, easeOut(seg(t, L[7] + 0.9, L[7] + 1.5)));

  /* confete */
  { const ct = t - (L[8] + 0.15); confetti.visible = ct > 0 && ct < 3.2; if (confetti.visible) { const m = new THREE.Matrix4(); const q = new THREE.Quaternion(); const e = new THREE.Euler(); const s = new THREE.Vector3(1, 1, 1);
    confData.forEach((d, i) => { const x = book.position.x + d.vx * ct * 0.55, y = book.position.y + 0.5 + d.vy * ct - 9.8 * ct * ct * 0.5 * 0.9, z = book.position.z + 1 + d.vz * ct * 0.4; e.set(ct * d.rot, ct * d.rot * 0.7, ct * d.rot * 0.4); q.setFromEuler(e); s.setScalar(y < 0.1 ? 0.001 : 1); m.compose(new THREE.Vector3(x, Math.max(y, 0.1), z), q, s); confetti.setMatrixAt(i, m); }); confetti.instanceMatrix.needsUpdate = true; } }

  /* vaga-lumes */
  flies.forEach((f) => { f.mesh.position.set(f.x + Math.sin(t * 0.8 + f.ph) * 0.8, f.y + Math.sin(t * 1.3 + f.ph * 2) * 0.4, f.z); f.mesh.scale.setScalar(0.6 + 0.4 * Math.sin(t * 3 + f.ph)); });

  /* câmera */
  const hz = Math.max(heroState(t - 0.35).z, tz(7)); const dollyIn = seg(t, 0, L[1]);
  const endK = easeInOut(seg(t, L[7] + 1.2, L[8] + 0.7));
  const camZ = hz + lerp(11.8 + 1.5 * (1 - dollyIn), 9.2, endK);
  const shake = (hs.run ? 0.07 : 0) * Math.sin(t * 31);
  camera.position.set(Math.sin(t * 0.35) * 0.45 + shake, lerp(8.6, 7.4, endK), camZ);
  camera.lookAt(lerp(0.1, 0.0, endK), lerp(0.7, 1.6, endK), hz - lerp(9, 8, endK));
  camera.updateMatrixWorld();
  sun.position.set(heroPos.x - 13, 13.5, hz + 7); sun.target.position.set(heroPos.x, 0, hz - 3); sun.target.updateMatrixWorld();

  /* DOM: pílulas, títulos, legenda, CTA */
  for (const p of pills) {
    const on = t >= p.a && t <= p.b; if (!on) { p.el.style.display = "none"; continue; }
    p.anchor(); const s = project(v3); const k = easeBack(seg(t, p.a, p.a + 0.25)) * (1 - seg(t, p.b - 0.18, p.b));
    p.el.style.display = "inline-flex";
    const w = p.el.offsetWidth; const x = Math.min(W - w / 2 - 14 * u, Math.max(w / 2 + 14 * u, s.x));
    p.el.style.transform = `translate(${x - w / 2}px, ${s.y - p.el.offsetHeight}px) scale(${Math.max(0.01, k)})`; p.el.style.transformOrigin = "50% 100%";
  }
  for (const p of titles) {
    const on = t >= p.a && t <= p.b; if (!on) { p.el.style.display = "none"; continue; }
    p.anchor(); const s = project(v3); const k = easeBack(seg(t, p.a, p.a + 0.3)) * (1 - seg(t, p.b - 0.2, p.b));
    p.el.style.display = "block"; const w = p.el.offsetWidth; const x = Math.min(W - w / 2 - 20 * u, Math.max(w / 2 + 20 * u, s.x));
    p.el.style.transform = `translate(${x - w / 2}px, ${s.y - p.el.offsetHeight / 2}px) rotate(${p.rot}deg) scale(${Math.max(0.01, k)})`;
  }
  const cw = words.find((w) => t >= w.a && t < w.b + 0.06);
  if (cw && t < L[8] + 2.8) { capEl.style.display = "block"; const k = easeBack(seg(t, cw.a, cw.a + 0.1)); capEl.innerHTML = `<span class="${cw.hi ? "hi" : ""}" style="transform:scale(${0.82 + 0.18 * k})">${cw.w}</span>`; } else capEl.style.display = "none";
  const ck = seg(t, L[8] + 0.55, L[8] + 0.95);
  ctaEl.style.display = ck > 0 ? "block" : "none"; ctaEl.style.opacity = String(ck); ctaEl.style.transform = `translateX(-50%) scale(${(0.9 + 0.1 * easeBack(ck)) * (1 + 0.03 * Math.sin(t * 6))})`;

  renderer.render(scene, camera);
}

window.setTime = setTime; window.TOTAL = TOTAL; window.ready = true;
setTime(parseFloat(params.get("t") || "0"));
