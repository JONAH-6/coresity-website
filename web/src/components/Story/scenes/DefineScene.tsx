import SceneEyebrow from './SceneEyebrow'

// 07 · Define. Pinned for 320vh. Five scattered words line up, each
// "becomes" the next, then collapse into OPPORTUNITY.

const WORDS = ['PERSON', 'CAPABILITY', 'OUTCOME', 'CUSTOMER', 'PROBLEM']

const DefineScene = () => (
  <section
    id="define"
    data-scene="define"
    data-pin="1"
    data-idx="07"
    data-label="Define"
    className="relative h-[320vh]"
  >
    <div data-stage="1" className="sticky top-0 h-screen overflow-hidden">
      <div className="absolute left-[5vw] top-[92px] max-w-[500px]">
        <SceneEyebrow idx="07" label="Discover · Define" />
        <h3 className="mt-[14px] text-balance font-display text-[length:clamp(20px,1.9vw,30px)] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--c-ink)]">
          We find under-commercialized talent, then narrow it down until it
          sells.
        </h3>
      </div>
      {WORDS.map((w, k) => (
        <div
          key={w}
          data-dw={k}
          aria-hidden="true"
          className="absolute left-0 top-0 whitespace-nowrap font-display text-[length:clamp(34px,8.4vh,96px)] font-bold leading-none tracking-[-0.035em] text-[var(--ink-400)]"
        >
          {w}
        </div>
      ))}
      {[0, 1, 2, 3].map((k) => (
        <div
          key={k}
          data-dcon={k}
          aria-hidden="true"
          className="absolute left-0 top-0 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--c-amber-ink)] opacity-0"
        >
          ↓ becomes
        </div>
      ))}
      <div
        data-dopp="1"
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-display text-[length:clamp(46px,10.4vw,180px)] font-bold tracking-[-0.04em] text-[var(--c-vio)] opacity-0"
      >
        OPPORTUNITY
      </div>
    </div>
  </section>
)

export default DefineScene
