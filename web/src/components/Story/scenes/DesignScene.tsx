import { BRANCHES } from 'src/components/Story/story.data'

import SceneEyebrow from './SceneEyebrow'

// 08 · Design. Pinned for 300vh. Seven branches grow out of CAPABILITY on the
// canvas; hovering or focusing one shows what it becomes. Below 860px the
// result panel sits at the bottom of the stage and the engine fits the
// branches above it (STAGE_ROW_MIN).

const DesignScene = () => (
  <section
    id="design"
    data-scene="design"
    data-pin="1"
    data-idx="08"
    data-label="Design"
    className="relative h-[300vh]"
  >
    <div data-stage="1" className="sticky top-0 h-screen overflow-hidden">
      <div
        data-dhead="1"
        className="absolute left-[5vw] top-[88px] max-w-[88vw] min-[860px]:max-w-[min(520px,60vw)]"
      >
        <SceneEyebrow idx="08" label="Design · What could this become?" />
        <h3 className="mt-[14px] text-balance font-display text-[length:clamp(22px,2.2vw,36px)] font-bold leading-[1.1] tracking-[-0.025em] text-[var(--c-ink)]">
          Capability → product, program, solution, AI, or software.
        </h3>
        <p className="mt-3 text-[length:var(--text-sm)] leading-[var(--lh-sm)] text-[var(--c-body2)]">
          The shape of the expertise decides the shape of the offer.
        </p>
      </div>

      <div
        data-bo="1"
        aria-hidden="true"
        className="absolute left-0 top-0 whitespace-nowrap font-display text-base font-bold tracking-[0.12em] text-[var(--c-ink)] min-[860px]:text-xl"
      >
        CAPABILITY
      </div>
      {BRANCHES.map((b, k) => (
        <button
          key={b.name}
          data-br={k}
          type="button"
          className="absolute left-0 top-0 cursor-pointer whitespace-nowrap border border-transparent px-[10px] py-2 text-left font-display text-[14px] font-medium text-[var(--ink-500)] opacity-0 transition-[color,border-color] duration-300 min-[860px]:px-[14px] min-[860px]:text-[17px]"
        >
          {b.name}
        </button>
      ))}

      <div className="absolute bottom-[7vh] left-[5vw] right-[5vw] min-[860px]:bottom-auto min-[860px]:left-[69%] min-[860px]:right-auto min-[860px]:top-1/2 min-[860px]:w-[27vw] min-[860px]:-translate-y-1/2">
        <div className="relative h-[150px] min-[860px]:h-[260px]">
          {BRANCHES.map((b, k) => (
            <div
              key={b.name}
              data-bf={k}
              className="absolute inset-0 opacity-0 transition-[opacity,transform] duration-[500ms,700ms] ease-[ease,cubic-bezier(.2,.7,.2,1)]"
            >
              <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--c-amber-ink)]">
                {b.name} becomes
              </div>
              <div className="mt-[14px] font-display text-[length:clamp(34px,3.8vw,64px)] font-bold leading-[0.98] tracking-[-0.035em] text-[var(--c-ink)]">
                {b.becomes}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-7 left-[5vw] font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--c-muted)]">
        Hover a branch — see what it becomes
      </div>
    </div>
  </section>
)

export default DesignScene
