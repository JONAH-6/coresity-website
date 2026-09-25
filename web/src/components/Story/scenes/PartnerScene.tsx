import { PARTNER } from 'src/components/Story/story.data'

import SceneEyebrow from './SceneEyebrow'

// 13 · How we partner. Four steps on one rule.

const PartnerScene = () => (
  <section
    id="partner"
    data-scene="partner"
    data-idx="13"
    data-label="How we partner"
    className="relative px-[5vw] pb-[12vh] pt-[14vh]"
  >
    <SceneEyebrow idx="13" label="How we partner" reveal />
    <h2
      data-reveal="clip"
      className="mt-6 max-w-[1200px] text-balance font-display text-[length:clamp(40px,6vw,104px)] font-bold leading-[0.98] tracking-[-0.035em] text-[var(--c-ink)]"
    >
      You bring the expertise.{' '}
      <span className="text-[var(--c-vio)]">We build around it.</span>
    </h2>
    <div className="mt-[72px] grid grid-cols-[repeat(auto-fit,minmax(min(100%,230px),1fr))] border-t border-[var(--c-ink)]">
      {PARTNER.map((p) => (
        <div
          key={p.n}
          data-reveal="1"
          className="relative pb-3 pr-7 pt-9 transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)] hover:-translate-y-1.5"
        >
          <div
            aria-hidden="true"
            className={`absolute -top-[6px] left-0 h-[11px] w-[11px] rounded-full ${p.dotClass}`}
          />
          <div className="font-mono text-[11px] tracking-[0.14em] text-[var(--c-vio)]">
            {p.n}
          </div>
          <div className="mt-[10px] font-display text-[length:var(--text-2xl)] font-semibold leading-[var(--lh-2xl)] text-[var(--c-ink)]">
            {p.t}
          </div>
          <p className="mt-2 text-[length:var(--text-sm)] leading-[var(--lh-sm)] text-[var(--c-body2)]">
            {p.d}
          </p>
        </div>
      ))}
    </div>
  </section>
)

export default PartnerScene
