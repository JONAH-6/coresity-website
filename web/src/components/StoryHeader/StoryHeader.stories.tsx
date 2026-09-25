import type { Meta, StoryObj } from '@storybook/react'

import StoryHeader from './StoryHeader'

const meta: Meta<typeof StoryHeader> = {
  component: StoryHeader,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof StoryHeader>

export const Primary: Story = {}
