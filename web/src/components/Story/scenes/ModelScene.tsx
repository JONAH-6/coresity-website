import { MODEL_STEPS } from 'src/components/Story/story.data'

import SceneEyebrow from './SceneEyebrow'

// 06 · The model. Pinned for 640vh on a dark ground (the canvas paints it).
// Six labels ride a ring the engine rotates with scroll; the matching panel
// fades in on the right (or below, on narrow screens). The hub carries the
// brand: the design draws its mark and wordmark, the site uses the real
// lockup, as the header does.

const ModelScene = () => (
  <section
    id="model"
    data-scene="model"
    data-pin="1"
    data-dark="1"
    data-idx="06"
    data-label="The model"
    className="relative h-[640vh]"
  >
    <div data-stage="1" className="sticky top-0 h-screen overflow-hidden">
      <div className="absolute left-[5vw] top-[92px]">
        <SceneEyebrow idx="06" label="The model" dark />
        <h2 className="mt-[14px] font-display text-[length:clamp(22px,2.2vw,34px)] font-semibold leading-[1.1] tracking-[-0.02em] text-white">
          Six steps from talent to revenue.
        </h2>
      </div>

      <div data-mc="1" className="absolute left-0 top-0 whitespace-nowrap">
        <img
          src="/CORESITY-IMAGE/lockup-inverse@2x.png"
          alt="Coresity"
          width="636"
          height="137"
          className="h-6 w-auto"
        />
      </div>
      {MODEL_STEPS.map((step, i) => (
        <div
          key={step.name}
          data-ml={i}
          aria-hidden="true"
          className="absolute left-0 top-0 whitespace-nowrap text-center transition-opacity duration-[400ms]"
        >
          <div className="font-mono text-[10px] tracking-[0.16em] text-[var(--violet-300)]">
            {String(i + 1).padStart(2, '0')}
          </div>
          <div className="font-display text-lg font-semibold text-white">
            {step.name}
          </div>
        </div>
      ))}

      <div
        data-mpanels="1"
        className="absolute right-[5vw] top-1/2 h-[340px] w-[min(40vw,580px)] -translate-y-1/2"
      >
        {MODEL_STEPS.map((step, i) => (
          <div
            key={step.name}
            data-mp={i}
            className="absolute inset-0 opacity-0 transition-[opacity,transform] duration-[600ms,800ms] ease-[ease,cubic-bezier(.2,.7,.2,1)]"
          >
            <div className="flex gap-[14px] font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]">
              <span className="shrink-0 whitespace-nowrap">
                {String(i + 1).padStart(2, '0')} / 06
              </span>
              <span>{step.eyebrow}</span>
            </div>
            <div className="mt-[18px] font-display text-[length:clamp(52px,6.4vw,112px)] font-bold leading-[0.92] tracking-[-0.04em] text-white">
              {step.name}
            </div>
            <p className="mt-[22px] max-w-[460px] font-display text-[length:clamp(20px,1.8vw,28px)] leading-[1.25] text-[var(--violet-200)]">
              {step.line}
            </p>
          </div>
        ))}
      </div>

      <div className="absolute bottom-7 left-[5vw] font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--ink-400)]">
        Scroll to run the engine ↓
      </div>
    </div>
  </section>
)

export default ModelScene
