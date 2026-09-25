import Button from 'src/components/Button/Button'
import { WORK_WITH_US_FORM_URL } from 'src/lib/links'

import SceneEyebrow from './SceneEyebrow'

// 15 · Final call to action. Pinned for 210vh on a dark ground; each line
// rises in as the scene arrives. Carries the site's footer line, which opens
// with the real lockup where the design draws its mark and wordmark.

const FinalScene = () => (
  <section
    data-scene="final"
    data-pin="1"
    data-dark="1"
    data-idx="15"
    data-label="Work with us"
    className="relative h-[210vh]"
  >
    <div
      data-stage="1"
      className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden px-[5vw] pt-20"
    >
      <div data-fin="1">
        <SceneEyebrow idx="15" label="Your turn" dark />
      </div>
      <h2
        data-fin="1"
        className="mt-7 max-w-[1500px] text-balance font-display text-[length:clamp(48px,8.8vw,164px)] font-bold leading-[0.92] tracking-[-0.045em] text-white"
      >
        Have something worth{' '}
        <span className="text-[var(--accent)]">commercializing?</span>
      </h2>
      <p
        data-fin="1"
        className="mt-9 font-display text-[length:clamp(22px,2.2vw,36px)] font-medium leading-[1.2] tracking-[-0.02em] text-[var(--violet-200)]"
      >
        You bring the expertise.
        <br />
        We build around it.
      </p>
      <div data-fin="1" className="mt-10 flex flex-wrap items-center gap-6">
        <div className="flex flex-wrap gap-3">
          <Button variant="accent" size="lg" href={WORK_WITH_US_FORM_URL}>
            Work with us →
          </Button>
          <Button variant="inverse" size="lg" href="#notes">
            Read field notes
          </Button>
        </div>
        <span className="max-w-[360px] text-[length:var(--text-sm)] text-[var(--violet-300)]">
          Tell us what you’re unusually good at. We’ll show you what it could
          become.
        </span>
      </div>

      <div className="mt-10 flex flex-wrap justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--ink-400)] sm:absolute sm:bottom-6 sm:left-[5vw] sm:right-[5vw] sm:mt-0">
        <img
          src="/CORESITY-IMAGE/lockup-inverse@2x.png"
          alt="Coresity"
          width="636"
          height="137"
          className="h-6 w-auto"
        />
        <span>People → capabilities → connections → products → markets</span>
        <span>© 2026 Coresity Solutions</span>
      </div>
    </div>
  </section>
)

export default FinalScene
