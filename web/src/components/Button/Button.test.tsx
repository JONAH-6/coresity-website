import { render, screen } from '@redwoodjs/testing/web'

import Button from './Button'

describe('Button', () => {
  it('renders a real button by default, primary and medium', () => {
    render(<Button>Save</Button>)

    const btn = screen.getByRole('button', { name: 'Save' })
    expect(btn.tagName).toBe('BUTTON')
    expect(btn).toHaveClass('bg-[var(--brand)]', 'h-10')
  })

  it('applies the requested variant and size', () => {
    render(
      <Button variant="accent" size="lg">
        Work with us
      </Button>
    )

    expect(screen.getByRole('button')).toHaveClass('bg-[var(--accent)]', 'h-12')
  })

  it('renders an external link in a new tab when given an external href', () => {
    render(
      <Button href="https://forms.gle/example" variant="primary" size="sm">
        Work with us →
      </Button>
    )

    const link = screen.getByRole('link', { name: 'Work with us →' })
    expect(link).toHaveAttribute('href', 'https://forms.gle/example')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    expect(link).toHaveClass('h-8')
  })

  it('renders an in-page link without a new tab', () => {
    render(<Button href="#problem">Explore Coresity →</Button>)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '#problem')
    expect(link).not.toHaveAttribute('target')
  })
})
