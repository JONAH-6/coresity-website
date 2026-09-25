import { createNodes, drawField } from './field'
import type { Node } from './field'
import { heroFrame } from './hero'
import { c01 } from './math'
import { drawPortraits } from './portraits'
import type { Portrait } from './portraits'
import { crossesMiddle, sceneProgress } from './progress'
import { NOTES_RAIL_MIN, fx, targets } from './scenes'
import type { Hooks, Hover, Scene, StoryState } from './scenes'
import { palette } from './theme'

// The story engine: binds the design's data-* hooks, runs one
// requestAnimationFrame loop that reads scroll progress per scene, moves the
// hooked elements, and draws the particle field. Port of the design's
// boot()/frame()/nav()/tilts() (script lines 531–620, 782–791).
//
// Reduced motion follows the design's "Calm" tweak and goes one step
// further: no hero intro, no mouse-follow, no idle drift, no auto-rotation,
// and the field-notes rail holds still. Scroll-linked choreography still
// works, so nothing becomes unreadable.
//
// Colours come from the theme (lib/story/theme): the palette is re-read every
// frame, so a toggle or a system change recolours the canvas at once.

const q = (root: ParentNode, s: string) =>
  Array.from(root.querySelectorAll<HTMLElement>(s))

const idx = <T extends HTMLElement>(
  root: ParentNode,
  s: string,
  key: string
) => {
  const a: T[] = []
  root.querySelectorAll<T>(s).forEach((el) => {
    a[+(el.dataset[key] as string)] = el
  })
  return a
}

const bindHooks = (root: HTMLElement): Hooks => ({
  hp: idx(root, '[data-hp]', 'hp'),
  rail: q(root, '[data-rail]')[0],
  hw: q(root, '[data-hw]'),
  hcta: q(root, '[data-hcta]')[0],
  navIdx: document.querySelector<HTMLElement>('[data-nav-idx]') ?? undefined,
  navLabel:
    document.querySelector<HTMLElement>('[data-nav-label]') ?? undefined,
  prog: document.querySelector<HTMLElement>('[data-progress]') ?? undefined,
  pw: idx(root, '[data-pw]', 'pw'),
  pc: idx(root, '[data-pc]', 'pc'),
  pl: idx(root, '[data-pl]', 'pl'),
  pbox: q(root, '[data-pbox]')[0],
  pexp: q(root, '[data-pexp]')[0],
  pq: q(root, '[data-pq]')[0],
  ptext: q(root, '[data-ptext]')[0],
  q1: q(root, '[data-q1]')[0],
  q2: q(root, '[data-q2]')[0],
  ml: idx(root, '[data-ml]', 'ml'),
  mp: idx(root, '[data-mp]', 'mp'),
  mc: q(root, '[data-mc]')[0],
  mpanels: q(root, '[data-mpanels]')[0],
  dw: idx(root, '[data-dw]', 'dw'),
  dcon: idx(root, '[data-dcon]', 'dcon'),
  dopp: q(root, '[data-dopp]')[0],
  br: idx(root, '[data-br]', 'br'),
  dhead: q(root, '[data-dhead]')[0],
  bf: idx(root, '[data-bf]', 'bf'),
  bo: q(root, '[data-bo]')[0],
  ch: idx(root, '[data-ch]', 'ch'),
  dc: q(root, '[data-dc]')[0],
  dphead: q(root, '[data-dphead]')[0],
  dproutes: q(root, '[data-dproutes]')[0],
  fly: q(root, '[data-fly]')[0],
  fl: idx(root, '[data-fl]', 'fl'),
  fc: idx(root, '[data-fc]', 'fc'),
  fcd: q(root, '[data-fcd]')[0],
  fin: q(root, '[data-fin]'),
  notes: q(root, '[data-notes]')[0],
  nhint: q(root, '[data-nhint]')[0],
  nprog: q(root, '[data-nprog]')[0],
  person: idx(root, '[data-person]', 'person'),
  pdesc: idx(root, '[data-pdesc]', 'pdesc'),
  portrait: idx<HTMLCanvasElement>(root, '[data-portrait]', 'portrait'),
  tilt: q(root, '[data-tilt]'),
  dark: q(root, '[data-dark]'),
})

const prefersReducedMotion = () =>
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Starts the story on `root` (the element holding the canvas and the scenes).
 * Returns a cleanup that stops the loop and removes every listener.
 */
export const startStory = (root: HTMLElement | null): (() => void) => {
  if (!root || typeof window === 'undefined') return () => {}
  const cv = root.querySelector<HTMLCanvasElement>('[data-story-canvas]')
  const ctx = cv?.getContext('2d')
  if (!cv || !ctx) return () => {}

  const E = bindHooks(root)
  const scenes: Scene[] = q(root, '[data-scene]').map((el) => ({
    el,
    name: el.dataset.scene as string,
    pin: el.dataset.pin === '1',
    label: el.dataset.label || '',
    idx: el.dataset.idx || '',
    p: 0,
    oy: 0,
    vis: false,
  }))

  const calm = prefersReducedMotion()
  const st: StoryState = {
    hv: { br: -1, ch: -1, fl: -1, person: -1 },
    mouse: { x: -9999, y: -9999 },
    calm,
    P: palette(),
    dphi: 0,
    phi: 0,
  }

  // Hover and keyboard focus reveal the same things.
  const disposers: (() => void)[] = []
  const hov = (arr: HTMLElement[], key: keyof Hover) => {
    arr.forEach((el, k) => {
      if (!el) return
      const on = () => {
        st.hv[key] = k
      }
      const off = () => {
        if (st.hv[key] === k) st.hv[key] = -1
      }
      el.addEventListener('mouseenter', on)
      el.addEventListener('mouseleave', off)
      el.addEventListener('focusin', on)
      el.addEventListener('focusout', off)
      disposers.push(() => {
        el.removeEventListener('mouseenter', on)
        el.removeEventListener('mouseleave', off)
        el.removeEventListener('focusin', on)
        el.removeEventListener('focusout', off)
      })
    })
  }
  hov(E.br, 'br')
  hov(E.ch, 'ch')
  hov(E.fl, 'fl')
  hov(E.person, 'person')

  const onMouse = (e: MouseEvent) => {
    st.mouse.x = e.clientX
    st.mouse.y = e.clientY
  }
  window.addEventListener('mousemove', onMouse)
  disposers.push(() => window.removeEventListener('mousemove', onMouse))

  // The field-notes rail drifts sideways on its own and turns round at each
  // end. A pointer or keyboard focus inside it pauses the drift; a wheel or a
  // touch hands the rail to the visitor for a moment, after which the drift
  // resumes from wherever they left it. A progress bar under the rail shows
  // how much is in view. Below NOTES_RAIL_MIN the cards stack and none of
  // this runs. Port of the design's drift().
  const notes = E.notes
  const nd = { hover: false, dir: 1, pos: 0, hold: 0 }
  if (notes) {
    nd.pos = notes.scrollLeft
    const listen = <K extends keyof HTMLElementEventMap>(
      type: K,
      fn: () => void,
      opts?: AddEventListenerOptions
    ) => {
      notes.addEventListener(type, fn, opts)
      disposers.push(() => notes.removeEventListener(type, fn, opts))
    }
    const pause = () => {
      nd.hover = true
    }
    const resume = () => {
      nd.hover = false
      nd.pos = notes.scrollLeft
    }
    listen('mouseenter', pause)
    listen('mouseleave', resume)
    listen('focusin', pause)
    listen('focusout', resume)
    listen(
      'wheel',
      () => {
        nd.pos = notes.scrollLeft
        nd.hold = 2.5
      },
      { passive: true }
    )
    listen(
      'touchstart',
      () => {
        nd.hold = 4
      },
      { passive: true }
    )
  }
  const drift = (dt: number, W: number, H: number) => {
    if (!notes || W < NOTES_RAIL_MIN) return
    if (E.nprog) {
      const sw = Math.max(1, notes.scrollWidth)
      E.nprog.style.width =
        (Math.min(1, notes.clientWidth / sw) * 100).toFixed(1) + '%'
      E.nprog.style.marginLeft =
        ((notes.scrollLeft / sw) * 100).toFixed(1) + '%'
      if (E.nhint)
        E.nhint.style.visibility =
          notes.scrollWidth - notes.clientWidth > 2 ? 'visible' : 'hidden'
    }
    const r = notes.getBoundingClientRect()
    if (r.bottom < 0 || r.top > H || calm) return
    if (nd.hold > 0) {
      nd.hold -= dt
      nd.pos = notes.scrollLeft
      return
    }
    if (nd.hover) return
    const max = notes.scrollWidth - notes.clientWidth
    if (max <= 2) return
    nd.pos += nd.dir * dt * 28
    if (nd.pos >= max) {
      nd.pos = max
      nd.dir = -1
    } else if (nd.pos <= 0) {
      nd.pos = 0
      nd.dir = 1
    }
    notes.scrollLeft = nd.pos
  }

  const nodes: Node[] = createNodes(window.innerWidth, window.innerHeight)
  const portraits: Portrait[] = []

  const skipIntro = calm || window.scrollY > window.innerHeight * 0.5
  if (!skipIntro) {
    E.hw.forEach((el) => {
      el.style.opacity = '0'
    })
    if (E.hcta) E.hcta.style.opacity = '0'
  }

  // Entrance reveals for flow sections that start below the fold.
  const H0 = window.innerHeight
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return
        const el = e.target as HTMLElement
        el.style.opacity = '1'
        el.style.transform = 'none'
        if (el.dataset.reveal === 'clip')
          el.style.clipPath = 'inset(-20% -5% -30% -5%)'
        io.unobserve(el)
      }),
    { threshold: 0.12 }
  )
  let clips: HTMLElement[] = []
  q(root, '[data-reveal]').forEach((el) => {
    if (el.getBoundingClientRect().top < H0 * 0.92) return
    const clip = el.dataset.reveal === 'clip'
    el.style.transition =
      (el.style.transition ? el.style.transition + ', ' : '') +
      'opacity .9s ease, transform 1.2s cubic-bezier(.2,.7,.2,1), clip-path 1.3s cubic-bezier(.2,.7,.2,1)'
    el.style.opacity = clip ? '1' : '0'
    el.style.transform = 'translateY(36px)'
    if (clip) {
      el.style.clipPath = 'inset(0 0 100% 0)'
      clips.push(el)
    } else io.observe(el)
  })

  let lastActive: Scene | null = null
  const nav = (active: Scene | null, H: number) => {
    if (active && active !== lastActive) {
      lastActive = active
      if (E.navIdx) E.navIdx.textContent = active.idx
      if (E.navLabel) E.navLabel.textContent = active.label
    }
    if (E.prog) {
      const max = document.documentElement.scrollHeight - H
      E.prog.style.transform = `scaleX(${c01(window.scrollY / Math.max(1, max)).toFixed(4)})`
    }
  }

  const tilts = (H: number) => {
    const m = st.mouse
    for (const el of E.tilt) {
      const r = el.getBoundingClientRect()
      if (r.bottom < 0 || r.top > H) continue
      const inner = el.firstElementChild as HTMLElement | null
      if (!inner) continue
      const inside =
        m.x >= r.left && m.x <= r.right && m.y >= r.top && m.y <= r.bottom
      const dx = inside ? (m.x - (r.left + r.width / 2)) / r.width : 0
      const dy = inside ? (m.y - (r.top + r.height / 2)) / r.height : 0
      inner.style.transform = `translate(${(-dx * 14).toFixed(1)}px,${(-dy * 14).toFixed(1)}px) scale(${inside ? 1.03 : 1})`
    }
  }

  const t0 = performance.now()
  let last = t0
  let raf = 0

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame)
    const t = (now - t0) / 1000
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    const W = window.innerWidth
    const H = window.innerHeight
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) {
      cv.width = Math.round(W * dpr)
      cv.height = Math.round(H * dpr)
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    st.P = palette()

    let active: Scene | null = null
    for (const s of scenes) {
      const r = s.el.getBoundingClientRect()
      const pr = sceneProgress(r, H, s.pin)
      s.p = pr.p
      s.oy = pr.oy
      s.vis = pr.vis
      if (crossesMiddle(r, H)) active = s
    }
    nav(active, H)
    drift(dt, W, H)
    if (window.scrollY < H * 1.6) heroFrame(E, t, !skipIntro, window.scrollY)
    if (E.rail) E.rail.style.display = W < 1100 ? 'none' : ''
    for (const s of scenes) {
      if (!s.vis) continue
      const fn = fx[s.name]
      if (fn) fn(E, s, st, W, H, t, dt)
    }
    drawPortraits(E.portrait, portraits, t, H, st.hv.person, dpr, st.P.inkRGB)
    tilts(H)
    if (clips.length) {
      clips = clips.filter((el) => {
        if (el.getBoundingClientRect().top < H * 0.88) {
          el.style.transform = 'none'
          el.style.clipPath = 'inset(-20% -5% -30% -5%)'
          return false
        }
        return true
      })
    }
    const { D, LA, extra } = targets(active, W, H, t, nodes, st)
    const darks: DOMRect[] = []
    for (const el of E.dark) {
      const r = el.getBoundingClientRect()
      if (r.bottom > 0 && r.top < H) darks.push(r)
    }
    drawField(ctx, { nodes, W, H, darks, extra, D, LA, P: st.P })
  }
  raf = requestAnimationFrame(frame)

  return () => {
    cancelAnimationFrame(raf)
    io.disconnect()
    disposers.forEach((d) => d())
  }
}
