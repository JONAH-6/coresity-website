import { DEVELOP } from 'src/components/Story/story.data'

import SceneEyebrow from './SceneEyebrow'

// 10 · Develop. A heading beside a ruled list of what we learn from; the
// heading is sticky once the two sit side by side.

const DevelopScene = () => (
  <section
    id="develop"
    data-scene="develop"
    data-idx="10"
    data-label="Develop"
    className="relative px-[5vw] pb-[12vh] pt-[18vh]"
  >
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-start gap-x-20 gap-y-12">
      <div className="lg:sticky lg:top-[120px]">
        <SceneEyebrow idx="10" label="Develop" reveal />
        <h2
          data-reveal="clip"
          className="mt-6 text-balance font-display text-[length:clamp(38px,4.8vw,84px)] font-bold leading-none tracking-[-0.035em] text-[var(--c-ink)]"
        >
          Learn from the market and build what comes next.
        </h2>
      </div>
      <div className="border-t border-[var(--c-ink)]">
        {DEVELOP.map((d) => (
          <div
            key={d.n}
            data-reveal="1"
            className="grid grid-cols-[64px_minmax(0,1fr)] items-baseline gap-4 border-b border-[var(--c-line)] py-[22px] transition-[padding,background-color] duration-[400ms] ease-[cubic-bezier(.2,.7,.2,1)] hover:bg-[var(--c-surface)] hover:pl-4"
          >
            <span className="font-mono text-xs text-[var(--c-vio)]">{d.n}</span>
            <span className="font-display text-[length:clamp(20px,1.8vw,28px)] font-medium leading-[1.2] tracking-[-0.015em] text-[var(--c-ink)]">
              {d.t}
            </span>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default DevelopScene
