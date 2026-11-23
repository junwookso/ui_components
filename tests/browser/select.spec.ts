import { expect, test } from '@playwright/test'
const story = (name: string) => `/iframe.html?id=components-uiselect--${name}&viewMode=story`

test('required select rejects empty choice and submits its native form value', async ({ page }) => {
  await page.goto(story('form'))
  const select = page.getByRole('combobox', { name: '업무 상태 (필수)' })
  await page.getByRole('button', { name: '적용' }).click()
  await expect(select).toBeFocused()
  expect(await select.evaluate(el => (el as HTMLSelectElement).validity.valueMissing)).toBe(true)
  await expect(page.getByRole('status')).toBeEmpty()
  await select.selectOption('reviewing')
  await page.getByRole('button', { name: '적용' }).click()
  await expect(page.getByRole('status')).toHaveText('reviewing')
  expect(await page.locator('form').evaluate(el => Object.fromEntries(new FormData(el as HTMLFormElement)))).toEqual({ status: 'reviewing' })
})
