import { expect, test } from '@playwright/test'

const story = (name: string) => `/iframe.html?id=components-uicheckbox--${name}&viewMode=story`

test('Space and label clicks update a partially selected group', async ({ page }) => {
  await page.goto(story('partial-selection'))
  const all = page.getByRole('checkbox', { name: '전체 선택' })
  const summary = page.getByRole('checkbox', { name: '업무 요약' })
  const minutes = page.getByRole('checkbox', { name: '회의 기록' })
  await expect(all).toBeChecked({ indeterminate: true })
  await page.keyboard.press('Tab')
  await expect(all).toBeFocused()
  await expect(all).toHaveCSS('outline-width', '2px')
  await page.keyboard.press('Space')
  await expect(summary).toBeChecked()
  await expect(minutes).toBeChecked()
  await expect(all).toHaveJSProperty('indeterminate', false)

  await page.getByText('회의 기록', { exact: true }).click()
  await expect(all).toBeChecked({ indeterminate: true })
})

test('required checkboxes validate and submit a native value', async ({ page }) => {
  await page.goto(story('form'))
  const checkbox = page.getByRole('checkbox', { name: '검토 완료 확인 (필수)' })
  const submit = page.getByRole('button', { name: '제출' })
  const form = page.locator('form')
  const data = () => form.evaluate(el => Object.fromEntries(new FormData(el as HTMLFormElement)))

  await expect(checkbox).toHaveAccessibleDescription('제출 전에 문서 내용을 확인해 주세요.')
  await submit.click()
  await expect(checkbox).toBeFocused()
  await expect(checkbox).toHaveJSProperty('required', true)
  await expect(page.getByRole('status')).toBeEmpty()
  expect(await data()).toEqual({})

  await checkbox.check()
  await submit.click()
  await expect(page.getByRole('status')).toHaveText('검토 완료로 제출했습니다.')
  expect(await data()).toEqual({ reviewed: 'yes' })

  await page.getByRole('button', { name: '초기화' }).click()
  await expect(checkbox).not.toBeChecked()
  await expect(page.getByRole('status')).toBeEmpty()
})
