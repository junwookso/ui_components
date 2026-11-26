import { expect, test } from '@playwright/test'

test('the line chart renders distinct series and follows the chart theme', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 600 })
  await page.goto('/iframe.html?id=components-uilinechart--multiple-series&viewMode=story')

  const chart = page.getByRole('img', { name: /요일별 업무 처리 추이/ })
  await expect(chart).toHaveAccessibleName(/월요일 접수 12건, 완료 8건/)
  const received = chart.locator('svg path[stroke="var(--ui-chart-1)"]')
  const completed = chart.locator('svg path[stroke="var(--ui-chart-2)"][stroke-dasharray]')
  await expect(received).toBeVisible()
  await expect(completed).toBeVisible()
  await expect(completed).toHaveCSS('stroke', 'rgb(17, 146, 232)')
  await page.evaluate(() => {
    document.documentElement.dataset.uiColorMode = 'dark'
  })
  await expect(completed).toHaveCSS('stroke', 'rgb(51, 177, 255)')
})
