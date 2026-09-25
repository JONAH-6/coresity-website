import { render } from '@redwoodjs/testing/web'

import Cta from './Cta'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Cta', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Cta />)
    }).not.toThrow()
  })
})
