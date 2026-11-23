import { expect, test } from '@playwright/test'

const story = (name: string) => `/iframe.html?id=components-uialert--${name}&viewMode=story`

test('an inline recovery action is keyboard accessible at a narrow width', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 600 })
  await page.goto(story('with-actions'))
  const action = page.getByRole('button', { name: '첨부 안내 보기' })
  await expect(action).toBeVisible()
  await page.keyboard.press('Tab')
  await expect(action).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('button', { name: '첨부 안내 접기' })).toBeFocused()
  await expect(page.getByText('검토 보고서는 PDF로 첨부해 주세요.')).toBeVisible()
  await expect(page.getByText('첨부 문서 누락', { exact: true })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})
