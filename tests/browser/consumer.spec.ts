import { expect, test } from '@playwright/test'

test('consumer builds package classes, service grid utilities and theme in one stylesheet', async ({ page }) => {
  await page.goto('http://127.0.0.1:6008')
  const grid = page.getByTestId('grid')
  await expect(grid).toHaveCSS('display', 'grid')
  await expect(grid).toHaveCSS('gap', '16px')
  const columns = grid.locator(':scope > div')
  await expect(columns.first()).toHaveCSS('grid-column', 'span 6 / span 6')
  await expect(page.getByRole('button', { name: '저장', exact: true })).toHaveCSS('background-color', 'rgb(3, 105, 161)')
  await expect(page.getByRole('button', { name: '미리보기' })).toHaveCSS('height', '32px')
  await expect(page.getByRole('textbox')).toHaveCSS('height', '40px')
  await expect(page.getByRole('heading', { level: 1 })).toHaveCSS('font-size', '24px')
  await expect(page.locator('body')).toHaveCSS('margin', '0px')
  await page.setViewportSize({ width: 375, height: 800 })
  await expect(columns.first()).toHaveCSS('grid-column', 'span 12 / span 12')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})
