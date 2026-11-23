import { expect, test } from '@playwright/test'
const story = (name: string) => `/iframe.html?id=components-uiprogress--${name}&viewMode=story`

test('unknown progress, reduced motion, sizes, theme and narrow layout', async ({ page }) => {
  await page.goto(story('indeterminate'))
  const progress = page.getByRole('progressbar', { name: '보고서 생성' })
  await expect(progress).not.toHaveAttribute('value')
  await expect(progress).toHaveAttribute('aria-valuetext', '진행 중')
  await expect(page.locator('.ui-progress-fill')).toHaveCSS('animation-name', 'ui-progress-travel')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(page.locator('.ui-progress-fill')).toHaveCSS('animation-name', 'none')
  await page.goto(story('sizes') + '&globals=theme:ocean')
  const tracks = page.locator('.ui-progress-track')
  for (const [index, size] of ['4px', '8px', '12px'].entries()) await expect(tracks.nth(index)).toHaveCSS('height', size)
  await expect(page.locator('.ui-progress-fill').first()).toHaveCSS('background-color', 'rgb(3, 105, 161)')
  const ids = await page.locator('.ui-progress-label').evaluateAll(elements => elements.map(el => el.id))
  expect(new Set(ids).size).toBe(3)
  await page.goto(story('states'))
  await page.setViewportSize({ width: 320, height: 800 })
  await page.goto(story('long-label'))
  await expect(page.getByRole('progressbar')).toHaveAttribute('value', '45')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})
