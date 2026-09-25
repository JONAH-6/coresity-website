import { useEffect } from 'react'
import type { CSSProperties, ReactNode } from 'react'

import StoryHeader from 'src/components/StoryHeader/StoryHeader'
import { THEMES } from 'src/lib/story/theme'
import { useStoryTheme } from 'src/lib/story/useStoryTheme'

// Layout for the homepage story. The story carries its own header and closes
// with its own footer line, so this layout adds no Navbar or Footer.
//
// It also applies the theme: the design's `--c-*` variables go on the root
// and the page ground follows, so overscroll matches. Both are undone on
// unmount, since the other pages keep their own colours.

type Props = { children?: ReactNode }

const StoryLayout = ({ children }: Props) => {
  const { dark } = useStoryTheme()
  const theme = THEMES[dark ? 'dark' : 'light']

  useEffect(() => {
    document.documentElement.style.background = theme.bg
    document.body.style.background = theme.bg
    return () => {
      document.documentElement.style.background = ''
      document.body.style.background = ''
    }
  }, [theme])

  return (
    <div
      data-theme={dark ? 'dark' : 'light'}
      style={theme.vars as CSSProperties}
      className="relative min-h-screen bg-[var(--c-bg)] text-[var(--c-ink)]"
    >
      <StoryHeader />
      {children}
    </div>
  )
}

export default StoryLayout
