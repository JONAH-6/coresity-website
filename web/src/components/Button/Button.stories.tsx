import type { Meta, StoryObj } from '@storybook/react'

import Button from './Button'

const meta: Meta<typeof Button> = {
  component: Button,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: { children: 'Explore Coresity →', variant: 'primary', size: 'lg' },
}

export const Outline: Story = {
  args: { children: 'Work with us →', variant: 'outline', size: 'lg' },
}

export const Accent: Story = {
  args: { children: 'Work with us →', variant: 'accent', size: 'lg' },
}

export const Inverse: Story = {
  args: { children: 'Read field notes', variant: 'inverse', size: 'lg' },
}
