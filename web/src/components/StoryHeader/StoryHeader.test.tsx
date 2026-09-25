import userEvent from '@testing-library/user-event'

import { render, screen } from '@redwoodjs/testing/web'

import { WORK_WITH_US_FORM_URL } from 'src/lib/links'
import { THEME_STORAGE_KEY } from 'src/lib/story/theme'

import StoryHeader from './StoryHeader'

describe('StoryHeader', () => {
  beforeEach(() => localStorage.clear())

  it('shows the logo linking back to the top', () => {
    render(<StoryHeader />)

    const logo = screen.getByRole('img', { name: 'Coresity' })
    // The mark alone on phones, the lockup from 640px up.
    expect(logo).toHaveAttribute('src', '/CORESITY-IMAGE/mark@1x.png')
    const source = logo.parentElement?.querySelector('source')
    expect(source).toHaveAttribute('srcset', '/CORESITY-IMAGE/lockup@3x.png')
    expect(source).toHaveAttribute('media', '(min-width: 640px)')
    expect(logo.closest('a')).toHaveAttribute('href', '#top')
  })

  it('switches to the inverse lockup on the dark theme', async () => {
    render(<StoryHeader />)

    const toggle = screen.getByRole('button', {
      name: 'Toggle light and dark mode',
    })
    await userEvent.click(toggle)
    const logo = screen.getByRole('img', { name: 'Coresity' })
    expect(logo).toHaveAttribute('src', '/CORESITY-IMAGE/mark-inverse@2x.png')
    expect(logo.parentElement?.querySelector('source')).toHaveAttribute(
      'srcset',
      '/CORESITY-IMAGE/lockup-inverse@2x.png'
    )
    // The store lives in the module, so leave it light for the next test.
    await userEvent.click(toggle)
  })

  it('carries the scene index, label and progress hooks for the engine', () => {
    const { container } = render(<StoryHeader />)

    expect(container.querySelector('[data-nav-idx]')).toBeInTheDocument()
    expect(container.querySelector('[data-nav-label]')).toBeInTheDocument()
    expect(container.querySelector('[data-progress]')).toBeInTheDocument()
    expect(screen.getByText('/ 15')).toBeInTheDocument()
  })

  it('links the call to action to the form', () => {
    render(<StoryHeader />)

    expect(
      screen.getByRole('link', { name: 'Work with us →' })
    ).toHaveAttribute('href', WORK_WITH_US_FORM_URL)
  })

  it('offers the dark theme in light mode and switches on click', async () => {
    render(<StoryHeader />)
    const toggle = screen.getByRole('button', {
      name: 'Toggle light and dark mode',
    })

    expect(toggle).toHaveTextContent('Dark mode')
    await userEvent.click(toggle)
    expect(toggle).toHaveTextContent('Light mode')
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('Dark')
  })
})
