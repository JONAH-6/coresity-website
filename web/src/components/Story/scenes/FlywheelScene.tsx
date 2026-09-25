import { FLYWHEEL } from 'src/components/Story/story.data'

import SceneEyebrow from './SceneEyebrow'

// 11 · The flywheel. Five stages turn on a ring the engine spins; hovering or
// focusing a stage slows it and shows its line. The section clips
// horizontally: on a phone the rotating labels can swing past the edge.

const FlywheelScene = () => (
  <section
    data-scene="flywheel"
    data-idx="11"
    data-label="The flywheel"
    className="relative overflow-x-clip px-[5vw] pb-[14vh] pt-[12vh]"
  >
    <div className="flex flex-wrap items-center gap-x-16 gap-y-12">
      <div className="flex-[1_1_320px]">
        <SceneEyebrow idx="11" label="The flywheel" reveal />
        <h2
          data-reveal="clip"
          className="mt-6 text-balance font-display text-[length:clamp(36px,4.4vw,76px)] font-bold leading-none tracking-[-0.035em] text-[var(--c-ink)]"
        >
          Every turn makes the next one stronger.
        </h2>
        <p
          data-reveal="1"
          className="mt-6 max-w-[440px] text-[length:var(--text-base)] leading-[var(--lh-base)] text-[var(--c-body2)]"
        >
          Expertise becomes an offer. The offer finds customers. Customers teach
          us what to build next — and the spark grows.
        </p>
        <div
          data-reveal="1"
          className="mt-7 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--c-muted)]"
        >
          Hover a stage to slow the wheel
        </div>
      </div>

      <div
        data-fly="1"
        className="relative aspect-square max-w-[720px] flex-[1.6_1_480px]"
      >
        <div
          data-fcd="1"
          className="absolute left-1/2 top-1/2 mt-11 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--c-muted)] transition-opacity duration-[400ms]"
        >
          Always learning
        </div>
        {FLYWHEEL.map((f, k) => (
          <div
            key={f.label}
            data-fc={k}
            className="absolute left-1/2 top-1/2 mt-14 w-[46%] -translate-x-1/2 -translate-y-1/2 text-center text-[length:var(--text-sm)] leading-[var(--lh-sm)] text-[var(--c-ink)] opacity-0 transition-opacity duration-[400ms]"
          >
            {f.desc}
          </div>
        ))}
        {FLYWHEEL.map((f, k) => (
          <button
            key={f.label}
            data-fl={k}
            type="button"
            className="absolute left-0 top-0 cursor-pointer whitespace-nowrap px-2 py-2 text-left font-display text-[13px] font-semibold text-[var(--c-ink)] sm:px-3 sm:text-[length:clamp(15px,1.4vw,21px)]"
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  </section>
)

export default FlywheelScene
