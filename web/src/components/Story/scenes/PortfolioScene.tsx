import { WORK } from 'src/components/Story/story.data'

import PlaceholderFrame from './PlaceholderFrame'
import SceneEyebrow from './SceneEyebrow'

// 12 · The portfolio. Three staggered frames that tilt toward the pointer.

const PortfolioScene = () => (
  <section
    id="work"
    data-scene="work"
    data-idx="12"
    data-label="The portfolio"
    className="relative px-[5vw] pb-[12vh] pt-[14vh]"
  >
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div>
        <SceneEyebrow idx="12" label="The portfolio" reveal />
        <h2
          data-reveal="clip"
          className="mt-6 font-display text-[length:clamp(40px,6vw,104px)] font-bold leading-[0.98] tracking-[-0.035em] text-[var(--c-ink)]"
        >
          What we’ve built
        </h2>
      </div>
      <a
        href="#work"
        className="flex gap-[10px] font-mono text-xs uppercase tracking-[0.12em] text-[var(--c-ink)] transition-[gap,color] hover:gap-[18px] hover:text-[var(--c-vio)] hover:no-underline"
      >
        See all work <span>→</span>
      </a>
    </div>

    <div className="mt-16 grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-start gap-7">
      {WORK.map((w) => (
        <div key={w.id} data-reveal="1" className={w.offsetClass}>
          <div
            data-tilt="1"
            className={`relative overflow-hidden border border-[var(--ink-200)] bg-[var(--ink-100)] ${w.frameClass}`}
          >
            <div className="absolute -inset-[14px] transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)]">
              <PlaceholderFrame />
            </div>
          </div>
          <div className="mt-[18px] flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--c-muted)]">
            <span>{w.n}</span>
            <span className="text-[var(--c-vio)]">{w.kind}</span>
          </div>
          <h3 className="mb-[6px] mt-[10px] font-display text-[length:var(--text-2xl)] font-semibold leading-[var(--lh-2xl)] text-[var(--c-ink)]">
            {w.t}
          </h3>
          <p className="text-[length:var(--text-sm)] leading-[var(--lh-sm)] text-[var(--c-body2)]">
            {w.d}
          </p>
        </div>
      ))}
    </div>
  </section>
)

export default PortfolioScene
