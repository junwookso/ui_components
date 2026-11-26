import { expect, test } from '@playwright/test'

test('topbar uses the surface by default and inherits service primary colors when enabled', async ({ page }) => {
  await page.goto('/iframe.html?id=layout-uitopbar--playground&viewMode=story')
  const topbar = page.getByRole('banner', { name: '상단 바' })
  await expect(topbar).toHaveCSS('background-color', 'rgb(255, 255, 255)')

  await page.goto('/iframe.html?id=layout-uitopbar--primary&viewMode=story')
  const link = topbar.getByRole('link', { name: '운영 현황' })
  await expect(topbar).toHaveCSS('background-color', 'rgb(24, 24, 27)')
  await page.locator('.ui-preview').evaluate((element: HTMLElement) => {
    element.style.setProperty('--ui-primary', '#e0f2fe')
    element.style.setProperty('--ui-primary-foreground', '#075985')
  })

  await expect(topbar).toHaveCSS('background-color', 'rgb(224, 242, 254)')
  await expect(link).toHaveCSS('color', 'rgb(7, 89, 133)')
  await page.keyboard.press('Tab')
  await expect(link).toBeFocused()
  await expect(link).toHaveCSS('outline-color', 'rgb(7, 89, 133)')
  await link.hover()
  await expect(link).toHaveCSS('color', 'rgb(7, 89, 133)')
})
