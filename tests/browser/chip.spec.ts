import { expect, test } from '@playwright/test'
const story = (name: string) => `/iframe.html?id=components-uichip--${name}&viewMode=story`

test('removal supports keyboard activation and restores focus through the list', async ({ page }) => {
  await page.goto(story('removable'))
  const first = page.getByRole('button', { name: '플랫폼팀 제거' })
  await first.focus()
  await page.keyboard.press('Tab')
  await page.keyboard.press('Shift+Tab')
  await expect(first).toHaveCSS('outline-width', '2px')
  await page.keyboard.press('Enter')
  await expect(first).toHaveCount(0)
  await expect(page.getByRole('button', { name: '진행 중 제거' })).toBeFocused()
  await expect(page.getByRole('status')).toHaveText('플랫폼팀 조건을 제거했습니다.')
  await page.keyboard.press('Space')
  await expect(page.getByRole('button', { name: '이번 달 제거' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('button', { name: '조건 초기화' })).toBeFocused()
  await expect(page.getByText('적용된 조건이 없습니다.')).toBeVisible()
  await page.keyboard.press('Enter')
  await expect(page.locator('.ui-chip')).toHaveCount(3)
})
