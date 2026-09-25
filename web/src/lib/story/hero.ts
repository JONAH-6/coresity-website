import { lerp, sm } from './math'

// The hero's opening: three word pairs (data-hp) fade through, then the
// headline words (data-hw) stagger in, then the call to action (data-hcta).
// Ported from the design's hero() (script lines 622–639).

export type HeroHooks = {
  hp: HTMLElement[]
  hw: HTMLElement[]
  hcta: HTMLElement | undefined
}

/** Beat length and the moment the headline starts, in seconds. */
export const HERO_BEAT = 1.45
export const HERO_START = 0.3
export const HERO_HEADLINE_AT = HERO_START + 3 * HERO_BEAT

export const heroFrame = (
  E: HeroHooks,
  t: number,
  intro: boolean,
  scrollY: number
) => {
  const d = HERO_BEAT
  const t0 = HERO_START
  const tf = HERO_HEADLINE_AT
  E.hp.forEach((el, k) => {
    if (!el) return
    if (!intro) {
      el.style.opacity = '0'
      return
    }
    const l = t - t0 - k * d
    const i = sm(l / 0.6)
    const o = sm((l - (d - 0.45)) / 0.45)
    el.style.opacity = (i * (1 - o)).toFixed(3)
    el.style.letterSpacing = (lerp(0.28, -0.03, i) - o * 0.05).toFixed(3) + 'em'
    el.style.transform = `translateY(${((1 - i) * 40 - o * 30).toFixed(1)}px)`
  })
  const tt = intro ? t - tf : 99
  E.hw.forEach((el, j) => {
    const e = sm((tt - j * 0.055) / 0.7)
    const f = 0.03 + (j % 5) * 0.03
    el.style.opacity = e.toFixed(3)
    el.style.transform = `translateY(${((1 - e) * 36 - scrollY * f).toFixed(1)}px)`
  })
  if (E.hcta) {
    const e = sm((tt - 1.1) / 0.6)
    E.hcta.style.opacity = e.toFixed(3)
    E.hcta.style.transform = `translateY(${((1 - e) * 20).toFixed(1)}px)`
  }
}
