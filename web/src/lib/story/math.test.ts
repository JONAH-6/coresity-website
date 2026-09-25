import { DW, PC, PW, TAU, bz, c01, lerp, rng, sm, tr } from './math'

describe('story math', () => {
  it('clamps to the unit interval', () => {
    expect(c01(-2)).toBe(0)
    expect(c01(0.4)).toBe(0.4)
    expect(c01(7)).toBe(1)
  })

  it('smoothsteps with flat ends and a symmetric middle', () => {
    expect(sm(0)).toBe(0)
    expect(sm(1)).toBe(1)
    expect(sm(0.5)).toBeCloseTo(0.5)
    expect(sm(0.25)).toBeCloseTo(0.15625)
    expect(sm(3)).toBe(1)
  })

  it('interpolates linearly', () => {
    expect(lerp(10, 20, 0.25)).toBe(12.5)
  })

  it('is deterministic for a given seed', () => {
    const a = rng(11)
    const b = rng(11)
    const first = [a(), a(), a()]
    expect([b(), b(), b()]).toEqual(first)
    expect(first.every((v) => v >= 0 && v < 1)).toBe(true)
    expect(rng(12)()).not.toBe(first[0])
  })

  it('evaluates a cubic bezier at its endpoints', () => {
    const a = { x: 0, y: 0 }
    const b = { x: 10, y: 50 }
    const c = { x: 90, y: 50 }
    const d = { x: 100, y: 0 }
    expect(bz(a, b, c, d, 0)).toEqual(a)
    expect(bz(a, b, c, d, 1)).toEqual(d)
    expect(bz(a, b, c, d, 0.5)).toEqual({ x: 50, y: 37.5 })
  })

  it('formats a translate transform', () => {
    expect(tr(10.24, -3, ' scale(2)')).toBe('translate(10.2px,-3.0px) scale(2)')
    expect(tr(1, 2)).toBe('translate(1.0px,2.0px)')
  })

  it('keeps the design file’s layout constants verbatim', () => {
    expect(TAU).toBeCloseTo(6.283185307)
    expect(PW).toEqual([
      [0.16, 0.3],
      [0.78, 0.24],
      [0.2, 0.76],
      [0.8, 0.72],
      [0.52, 0.16],
    ])
    expect(PC).toEqual([
      [-0.82, -1.42],
      [0.78, -1.4],
      [1.34, 0.02],
      [0.72, 1.42],
      [-0.78, 1.42],
      [-1.36, 0],
    ])
    expect(DW).toEqual([
      [0.24, 0.42, -7],
      [0.74, 0.3, 5],
      [0.3, 0.76, 4],
      [0.8, 0.72, -5],
      [0.56, 0.54, 3],
    ])
  })
})
