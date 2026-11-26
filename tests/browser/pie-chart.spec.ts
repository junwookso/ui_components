import { expect, test } from '@playwright/test'

test('pie and donut examples render the same categories with different slice shapes', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 600 })
  await page.goto('/iframe.html?id=components-uipiechart--playground&viewMode=story')

  const chart = page.getByRole('img', { name: /기능 요청 45%, 오류 신고 30%, 사용 문의 25%/ })
  const firstSlice = chart.locator('svg path[fill="var(--ui-chart-1)"]')
  await expect(firstSlice).toBeVisible()
  await expect(chart.locator('svg path[fill^="var(--ui-chart-"]')).toHaveCount(3)
  const pieShape = await firstSlice.getAttribute('d')
  expect(pieShape).toBeTruthy()

  await page.goto('/iframe.html?id=components-uipiechart--donut&viewMode=story')
  await expect(firstSlice).toBeVisible()
  await expect(firstSlice).not.toHaveAttribute('d', pieShape!)
  await expect(page.getByRole('list', { name: '요청 유형 범례' })).toContainText('기능 요청 45%')
  await page.evaluate(() => {
    document.documentElement.dataset.uiColorMode = 'dark'
  })
  await expect(firstSlice).toHaveCSS('fill', 'rgb(138, 63, 252)')
})
