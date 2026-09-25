// Pass props to your component by passing an `args` object to your story
//
// ```tsx
// export const Primary: Story = {
//  args: {
//    propName: propValue
//  }
// }
// ```
//
// See https://storybook.js.org/docs/7/writing-stories/args

import type { Meta, StoryObj } from '@storybook/react'

import Cta from './Cta'

const meta: Meta<typeof Cta> = {
  component: Cta,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof Cta>

export const Primary: Story = {}
