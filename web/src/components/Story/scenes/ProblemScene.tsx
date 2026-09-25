// 02 · The problem. Pinned for 330vh. Five words converge into a box that
// reads EXPERTISE, constraint chips gather around it, three lines appear,
// then the box bursts and the question lands. All engine-driven.

const WORDS = ['TIME', 'KNOWLEDGE', 'EXPERIENCE', 'METHOD', 'SKILL']
const CHIPS = ['TIME', 'CALENDAR', 'MEETINGS', '1:1', 'MANUAL', 'UNSCALED']
const LINES = [
  'Trapped in one person’s head.',
  'Limited to one-to-one work.',
  'Never packaged for the people who need it.',
]

const ProblemScene = () => (
  <section
    id="problem"
    data-scene="problem"
    data-pin="1"
    data-idx="02"
    data-label="The problem"
    className="relative h-[330vh]"
  >
    <div data-stage="1" className="sticky top-0 h-screen overflow-hidden">
      <div data-ptext="1" className="absolute left-[5vw] top-24 max-w-[560px]">
        <div className="flex items-center gap-[14px] font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--c-muted)]">
          <span className="font-medium text-[var(--c-vio)]">02</span>
          <span className="h-px w-10 bg-[var(--c-line2)]" />
          <span>The problem</span>
        </div>
        <h2 className="mt-4 text-balance font-display text-[length:clamp(26px,2.8vw,44px)] font-bold leading-[1.08] tracking-[-0.025em] text-[var(--c-ink)]">
          Exceptional expertise is often under-commercialized.
        </h2>
      </div>

      {WORDS.map((w, k) => (
        <div
          key={w}
          data-pw={k}
          aria-hidden="true"
          className="absolute left-0 top-0 font-display text-[length:clamp(20px,2.6vw,42px)] font-semibold tracking-[0.04em] text-[var(--c-faint)]"
        >
          {w}
        </div>
      ))}
      <div
        data-pbox="1"
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[min(30vh,240px)] w-[min(62vw,760px)] -translate-x-1/2 -translate-y-1/2 border border-[var(--c-ink)] opacity-0"
      />
      <div
        data-pexp="1"
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-display text-[length:clamp(44px,8.6vw,148px)] font-bold tracking-[-0.035em] text-[var(--c-ink)] opacity-0"
      >
        EXPERTISE
      </div>
      {CHIPS.map((c, k) => (
        <div
          key={c}
          data-pc={k}
          aria-hidden="true"
          className="absolute left-0 top-0 border border-[var(--c-line2)] bg-[var(--c-bg)] px-[10px] py-[6px] font-mono text-xs tracking-[0.14em] text-[var(--c-ink)] opacity-0"
        >
          {c}
        </div>
      ))}

      <div className="absolute bottom-[7vh] left-[5vw] flex flex-col gap-[10px] font-mono text-[13px] text-[var(--c-ink)]">
        {LINES.map((line, k) => (
          <div key={line} data-pl={k} className="flex gap-[14px] opacity-0">
            <span className="text-[var(--c-amber-ink)]">
              {String(k + 1).padStart(2, '0')}
            </span>
            {line}
          </div>
        ))}
      </div>

      <div
        data-pq="1"
        className="absolute left-0 top-0 w-[min(92vw,1180px)] text-balance text-center font-display text-[length:clamp(34px,5.6vw,96px)] font-bold leading-[1.02] tracking-[-0.035em] text-[var(--c-ink)] opacity-0"
      >
        What if it could become something{' '}
        <span className="text-[var(--c-vio)]">bigger?</span>
      </div>
    </div>
  </section>
)

export default ProblemScene
