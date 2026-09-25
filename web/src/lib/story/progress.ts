import { c01 } from './math'

// Scroll progress of a scene, as the design computes it each frame
// (script lines 594–600).

export type Rect = { top: number; bottom: number; height: number }

export type Progress = {
  /** 0..1 through the scene. */
  p: number
  /** Vertical offset of the scene's sticky stage relative to the viewport. */
  oy: number
  /** Within 60px of the viewport. */
  vis: boolean
}

export const sceneProgress = (
  r: Rect,
  viewportH: number,
  pinned: boolean
): Progress => {
  const vis = r.bottom > -60 && r.top < viewportH + 60
  if (pinned) {
    return {
      // `|| 0` turns the -0 a scene reports at its very top into 0.
      p: c01(-r.top / Math.max(1, r.height - viewportH)) || 0,
      oy: Math.min(Math.max(r.top, 0), r.bottom - viewportH),
      vis,
    }
  }
  return {
    p: c01((viewportH - r.top) / (r.height + viewportH)),
    oy: r.top,
    vis,
  }
}

/** The active scene is the one straddling the middle of the viewport. */
export const crossesMiddle = (
  r: { top: number; bottom: number },
  viewportH: number
) => r.top <= viewportH * 0.5 && r.bottom >= viewportH * 0.5
