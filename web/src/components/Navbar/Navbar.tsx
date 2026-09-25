import { useState } from 'react'

import { Link, routes } from '@redwoodjs/router'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const links = [
    { name: 'Home', route: routes.home() },
    { name: 'About', route: routes.about() },
    { name: 'How It Works', route: routes.howItWorks() },
    { name: 'Contact', route: routes.contact() },
  ]

  return (
    <>
      <nav className="fixed left-0 top-0 z-50 w-full border-b border-[var(--border-default)] bg-[var(--surface-page)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to={routes.home()}>
            <picture>
              <source
                srcSet="/CORESITY-IMAGE/lockup-inverse@2x.png"
                media="(prefers-color-scheme: dark)"
              />
              <img
                src="/CORESITY-IMAGE/lockup@3x.png"
                alt="Coresity"
                width="954"
                height="206"
                className="h-8 w-auto"
              />
            </picture>
          </Link>

          <div className="hidden gap-8 text-sm font-medium md:flex">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.route}
                className="text-[var(--text-body)] transition-colors hover:text-[var(--brand)]"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="flex flex-col gap-1.5 md:hidden"
            aria-label="Open menu"
          >
            <span className="block h-0.5 w-6 bg-[var(--text-heading)]"></span>
            <span className="block h-0.5 w-6 bg-[var(--text-heading)]"></span>
            <span className="block h-0.5 w-6 bg-[var(--text-heading)]"></span>
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile drawer */}
      <div
        className={`fixed left-0 top-0 z-50 h-full w-64 transform bg-[var(--surface-page)] shadow-xl transition-transform md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-full flex-col p-6">
          <div className="mb-10 flex items-center justify-between">
            <span className="text-xl font-bold text-[var(--text-heading)]">
              Menu
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-2xl text-[var(--text-muted)]"
            >
              ✕
            </button>
          </div>
          <div className="flex flex-col gap-6 text-lg font-medium">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.route}
                onClick={() => setIsOpen(false)}
                className="text-[var(--text-body)] hover:text-[var(--brand)]"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar
