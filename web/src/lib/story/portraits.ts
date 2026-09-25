import { TAU, lerp, rng } from './math'

// Seven procedural dot-matrix portraits for "Who we work with", each with a
// signature detail that fills in on hover. Ported from makePortrait() and
// portraits() (script lines 743–780).

export type Portrait = {
  base: [number, number, number][]
  sig: [number, number][]
  hx: number
  hy: number
  /** Hover amount, eased. */
  h: number
}

const W = 300
const H = 360

export const makePortrait = (k: number): Portrait => {
  const r = rng(k * 7 + 3)
  const off = [0, -0.05, 0.04, 0, 0.06, -0.04, 0.02][k]
  const hr = [50, 46, 54, 50, 44, 50, 56][k]
  const hx = W / 2 + off * W
  const hy = 128
  const base: [number, number, number][] = []
  const sig: [number, number][] = []
  for (let y = 4; y < H; y += 6) {
    for (let x = 4; x < W; x += 6) {
      const inHead = Math.hypot(x - hx, y - hy) < hr
      const neck = Math.abs(x - hx) < hr * 0.42 && y > hy && y < hy + hr * 2.3
      const sx = (x - W / 2) / (W * 0.46)
      const sy = (y - (H + 10)) / (H * 0.36)
      if (inHead || neck || sx * sx + sy * sy < 1) base.push([x, y, r() * TAU])
    }
  }
  const line = (a: number[], b: number[], st: number) => {
    const n = Math.max(1, Math.floor(Math.hypot(b[0] - a[0], b[1] - a[1]) / st))
    for (let i = 0; i <= n; i++) {
      sig.push([lerp(a[0], b[0], i / n), lerp(a[1], b[1], i / n)])
    }
  }
  if (k === 0) {
    for (const yy of [284, 300, 316])
      for (let x = 70; x <= 230; x += 9) sig.push([x, yy])
  }
  if (k === 1) {
    for (const [cx, cy] of [
      [118, 304],
      [160, 304],
      [139, 266],
    ]) {
      for (let a = -12; a <= 12; a += 6)
        for (let b = -12; b <= 12; b += 6) sig.push([cx + a, cy + b])
    }
  }
  if (k === 2) {
    const pts = [
      [hx - hr * 1.5, hy - hr * 0.1],
      [hx - hr * 0.5, hy - hr * 1.45],
      [hx + hr * 0.6, hy - hr * 0.6],
      [hx + hr * 1.6, hy - hr * 1.5],
    ]
    for (let i = 0; i < 3; i++) line(pts[i], pts[i + 1], 7)
  }
  if (k === 3) {
    for (let a = -150; a <= -30; a += 15) {
      const rad = (a * Math.PI) / 180
      line(
        [hx + Math.cos(rad) * hr * 1.18, hy + Math.sin(rad) * hr * 1.18],
        [hx + Math.cos(rad) * hr * 2.1, hy + Math.sin(rad) * hr * 2.1],
        7
      )
    }
  }
  if (k === 4) {
    for (let i = 0; i < 80; i++) {
      const a = r() * TAU
      const d = Math.sqrt(r()) * 14
      sig.push([
        hx + hr * 0.3 + Math.cos(a) * d,
        hy - hr * 0.25 + Math.sin(a) * d,
      ])
    }
  }
  if (k === 5) {
    line([60, 334], [238, 156], 8)
    line([238, 156], [214, 160], 6)
    line([238, 156], [234, 180], 6)
  }
  if (k === 6) {
    for (const rr of [1.3, 1.62]) {
      for (let a = 0; a < 360; a += 8) {
        const rad = (a * Math.PI) / 180
        sig.push([hx + Math.cos(rad) * hr * rr, hy + Math.sin(rad) * hr * rr])
      }
    }
  }
  return { base, sig, hx, hy, h: 0 }
}

/**
 * Draws every portrait canvas that is on screen. `inkRGB` is the theme's ink
 * as "r,g,b": the base dots use it and the signature warms from it to amber.
 */
export const drawPortraits = (
  canvases: HTMLCanvasElement[],
  cache: Portrait[],
  t: number,
  viewportH: number,
  hovered: number,
  dpr: number,
  inkRGB: string
) => {
  const [ir, ig, ib] = inkRGB.split(',').map(Number)
  canvases.forEach((cv, k) => {
    if (!cv) return
    const rc = cv.getBoundingClientRect()
    if (rc.bottom < 0 || rc.top > viewportH) return
    if (!cache[k]) cache[k] = makePortrait(k)
    const pd = cache[k]
    if (cv.width !== W * dpr) {
      cv.width = W * dpr
      cv.height = H * dpr
    }
    const c = cv.getContext('2d')
    if (!c) return
    c.setTransform(dpr, 0, 0, dpr, 0, 0)
    c.clearRect(0, 0, W, H)
    pd.h += ((hovered === k ? 1 : 0) - pd.h) * 0.08
    const h = pd.h
    c.fillStyle = `rgba(${inkRGB},${(0.26 + 0.1 * h).toFixed(3)})`
    for (const [x, y, ph] of pd.base) {
      c.fillRect(
        x + Math.sin(t * 1.3 + ph) * 0.8 * h,
        y + Math.cos(t * 1.1 + ph) * 0.6 * h,
        1.6,
        1.6
      )
    }
    const n = pd.sig.length
    const reveal = 0.3 + 0.7 * h
    c.fillStyle = `rgba(${Math.round(lerp(ir, 245, h))},${Math.round(lerp(ig, 158, h))},${Math.round(lerp(ib, 11, h))},${(0.45 + 0.55 * h).toFixed(3)})`
    for (let i = 0; i < n; i++) {
      if (i / n > reveal) break
      const [x, y] = pd.sig[i]
      c.fillRect(x - 1.3, y - 1.3, 2.6, 2.6)
    }
    c.fillStyle = '#F59E0B'
    c.beginPath()
    c.arc(pd.hx, pd.hy + 4, 3.4 + h * 2.2 + Math.sin(t * 2.4 + k) * 0.6, 0, TAU)
    c.fill()
  })
}
