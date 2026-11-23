import { expect, test } from '@playwright/test'

const story = (name: string) => `/iframe.html?id=components-uitextarea--${name}&viewMode=story`

test('native form validation honors line breaks and length constraints', async ({ page }) => {
  await page.goto(story('form'))
  const note = page.getByRole('textbox', { name: '처리 사유 (필수)' })
  const submit = page.getByRole('button', { name: '저장' })
  const status = page.getByRole('status')
  await expect(note).toHaveAccessibleDescription('처리 사유를 5~24자로 입력해 주세요.')

  await submit.click()
  await expect(note).toBeFocused()
  expect(await note.evaluate(el => (el as HTMLTextAreaElement).validity.valueMissing)).toBe(true)
  await note.pressSequentially('abc')
  await submit.click()
  expect(await note.evaluate(el => (el as HTMLTextAreaElement).validity.tooShort)).toBe(true)
  await expect(status).toBeEmpty()

  await note.press('End')
  await note.press('Enter')
  await note.pressSequentially('de')
  await expect(note).toHaveValue('abc\nde')
  await expect(status).toBeEmpty()
  await submit.click()
  await expect(status).toHaveText('처리 사유를 저장했습니다.')
  const data = await page.locator('form').evaluate(el => Object.fromEntries(new FormData(el as HTMLFormElement)))
  expect(data).toEqual({ note: 'abc\nde' })

  await note.press('ControlOrMeta+a')
  await note.pressSequentially('x'.repeat(28))
  await expect(note).toHaveValue('x'.repeat(24))
  await page.getByRole('button', { name: '초기화' }).click()
  await expect(note).toHaveValue('')
  await expect(status).toBeEmpty()
})
