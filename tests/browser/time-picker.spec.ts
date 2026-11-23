import { expect, test } from '@playwright/test'
const story = (name: string) => `/iframe.html?id=components-uitimepicker--${name}&viewMode=story`

test('form enforces required time, bounds and minute intervals', async ({ page }) => {
  await page.goto(story('form'))
  const input = page.getByLabel('예약 시간 (필수)')
  const submit = page.getByRole('button', { name: '적용' })
  await submit.click()
  await expect(input).toBeFocused()
  await expect(page.getByRole('status')).toBeEmpty()
  await input.fill('08:45')
  expect(await input.evaluate(el => (el as HTMLInputElement).validity.rangeUnderflow)).toBe(true)
  await input.fill('18:15')
  expect(await input.evaluate(el => (el as HTMLInputElement).validity.rangeOverflow)).toBe(true)
  await input.fill('09:10')
  expect(await input.evaluate(el => (el as HTMLInputElement).validity.stepMismatch)).toBe(true)
  await submit.click()
  await expect(page.getByRole('status')).toBeEmpty()
  for (const value of ['09:00', '14:30', '18:00']) {
    await input.fill(value)
    await submit.click()
    await expect(page.getByRole('status')).toHaveText(value)
  }
  expect(await page.locator('form').evaluate(el => Object.fromEntries(new FormData(el as HTMLFormElement)))).toEqual({ time: '18:00' })
})
