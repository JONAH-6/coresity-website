import { Metadata } from '@redwoodjs/web'

const HowItWorksPage = () => {
  const steps = [
    {
      num: '01',
      title: 'Discover',
      desc: 'We find people who are exceptionally good at something valuable.',
    },
    {
      num: '02',
      title: 'Productize',
      desc: 'We turn their expertise into eBooks, courses, and consulting offers.',
    },
    {
      num: '03',
      title: 'Distribute',
      desc: 'We find the customers and turn the offer into revenue.',
    },
  ]

  return (
    <>
      <Metadata
        title="How It Works | Coresity"
        description="How Coresity works"
      />

      <section className="bg-[var(--surface-page)] px-4 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <h1 className="mb-4 text-4xl font-bold text-[var(--text-heading)] md:text-6xl">
              How It Works<span className="text-[var(--accent)]">.</span>
            </h1>
            <p className="text-lg text-[var(--text-muted)]">
              Three simple steps. One clear outcome.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.num}
                className="rounded-2xl border border-[var(--border-default)] bg-white p-8 transition-colors hover:border-[var(--brand)]"
              >
                <div className="mb-4 text-4xl font-bold text-[var(--brand-soft)]">
                  {step.num}
                </div>
                <h2 className="mb-3 text-2xl font-bold text-[var(--text-heading)]">
                  {step.title}
                </h2>
                <p className="leading-relaxed text-[var(--text-body)]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default HowItWorksPage
