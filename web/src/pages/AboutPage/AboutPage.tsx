import { Metadata } from '@redwoodjs/web'

const AboutPage = () => {
  return (
    <>
      <Metadata title="About | Coresity" description="About Coresity" />

      <section className="bg-[var(--surface-page)] px-4 py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-8 text-4xl font-bold text-[var(--text-heading)] md:text-6xl">
            About Coresity<span className="text-[var(--accent)]">.</span>
          </h1>

          <p className="mb-6 text-lg leading-relaxed text-[var(--text-body)]">
            Coresity discovers exceptional people, identifies the valuable
            expertise they possess, and turns it into products, programs, and
            business solutions that customers are willing to pay for.
          </p>

          <p className="mb-12 text-lg leading-relaxed text-[var(--text-body)]">
            We bridge the gap between exceptional capability and market demand.
          </p>

          <div className="rounded-2xl bg-[var(--brand-soft)] p-8 text-left">
            <h2 className="mb-3 text-xl font-bold text-[var(--text-heading)]">
              What makes us different
            </h2>
            <p className="leading-relaxed text-[var(--text-body)]">
              We are not just a consulting firm, course company, or talent
              agency. We combine all of these around one central function:{' '}
              <span className="font-semibold text-[var(--brand)]">
                commercializing exceptional expertise.
              </span>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

export default AboutPage
