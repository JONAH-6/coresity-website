import { render, screen } from '@redwoodjs/testing/web'

import { THEMES } from 'src/lib/story/theme'

import StoryLayout from './StoryLayout'

describe('StoryLayout', () => {
  it('renders the story header above its children, with no footer', () => {
    render(
      <StoryLayout>
        <p>Scene content</p>
      </StoryLayout>
    )

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByText('Scene content')).toBeInTheDocument()
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument()
  })

  it('applies the light theme variables and ground by default', () => {
    const { container } = render(<StoryLayout />)

    const root = container.firstElementChild as HTMLElement
    expect(root).toHaveAttribute('data-theme', 'light')
    expect(root).toHaveStyle({
      '--c-bg': THEMES.light.vars['--c-bg'],
      '--c-ink': THEMES.light.vars['--c-ink'],
    })
    expect(document.documentElement).toHaveStyle({
      background: THEMES.light.bg,
    })
  })
})
