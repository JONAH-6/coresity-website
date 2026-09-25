import { useLayoutEffect, useRef } from 'react'

import { startStory } from 'src/lib/story/engine'

import DefineScene from './scenes/DefineScene'
import DeployScene from './scenes/DeployScene'
import DesignScene from './scenes/DesignScene'
import DevelopScene from './scenes/DevelopScene'
import FinalScene from './scenes/FinalScene'
import FlywheelScene from './scenes/FlywheelScene'
import HeroScene from './scenes/HeroScene'
import InterludeScene from './scenes/InterludeScene'
import ModelScene from './scenes/ModelScene'
import NotesScene from './scenes/NotesScene'
import OpportunityScene from './scenes/OpportunityScene'
import PartnerScene from './scenes/PartnerScene'
import PortfolioScene from './scenes/PortfolioScene'
import ProblemScene from './scenes/ProblemScene'
import WhoScene from './scenes/WhoScene'
import WhyScene from './scenes/WhyScene'

// The homepage story: sixteen scenes over a fixed particle canvas, with a
// grain overlay on top. The engine (lib/story) binds the scenes' data-*
// hooks and drives everything from scroll. Ported from
// docs/Coresity Story v3.dc.html.

const Story = () => {
  const rootRef = useRef<HTMLDivElement>(null)

  // A layout effect so the hero's word layers are already hidden on the first
  // paint (the design boots after paint, which can flash them for a frame).
  useLayoutEffect(() => startStory(rootRef.current), [])

  return (
    <div ref={rootRef} className="relative">
      <canvas
        data-story-canvas="1"
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-0 h-screen w-screen"
      />

      <main id="top" className="relative z-[1]">
        <HeroScene />
        <ProblemScene />
        <OpportunityScene />
        <WhoScene />
        <WhyScene />
        <InterludeScene />
        <ModelScene />
        <DefineScene />
        <DesignScene />
        <DeployScene />
        <DevelopScene />
        <FlywheelScene />
        <PortfolioScene />
        <PartnerScene />
        <NotesScene />
        <FinalScene />
      </main>

      <svg
        aria-hidden="true"
        width="100%"
        height="100%"
        className="pointer-events-none fixed inset-0 z-30 opacity-[0.06]"
      >
        <filter id="cz-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="2"
            seed="5"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#cz-grain)" />
      </svg>
    </div>
  )
}

export default Story
