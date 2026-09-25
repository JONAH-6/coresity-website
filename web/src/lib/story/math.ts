// Pure helpers and layout constants, ported verbatim from the design file
// (docs/Coresity Story v3.dc.html, script lines 489–498). Same names, so the
// two can be compared side by side.

export const c01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

/** Smoothstep on the clamped unit interval. */
export const sm = (v: number) => {
  v = c01(v)
  return v * v * (3 - 2 * v)
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export const TAU = Math.PI * 2

/** Mulberry32: a tiny seeded generator so the field is the same every visit. */
export function rng(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export type Pt = { x: number; y: number }

/** Cubic bezier point at t. */
export const bz = (a: Pt, b: Pt, c: Pt, d: Pt, t: number): Pt => {
  const u = 1 - t
  return {
    x:
      u * u * u * a.x +
      3 * u * u * t * b.x +
      3 * u * t * t * c.x +
      t * t * t * d.x,
    y:
      u * u * u * a.y +
      3 * u * u * t * b.y +
      3 * u * t * t * c.y +
      t * t * t * d.y,
  }
}

/** Problem scene: where the five words start, as fractions of the viewport. */
export const PW: [number, number][] = [
  [0.16, 0.3],
  [0.78, 0.24],
  [0.2, 0.76],
  [0.8, 0.72],
  [0.52, 0.16],
]

/** Problem scene: where the six constraint chips sit around the box. */
export const PC: [number, number][] = [
  [-0.82, -1.42],
  [0.78, -1.4],
  [1.34, 0.02],
  [0.72, 1.42],
  [-0.78, 1.42],
  [-1.36, 0],
]

/** Define scene: where the five words start (x, y fractions, rotation). */
export const DW: [number, number, number][] = [
  [0.24, 0.42, -7],
  [0.74, 0.3, 5],
  [0.3, 0.76, 4],
  [0.8, 0.72, -5],
  [0.56, 0.54, 3],
]

/** A translate() string with one decimal, plus any extra transform. */
export const tr = (x: number, y: number, extra?: string) =>
  `translate(${x.toFixed(1)}px,${y.toFixed(1)}px)${extra || ''}`
