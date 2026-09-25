import type { Meta, StoryObj } from '@storybook/react'

import Story from './Story'

const meta: Meta<typeof Story> = {
  component: Story,
  tags: ['autodocs'],
}

export default meta

type StoryEntry = StoryObj<typeof Story>

export const Primary: StoryEntry = {}
