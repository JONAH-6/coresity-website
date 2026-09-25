import { PEOPLE } from 'src/components/Story/story.data'

import SceneEyebrow from './SceneEyebrow'

// 04 · Who we work with. Seven portrait panels (procedural dot portraits drawn
// by the engine). From 1024px (lg) up they sit in one row, widen on hover and
// reveal a line each in a small card; below that they form a grid with the
// line always showing. The design switches these layouts in script; here the
// breakpoint is CSS and the engine only honours it (WHO_ROW_MIN).

const WhoScene = () => (
  <section
    data-scene="who"
    data-idx="04"
    data-label="Who we work with"
    className="relative px-[5vw] pb-[16vh] pt-[14vh]"
  >
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-end gap-x-16 gap-y-8">
      <div>
        <SceneEyebrow idx="04" label="Who we work with" reveal />
        <h2
          data-reveal="clip"
          className="mt-6 text-balance font-display text-[length:clamp(36px,4.8vw,84px)] font-bold leading-none tracking-[-0.035em] text-[var(--c-ink)]"
        >
          Exceptional people <span className="text-[var(--accent)]">+</span>{' '}
          organizations with valuable problems.
        </h2>
      </div>
      <p
        data-reveal="1"
        className="max-w-[460px] text-pretty text-[length:var(--text-lg)] leading-[var(--lh-lg)] text-[var(--c-body2)]"
      >
        Practitioners, operators, educators, and specialists who are unusually
        good at something valuable — and haven’t yet built a business around it.
      </p>
    </div>

    <div className="mt-16 grid grid-cols-[repeat(auto-fill,minmax(min(100%,160px),1fr))] gap-3 lg:flex lg:h-[560px] lg:gap-2 lg:overflow-hidden">
      {PEOPLE.map((person, k) => (
        <div
          key={person.title}
          data-person={k}
          className="relative flex min-w-0 flex-[1_1_0px] cursor-default flex-col overflow-hidden border border-[var(--c-line)] bg-[var(--c-surface)] transition-[flex-basis,flex-grow] duration-700 ease-[cubic-bezier(.2,.7,.2,1)] hover:grow-[3.6] hover:basis-[340px] lg:block"
        >
          <canvas
            data-portrait={k}
            aria-hidden="true"
            width="300"
            height="360"
            className="relative mt-7 aspect-[300/360] h-auto w-full lg:absolute lg:left-1/2 lg:top-11 lg:mt-0 lg:h-[360px] lg:w-[300px] lg:-translate-x-1/2"
          />
          <div className="absolute left-[18px] top-4 font-mono text-[11px] text-[var(--c-faint)]">
            {String(k + 1).padStart(2, '0')}
          </div>
          <div className="px-[14px] pt-[10px] font-display text-[18px] font-bold tracking-[0.02em] text-[var(--c-ink)] lg:absolute lg:bottom-[18px] lg:left-[14px] lg:rotate-180 lg:whitespace-nowrap lg:p-0 lg:text-[26px] lg:[writing-mode:vertical-rl]">
            {person.title}
          </div>
          <div
            data-pdesc={k}
            className="px-[14px] pb-4 pt-[6px] text-[14px] leading-[1.45] text-[var(--c-ink)] lg:absolute lg:bottom-4 lg:left-14 lg:right-[14px] lg:z-[2] lg:max-w-[300px] lg:border lg:border-[var(--c-line)] lg:bg-[var(--c-surface)] lg:px-4 lg:py-[14px] lg:text-[15px] lg:opacity-0 lg:transition-opacity lg:delay-[250ms] lg:duration-[450ms] lg:ease-[ease]"
          >
            {person.desc}
          </div>
        </div>
      ))}
    </div>

    <div
      data-reveal="1"
      className="mt-14 grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-baseline gap-x-16 gap-y-6 border-t border-[var(--c-ink)] pt-8"
    >
      <div className="font-display text-[length:clamp(26px,2.6vw,40px)] font-bold leading-[1.08] tracking-[-0.025em] text-[var(--c-ink)]">
        <span className="text-[var(--accent)]">+</span> Organizations with
        valuable problems
      </div>
      <p className="max-w-[520px] text-[length:var(--text-base)] leading-[var(--lh-base)] text-[var(--c-body2)]">
        Businesses, institutions, and agencies that need the kind of expertise
        that’s hard to find and harder to scale.
      </p>
    </div>
  </section>
)

export default WhoScene
