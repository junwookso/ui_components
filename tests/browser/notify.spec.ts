import { expect, test } from '@playwright/test'
const story = '/iframe.html?id=actions-notify--playground&viewMode=story'

test('notify preserves focus and supports keyboard dismissal and urgency', async ({ page }) => {
  await page.goto(story)
  const trigger = page.getByRole('button', { name: '오류 표시', exact: true })
  await trigger.focus()
  await page.keyboard.press('Enter')
  await expect(trigger).toBeFocused()
  await expect(page.getByRole('alert')).toContainText('저장하지 못했습니다')
  const close = page.getByRole('button', { name: /저장하지 못했습니다.*알림 닫기/ })
  await close.focus()
  await expect(close).toHaveCSS('outline-style', 'solid')
  await page.keyboard.press('Enter')
  await expect(trigger).toBeFocused()
  await expect(page.getByRole('region', { name: '알림', exact: true })).toBeHidden()
  await page.getByRole('button', { name: '대기열 5개' }).click()
  await expect(page.locator('.ui-notify-card')).toHaveCount(3)
  await expect(page.getByText('대기 중인 알림 2개')).toBeVisible()
  await page.locator('.ui-notify-close').first().click()
  await expect(page.locator('.ui-notify-message').last()).toHaveText('작업 4 완료')
  await expect(page.locator('.ui-notify-close').first()).toBeFocused()
})
