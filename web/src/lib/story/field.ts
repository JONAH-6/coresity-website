import { TAU, rng } from './math'
import type { Palette } from './theme'

// The particle field: 170 seeded nodes that ease toward per-scene targets,
// with faint connections between neighbours. Ported from the design's
// boot() node setup, field() and draw() (script lines 565–566, 793–797,
// 931–961).

export type Node = {
  x: number
  y: number
  tx: number
  ty: number
  r: number
  tr: number
  a: number
  ta: number
  k: number
  /** 0 ink, 1 lavender (on dark), 2 amber */
  c: number
  s1: number
  s2: number
  s3: number
  s4: number
  amber: boolean
  dk: boolean
}

export const createNodes = (
  W: number,
  H: number,
  count = 170,
  seed = 11
): Node[] => {
  const r = rng(seed)
  const nodes: Node[] = []
  for (let i = 0; i < count; i++) {
    nodes.push({
      x: r() * W,
      y: r() * H,
      tx: 0,
      ty: 0,
      r: 1.5,
      tr: 1.5,
      a: 0,
      ta: 0.5,
      k: 0.07,
      c: 0,
      s1: r(),
      s2: r(),
      s3: r(),
      s4: r(),
      amber: i % 17 === 0,
      dk: false,
    })
  }
  return nodes
}

/**
 * Ambient target: the node's home position plus a slow wander. `drift` is 1
 * normally and 0 under reduced motion, where the field holds still.
 */
export const fieldTarget = (
  n: Node,
  W: number,
  H: number,
  t: number,
  oy: number,
  a: number,
  drift = 1
) => {
  n.tx = n.s1 * W + Math.sin(t * 0.21 + n.s3 * TAU) * 24 * drift
  n.ty = oy + n.s2 * H + Math.cos(t * 0.17 + n.s4 * TAU) * 24 * drift
  n.tr = 1.1 + n.s3 * 1.5
  n.ta = a
  n.k = 0.06
  n.c = n.amber ? 2 : 0
}

export type Extra = (ctx: CanvasRenderingContext2D) => void

export type DrawInput = {
  nodes: Node[]
  W: number
  H: number
  /** Viewport rects of visible dark scenes, painted before the field. */
  darks: DOMRect[]
  extra: Extra | null
  /** Connection distance. */
  D: number
  /** Connection alpha. */
  LA: number
  /** The theme's canvas colours. */
  P: Palette
}

export const drawField = (
  ctx: CanvasRenderingContext2D,
  { nodes, W, H, darks, extra, D, LA, P }: DrawInput
) => {
  ctx.clearRect(0, 0, W, H)
  for (const r of darks) {
    const top = Math.max(0, r.top)
    const bot = Math.min(H, r.bottom)
    ctx.fillStyle = P.deep
    ctx.fillRect(r.left, top, r.width, bot - top)
  }
  const inDark = (x: number, y: number) => {
    for (const r of darks) {
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom)
        return true
    }
    return false
  }
  for (const n of nodes) {
    n.x += (n.tx - n.x) * n.k
    n.y += (n.ty - n.y) * n.k
    n.a += (n.ta - n.a) * 0.08
    n.r += (n.tr - n.r) * 0.1
    n.dk = darks.length ? inDark(n.x, n.y) : false
  }
  if (extra) extra(ctx)

  const N = nodes.length
  const D2 = D * D
  if (LA > 0.005) {
    ctx.lineWidth = 0.7
    for (let i = 0; i < N; i++) {
      const a = nodes[i]
      if (a.a < 0.05) continue
      for (let j = i + 1; j < N; j++) {
        const b = nodes[j]
        if (b.a < 0.05) continue
        const dx = a.x - b.x
        if (dx > D || dx < -D) continue
        const dy = a.y - b.y
        const d2 = dx * dx + dy * dy
        if (d2 > D2) continue
        const al = (1 - Math.sqrt(d2) / D) * LA * Math.min(a.a, b.a)
        if (al < 0.01) continue
        ctx.strokeStyle = a.dk
          ? `rgba(221,214,254,${al.toFixed(3)})`
          : `rgba(${P.inkRGB},${al.toFixed(3)})`
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }
    }
  }
  for (const n of nodes) {
    if (n.a < 0.01) continue
    ctx.globalAlpha = Math.min(1, n.a)
    ctx.fillStyle = n.c === 2 ? '#F59E0B' : n.dk ? '#DDD6FE' : P.ink
    ctx.beginPath()
    ctx.arc(n.x, n.y, Math.max(0.5, n.r), 0, TAU)
    ctx.fill()
  }
  ctx.globalAlpha = 1
}
