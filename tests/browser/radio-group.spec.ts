import { expect, test } from '@playwright/test'

const story = (name: string) => `/iframe.html?id=components-uiradiogroup--${name}&viewMode=story`

test('native arrow keys select one radio and skip disabled options', async ({ page }) => {
  await page.goto(story('playground'))
  const group = page.getByRole('group', { name: '공개 범위' })
  const team = group.getByRole('radio', { name: '담당 팀' })
  const company = group.getByRole('radio', { name: '전사 (권한 필요)' })
  const privateOption = group.getByRole('radio', { name: '나만 보기' })

  await expect(team).not.toBeChecked()
  await expect(company).toBeDisabled()
  await page.keyboard.press('Tab')
  await expect(team).toBeFocused()
  await expect(team).toHaveCSS('outline-width', '2px')
  await page.keyboard.press('Space')
  await expect(team).toBeChecked()
  await page.keyboard.press('ArrowDown')
  await expect(privateOption).toBeFocused()
  await expect(privateOption).toBeChecked()
  await expect(team).not.toBeChecked()
  await page.keyboard.press('ArrowRight')
  await expect(team).toBeChecked()
  await page.getByText('나만 보기', { exact: true }).click()
  await expect(privateOption).toBeChecked()
})

test('a required group validates and submits to its associated form', async ({ page }) => {
  await page.goto(story('form'))
  const group = page.getByRole('group', { name: '공개 범위 (필수)' })
  const team = group.getByRole('radio', { name: '담당 팀' })
  const submit = page.getByRole('button', { name: '저장' })
  const form = page.locator('form')
  const data = () => form.evaluate(el => Object.fromEntries(new FormData(el as HTMLFormElement)))

  await expect(group).toHaveAccessibleDescription('저장한 문서를 볼 수 있는 대상을 선택해 주세요.')
  await submit.click()
  await expect(team).toBeFocused()
  expect(await team.evaluate(el => (el as HTMLInputElement).validity.valueMissing)).toBe(true)
  expect(await data()).toEqual({})
  await expect(page.getByRole('status')).toBeEmpty()

  await group.getByRole('radio', { name: '나만 보기' }).check()
  await submit.click()
  await expect(page.getByRole('status')).toHaveText('저장한 공개 범위: 나만 보기')
  expect(await data()).toEqual({ visibility: 'private' })

  await page.getByRole('button', { name: '초기화' }).click()
  expect(await data()).toEqual({})
  await expect(page.getByRole('status')).toBeEmpty()
})
