// The story's light and dark themes. The design keeps a THEMES table with
// the values its canvas draws with (`ink`, `faint`, …) and the `--c-*`
// variables its markup reads; the visitor's choice is remembered under
// `coresity-theme`, and "Auto" follows the system. Ported from the design's
// THEMES, resolveDark() and toggleTheme.
//
// This module is the one place the theme lives: the layout applies the
// variables, the header toggles it, the hero picks a button variant by it,
// and the engine reads the palette every frame.

export type ThemeMode = 'Auto' | 'Light' | 'Dark'
export type ThemeName = 'light' | 'dark'

export type Palette = {
  ink: string
  /** `ink` as an "r,g,b" triplet, for rgba() strokes on the canvas. */
  inkRGB: string
  faint: string
  muted: string
  body: string
  vio: string
  amber: string
  /** The ground the dark scenes are painted on. */
  deep: string
  bg: string
  /** The hero's cursor lines, as "r,g,b". */
  cursor: string
  /** The `--c-*` variables the markup reads. */
  vars: Record<string, string>
}

export const THEMES: Record<ThemeName, Palette> = {
  light: {
    ink: '#131022',
    inkRGB: '19,16,34',
    faint: '#8D87A1',
    muted: '#6E6883',
    body: '#413B58',
    vio: '#4C1D95',
    amber: '#B45309',
    deep: '#131022',
    bg: '#F6F5FA',
    cursor: '76,29,149',
    vars: {
      '--c-bg': '#F6F5FA',
      '--c-surface': '#FFFFFF',
      '--c-ink': '#131022',
      '--c-body': '#413B58',
      '--c-body2': '#575170',
      '--c-muted': '#6E6883',
      '--c-faint': '#8D87A1',
      '--c-line': '#D8D4E3',
      '--c-line2': '#B6B1C6',
      '--c-sunk': '#EAE8F1',
      '--c-vio': '#4C1D95',
      '--c-amber-ink': '#B45309',
      '--c-deep': '#131022',
      '--c-mark': '#4C1D95',
    },
  },
  dark: {
    ink: '#F6F5FA',
    inkRGB: '234,232,241',
    faint: '#6E6883',
    muted: '#8D87A1',
    body: '#D8D4E3',
    vio: '#C4B5FD',
    amber: '#FBBF24',
    deep: '#1D1930',
    bg: '#131022',
    cursor: '196,181,253',
    vars: {
      '--c-bg': '#131022',
      '--c-surface': '#1D1930',
      '--c-ink': '#F6F5FA',
      '--c-body': '#D8D4E3',
      '--c-body2': '#B6B1C6',
      '--c-muted': '#8D87A1',
      '--c-faint': '#6E6883',
      '--c-line': '#2B2640',
      '--c-line2': '#413B58',
      '--c-sunk': '#2B2640',
      '--c-vio': '#C4B5FD',
      '--c-amber-ink': '#FBBF24',
      '--c-deep': '#1D1930',
      '--c-mark': '#FFFFFF',
    },
  },
}

export const THEME_STORAGE_KEY = 'coresity-theme'

/** Auto follows the system preference; Light and Dark are explicit. */
export const resolveDark = (mode: ThemeMode, prefersDark: boolean) =>
  mode === 'Auto' ? prefersDark : mode === 'Dark'

const readStored = (): ThemeMode => {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY)
    return v === 'Light' || v === 'Dark' ? v : 'Auto'
  } catch {
    return 'Auto'
  }
}

let mode: ThemeMode | null = null
const currentMode = () => {
  if (mode === null) mode = readStored()
  return mode
}

const DARK_QUERY = '(prefers-color-scheme: dark)'
const canQuery = () =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
let mq: MediaQueryList | null = null
const darkQuery = () => {
  if (!mq && canQuery()) mq = window.matchMedia(DARK_QUERY)
  return mq
}

/** Whether the dark theme is in effect right now. */
export const isDark = () =>
  resolveDark(currentMode(), darkQuery()?.matches ?? false)

/** The palette in effect right now. */
export const palette = () => THEMES[isDark() ? 'dark' : 'light']

const listeners = new Set<() => void>()

/** Switches to the opposite theme and remembers the choice. */
export const toggleTheme = () => {
  mode = isDark() ? 'Light' : 'Dark'
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode)
  } catch {
    // Storage may be unavailable; the choice still holds for this visit.
  }
  listeners.forEach((fn) => fn())
}

/**
 * Calls `fn` whenever the theme may have changed: a toggle, or the system
 * preference while in Auto. Returns the unsubscribe.
 */
export const subscribe = (fn: () => void) => {
  listeners.add(fn)
  const q = darkQuery()
  q?.addEventListener('change', fn)
  return () => {
    listeners.delete(fn)
    q?.removeEventListener('change', fn)
  }
}
