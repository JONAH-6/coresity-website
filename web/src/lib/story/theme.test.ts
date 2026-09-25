import {
  THEMES,
  THEME_STORAGE_KEY,
  isDark,
  palette,
  resolveDark,
  subscribe,
  toggleTheme,
} from './theme'

// The theme store reads the stored choice once, so each test that changes
// storage starts from a fresh module.
const fresh = () => {
  let mod: typeof import('./theme') = {} as never
  jest.isolateModules(() => {
    mod = jest.requireActual('./theme')
  })
  return mod
}

describe('resolveDark', () => {
  it('follows the system preference only in Auto', () => {
    expect(resolveDark('Auto', true)).toBe(true)
    expect(resolveDark('Auto', false)).toBe(false)
    expect(resolveDark('Light', true)).toBe(false)
    expect(resolveDark('Dark', false)).toBe(true)
  })
})

describe('theme store', () => {
  beforeEach(() => localStorage.clear())

  it('is light by default when the system has no dark preference', () => {
    expect(isDark()).toBe(false)
    expect(palette()).toBe(THEMES.light)
  })

  it('honours a stored choice', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'Dark')
    const t = fresh()
    expect(t.isDark()).toBe(true)
    expect(t.palette()).toBe(t.THEMES.dark)
  })

  it('ignores a stored value it does not know', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'Sepia')
    expect(fresh().isDark()).toBe(false)
  })

  it('toggles to the opposite theme, remembers it and tells subscribers', () => {
    const t = fresh()
    const heard = jest.fn()
    const stop = t.subscribe(heard)

    t.toggleTheme()
    expect(t.isDark()).toBe(true)
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('Dark')
    expect(heard).toHaveBeenCalledTimes(1)

    t.toggleTheme()
    expect(t.isDark()).toBe(false)
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('Light')

    stop()
    t.toggleTheme()
    expect(heard).toHaveBeenCalledTimes(2)
  })

  it('keeps the light and dark palettes in step', () => {
    expect(Object.keys(THEMES.dark.vars)).toEqual(
      Object.keys(THEMES.light.vars)
    )
    expect(THEMES.light.ink).toBe(THEMES.light.vars['--c-ink'])
    expect(THEMES.dark.ink).toBe(THEMES.dark.vars['--c-ink'])
    expect(typeof subscribe).toBe('function')
    expect(typeof toggleTheme).toBe('function')
  })
})
