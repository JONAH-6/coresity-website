import { Metadata } from '@redwoodjs/web'

import Story from 'src/components/Story/Story'

const HomePage = () => {
  return (
    <>
      <Metadata
        title="Home"
        description="Coresity finds exceptional people and builds commercial opportunities around what they're unusually good at."
      />

      <Story />
    </>
  )
}

export default HomePage
