import { expect, test } from '@playwright/test'

test('the standalone bar chart renders in the centered Storybook preview', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 600 })
  await page.goto('/iframe.html?id=components-uibarchart--playground&viewMode=story')
  const chart = page.getByRole('img', { name: /요일별 업무 요청/ })
  await expect(chart.locator('svg text').filter({ hasText: /^월$/ })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test('the chart uses fourteen palette tokens and follows the theme', async ({ page }) => {
  await page.goto('/iframe.html?id=components-uibarchart--palette&viewMode=story')
  const chart = page.getByRole('img', { name: /팀별 업무 요청/ })
  for (let index = 1; index <= 14; index++) {
    await expect(chart.locator(`svg [fill="var(--ui-chart-${index})"]`)).toHaveCount(1)
  }

  const firstBar = chart.locator('svg [fill="var(--ui-chart-1)"]')
  await expect(firstBar).toHaveCSS('fill', 'rgb(105, 41, 196)')
  await page.evaluate(() => {
    document.documentElement.dataset.uiColorMode = 'dark'
  })
  await expect(firstBar).toHaveCSS('fill', 'rgb(138, 63, 252)')
  await page.evaluate(() => {
    document.querySelector<HTMLElement>('[role="img"][aria-label^="팀별 업무 요청"]')!
      .style.setProperty('--ui-chart-1', '#ff00ff')
  })
  await expect(firstBar).toHaveCSS('fill', 'rgb(255, 0, 255)')
})
