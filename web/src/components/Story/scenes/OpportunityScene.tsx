import SceneEyebrow from './SceneEyebrow'

// 03 · The opportunity. Three levels of commercial value.

const LEVELS = [
  {
    tag: 'Scalable',
    level: 'Level 01',
    n: '01',
    title: 'Products',
    body: 'Knowledge products that sell without the expert in the room.',
    examples: 'eBooks · guides · templates · playbooks',
    offset: '',
  },
  {
    tag: 'Structured',
    level: 'Level 02',
    n: '02',
    title: 'Programs',
    body: 'Learning experiences that transfer the skill to others.',
    examples: 'Courses · workshops · training',
    offset: 'mt-16',
  },
  {
    tag: 'Expert-led',
    level: 'Level 03',
    n: '03',
    title: 'Business solutions',
    body: 'Problem solving delivered directly to organizations.',
    examples: 'Consulting · advisory · implementation',
    offset: 'mt-32',
  },
]

const OpportunityScene = () => (
  <section
    data-scene="opportunity"
    data-idx="03"
    data-label="The opportunity"
    className="relative px-[5vw] pb-[16vh] pt-[18vh]"
  >
    <SceneEyebrow idx="03" label="The opportunity" reveal />
    <h2
      data-reveal="clip"
      className="mt-6 max-w-[1300px] text-balance font-display text-[length:clamp(40px,6.4vw,112px)] font-bold leading-[0.98] tracking-[-0.035em] text-[var(--c-ink)]"
    >
      There is enormous value trapped inside expertise.
    </h2>
    <p
      data-reveal="1"
      className="ml-auto mt-8 max-w-[440px] text-pretty text-[length:var(--text-lg)] leading-[var(--lh-lg)] text-[var(--c-body2)]"
    >
      Released in the right form, one person’s capability can serve thousands —
      at three levels of commercial value.
    </p>
    <div className="mt-[72px] grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))]">
      {LEVELS.map((l) => (
        <div
          key={l.n}
          data-reveal="1"
          className={`border-t border-[var(--c-ink)] pb-10 pr-7 pt-7 transition-[background-color,padding] duration-[400ms] hover:bg-[var(--c-surface)] hover:pl-5 ${l.offset}`}
        >
          <div className="flex justify-between font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--c-muted)]">
            <span>{l.tag}</span>
            <span>{l.level}</span>
          </div>
          <div
            aria-hidden="true"
            className="mt-5 font-display text-[length:clamp(90px,10vw,160px)] font-bold leading-[0.9] tracking-[-0.05em] text-[var(--c-line)]"
          >
            {l.n}
          </div>
          <h3 className="mb-[10px] mt-2 font-display text-[length:var(--text-3xl)] font-semibold leading-[var(--lh-3xl)] text-[var(--c-ink)]">
            {l.title}
          </h3>
          <p className="mb-[18px] max-w-[340px] text-[length:var(--text-base)] leading-[var(--lh-base)] text-[var(--c-body2)]">
            {l.body}
          </p>
          <div className="font-mono text-xs text-[var(--c-vio)]">
            {l.examples}
          </div>
        </div>
      ))}
    </div>
  </section>
)

export default OpportunityScene
