import type { Extra, Node } from './field'
import { fieldTarget } from './field'
import { DW, PC, PW, TAU, bz, c01, lerp, sm, tr } from './math'
import type { Palette } from './theme'

// Per-scene choreography. Two halves, as in the design:
//   fx*      — moves the scene's DOM hooks with scroll progress (lines 641–741)
//   targets  — sets each field node's target and the extra canvas drawing
//              for the active scene (lines 799–929)

export type Scene = {
  el: HTMLElement
  name: string
  pin: boolean
  label: string
  idx: string
  p: number
  oy: number
  vis: boolean
}

type El = HTMLElement
type Els = HTMLElement[]

/** Every data-* hook the engine binds, by the design's names. */
export type Hooks = {
  hp: Els
  rail: El | undefined
  hw: Els
  hcta: El | undefined
  navIdx: El | undefined
  navLabel: El | undefined
  prog: El | undefined
  pw: Els
  pc: Els
  pl: Els
  pbox: El | undefined
  pexp: El | undefined
  pq: El | undefined
  ptext: El | undefined
  q1: El | undefined
  q2: El | undefined
  ml: Els
  mp: Els
  mc: El | undefined
  mpanels: El | undefined
  dw: Els
  dcon: Els
  dopp: El | undefined
  br: Els
  dhead: El | undefined
  bf: Els
  bo: El | undefined
  ch: Els
  dc: El | undefined
  dphead: El | undefined
  dproutes: El | undefined
  fly: El | undefined
  fl: Els
  fc: Els
  fcd: El | undefined
  fin: Els
  notes: El | undefined
  nhint: El | undefined
  nprog: El | undefined
  person: Els
  pdesc: Els
  portrait: HTMLCanvasElement[]
  tilt: Els
  dark: Els
}

export type Hover = { br: number; ch: number; fl: number; person: number }

/** Viewport width from which the Who panels sit in one row (the `lg` breakpoint). */
export const WHO_ROW_MIN = 1024
/** Viewport width from which the field notes form a drifting rail (CSS breakpoint). */
export const NOTES_RAIL_MIN = 760
/**
 * Viewport width from which the Design and Deploy stages lay out side by side
 * (the `min-[860px]:` classes). Below it the explanatory panel sits at the
 * bottom and the diagram is fitted above it, as the Model scene does.
 */
export const STAGE_ROW_MIN = 860

/** Mutable per-frame state shared between fx* and targets(). */
export type StoryState = {
  hv: Hover
  mouse: { x: number; y: number }
  /** Reduced motion: no mouse-follow, no idle drift, no auto-rotation. */
  calm: boolean
  /** The theme's canvas colours, refreshed by the engine each frame. */
  P: Palette
  dphi: number
  phi: number
  mnarrow?: boolean
  prow?: boolean
  pst?: { bw0: number; bh0: number; e1: number; ex: number; pr: number }
  mst?: { cx: number; cy: number; R: number; rot: number; act: number }
  dst?: {
    O: { x: number; y: number }
    E: { x: number; y: number }[]
    g: number[]
    act: number
  }
  dps?: {
    C: { x: number; y: number }
    P: { x: number; y: number }[]
    rv: number
  }
  fst?: { cx: number; cy: number; R: number; phi: number }
}

type Fx = (
  E: Hooks,
  s: Scene,
  st: StoryState,
  W: number,
  H: number,
  t: number,
  dt: number
) => void

const fxProblem: Fx = (E, s, st, W, H) => {
  const p = s.p
  const bw0 = Math.min(W * 0.62, 760)
  const bh0 = Math.min(H * 0.3, 240)
  const e1 = sm(p / 0.26)
  const eb = sm((p - 0.18) / 0.1)
  const pr = sm((p - 0.32) / 0.22)
  const ex = sm((p - 0.68) / 0.26)
  const sq = lerp(1, 0.84, pr)
  const bw = lerp(bw0 * sq, W * 1.04, ex)
  const bh = lerp(bh0 * sq, H * 1.04, ex)
  st.pst = { bw0: bw0 * sq, bh0: bh0 * sq, e1, ex, pr }
  E.pw.forEach((el, k) => {
    if (!el) return
    const x = lerp(PW[k][0] * W, W / 2, e1)
    // On phones the heading spans the width, so the words start below it.
    const y0 = W < 640 ? H * 0.3 + PW[k][1] * H * 0.6 : PW[k][1] * H
    const y = lerp(y0, H / 2, e1)
    el.style.transform = tr(
      x,
      y,
      ` translate(-50%,-50%) scale(${(1 - e1 * 0.3).toFixed(3)})`
    )
    el.style.opacity = (0.85 * (1 - sm((p - 0.18) / 0.08))).toFixed(3)
  })
  if (E.pbox) {
    E.pbox.style.width = bw.toFixed(1) + 'px'
    E.pbox.style.height = bh.toFixed(1) + 'px'
    E.pbox.style.opacity = (eb * (1 - ex * 0.75)).toFixed(3)
  }
  if (E.pexp) {
    E.pexp.style.opacity = (eb * (1 - sm(ex * 2))).toFixed(3)
    E.pexp.style.transform = `translate(-50%,-50%) scale(${(1 + ex * 0.8 - pr * 0.06).toFixed(3)})`
  }
  E.pc.forEach((el, k) => {
    if (!el) return
    const cin = sm((p - 0.3 - k * 0.025) / 0.14)
    const m = lerp(1.9, 1, cin) * (1 + ex * 2.6)
    const x = W / 2 + ((PC[k][0] * bw0 * sq) / 2) * m
    const y = H / 2 + ((PC[k][1] * bh0 * sq) / 2) * m
    el.style.transform = tr(x, y, ' translate(-50%,-50%)')
    el.style.opacity = (cin * (1 - ex)).toFixed(3)
  })
  E.pl.forEach((el, k) => {
    if (el)
      el.style.opacity = (sm((p - 0.36 - k * 0.05) / 0.1) * (1 - ex)).toFixed(3)
  })
  if (E.ptext) E.ptext.style.opacity = (1 - ex).toFixed(3)
  if (E.pq) {
    const qin = sm((p - 0.56) / 0.1)
    const y = lerp(H / 2 + bh0 * sq * 0.5 + 90, H / 2, ex)
    E.pq.style.transform = tr(
      W / 2,
      y,
      ` translate(-50%,-50%) scale(${lerp(0.5, 1, ex).toFixed(3)})`
    )
    E.pq.style.opacity = qin.toFixed(3)
  }
}

const fxPause: Fx = (E, s) => {
  const p = s.p
  if (E.q1) {
    const a = 1 - sm((p - 0.4) / 0.1)
    const i = sm(p / 0.14)
    E.q1.style.opacity = a.toFixed(3)
    E.q1.style.letterSpacing = lerp(0.02, -0.035, i).toFixed(3) + 'em'
    E.q1.style.transform = `translateY(${(-(1 - a) * 40).toFixed(1)}px)`
  }
  if (E.q2) {
    const e = sm((p - 0.52) / 0.14)
    E.q2.style.opacity = e.toFixed(3)
    E.q2.style.letterSpacing = lerp(0.06, -0.035, e).toFixed(3) + 'em'
    E.q2.style.transform = `translateY(${((1 - e) * 40).toFixed(1)}px)`
  }
}

const fxModel: Fx = (E, s, st, W, H) => {
  const p = s.p
  const narrow = W < 1024
  const m5 = W * 0.05
  const panelLeft = W - m5 - Math.min(W * 0.4, 580)
  let cx: number, ly: number, R: number
  if (narrow) {
    // Narrow screens: the design's numbers (panel 170px tall, ring centred at
    // 150 + 1.4R) let the ring's top label collide with the two-line heading
    // and the panel's copy spill into the caption below it at 390px. The panel
    // is 220px tall here and the ring sits 70px lower; nothing else changes.
    const panelTop = H - H * 0.07 - 220
    R = Math.max(40, Math.min(W * 0.22, (panelTop - 170) / 2.9))
    cx = W / 2
    ly = 220 + R * 1.4
  } else {
    R = Math.min(H * 0.25, (panelLeft - m5) * 0.34)
    cx = m5 + R * 1.62
    ly = Math.max(H * 0.56, 210 + R * 1.36)
  }
  const qq = c01((p - 0.05) / 0.9) * 5
  const k = Math.min(5, Math.floor(qq))
  const f = qq - k
  const sf = sm((f - 0.5) / 0.5)
  const rot = ((k + sf) * Math.PI) / 3
  const act = Math.min(5, sf < 0.5 ? k : k + 1)
  st.mst = { cx, cy: ly + s.oy, R, rot, act }
  E.ml.forEach((el, i) => {
    if (!el) return
    const a = -Math.PI / 2 + (i * Math.PI) / 3 - rot
    el.style.transform = tr(
      cx + Math.cos(a) * R * 1.36,
      ly + Math.sin(a) * R * 1.36,
      ' translate(-50%,-50%)'
    )
    el.style.opacity = i === act ? '1' : '0.45'
  })
  if (E.mc) E.mc.style.transform = tr(cx, ly + 30, ' translate(-50%,-50%)')
  E.mp.forEach((el, i) => {
    if (!el) return
    const on = i === act
    el.style.opacity = on ? '1' : '0'
    el.style.transform = `translateY(${on ? 0 : i < act ? -28 : 28}px)`
  })
  if (E.mpanels && narrow !== st.mnarrow) {
    st.mnarrow = narrow
    const style = E.mpanels.style
    if (narrow) {
      style.left = '5vw'
      style.right = '5vw'
      style.width = 'auto'
      style.top = 'auto'
      style.bottom = '7vh'
      style.height = '220px'
      style.transform = 'none'
    } else {
      style.left = ''
      style.right = '5vw'
      style.width = 'min(40vw,580px)'
      style.top = '50%'
      style.bottom = ''
      style.height = '340px'
      style.transform = 'translateY(-50%)'
    }
  }
}

const fxDefine: Fx = (E, s, st, W, H) => {
  const p = s.p
  const lineH = Math.min(H * 0.12, 104)
  const cOut = sm((p - 0.7) / 0.14)
  const opp = sm((p - 0.8) / 0.12)
  E.dw.forEach((el, k) => {
    if (!el) return
    const ok = sm((p - 0.1 - k * 0.09) / 0.14)
    const [fx, fy, fr] = DW[k]
    let x = lerp(fx * W, W / 2, ok)
    let y = lerp(fy * H, H / 2 + (k - 2) * lineH, ok)
    x = lerp(x, W / 2, cOut)
    y = lerp(y, H / 2, cOut)
    const sc = lerp(0.62, 1, ok) * (1 - cOut * 0.5)
    el.style.transform = tr(
      x,
      y,
      ` translate(-50%,-50%) rotate(${lerp(fr, 0, ok).toFixed(2)}deg) scale(${sc.toFixed(3)})`
    )
    el.style.opacity = ((0.3 + 0.7 * ok) * (1 - cOut)).toFixed(3)
    el.style.color = ok > 0.5 ? st.P.ink : st.P.faint
  })
  E.dcon.forEach((el, k) => {
    if (!el) return
    const o = sm((p - 0.1 - (k + 1) * 0.09) / 0.14) * (1 - cOut)
    el.style.transform = tr(
      W / 2 + Math.min(W * 0.26, 360),
      H / 2 + (k - 1.5) * lineH,
      ' translate(0,-50%)'
    )
    el.style.opacity = o.toFixed(3)
  })
  if (E.dopp) {
    E.dopp.style.opacity = opp.toFixed(3)
    E.dopp.style.letterSpacing = lerp(0.4, -0.04, opp).toFixed(3) + 'em'
    E.dopp.style.transform = `translate(-50%,-50%) scale(${lerp(0.9, 1, opp).toFixed(3)})`
  }
}

const fxDesign: Fx = (E, s, st, W, H, t) => {
  const p = s.p
  const narrow = W < STAGE_ROW_MIN
  const hb = E.dhead ? E.dhead.getBoundingClientRect() : null
  const hBottom = hb ? hb.bottom - s.oy : H * 0.3
  const top = Math.max(H * 0.26, hBottom + 28)
  let span: number
  let ox: number
  let ex: number
  if (narrow) {
    // The result panel sits at the bottom (150px tall, 7vh up), so the
    // branches end above it, the origin keeps its label on screen and the
    // widest branch label decides where the branches end. The span floor is
    // seven label heights, so labels never overlap each other.
    const m5 = W * 0.05
    const bottom = H - H * 0.07 - 150 - 36
    span = Math.max(7 * 34, bottom - top)
    ox = Math.max(W * 0.1, m5 + (E.bo ? E.bo.offsetWidth / 2 : 0))
    let bw = 0
    for (const el of E.br) if (el && el.offsetWidth > bw) bw = el.offsetWidth
    ex = Math.max(ox + 40, Math.min(W * 0.4, W - m5 - 12 - bw))
  } else {
    span = Math.max(H * 0.4, H * 0.9 - top)
    ox = W * 0.13
    ex = W * 0.44
  }
  const O = { x: ox, y: top + span * 0.55 }
  const ends: { x: number; y: number }[] = []
  const g: number[] = []
  for (let k = 0; k < 7; k++) {
    ends.push({ x: ex, y: top + (k / 6) * span })
    g.push(sm((p - 0.06 - k * 0.05) / 0.28))
  }
  const all = g[6] > 0.98
  const act = st.hv.br >= 0 ? st.hv.br : all ? Math.floor(t / 2.6) % 7 : -1
  st.dst = {
    O: { x: O.x, y: O.y + s.oy },
    E: ends.map((e) => ({ x: e.x, y: e.y + s.oy })),
    g,
    act,
  }
  E.br.forEach((el, k) => {
    if (!el) return
    el.style.transform = tr(ends[k].x + 12, ends[k].y, ' translate(0,-50%)')
    el.style.opacity = g[k].toFixed(3)
    const on = k === act
    el.style.color = on ? st.P.ink : st.P.muted
    el.style.borderColor = on ? st.P.ink : 'transparent'
    el.style.fontWeight = on ? '600' : '500'
  })
  E.bf.forEach((el, k) => {
    if (!el) return
    const on = k === act
    el.style.opacity = on ? '1' : '0'
    el.style.transform = `translateY(${on ? 0 : 24}px)`
  })
  if (E.bo) E.bo.style.transform = tr(O.x, O.y - 78, ' translate(-50%,-50%)')
}

const fxDeploy: Fx = (E, s, st, W, H, _t, dt) => {
  const p = s.p
  const narrow = W < STAGE_ROW_MIN
  const rx = Math.min(W * 0.36, 580)
  let cy = H * 0.56
  let ry = Math.min(H * 0.28, 280)
  if (narrow) {
    // Fit the ring between the heading and the routes caption; 44px covers a
    // label offset of 24 plus a line of text.
    const hb = E.dphead
      ? E.dphead.getBoundingClientRect().bottom - s.oy
      : H * 0.3
    const ct = E.dproutes ? E.dproutes.getBoundingClientRect().top - s.oy : H
    const top = hb + 44
    const bot = ct - 44
    cy = (top + bot) / 2
    ry = Math.max(60, Math.min(ry, (bot - top) / 2))
  }
  const C = { x: W / 2, y: cy }
  const speed = st.calm ? 0 : st.hv.ch >= 0 ? 0.004 : 0.035
  st.dphi += dt * speed
  const rv = sm(0.3 + p * 2)
  const P: { x: number; y: number }[] = []
  for (let k = 0; k < 12; k++) {
    const a = (k / 12) * TAU - Math.PI / 2 + st.dphi
    P.push({ x: C.x + Math.cos(a) * rx * rv, y: C.y + Math.sin(a) * ry * rv })
  }
  st.dps = {
    C: { x: C.x, y: C.y + s.oy },
    P: P.map((q) => ({ x: q.x, y: q.y + s.oy })),
    rv,
  }
  E.ch.forEach((el, k) => {
    if (!el) return
    // On phones neighbouring labels alternate above and below their dot.
    const dy = narrow && k % 2 ? -22 : 24
    el.style.transform = tr(P[k].x, P[k].y + dy, ' translate(-50%,-50%)')
    el.style.opacity = rv.toFixed(3)
    el.style.color = st.hv.ch === k ? st.P.amber : st.P.body
  })
  if (E.dc) E.dc.style.transform = tr(C.x, C.y - 34, ' translate(-50%,-50%)')
}

const fxFlywheel: Fx = (E, _s, st, W, _H, _t, dt) => {
  if (!E.fly) return
  const r = E.fly.getBoundingClientRect()
  const aw = r.width
  const ah = r.height
  // On phones the ring is smaller so its labels, which ride outside it, can
  // still fit inside the box (the section clips at its edge).
  const phone = W < 640
  const R = Math.min(aw, ah) * (phone ? 0.24 : 0.33)
  let Rl = R * 1.3
  if (phone) {
    let lw = 0
    for (const el of E.fl) if (el && el.offsetWidth > lw) lw = el.offsetWidth
    Rl = Math.min(Rl, aw / 2 - lw / 2 - 4)
  }
  const speed = st.calm ? 0 : st.hv.fl >= 0 ? 0.02 : 0.16
  st.phi += dt * speed
  st.fst = { cx: r.left + aw / 2, cy: r.top + ah / 2, R, phi: st.phi }
  E.fl.forEach((el, k) => {
    if (!el) return
    const a = -Math.PI / 2 + (k * TAU) / 5 + st.phi
    el.style.transform = tr(
      aw / 2 + Math.cos(a) * Rl,
      ah / 2 + Math.sin(a) * Rl,
      ' translate(-50%,-50%)'
    )
    el.style.color = st.hv.fl === k ? st.P.vio : st.P.ink
  })
  E.fc.forEach((el, k) => {
    if (el) el.style.opacity = st.hv.fl === k ? '1' : '0'
  })
  if (E.fcd) E.fcd.style.opacity = st.hv.fl < 0 ? '1' : '0'
}

const fxFinal: Fx = (E, s) => {
  const p = s.p
  E.fin.forEach((el, i) => {
    const e = sm((p + 0.14 - i * 0.07) / 0.32)
    el.style.opacity = e.toFixed(3)
    el.style.transform = `translateY(${((1 - e) * 50).toFixed(1)}px)`
  })
}

const fxWho: Fx = (E, _s, st, W) => {
  // In the grid below WHO_ROW_MIN every description shows (CSS), so the
  // opacity set here in row mode is cleared when the layout changes.
  const row = W >= WHO_ROW_MIN
  if (row !== st.prow) {
    st.prow = row
    if (!row) E.pdesc.forEach((el) => el && (el.style.opacity = ''))
  }
  if (!row) return
  E.pdesc.forEach((el, k) => {
    if (!el) return
    el.style.opacity = st.hv.person === k ? '1' : '0'
  })
}

export const fx: Record<string, Fx> = {
  problem: fxProblem,
  pause: fxPause,
  model: fxModel,
  define: fxDefine,
  design: fxDesign,
  deploy: fxDeploy,
  flywheel: fxFlywheel,
  final: fxFinal,
  who: fxWho,
}

export type Targets = { D: number; LA: number; extra: Extra | null }

/** Field targets and extra canvas drawing for the active scene. */
export const targets = (
  s: Scene | null,
  W: number,
  H: number,
  t: number,
  ns: Node[],
  st: StoryState
): Targets => {
  const N = ns.length
  const name = s ? s.name : 'hero'
  const p = s ? s.p : 0
  const oy = s ? s.oy : 0
  const drift = st.calm ? 0 : 1
  const P = st.P
  let D = 64
  let LA = 0.08
  let extra: Extra | null = null
  for (let i = 0; i < N; i++) fieldTarget(ns[i], W, H, t, 0, 0.3, drift)

  if (name === 'hero') {
    D = 92
    LA = 0.12
    const m = st.mouse
    for (const n of ns) {
      fieldTarget(n, W, H, t, oy, 0.62, drift)
      if (!st.calm) {
        const dx = m.x - n.tx
        const dy = m.y - n.ty
        const d = Math.hypot(dx, dy)
        if (d < 180) {
          const f = (1 - d / 180) * 0.22
          n.tx += dx * f
          n.ty += dy * f
        }
      }
    }
    if (!st.calm) {
      extra = (ctx) => {
        for (const n of ns) {
          const d = Math.hypot(m.x - n.x, m.y - n.y)
          if (d < 150) {
            ctx.strokeStyle = `rgba(${P.cursor},${((1 - d / 150) * 0.35).toFixed(3)})`
            ctx.lineWidth = 0.8
            ctx.beginPath()
            ctx.moveTo(m.x, m.y)
            ctx.lineTo(n.x, n.y)
            ctx.stroke()
          }
        }
      }
    }
  } else if (name === 'problem' && st.pst) {
    const { bw0, bh0, e1, ex, pr } = st.pst
    const cx = W / 2
    const cy = oy + H / 2
    const jit = p > 0.28 && p < 0.7 ? 2.4 + pr * 2 : 0.6
    D = lerp(36, 80, ex)
    LA = 0.14
    for (const n of ns) {
      fieldTarget(n, W, H, t, oy, 0.55, drift)
      const bx =
        cx +
        (n.s1 - 0.5) * bw0 * 0.9 +
        Math.sin(t * 9 + n.s3 * 40) * jit * drift
      const by =
        cy +
        (n.s2 - 0.5) * bh0 * 0.78 +
        Math.cos(t * 8 + n.s4 * 40) * jit * drift
      let x = lerp(n.tx, bx, e1)
      let y = lerp(n.ty, by, e1)
      x = cx + (x - cx) * (1 + ex * 5)
      y = cy + (y - cy) * (1 + ex * 5)
      n.tx = x
      n.ty = y
      n.ta = 0.55 * (1 - ex * 0.4)
      n.k = 0.12
    }
  } else if (name === 'opportunity') {
    D = 44
    LA = 0.1
    ns.forEach((n, i) => {
      const c = i % 3
      const a = n.s1 * TAU + t * 0.05 * (c - 1) * drift
      const rr = 90 * Math.sqrt(n.s2)
      n.tx = W * (0.2 + c * 0.3) + Math.cos(a) * rr
      n.ty = H * 0.66 + Math.sin(a) * rr * 0.8
      n.ta = 0.3
      n.tr = 1.1 + n.s3
    })
  } else if (name === 'pause') {
    const e = sm((p - 0.42) / 0.3)
    const C = { x: W / 2, y: oy + H * 0.8 }
    D = 46
    LA = 0.16 * e
    ns.forEach((n, i) => {
      if (i === 0) {
        n.tx = C.x
        n.ty = C.y
        n.tr = 5
        n.ta = 1
        n.c = 2
        n.k = 0.1
        return
      }
      const a = n.s1 * TAU + t * 0.05 * drift
      const rr = 40 + n.s2 * 200
      n.tx = lerp(C.x + (n.s1 - 0.5) * 6, C.x + Math.cos(a) * rr * 1.6, e)
      n.ty = lerp(C.y + (n.s2 - 0.5) * 6, C.y + Math.sin(a) * rr * 0.5, e)
      n.ta = lerp(0.15, 0.5, e)
      n.tr = 1 + n.s3 * 1.2
      n.k = 0.08
    })
  } else if (name === 'model' && st.mst) {
    const { cx, cy, R, rot, act } = st.mst
    D = 22
    LA = 0.22
    ns.forEach((n, i) => {
      n.k = 0.25
      n.c = 1
      n.tr = 1.3
      n.ta = 0.55
      let a: number
      let rr: number
      if (i < 6) {
        a = -Math.PI / 2 + (i * Math.PI) / 3 - rot
        rr = R
        n.tr = i === act ? 7 : 4
        n.c = i === act ? 2 : 1
        n.ta = 1
        n.k = 0.4
      } else if (i < 78) {
        a = ((i - 6) / 72) * TAU - rot * 0.5 + t * 0.02 * drift
        rr = R
        n.ta = 0.5
        n.tr = 1.1
      } else if (i < 118) {
        a = ((i - 78) / 40) * TAU + rot * 0.35 - t * 0.05 * drift
        rr = R * 0.56
        n.ta = 0.42
      } else {
        a = n.s2 * TAU - t * (0.12 + n.s3 * 0.3) * drift - rot
        rr = R * (0.72 + (n.s1 - 0.5) * 0.5)
        n.ta = 0.7
        n.c = n.amber ? 2 : 1
      }
      n.tx = cx + Math.cos(a) * rr
      n.ty = cy + Math.sin(a) * rr
    })
    extra = (ctx) => {
      ctx.lineWidth = 1
      ctx.strokeStyle = 'rgba(221,214,254,0.16)'
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, TAU)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(cx, cy, R * 0.56, 0, TAU)
      ctx.stroke()
      ctx.strokeStyle = 'rgba(221,214,254,0.22)'
      for (let k = 0; k < 72; k++) {
        const a = (k / 72) * TAU - rot
        const r2 = R * (k % 12 === 0 ? 1.19 : 1.13)
        ctx.beginPath()
        ctx.moveTo(cx + Math.cos(a) * R * 1.09, cy + Math.sin(a) * R * 1.09)
        ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2)
        ctx.stroke()
      }
      for (let i = 0; i < 6; i++) {
        const n = ns[i]
        ctx.strokeStyle =
          i === act ? 'rgba(245,158,11,0.85)' : 'rgba(221,214,254,0.1)'
        ctx.lineWidth = i === act ? 1.4 : 1
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(n.x, n.y)
        ctx.stroke()
      }
      ctx.fillStyle = '#F59E0B'
      ctx.beginPath()
      ctx.arc(cx, cy, 4, 0, TAU)
      ctx.fill()
      ctx.strokeStyle = 'rgba(245,158,11,0.45)'
      ctx.beginPath()
      ctx.arc(cx, cy, 11 + Math.sin(t * 2) * 2, 0, TAU)
      ctx.stroke()
    }
  } else if (name === 'define') {
    const c = sm((p - 0.72) / 0.18)
    const C = { x: W / 2, y: oy + H / 2 }
    D = 40
    LA = 0.12
    for (const n of ns) {
      const px = W * 0.06 + n.s1 * W * 0.88
      const py =
        oy +
        H * 0.86 +
        Math.sin(n.s1 * 9 + t * 0.6 * drift) * 16 +
        (n.s2 - 0.5) * 12
      const a = n.s1 * TAU + t * 0.1 * drift
      const rr = 150 + n.s2 * 140
      n.tx = lerp(px, C.x + Math.cos(a) * rr * 1.5, c)
      n.ty = lerp(py, C.y + Math.sin(a) * rr * 0.7, c)
      n.ta = lerp(0.45, 0.4, c)
      n.tr = 1.2 + n.s3
      n.k = 0.08
      n.c = n.amber ? 2 : 0
    }
  } else if (name === 'design' && st.dst) {
    const { O, E: ends, g, act } = st.dst
    D = 18
    LA = 0.3
    const ctrl = ends.map((e) => [
      { x: O.x + (e.x - O.x) * 0.45, y: O.y },
      { x: O.x + (e.x - O.x) * 0.55, y: e.y },
    ])
    ns.forEach((n, i) => {
      n.k = 0.3
      if (i < 84) {
        const b = Math.floor(i / 12)
        const j = i % 12
        const q = bz(O, ctrl[b][0], ctrl[b][1], ends[b], ((j + 1) / 12) * g[b])
        n.tx = q.x
        n.ty = q.y
        n.ta = g[b] > 0.02 ? 0.85 : 0
        n.tr = b === act ? 2.8 : 1.5
        n.c = b === act ? 2 : 0
      } else {
        const a = n.s1 * TAU + t * 0.3 * (n.s3 - 0.5) * drift
        const rr = 8 + n.s2 * 44
        n.tx = O.x + Math.cos(a) * rr
        n.ty = O.y + Math.sin(a) * rr
        n.ta = 0.75
        n.tr = 1.3 + n.s3
        n.c = n.amber ? 2 : 0
      }
    })
    extra = (ctx) => {
      for (let b = 0; b < 7; b++) {
        if (g[b] < 0.01) continue
        const on = b === act
        ctx.strokeStyle = on ? 'rgba(245,158,11,0.9)' : `rgba(${P.inkRGB},0.16)`
        ctx.lineWidth = on ? 1.6 : 1
        ctx.beginPath()
        for (let s2 = 0; s2 <= 30; s2++) {
          const q = bz(O, ctrl[b][0], ctrl[b][1], ends[b], (s2 / 30) * g[b])
          if (s2 === 0) ctx.moveTo(q.x, q.y)
          else ctx.lineTo(q.x, q.y)
        }
        ctx.stroke()
      }
    }
  } else if (name === 'deploy' && st.dps) {
    const { C, P, rv } = st.dps
    const hv = st.hv.ch
    D = 50
    LA = 0.14
    ns.forEach((n, i) => {
      n.k = 0.3
      if (i < 12) {
        n.tx = P[i].x
        n.ty = P[i].y
        n.tr = hv === i ? 6 : 4
        n.c = hv === i ? 2 : 0
        n.ta = 1
        return
      }
      if (i === 12) {
        n.tx = C.x
        n.ty = C.y
        n.tr = 7
        n.c = 2
        n.ta = 1
        return
      }
      const ch = i % 12
      const q = P[ch]
      if (i % 4 === 0) {
        n.tx = lerp(C.x, q.x, n.s1)
        n.ty = lerp(C.y, q.y, n.s1)
      } else {
        n.tx =
          q.x +
          (n.s1 - 0.5) * 110 * rv +
          Math.sin(t * 0.5 + n.s3 * 9) * 6 * drift
        n.ty =
          q.y +
          (n.s2 - 0.5) * 80 * rv +
          Math.cos(t * 0.4 + n.s4 * 9) * 6 * drift
      }
      n.ta = 0.45
      n.tr = 1.2 + n.s3
      n.c = hv === ch ? 2 : 0
      n.k = 0.14
    })
    extra = (ctx) => {
      for (let k = 0; k < 12; k++) {
        const on = hv === k
        const near =
          hv >= 0 && (Math.abs(hv - k) === 1 || Math.abs(hv - k) === 11)
        ctx.strokeStyle = on
          ? 'rgba(245,158,11,0.9)'
          : near
            ? 'rgba(245,158,11,0.35)'
            : `rgba(${st.P.inkRGB},0.1)`
        ctx.lineWidth = on ? 1.5 : 1
        ctx.beginPath()
        ctx.moveTo(C.x, C.y)
        ctx.lineTo(ns[k].x, ns[k].y)
        ctx.stroke()
        const nx = ns[(k + 1) % 12]
        ctx.strokeStyle =
          on || hv === (k + 1) % 12
            ? 'rgba(245,158,11,0.5)'
            : `rgba(${st.P.inkRGB},0.07)`
        ctx.beginPath()
        ctx.moveTo(ns[k].x, ns[k].y)
        ctx.lineTo(nx.x, nx.y)
        ctx.stroke()
      }
    }
  } else if (name === 'flywheel' && st.fst) {
    const { cx, cy, R, phi } = st.fst
    const hv = st.hv.fl
    D = 20
    LA = 0.2
    ns.forEach((n, i) => {
      n.k = 0.4
      let a: number
      let rr = R
      if (i < 5) {
        a = -Math.PI / 2 + (i * TAU) / 5 + phi
        n.tr = hv === i ? 7 : 4.5
        n.c = hv === i ? 2 : 0
        n.ta = 1
      } else if (i < 85) {
        a = ((i - 5) / 80) * TAU + phi
        n.tr = 1.1
        n.ta = 0.38
        n.c = 0
      } else {
        a =
          n.s1 * TAU +
          phi +
          t * 0.4 * (0.6 + n.s3) * (hv >= 0 ? 0.2 : 1) * drift
        rr = R + (n.s2 - 0.5) * 18
        n.tr = 1.3 + n.s3
        n.ta = 0.7
        n.c = n.amber ? 2 : 0
      }
      n.tx = cx + Math.cos(a) * rr
      n.ty = cy + Math.sin(a) * rr
    })
    extra = (ctx) => {
      ctx.strokeStyle = `rgba(${P.inkRGB},0.14)`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, TAU)
      ctx.stroke()
      ctx.fillStyle = '#F59E0B'
      ctx.beginPath()
      ctx.arc(cx, cy, 5 + Math.sin(t * 2) * 0.8, 0, TAU)
      ctx.fill()
      ctx.strokeStyle = 'rgba(245,158,11,0.5)'
      for (let k = 0; k < 8; k++) {
        const a = (k / 8) * TAU + t * 0.2
        ctx.beginPath()
        ctx.moveTo(cx + Math.cos(a) * 10, cy + Math.sin(a) * 10)
        ctx.lineTo(cx + Math.cos(a) * 18, cy + Math.sin(a) * 18)
        ctx.stroke()
      }
    }
  } else if (name === 'final') {
    const e = sm(p / 0.75)
    const C = { x: W * 0.72, y: oy + H * 0.46 }
    const M = Math.min(W, H)
    D = lerp(30, 46, e)
    LA = 0.2
    ns.forEach((n, i) => {
      fieldTarget(n, W, H, t, oy, 0.5, drift)
      const cl = i % 14
      const ca = (cl / 14) * TAU + t * 0.03 * drift
      const cr = M * 0.36
      const kx = C.x + Math.cos(ca) * cr + (n.s1 - 0.5) * 30
      const ky = C.y + Math.sin(ca) * cr * 0.8 + (n.s2 - 0.5) * 30
      const pa = i * 2.39996 + t * 0.04 * drift
      const pr2 = Math.sqrt((i + 1) / N) * M * 0.3
      const fx2 = C.x + Math.cos(pa) * pr2
      const fy2 = C.y + Math.sin(pa) * pr2
      const e1 = sm(e * 2)
      const e2 = sm(e * 2 - 1)
      n.tx = lerp(lerp(n.tx, kx, e1), fx2, e2)
      n.ty = lerp(lerp(n.ty, ky, e1), fy2, e2)
      n.ta = 0.55
      n.c = n.amber ? 2 : 1
      n.k = 0.08
    })
  }
  return { D, LA, extra }
}
