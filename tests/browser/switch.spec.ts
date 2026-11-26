import { expect, test } from '@playwright/test'

const story = (name: string) => `/iframe.html?id=components-uiswitch--${name}&viewMode=story`

test('switch supports label clicks, Space, stable names and disabled keyboard skipping', async ({ page }) => {
  await page.goto(story('states'))
  const email = page.getByRole('switch', { name: '이메일 알림', exact: true })
  await expect(email).not.toBeChecked()
  const falseLabel = email.locator('..').getByText('False', { exact: true })
  const trueLabel = email.locator('..').getByText('True', { exact: true })
  await expect(falseLabel).toHaveCSS('color', 'rgb(31, 35, 40)')
  await expect(trueLabel).toHaveCSS('color', 'color(srgb 0.419608 0.429412 0.466667)')
  await expect(email.locator('..').locator('.ui-switch-track')).toHaveCSS('border-top-color', 'rgb(209, 217, 224)')
  await email.hover()
  await expect(email.locator('..').locator('.ui-switch-track')).toHaveCSS('border-top-color', 'rgb(30, 64, 175)')
  await page.locator('label[for="switch-off"]').click()
  await expect(email).toBeChecked()
  await expect(falseLabel).toHaveCSS('color', 'color(srgb 0.419608 0.429412 0.466667)')
  await expect(trueLabel).toHaveCSS('color', 'rgb(31, 35, 40)')
  await email.focus()
  await page.keyboard.press('Space')
  await expect(email).not.toBeChecked()
  await expect(email.locator('..').locator('.ui-switch-track')).toHaveCSS('outline-width', '2px')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('switch', { name: '업무 알림', exact: true })).toBeFocused()
  await page.keyboard.press('Tab')
  for (const input of await page.getByRole('switch', { name: /비활성/ }).all()) {
    await input.hover()
    await expect(input.locator('..').locator('.ui-switch-track')).toHaveCSS('border-top-color', 'rgb(209, 217, 224)')
    await expect(input).toBeDisabled()
    await expect(input).not.toBeFocused()
  }
  await expect(page.getByRole('switch', { name: '비활성 · 켜짐', exact: true })).toBeChecked()
})
