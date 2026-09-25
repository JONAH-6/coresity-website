import { CHANNELS, MARKET_ROUTES } from 'src/components/Story/story.data'

import SceneEyebrow from './SceneEyebrow'

// 09 · Deploy + Distribute. Pinned for 230vh. EXPERTISE at the hub, twelve
// channels on a slowly turning ring; hover or focus one to light its spokes.
// Below 860px the engine fits the ring between the heading (data-dphead) and
// the routes caption (data-dproutes) and staggers the labels (STAGE_ROW_MIN).

const DeployScene = () => (
  <section
    id="deploy"
    data-scene="deploy"
    data-pin="1"
    data-idx="09"
    data-label="Deploy + Distribute"
    className="relative h-[230vh]"
  >
    <div data-stage="1" className="sticky top-0 h-screen overflow-hidden">
      <div
        data-dphead="1"
        className="absolute left-[5vw] top-[92px] max-w-[460px]"
      >
        <SceneEyebrow idx="09" label="Deploy + Distribute" />
        <h2 className="mt-[14px] text-balance font-display text-[length:clamp(24px,2.6vw,42px)] font-bold leading-[1.05] tracking-[-0.03em] text-[var(--c-ink)]">
          Build the offer. Build the demand engine.
        </h2>
        <p className="mt-[10px] text-[length:var(--text-sm)] text-[var(--c-body2)]">
          We build demand around the expertise with —
        </p>
      </div>

      <div
        data-dc="1"
        aria-hidden="true"
        className="absolute left-0 top-0 whitespace-nowrap font-display text-[length:clamp(20px,1.8vw,28px)] font-bold tracking-[0.08em] text-[var(--c-ink)]"
      >
        EXPERTISE
      </div>
      {CHANNELS.map((c, k) => (
        <button
          key={c}
          data-ch={k}
          type="button"
          className="absolute left-0 top-0 cursor-pointer whitespace-nowrap px-[10px] py-[6px] text-left font-mono text-[10px] tracking-[0.1em] text-[var(--ink-700)] transition-colors duration-300 sm:text-[11px] sm:tracking-[0.16em]"
        >
          {c}
        </button>
      ))}

      <div
        data-dproutes="1"
        className="absolute bottom-[26px] left-[5vw] right-[5vw] flex flex-wrap gap-x-[14px] gap-y-[6px] font-mono text-[11px] tracking-[0.08em] text-[var(--c-muted)]"
      >
        <span className="text-[var(--c-ink)]">
          We take it to market through —
        </span>
        {MARKET_ROUTES.map((r) => (
          <span key={r}>{r}</span>
        ))}
      </div>
    </div>
  </section>
)

export default DeployScene
