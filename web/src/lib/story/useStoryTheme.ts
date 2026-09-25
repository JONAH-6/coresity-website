import { useSyncExternalStore } from 'react'

import { isDark, subscribe, toggleTheme } from './theme'

/** The theme in effect, kept current by the store in ./theme. */
export const useStoryTheme = () => {
  const dark = useSyncExternalStore(subscribe, isDark, () => false)
  return { dark, toggleTheme }
}
