import { expect, test } from '@playwright/test'
const story = '/iframe.html?id=layout-basic-layout--responsive&viewMode=story'

test('crossing breakpoint closes overlay, preserves selection and moves focus to a visible control', async ({ page }) => {
  await page.setViewportSize({ width: 1023, height: 800 })
  await page.goto(story)
  const trigger = page.getByRole('button', { name: '메뉴 열기' })
  await trigger.click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.setViewportSize({ width: 1024, height: 800 })
  await expect(page.getByRole('dialog')).toBeHidden()
  const current = page.getByRole('complementary').getByRole('link', { name: '내 업무', exact: true })
  await expect(current).toBeFocused()
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')
  await page.setViewportSize({ width: 1023, height: 800 })
  await expect(trigger).toBeFocused()
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  await expect(page.getByRole('dialog')).toBeHidden()
  await trigger.click()
  await expect(page.getByRole('dialog').getByRole('link', { name: '내 업무', exact: true })).toHaveAttribute('aria-current', 'page')
})
