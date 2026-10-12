import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect.js'

// ─── A tiny walkable planet, Messenger-style ─────────────────────────────────
// Everything lives on a sphere of radius R. The player is a unit vector `p` on
// that sphere plus a tangent `fwd`; the camera trails behind with its own tangent.

export type NpcId = 'bakano' | 'pastry' | 'dental' | 'robot' | 'mailbox' | 'gallery'

export interface EngineCallbacks {
  onProgress?: (ratio: number) => void
  onNear?: (id: NpcId | null) => void
  onStep?: () => void
}

const R = 18
const WALK_SPEED = 5.2
const TALK_DIST = 3.2

const PALETTE = {
  sky: '#8fd6cc',
  grass: '#9cc97f',
  grassDark: '#86b56e',
  path: '#eadcb4',
  ink: '#1f2a2c',
  skin: '#c98d62',
}

// ─── helpers ──────────────────────────────────────────────────────────────────
const UP = new THREE.Vector3(0, 1, 0)

const fromLatLon = (lat: number, lon: number) => {
  const la = THREE.MathUtils.degToRad(lat)
  const lo = THREE.MathUtils.degToRad(lon)
  return new THREE.Vector3(Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)).normalize()
}

const height = (d: THREE.Vector3) =>
  0.22 * Math.sin(3 * d.x + 1) * Math.sin(3 * d.y) + 0.16 * Math.sin(5 * d.z + 2 * d.x)

const surface = (d: THREE.Vector3, lift = 0) => d.clone().multiplyScalar(R + height(d) + lift)

const tangentToward = (from: THREE.Vector3, to: THREE.Vector3) => {
  const t = to.clone().sub(from.clone().multiplyScalar(to.dot(from)))
  if (t.lengthSq() < 1e-6) t.set(0, 0, 1).sub(from.clone().multiplyScalar(from.z))
  return t.normalize()
}

const offsetAlong = (d: THREE.Vector3, tangent: THREE.Vector3, dist: number) =>
  d.clone().add(tangent.clone().multiplyScalar(dist / R)).normalize()

const orient = (obj: THREE.Object3D, up: THREE.Vector3, fwd: THREE.Vector3) => {
  const f = fwd.clone().sub(up.clone().multiplyScalar(fwd.dot(up))).normalize()
  const x = new THREE.Vector3().crossVectors(up, f)
  obj.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, up, f))
}

const mulberry32 = (seed: number) => () => {
  seed |= 0
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

let gradientMap: THREE.DataTexture | null = null
const toonGradient = () => {
  if (gradientMap) return gradientMap
  const data = new Uint8Array([90, 90, 90, 255, 175, 175, 175, 255, 255, 255, 255, 255])
  gradientMap = new THREE.DataTexture(data, 3, 1, THREE.RGBAFormat)
  gradientMap.minFilter = THREE.NearestFilter
  gradientMap.magFilter = THREE.NearestFilter
  gradientMap.needsUpdate = true
  return gradientMap
}

const toon = (color: THREE.ColorRepresentation, extra: THREE.MeshToonMaterialParameters = {}) =>
  new THREE.MeshToonMaterial({ color, gradientMap: toonGradient(), ...extra })

const canvasTexture = (
  w: number,
  h: number,
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
) => {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  draw(c.getContext('2d')!, w, h)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

const sign = (text: string, bg: string, fg: string, w = 3, h = 0.8, font = 'Bowlby One') => {
  const tex = canvasTexture(512, Math.round((512 * h) / w), (ctx, cw, ch) => {
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, cw, ch)
    ctx.strokeStyle = PALETTE.ink
    ctx.lineWidth = 10
    ctx.strokeRect(5, 5, cw - 10, ch - 10)
    ctx.fillStyle = fg
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    let size = ch * 0.55
    ctx.font = `${size}px "${font}", Impact, sans-serif`
    while (ctx.measureText(text).width > cw * 0.86 && size > 10) {
      size -= 2
      ctx.font = `${size}px "${font}", Impact, sans-serif`
    }
    ctx.fillText(text, cw / 2, ch / 2 + size * 0.05)
  })
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex }))
  mesh.userData.outlineParameters = { visible: false }
  return mesh
}

const marker = (glyph = '!') => {
  const make = (glyph: string, bg: string) =>
    canvasTexture(128, 128, (ctx) => {
      ctx.fillStyle = bg
      ctx.beginPath()
      ctx.arc(64, 64, 56, 0, Math.PI * 2)
      ctx.fill()
      ctx.lineWidth = 8
      ctx.strokeStyle = PALETTE.ink
      ctx.stroke()
      ctx.fillStyle = PALETTE.ink
      ctx.font = 'bold 76px "Bowlby One", Impact, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(glyph, 64, 70)
    })
  const pending = make(glyph, glyph === '!' ? '#ffe14d' : '#ff8fd0')
  const done = make('✓', '#3ddc97')
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: pending }))
  sprite.scale.setScalar(0.9)
  sprite.renderOrder = 10
  sprite.userData.textures = { pending, done }
  return sprite
}

// ─── props ────────────────────────────────────────────────────────────────────
const box = (w: number, h: number, d: number, color: THREE.ColorRepresentation) => {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), toon(color))
  m.position.y = h / 2
  return m
}

const windows = (group: THREE.Group, w: number, h: number, d: number, rows: number, cols: number, color: string, from = 0.6) => {
  const glass = toon(color)
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const win = new THREE.Mesh(new THREE.BoxGeometry(w / (cols * 1.8), 0.45, 0.06), glass)
      win.position.set(-w / 2 + (w / cols) * (c + 0.5), from + r * ((h - from - 0.3) / rows) + 0.25, d / 2 + 0.02)
      group.add(win)
    }
  }
}

const buildBakano = () => {
  const g = new THREE.Group()
  g.add(box(3.2, 5.6, 3, '#1b1b1f'))
  windows(g, 3.2, 5.6, 3, 5, 3, '#7fd3e6', 0.9)
  const door = box(1, 1.4, 0.1, '#e5173f')
  door.position.z = 1.52
  g.add(door)
  const roof = box(3.4, 0.25, 3.2, '#2b2b31')
  roof.position.y = 5.7
  g.add(roof)
  const dot = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.12, 24), toon('#e5173f'))
  dot.rotation.x = Math.PI / 2
  dot.position.set(1.05, 5.0, 1.56)
  g.add(dot)
  const s = sign('BAKANO.', '#111111', '#ffffff', 3, 0.8)
  s.position.set(0, 6.3, 0.2)
  const back = s.clone()
  back.rotation.y = Math.PI
  back.position.z = 0.18
  g.add(back)
  g.add(s)
  return g
}

const buildPastry = () => {
  const g = new THREE.Group()
  g.add(box(3.2, 2.6, 2.8, '#9a5aa6'))
  const roof = box(3.5, 0.3, 3.1, '#5e2f63')
  roof.position.y = 2.75
  g.add(roof)
  const stripes = canvasTexture(256, 64, (ctx, w, h) => {
    for (let i = 0; i < 8; i++) {
      ctx.fillStyle = i % 2 ? '#ffffff' : '#ff8fd0'
      ctx.fillRect((w / 8) * i, 0, w / 8, h)
    }
  })
  const awning = new THREE.Mesh(new THREE.BoxGeometry(3.3, 0.12, 1.1), toon('#ffffff', { map: stripes }))
  awning.position.set(0, 2.0, 1.85)
  awning.rotation.x = 0.35
  g.add(awning)
  const win = box(1.6, 1.0, 0.08, '#f6e7c8')
  win.position.set(-0.5, 0.5, 1.42)
  g.add(win)
  const door = box(0.8, 1.5, 0.08, '#5e2f63')
  door.position.set(1.0, 0, 1.42)
  g.add(door)
  const cake = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.3, 16), toon('#f3d9a4'))
  cake.position.set(-0.5, 0.75, 1.5)
  g.add(cake)
  const s = sign('NICOLE PASTRY ARTS', '#fff6e8', '#5e2f63', 3, 0.55)
  s.position.set(0, 2.45, 1.42)
  g.add(s)
  return g
}

const buildDental = () => {
  const g = new THREE.Group()
  g.add(box(3, 2.8, 2.8, '#f4f1ea'))
  const band = box(3.02, 0.35, 2.82, '#4aa3df')
  band.position.y = 2.3
  g.add(band)
  const roof = box(3.2, 0.25, 3, '#d8d3c6')
  roof.position.y = 2.95
  g.add(roof)
  windows(g, 3, 2.8, 2.8, 1, 2, '#9fd7f0', 0.9)
  const door = box(0.9, 1.5, 0.08, '#4aa3df')
  door.position.z = 1.42
  g.add(door)
  const tooth = new THREE.Mesh(new THREE.IcosahedronGeometry(0.45, 1), toon('#ffffff'))
  tooth.scale.set(1, 1.2, 0.6)
  tooth.position.set(0, 3.6, 0)
  g.add(tooth)
  const s = sign('CENTRO MÉDICO', '#ffffff', '#1d6fa5', 2.8, 0.5)
  s.position.set(0, 2.3, 1.43)
  g.add(s)
  return g
}

const buildRobotLab = () => {
  const g = new THREE.Group()
  const server = box(2.2, 2.2, 1.8, '#3a3f4a')
  g.add(server)
  for (let i = 0; i < 4; i++) {
    const led = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.12, 0.05), new THREE.MeshBasicMaterial({ color: i % 2 ? '#3ddc97' : '#ffe14d' }))
    led.position.set(0, 0.5 + i * 0.4, 0.92)
    led.userData.blink = i
    g.add(led)
  }
  const mastMat = toon('#c9c2b0')
  for (const [x, z] of [[-0.7, -0.5], [0.7, -0.5], [0, 0.6]] as const) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, 6.5, 6), mastMat)
    leg.position.set(x * 0.6, 3.25 + 2.2, z * 0.6 - 0.2)
    g.add(leg)
  }
  const dish = new THREE.Mesh(new THREE.SphereGeometry(0.7, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2.6), toon('#f4f1ea', { side: THREE.DoubleSide }))
  dish.position.set(0, 8.4, 0)
  dish.rotation.x = -0.9
  g.add(dish)
  const s = sign('BOT WHATSAPP IA', '#111111', '#3ddc97', 2.1, 0.55, 'DM Mono')
  s.position.set(0, 2.55, 0.5)
  g.add(s)
  return g
}

const GALLERY_SHOTS = ['/work/courierbox.jpg', '/work/boloncity.jpg', '/work/ponce-rent-a-car.jpg', '/work/nemo-cleaning-services.jpg', '/work/cafe-malacatos.jpg', '/work/inmobiliaria.jpg']

const buildGallery = () => {
  const g = new THREE.Group()
  const loader = new THREE.TextureLoader()
  const frame = toon('#2f3a3c')
  for (const x of [-2.2, 2.2]) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 3.4, 8), frame)
    post.position.set(x, 1.7, -0.1)
    g.add(post)
  }
  const board = box(5, 2.6, 0.25, '#f4efe1')
  board.position.y = 2.2
  g.add(board)
  GALLERY_SHOTS.forEach((src, i) => {
    const tex = loader.load(src)
    tex.colorSpace = THREE.SRGBColorSpace
    const shot = new THREE.Mesh(new THREE.PlaneGeometry(1.45, 0.95), new THREE.MeshBasicMaterial({ map: tex }))
    shot.position.set(-1.6 + (i % 3) * 1.6, 3.1 - Math.floor(i / 3) * 1.1, 0.14)
    shot.userData.outlineParameters = { visible: false }
    g.add(shot)
  })
  const s = sign('43 PROYECTOS', '#ff8fd0', '#111111', 2.6, 0.55)
  s.position.set(0, 4.15, 0.14)
  g.add(s)
  return g
}

const buildMailbox = () => {
  const g = new THREE.Group()
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.2, 8), toon('#3a3f4a'))
  post.position.y = 0.6
  g.add(post)
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.8, 1.4), toon('#ff7a1a'))
  body.position.y = 1.55
  g.add(body)
  const top = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 1.4, 16, 1, false, 0, Math.PI), toon('#ff7a1a'))
  top.rotation.set(0, 0, Math.PI / 2)
  top.rotation.y = Math.PI / 2
  top.position.y = 1.95
  g.add(top)
  const flag = box(0.08, 0.6, 0.35, '#e5173f')
  flag.position.set(0.6, 1.6, -0.2)
  g.add(flag)
  const s = sign('YEYO.DEV', '#ffe14d', '#111111', 1.2, 0.35)
  s.position.set(0, 1.55, 0.71)
  g.add(s)
  return g
}

const buildPalm = (rand: () => number) => {
  const g = new THREE.Group()
  const trunkMat = toon('#a7835a')
  let y = 0
  const lean = (rand() - 0.5) * 0.5
  for (let i = 0; i < 5; i++) {
    const seg = new THREE.Mesh(new THREE.CylinderGeometry(0.16 - i * 0.015, 0.2 - i * 0.015, 0.7, 7), trunkMat)
    seg.position.set(lean * i * 0.3, y + 0.35, 0)
    seg.rotation.z = -lean * 0.3
    g.add(seg)
    y += 0.65
  }
  const leafMat = toon('#3f9b5a', { side: THREE.DoubleSide })
  for (let i = 0; i < 6; i++) {
    const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.28, 1.8, 4), leafMat)
    leaf.scale.z = 0.25
    leaf.position.set(lean * 1.5, y, 0)
    leaf.rotation.set(0, (i / 6) * Math.PI * 2, 1.9)
    leaf.translateY(0.8)
    g.add(leaf)
  }
  return g
}

const buildTree = (rand: () => number) => {
  const g = new THREE.Group()
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.2, 1, 6), toon('#8b6a48'))
  trunk.position.y = 0.5
  g.add(trunk)
  const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(0.9 + rand() * 0.5, 0), toon(rand() > 0.5 ? '#4e9e5c' : '#5aae66'))
  crown.position.y = 1.6
  g.add(crown)
  return g
}

const buildRock = (rand: () => number) => {
  const m = new THREE.Mesh(new THREE.DodecahedronGeometry(0.3 + rand() * 0.4, 0), toon('#b9b3a2'))
  m.scale.y = 0.6
  m.position.y = 0.1
  return m
}

const buildLamp = () => {
  const g = new THREE.Group()
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 2.4, 6), toon('#2f3a3c'))
  pole.position.y = 1.2
  g.add(pole)
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.25, 0.35), toon('#ffe9a8'))
  head.position.y = 2.45
  g.add(head)
  return g
}

interface NpcStyle {
  shirt: string
  pants: string
  hair: string
  skin?: string
  robot?: boolean
}

const buildNpc = (style: NpcStyle) => {
  const g = new THREE.Group()
  if (style.robot) {
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.9, 0.6), toon('#efe6cf'))
    body.position.y = 0.75
    g.add(body)
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.75, 0.75), toon('#d9a441'))
    head.position.y = 1.62
    g.add(head)
    const face = new THREE.Mesh(new THREE.CircleGeometry(0.3, 20), new THREE.MeshBasicMaterial({ color: '#173238' }))
    face.position.set(0, 1.62, 0.38)
    g.add(face)
    for (const x of [-0.11, 0.11]) {
      const eye = new THREE.Mesh(new THREE.PlaneGeometry(0.07, 0.11), new THREE.MeshBasicMaterial({ color: '#7cf5c4' }))
      eye.position.set(x, 1.66, 0.39)
      g.add(eye)
    }
    const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.4, 6), toon('#3a3f4a'))
    antenna.position.y = 2.15
    g.add(antenna)
    for (const x of [-0.18, 0.18]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.35, 8), toon('#3a3f4a'))
      leg.position.set(x, 0.18, 0)
      g.add(leg)
    }
    return g
  }
  const skin = style.skin ?? PALETTE.skin
  for (const x of [-0.14, 0.14]) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.1, 0.7, 8), toon(style.pants))
    leg.position.set(x, 0.35, 0)
    g.add(leg)
  }
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.3, 0.45, 4, 10), toon(style.shirt))
  torso.position.y = 1.05
  g.add(torso)
  for (const x of [-0.4, 0.4]) {
    const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.08, 0.45, 4, 8), toon(skin))
    arm.position.set(x, 1.0, 0)
    arm.rotation.z = x > 0 ? 0.15 : -0.15
    g.add(arm)
  }
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.26, 16, 12), toon(skin))
  head.position.y = 1.72
  g.add(head)
  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), toon(style.hair))
  hair.position.y = 1.76
  hair.rotation.x = -0.25
  g.add(hair)
  for (const x of [-0.09, 0.09]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 6), new THREE.MeshBasicMaterial({ color: '#1f2a2c' }))
    eye.position.set(x, 1.74, 0.24)
    g.add(eye)
  }
  return g
}

const blobShadow = (radius: number) => {
  const tex = canvasTexture(64, 64, (ctx) => {
    const grd = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    grd.addColorStop(0, 'rgba(20,40,40,0.45)')
    grd.addColorStop(1, 'rgba(20,40,40,0)')
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, 64, 64)
  })
  const m = new THREE.Mesh(new THREE.PlaneGeometry(radius * 2, radius * 2), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }))
  m.rotation.x = -Math.PI / 2
  m.position.y = 0.03
  m.userData.outlineParameters = { visible: false }
  return m
}

// ─── Engine ───────────────────────────────────────────────────────────────────
interface Site {
  id: NpcId
  lat: number
  lon: number
  build: () => THREE.Group
  npc: NpcStyle | null
  radius: number
}

const SITES: Site[] = [
  { id: 'bakano', lat: 24, lon: 38, build: buildBakano, npc: { shirt: '#18181b', pants: '#2f3542', hair: '#1b1410' }, radius: 2.6 },
  { id: 'pastry', lat: -22, lon: 72, build: buildPastry, npc: { shirt: '#f4f1ea', pants: '#5e2f63', hair: '#4a2e1c' }, radius: 2.6 },
  { id: 'dental', lat: 30, lon: 128, build: buildDental, npc: { shirt: '#cfe6f5', pants: '#2f3542', hair: '#1b1410' }, radius: 2.5 },
  { id: 'robot', lat: -8, lon: -62, build: buildRobotLab, npc: { shirt: '', pants: '', hair: '', robot: true }, radius: 2.0 },
  { id: 'mailbox', lat: -38, lon: 8, build: buildMailbox, npc: null, radius: 0.8 },
  { id: 'gallery', lat: 14, lon: -26, build: buildGallery, npc: null, radius: 1.6 },
]
const START = fromLatLon(4, 0)

interface Obstacle {
  dir: THREE.Vector3
  radius: number
}

export class WorldEngine {
  private renderer: THREE.WebGLRenderer
  private effect: OutlineEffect
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(50, 1, 0.1, 200)
  private clock = new THREE.Clock()
  private keyLight = new THREE.DirectionalLight('#ffffff', 2.2)
  private raf = 0
  private disposed = false

  private p = START.clone()
  private fwd = tangentToward(START, fromLatLon(24, 38))
  private camFwd = this.fwd.clone()
  private camPos = new THREE.Vector3()
  private player = new THREE.Group()
  private bones: Record<string, { bone: THREE.Bone; rest: THREE.Quaternion; parent: THREE.Quaternion; parentInv: THREE.Quaternion }> = {}
  private walkPhase = 0
  private walkAmount = 0
  private lastStepSign = 0

  private obstacles: Obstacle[] = []
  private npcs = new Map<NpcId, { group: THREE.Group; dir: THREE.Vector3; marker: THREE.Sprite | null; baseQ: THREE.Quaternion }>()
  private blinkers: THREE.Mesh[] = []
  private clouds = new THREE.Group()
  private occluders: THREE.Object3D[] = []
  private near: NpcId | null = null

  input = { x: 0, y: 0 }
  paused = true

  constructor(
    private canvas: HTMLCanvasElement,
    private cb: EngineCallbacks = {},
  ) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.effect = new OutlineEffect(this.renderer, { defaultThickness: 0.0045, defaultColor: [0.12, 0.16, 0.17] })

    this.scene.background = new THREE.Color(PALETTE.sky)
    this.scene.fog = new THREE.Fog(PALETTE.sky, 28, 70)
    this.scene.add(new THREE.HemisphereLight('#ffffff', '#5f8f86', 1.4))
    this.scene.add(this.keyLight, this.keyLight.target)

    this.buildPlanet()
    this.buildSites()
    this.buildDecor()
    this.buildClouds()
    this.scene.add(this.player)
    this.resize()
  }

  async load(url: string) {
    const loader = new GLTFLoader()
    const gltf = await loader.loadAsync(url, (e) => {
      if (e.total) this.cb.onProgress?.(e.loaded / e.total)
    })
    const model = gltf.scene
    model.traverse((o) => {
      const mesh = o as THREE.SkinnedMesh
      if (mesh.isMesh) {
        const old = mesh.material as THREE.MeshStandardMaterial
        mesh.material = toon('#ffffff', { map: old.map ?? null })
        mesh.frustumCulled = false
      }
    })
    this.rigBones(model)
    model.scale.setScalar(0.95)
    this.player.add(model, blobShadow(0.6))
    this.cb.onProgress?.(1)
    this.placePlayer()
    this.snapCamera()
    this.loop()
  }

  // Bone axes differ per joint, so poses are expressed in model space and
  // converted through each bone's parent rotation.
  private rigBones(model: THREE.Object3D) {
    model.updateMatrixWorld(true)
    model.traverse((o) => {
      const bone = o as THREE.Bone
      if (!bone.isBone) return
      const parent = new THREE.Quaternion()
      bone.parent?.getWorldQuaternion(parent)
      this.bones[bone.name] = { bone, rest: bone.quaternion.clone(), parent, parentInv: parent.clone().invert() }
    })
    // drop the arms from the A-pose to a relaxed pose
    for (const [arm, fore, side] of [['LeftArm', 'LeftForeArm', 1], ['RightArm', 'RightForeArm', -1]] as const) {
      const a = this.bones[arm]
      const f = this.bones[fore]
      if (!a || !f) continue
      const from = f.bone.getWorldPosition(new THREE.Vector3()).sub(a.bone.getWorldPosition(new THREE.Vector3())).normalize()
      const to = new THREE.Vector3(side * 0.28, -1, 0.05).normalize()
      const qWorld = new THREE.Quaternion().setFromUnitVectors(from, to)
      a.rest.premultiply(a.parentInv.clone().multiply(qWorld).multiply(a.parent))
      a.bone.quaternion.copy(a.rest)
    }
  }

  // ── world building ───────────────────────────────────────────────────────
  private buildPlanet() {
    const geo = new THREE.IcosahedronGeometry(R, 24)
    const pos = geo.attributes.position as THREE.BufferAttribute
    const colors = new Float32Array(pos.count * 3)
    const v = new THREE.Vector3()
    const grass = new THREE.Color(PALETTE.grass)
    const grassDark = new THREE.Color(PALETTE.grassDark)
    const path = new THREE.Color(PALETTE.path)
    const siteDirs = SITES.map((s) => fromLatLon(s.lat, s.lon))
    const arcs: [THREE.Vector3, THREE.Vector3][] = siteDirs.map((d) => [START, d])

    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i).normalize()
      const d = v.clone()
      v.multiplyScalar(R + height(d))
      pos.setXYZ(i, v.x, v.y, v.z)

      let c = Math.sin(d.x * 9) * Math.sin(d.z * 7) > 0.3 ? grassDark : grass
      const nearSite = [START, ...siteDirs].some((s) => d.angleTo(s) < 0.2)
      const onPath = arcs.some(([a, b]) => {
        const n = new THREE.Vector3().crossVectors(a, b).normalize()
        const off = Math.abs(Math.asin(THREE.MathUtils.clamp(d.dot(n), -1, 1)))
        return off < 0.045 && d.angleTo(a) + d.angleTo(b) < a.angleTo(b) + 0.05
      })
      if (nearSite || onPath) c = path
      colors.set([c.r, c.g, c.b], i * 3)
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geo.computeVertexNormals()
    const planet = new THREE.Mesh(geo, toon('#ffffff', { vertexColors: true }))
    planet.userData.outlineParameters = { visible: false }
    this.scene.add(planet)
  }

  private place(obj: THREE.Object3D, dir: THREE.Vector3, fwd: THREE.Vector3, lift = 0, occluder = true) {
    obj.position.copy(surface(dir, lift - 0.05))
    orient(obj, dir, fwd)
    this.scene.add(obj)
    if (occluder) this.occluders.push(obj)
  }

  private buildSites() {
    for (const site of SITES) {
      const dir = fromLatLon(site.lat, site.lon)
      const toStart = tangentToward(dir, START)
      const building = site.build()
      building.traverse((o) => {
        if (o.userData.blink !== undefined) this.blinkers.push(o as THREE.Mesh)
      })
      this.place(building, dir, toStart, 0, false)
      this.obstacles.push({ dir, radius: site.radius / R })

      let npcGroup: THREE.Group
      let npcDir: THREE.Vector3
      if (site.npc) {
        npcDir = offsetAlong(dir, toStart, site.radius + 0.9)
        npcGroup = buildNpc(site.npc)
        npcGroup.add(blobShadow(0.5))
        this.place(npcGroup, npcDir, tangentToward(npcDir, START))
        this.obstacles.push({ dir: npcDir, radius: 0.7 / R })
      } else {
        npcDir = dir
        npcGroup = building
      }
      const m = marker(site.id === 'gallery' ? '★' : site.id === 'mailbox' ? '✉' : '!')
      m.position.copy(surface(npcDir, site.npc ? 2.6 : site.id === 'gallery' ? 5.2 : 3.1))
      this.scene.add(m)
      this.npcs.set(site.id, { group: npcGroup, dir: npcDir, marker: m, baseQ: npcGroup.quaternion.clone() })
    }

    // welcome sign at spawn
    const post = new THREE.Group()
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 2, 6), toon('#8b6a48'))
    pole.position.y = 1
    const board = sign('YEYO.DEV', '#ffe14d', '#111111', 2, 0.6)
    board.position.y = 2
    const back = board.clone()
    back.rotation.y = Math.PI
    post.add(pole, board, back)
    const spawnSign = offsetAlong(START, new THREE.Vector3().crossVectors(START, this.fwd).normalize(), 2.6)
    this.place(post, spawnSign, tangentToward(spawnSign, START))
  }

  private nearPath(d: THREE.Vector3, width: number) {
    return SITES.some((site) => {
      const b = fromLatLon(site.lat, site.lon)
      const n = new THREE.Vector3().crossVectors(START, b).normalize()
      const off = Math.abs(Math.asin(THREE.MathUtils.clamp(d.dot(n), -1, 1)))
      return off < width && d.angleTo(START) + d.angleTo(b) < START.angleTo(b) + 0.1
    })
  }

  private buildDecor() {
    const rand = mulberry32(42)
    const blocked = [START, ...SITES.map((s) => fromLatLon(s.lat, s.lon))]
    const factories = [buildPalm, buildPalm, buildTree, buildTree, buildTree, buildRock, buildRock]
    let placed = 0
    for (let tries = 0; placed < 90 && tries < 600; tries++) {
      const d = new THREE.Vector3(rand() * 2 - 1, rand() * 2 - 1, rand() * 2 - 1).normalize()
      if (blocked.some((b) => d.angleTo(b) < 0.32)) continue
      if (this.obstacles.some((o) => d.angleTo(o.dir) < o.radius + 0.06)) continue
      if (this.nearPath(d, 0.09)) continue
      const make = factories[Math.floor(rand() * factories.length)]!
      const obj = make(rand)
      obj.scale.multiplyScalar(0.8 + rand() * 0.5)
      const tangent = tangentToward(d, new THREE.Vector3(rand(), rand(), rand()).normalize())
      this.place(obj, d, tangent)
      if (make !== buildRock) this.obstacles.push({ dir: d, radius: 0.35 / R })
      placed++
    }
    // lamps along the paths
    for (const s of SITES) {
      const end = fromLatLon(s.lat, s.lon)
      for (const t of [0.35, 0.7]) {
        const d = START.clone().lerp(end, t).normalize()
        const side = new THREE.Vector3().crossVectors(d, tangentToward(d, end)).normalize()
        const lampDir = offsetAlong(d, side, 1.4)
        this.place(buildLamp(), lampDir, tangentToward(lampDir, end))
      }
    }
  }

  private buildClouds() {
    const rand = mulberry32(7)
    const mat = toon('#ffffff')
    for (let i = 0; i < 16; i++) {
      const cloud = new THREE.Group()
      for (let j = 0; j < 4; j++) {
        const puff = new THREE.Mesh(new THREE.IcosahedronGeometry(0.8 + rand() * 0.9, 1), mat)
        puff.position.set(j * 1.1 - 1.6, rand() * 0.4, rand() * 0.6)
        puff.scale.y = 0.65
        cloud.add(puff)
      }
      const d = new THREE.Vector3(rand() * 2 - 1, rand() * 2 - 1, rand() * 2 - 1).normalize()
      cloud.position.copy(d.multiplyScalar(R + 9 + rand() * 6))
      orient(cloud, d.normalize(), tangentToward(d, new THREE.Vector3(0, 1, 0)))
      this.clouds.add(cloud)
    }
    this.scene.add(this.clouds)
  }

  // ── runtime ──────────────────────────────────────────────────────────────
  resize() {
    const w = this.canvas.clientWidth || window.innerWidth
    const h = this.canvas.clientHeight || window.innerHeight
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    this.camera.fov = w < 700 ? 62 : 50
    this.camera.updateProjectionMatrix()
  }

  /** Where an NPC is relative to the camera: 0° = straight ahead, positive = to the right. */
  bearingTo(id: NpcId) {
    const npc = this.npcs.get(id)
    if (!npc) return null
    const toward = tangentToward(this.p, npc.dir)
    const right = new THREE.Vector3().crossVectors(this.camFwd, this.p).normalize()
    const angle = THREE.MathUtils.radToDeg(Math.atan2(toward.dot(right), toward.dot(this.camFwd)))
    return { angle, dist: this.p.angleTo(npc.dir) * R }
  }

  setDelivered(id: NpcId) {
    const npc = this.npcs.get(id)
    if (!npc?.marker) return
    npc.marker.material.map = npc.marker.userData.textures.done
    npc.marker.material.needsUpdate = true
  }

  private placePlayer() {
    this.player.position.copy(surface(this.p))
    orient(this.player, this.p, this.fwd)
  }

  private snapCamera() {
    this.camPos.copy(this.cameraTarget())
  }

  private cameraTarget() {
    const ground = surface(this.p)
    return ground.add(this.p.clone().multiplyScalar(3.4)).add(this.camFwd.clone().multiplyScalar(-6.8))
  }

  private move(dt: number) {
    const { x, y } = this.input
    const mag = Math.min(1, Math.hypot(x, y))
    const right = new THREE.Vector3().crossVectors(this.camFwd, this.p).normalize()
    const want = this.camFwd.clone().multiplyScalar(y).add(right.multiplyScalar(x))

    if (!this.paused && mag > 0.05) {
      want.normalize()
      this.fwd.lerp(want, Math.min(1, dt * 10)).normalize()
      const angle = (WALK_SPEED * mag * dt) / R
      const axis = new THREE.Vector3().crossVectors(this.p, this.fwd).normalize()
      const q = new THREE.Quaternion().setFromAxisAngle(axis, angle)
      const next = this.p.clone().applyQuaternion(q).normalize()

      // push out of obstacles
      for (const o of this.obstacles) {
        const a = next.angleTo(o.dir)
        const min = o.radius + 0.4 / R
        if (a < min) {
          const away = tangentToward(o.dir, next)
          next.copy(offsetAlong(o.dir, away, min * R))
        }
      }
      const moveQ = new THREE.Quaternion().setFromUnitVectors(this.p, next)
      this.p.copy(next)
      this.fwd.applyQuaternion(moveQ)
      this.camFwd.applyQuaternion(moveQ)
      // camera lazily swings behind the player while walking forward-ish
      if (y > -0.2) this.camFwd.lerp(this.fwd, Math.min(1, dt * 1.6))
    }
    this.fwd.sub(this.p.clone().multiplyScalar(this.fwd.dot(this.p))).normalize()
    this.camFwd.sub(this.p.clone().multiplyScalar(this.camFwd.dot(this.p))).normalize()

    const target = !this.paused && mag > 0.05 ? mag : 0
    this.walkAmount += (target - this.walkAmount) * Math.min(1, dt * 8)
  }

  private animatePlayer(dt: number, t: number) {
    this.walkPhase += dt * (4 + this.walkAmount * 7)
    const s = Math.sin(this.walkPhase)
    const w = this.walkAmount
    const set = (name: string, axis: THREE.Vector3, angle: number) => {
      const b = this.bones[name]
      if (!b) return
      const qWorld = new THREE.Quaternion().setFromAxisAngle(axis, angle)
      b.bone.quaternion.copy(b.parentInv.clone().multiply(qWorld).multiply(b.parent).multiply(b.rest))
    }
    const X = new THREE.Vector3(1, 0, 0)
    const Z = new THREE.Vector3(0, 0, 1)
    set('LeftUpLeg', X, -s * 0.6 * w)
    set('RightUpLeg', X, s * 0.6 * w)
    set('LeftLeg', X, Math.max(0, s) * 0.9 * w)
    set('RightLeg', X, Math.max(0, -s) * 0.9 * w)
    set('LeftArm', X, s * 0.45 * w)
    set('RightArm', X, -s * 0.45 * w)
    set('LeftForeArm', X, -0.25 - 0.2 * w)
    set('RightForeArm', X, -0.25 - 0.2 * w)
    set('Spine01', X, Math.sin(t * 2) * 0.025 * (1 - w) + 0.06 * w)
    set('Head', Z, Math.sin(this.walkPhase) * 0.04 * w)

    const model = this.player.children[0]
    if (model) model.position.y = Math.abs(Math.cos(this.walkPhase)) * 0.06 * w

    const stepSign = Math.sign(s)
    if (w > 0.4 && stepSign !== this.lastStepSign) this.cb.onStep?.()
    this.lastStepSign = stepSign
  }

  private updateNpcs(t: number) {
    let nearest: NpcId | null = null
    let best = Infinity
    for (const [id, npc] of this.npcs) {
      const dist = this.p.angleTo(npc.dir) * R
      if (npc.marker) {
        npc.marker.position.copy(surface(npc.dir, (id === 'mailbox' ? 3.1 : id === 'gallery' ? 5.2 : 2.6) + Math.sin(t * 3 + dist) * 0.15))
      }
      if (id !== 'mailbox' && id !== 'gallery') {
        // turn to face the player when close
        if (dist < 6) {
          const look = tangentToward(npc.dir, this.p)
          const tmp = new THREE.Object3D()
          orient(tmp, npc.dir, look)
          npc.group.quaternion.slerp(tmp.quaternion, 0.1)
        } else {
          npc.group.quaternion.slerp(npc.baseQ, 0.05)
        }
      }
      if (dist < TALK_DIST && dist < best) {
        best = dist
        nearest = id
      }
    }
    if (nearest !== this.near) {
      this.near = nearest
      this.cb.onNear?.(nearest)
    }
  }

  private loop = () => {
    if (this.disposed) return
    this.raf = requestAnimationFrame(this.loop)
    const dt = Math.min(0.05, this.clock.getDelta())
    const t = this.clock.elapsedTime

    this.move(dt)
    this.placePlayer()
    this.animatePlayer(dt, t)
    this.updateNpcs(t)

    this.camPos.lerp(this.cameraTarget(), Math.min(1, dt * 4))
    this.camera.position.copy(this.camPos)
    this.camera.up.copy(this.p)
    this.camera.lookAt(surface(this.p, 1.5).add(this.camFwd.clone().multiplyScalar(3)))

    this.keyLight.position.copy(this.camPos).add(this.p.clone().multiplyScalar(14)).add(this.camFwd.clone().multiplyScalar(-4))
    this.keyLight.target.position.copy(surface(this.p))

    // props hugging the camera would fill the screen, so hide them
    for (const o of this.occluders) o.visible = o.position.distanceToSquared(this.camera.position) > 6.5
    this.clouds.rotation.y += dt * 0.01
    this.blinkers.forEach((m) => (m.visible = Math.sin(t * 4 + (m.userData.blink as number) * 1.7) > -0.3))

    this.effect.render(this.scene, this.camera)
  }

  dispose() {
    this.disposed = true
    cancelAnimationFrame(this.raf)
    this.scene.traverse((o) => {
      const mesh = o as THREE.Mesh
      if (mesh.geometry) mesh.geometry.dispose()
      const mat = mesh.material as THREE.Material | THREE.Material[] | undefined
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose())
      else mat?.dispose()
    })
    this.renderer.dispose()
  }
}
