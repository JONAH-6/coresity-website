import Button from 'src/components/Button/Button'
import { WORK_WITH_US_FORM_URL } from 'src/lib/links'
import { useStoryTheme } from 'src/lib/story/useStoryTheme'

// The story's fixed header: brand, the current scene index and label (filled
// by the story engine through the data-nav-* hooks), the theme toggle, one
// call to action, and the amber progress hairline (data-progress) the engine
// scales with scroll.

// The brand lockup with its intrinsic sizes, and the mark alone for phones
// (the brand kit's rule below a 96px-wide lockup); the inverse ones read on
// dark.
const LOGO = {
  light: {
    src: '/CORESITY-IMAGE/lockup@3x.png',
    width: 954,
    height: 206,
    mark: '/CORESITY-IMAGE/mark@1x.png',
  },
  dark: {
    src: '/CORESITY-IMAGE/lockup-inverse@2x.png',
    width: 636,
    height: 137,
    mark: '/CORESITY-IMAGE/mark-inverse@2x.png',
  },
}

const StoryHeader = () => {
  const { dark, toggleTheme } = useStoryTheme()

  return (
    <header className="fixed inset-x-0 top-0 z-20 border-b border-[var(--c-line)] bg-[var(--c-bg)]">
      <div className="flex items-center justify-between gap-6 px-[4vw] py-[14px]">
        <a href="#top" className="flex items-center">
          <picture>
            <source
              media="(min-width: 640px)"
              srcSet={dark ? LOGO.dark.src : LOGO.light.src}
              width={dark ? LOGO.dark.width : LOGO.light.width}
              height={dark ? LOGO.dark.height : LOGO.light.height}
            />
            <img
              src={dark ? LOGO.dark.mark : LOGO.light.mark}
              alt="Coresity"
              width="256"
              height="256"
              className="h-8 w-auto"
            />
          </picture>
        </a>

        {/* The design leaves the index on --brand; --c-vio is the same violet
            in light and stays legible in dark, as every other index does. */}
        <div className="hidden items-center gap-[10px] font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--c-muted)] sm:flex">
          <span data-nav-idx="1" className="font-medium text-[var(--c-vio)]" />
          <span>/ 15</span>
          <span className="h-px w-7 bg-[var(--c-line2)]" />
          <span data-nav-label="1" />
        </div>

        <div className="flex items-center gap-[10px]">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle light and dark mode"
            className="flex h-8 cursor-pointer items-center gap-2 whitespace-nowrap rounded-md border border-[var(--c-line2)] bg-transparent px-3 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--c-ink)] hover:border-[var(--c-ink)]"
          >
            <span
              aria-hidden="true"
              className={`h-[10px] w-[10px] rounded-full border-[1.5px] border-current ${
                dark ? 'bg-transparent' : 'bg-current'
              }`}
            />
            {dark ? 'Light mode' : 'Dark mode'}
          </button>
          <Button variant="primary" size="sm" href={WORK_WITH_US_FORM_URL}>
            Work with us →
          </Button>
        </div>
      </div>
      <div
        data-progress="1"
        className="h-px origin-left scale-x-0 bg-[var(--accent)]"
      />
    </header>
  )
}

export default StoryHeader
