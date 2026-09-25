import { crossesMiddle, sceneProgress } from './progress'

const H = 900

describe('sceneProgress', () => {
  it('runs a pinned scene from 0 at its top to 1 when its extra height is spent', () => {
    // A 330vh pinned section: its sticky stage spends 230vh of scrolling.
    const height = 3.3 * H
    expect(sceneProgress({ top: 0, bottom: height, height }, H, true).p).toBe(0)
    const half = sceneProgress(
      { top: -(height - H) / 2, bottom: height - (height - H) / 2, height },
      H,
      true
    )
    expect(half.p).toBeCloseTo(0.5)
    expect(
      sceneProgress({ top: -(height - H), bottom: H, height }, H, true).p
    ).toBe(1)
  })

  it('offsets a pinned scene by where its sticky stage sits', () => {
    const height = 3.3 * H
    expect(
      sceneProgress({ top: 200, bottom: 200 + height, height }, H, true).oy
    ).toBe(200)
    expect(
      sceneProgress({ top: -500, bottom: -500 + height, height }, H, true).oy
    ).toBe(0)
  })

  it('runs a flow scene from entering the bottom to leaving the top', () => {
    const height = 600
    expect(
      sceneProgress({ top: H, bottom: H + height, height }, H, false).p
    ).toBe(0)
    expect(sceneProgress({ top: -height, bottom: 0, height }, H, false).p).toBe(
      1
    )
    expect(
      sceneProgress(
        { top: (H - height) / 2, bottom: (H + height) / 2, height },
        H,
        false
      ).p
    ).toBeCloseTo(0.5)
  })

  it('marks a scene visible with a 60px margin either side', () => {
    expect(
      sceneProgress({ top: H + 30, bottom: H + 400, height: 370 }, H, false).vis
    ).toBe(true)
    expect(
      sceneProgress({ top: H + 61, bottom: H + 400, height: 339 }, H, false).vis
    ).toBe(false)
    expect(
      sceneProgress({ top: -400, bottom: -30, height: 370 }, H, false).vis
    ).toBe(true)
  })

  it('reports the scene crossing the viewport middle as active', () => {
    expect(crossesMiddle({ top: 100, bottom: 800 }, H)).toBe(true)
    expect(crossesMiddle({ top: 500, bottom: 900 }, H)).toBe(false)
  })
})
