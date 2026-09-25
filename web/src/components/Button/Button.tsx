import type { ReactNode } from 'react'

// Port of the design system's Button (`.cds-btn` in the compiled bundle).
// Variants and sizes map 1:1 to its CSS; tokens come from index.css.

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'accent'
  | 'inverse'
export type ButtonSize = 'sm' | 'md' | 'lg'

type Props = {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  /** Renders an anchor. External URLs open in a new tab. */
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  className?: string
  'aria-label'?: string
}

const BASE =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-sm)] border border-transparent font-semibold transition-[background-color,color,border-color] duration-[var(--dur-fast)] ease-[var(--ease-out)] hover:no-underline focus-visible:shadow-[var(--shadow-focus)] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-45'

const SIZE: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-[length:var(--text-sm)]',
  md: 'h-10 px-4 text-[length:var(--text-sm)]',
  lg: 'h-12 px-[22px] text-[length:var(--text-base)]',
}

const VARIANT: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--brand)] text-[var(--text-inverse)] hover:bg-[var(--brand-hover)] hover:text-[var(--text-inverse)] active:bg-[var(--brand-active)]',
  secondary:
    'bg-[var(--brand-soft)] text-[var(--brand)] hover:bg-[var(--brand-soft-hover)] hover:text-[var(--brand)]',
  outline:
    'border-[var(--border-strong)] bg-transparent text-[var(--text-heading)] hover:bg-[var(--surface-subtle)] hover:text-[var(--text-heading)]',
  ghost:
    'bg-transparent text-[var(--brand)] hover:bg-[var(--violet-50)] hover:text-[var(--brand)]',
  accent:
    'bg-[var(--accent)] text-[var(--ink-950)] hover:bg-[var(--accent-hover)] hover:text-[var(--ink-950)]',
  inverse:
    'bg-white text-[var(--brand)] hover:bg-[var(--violet-100)] hover:text-[var(--brand)]',
}

const isExternal = (href: string) => /^(https?:)?\/\/|^mailto:/.test(href)

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  type = 'button',
  disabled,
  className = '',
  'aria-label': ariaLabel,
}: Props) => {
  const classes = `${BASE} ${SIZE[size]} ${VARIANT[variant]} ${className}`

  if (href) {
    const external = isExternal(href)
    return (
      <a
        href={href}
        className={classes}
        onClick={onClick}
        aria-label={ariaLabel}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    )
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}

export default Button
