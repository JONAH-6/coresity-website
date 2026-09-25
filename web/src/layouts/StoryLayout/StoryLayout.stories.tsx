import type { Meta, StoryObj } from '@storybook/react'

import StoryLayout from './StoryLayout'

const meta: Meta<typeof StoryLayout> = {
  component: StoryLayout,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof StoryLayout>

export const Primary: Story = {
  args: { children: <p className="p-24">Scene content</p> },
}
