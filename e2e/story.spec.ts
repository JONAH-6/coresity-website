import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

// The homepage story: a fifteen-scene scroll narrative driven by lib/story.
// These tests guard the hero intro (as state, never as wall-clock), the header
// index following scroll, two pinned scenes reaching their key moments,
// reduced motion, the light/dark theme, the drifting field-notes rail, a
// clean console and no horizontal overflow on a phone.

// Scroll so that a pinned scene is `p` of the way through its range.
const scrollScene = async (page: Page, name: string, p: number) => {
  await page.evaluate(
    ([name, p]) => {
      const el = document.querySelector(`[data-scene="${name}"]`) as HTMLElement
      const H = window.innerHeight
      const top = el.getBoundingClientRect().top + window.scrollY
      window.scrollTo(0, top + (p as number) * (el.offsetHeight - H))
    },
    [name, p] as const
  )
}

test('hero plays its word pairs, then settles on the headline', async ({
  page,
}) => {
  await page.goto('/')
  const firstPair = page.locator('[data-hp="0"]')
  const firstWord = page.locator('[data-hw]').first()

  // The first pair becomes visible early in the intro…
  await expect
    .poll(
      async () => parseFloat(await firstPair.evaluate((e) => e.style.opacity)),
      {
        timeout: 4000,
      }
    )
    .toBeGreaterThan(0.5)
  // …and the headline is fully in by the end of it.
  await expect(firstWord).toHaveCSS('opacity', '1', { timeout: 10000 })
  await expect(page.locator('[data-hcta]')).toHaveCSS('opacity', '1', {
    timeout: 4000,
  })
})

test('reduced motion skips the intro and shows the headline at once', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')

  await expect(page.locator('[data-hw]').first()).toHaveCSS('opacity', '1', {
    timeout: 1500,
  })
  await page.waitForTimeout(2000)
  const pairs = await page
    .locator('[data-hp]')
    .evaluateAll((els) => els.map((e) => (e as HTMLElement).style.opacity))
  expect(pairs).toEqual(['0', '0', '0'])
})

test('the header index follows the scenes', async ({ page }) => {
  await page.goto('/')
  const idx = page.locator('[data-nav-idx]')
  const label = page.locator('[data-nav-label]')

  await expect(idx).toHaveText('01')
  await expect(label).toHaveText('Coresity')

  await scrollScene(page, 'model', 0.5)
  await expect(idx).toHaveText('06', { timeout: 3000 })
  await expect(label).toHaveText('The model')

  await page.evaluate(() =>
    window.scrollTo(0, document.documentElement.scrollHeight)
  )
  await expect(idx).toHaveText('15', { timeout: 3000 })
  // scrollTo clamps to a fractional maximum, so the bar lands within a hair of 1.
  await expect
    .poll(
      async () =>
        parseFloat(
          (
            await page
              .locator('[data-progress]')
              .evaluate((e) => getComputedStyle(e).transform)
          ).replace('matrix(', '')
        ),
      { timeout: 3000 }
    )
    .toBeGreaterThan(0.99)
})

test('the problem scene lands on its question near the end of its pin', async ({
  page,
}) => {
  await page.goto('/')
  const question = page.locator('[data-pq]')

  await scrollScene(page, 'problem', 0.3)
  await expect(question).toHaveCSS('opacity', '0', { timeout: 3000 })

  await scrollScene(page, 'problem', 0.9)
  await expect(question).toHaveCSS('opacity', '1', { timeout: 3000 })
  await expect(question).toContainText('bigger?')
})

test('the model scene runs from Discover to Develop', async ({ page }) => {
  await page.goto('/')

  await scrollScene(page, 'model', 0.08)
  await expect(page.locator('[data-mp="0"]')).toHaveCSS('opacity', '1', {
    timeout: 3000,
  })
  await expect(page.locator('[data-mp="0"]')).toContainText('Discover')

  await scrollScene(page, 'model', 0.97)
  await expect(page.locator('[data-mp="5"]')).toHaveCSS('opacity', '1', {
    timeout: 3000,
  })
  await expect(page.locator('[data-mp="5"]')).toContainText('Develop')
})

test('scrolling the whole story logs no console errors', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(err.message))

  await page.goto('/')
  const height = await page.evaluate(
    () => document.documentElement.scrollHeight
  )
  for (let y = 0; y < height; y += 700) {
    await page.evaluate((y) => window.scrollTo(0, y), y)
    await page.waitForTimeout(60)
  }
  expect(errors).toEqual([])
  await expect(page.locator('canvas[data-story-canvas]')).toHaveAttribute(
    'aria-hidden',
    'true'
  )
})

test('fits a phone without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  const height = await page.evaluate(
    () => document.documentElement.scrollHeight
  )
  for (let y = 0; y < height; y += 800) {
    await page.evaluate((y) => window.scrollTo(0, y), y)
    await page.waitForTimeout(40)
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    )
    expect(overflow, `overflow at scroll ${y}`).toBe(false)
  }
  await expect(page.locator('[data-rail]')).toBeHidden()
  // Below 760px the field notes stack and the drift hint goes away.
  await expect(page.locator('[data-notes]')).toHaveCSS('display', 'block')
  await expect(page.locator('[data-nhint]')).toBeHidden()

  // The pinned stages stay readable: labels inside the viewport, the deploy
  // ring above its caption, the final footer below the call to action.
  const outside = (sel: string) =>
    page.locator(sel).evaluateAll((els) =>
      els
        .filter((e) => {
          const r = e.getBoundingClientRect()
          return r.left < 0 || r.right > window.innerWidth
        })
        .map((e) => e.textContent)
    )
  await scrollScene(page, 'deploy', 0.5)
  await page.waitForTimeout(500)
  expect(await outside('[data-ch]')).toEqual([])
  const captionTop = await page
    .locator('[data-dproutes]')
    .evaluate((e) => e.getBoundingClientRect().top)
  const channelsBottom = await page
    .locator('[data-ch]')
    .evaluateAll((els) =>
      Math.max(...els.map((e) => e.getBoundingClientRect().bottom))
    )
  expect(channelsBottom).toBeLessThan(captionTop)

  await page
    .locator('[data-fly]')
    .evaluate((e) => e.scrollIntoView({ block: 'center' }))
  await page.waitForTimeout(500)
  expect(await outside('[data-fl]')).toEqual([])

  await scrollScene(page, 'final', 0.9)
  await page.waitForTimeout(800)
  const ctaBottom = await page
    .locator('[data-fin]')
    .last()
    .evaluate((e) => e.getBoundingClientRect().bottom)
  const footerTop = await page
    .locator('[data-scene="final"] img')
    .evaluate(
      (e) => (e.parentElement as HTMLElement).getBoundingClientRect().top
    )
  expect(footerTop).toBeGreaterThanOrEqual(ctaBottom)
})

test('the theme toggle turns the page dark and the choice survives a reload', async ({
  page,
}) => {
  await page.goto('/')
  const toggle = page.getByRole('button', {
    name: 'Toggle light and dark mode',
  })
  const root = page.locator('[data-theme]')
  const heroForm = page.locator('[data-hcta] a')

  await expect(root).toHaveAttribute('data-theme', 'light')
  await expect(toggle).toHaveText('Dark mode')
  // Outline on light: transparent.
  await expect(heroForm).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')

  await toggle.click()
  await expect(root).toHaveAttribute('data-theme', 'dark')
  await expect(toggle).toHaveText('Light mode')
  await expect(page.locator('html')).toHaveCSS(
    'background-color',
    'rgb(19, 16, 34)'
  )
  // Inverse on dark: white.
  await expect(heroForm).toHaveCSS('background-color', 'rgb(255, 255, 255)')

  await page.reload()
  await expect(root).toHaveAttribute('data-theme', 'dark')
  await expect(toggle).toHaveText('Light mode')
})

test('follows the system preference until the visitor chooses', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/')
  const root = page.locator('[data-theme]')

  await expect(root).toHaveAttribute('data-theme', 'dark')
  await page.getByRole('button', { name: 'Toggle light and dark mode' }).click()
  await expect(root).toHaveAttribute('data-theme', 'light')
  await expect(page.locator('html')).toHaveCSS(
    'background-color',
    'rgb(246, 245, 250)'
  )
})

test('the field-notes rail drifts on its own and pauses under the pointer', async ({
  page,
}) => {
  await page.goto('/')
  const rail = page.locator('[data-notes]')
  await rail.evaluate((el) => el.scrollIntoView({ block: 'center' }))

  await expect
    .poll(async () => rail.evaluate((el) => el.scrollLeft), { timeout: 5000 })
    .toBeGreaterThan(10)

  await rail.hover()
  await page.waitForTimeout(300)
  const held = await rail.evaluate((el) => el.scrollLeft)
  await page.waitForTimeout(700)
  expect(await rail.evaluate((el) => el.scrollLeft)).toBe(held)
})
