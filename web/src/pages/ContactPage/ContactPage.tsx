import { Metadata } from '@redwoodjs/web'

const ContactPage = () => {
  return (
    <>
      <Metadata title="Contact | Coresity" description="Contact Coresity" />

      <section className="bg-[var(--surface-page)] px-4 py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="mb-6 text-4xl font-bold text-[var(--text-heading)] md:text-6xl">
            Get in touch<span className="text-[var(--accent)]">.</span>
          </h1>

          <p className="mb-12 text-lg text-[var(--text-body)]">
            Whether you're an expert or looking for a solution — we'd love to
            hear from you.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <a
              href="https://wa.me/2348012345678"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-[var(--brand)] px-10 py-4 font-bold text-white transition hover:bg-[var(--brand-hover)]"
            >
              Chat on WhatsApp
            </a>

            <a
              href="mailto:hello@coresity.com"
              className="rounded-lg border-2 border-[var(--brand)] px-10 py-4 font-bold text-[var(--brand)] transition hover:bg-[var(--brand-soft)]"
            >
              Send Email
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

export default ContactPage
