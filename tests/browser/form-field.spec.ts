import { expect, test } from '@playwright/test'

const story = (name: string) => `/iframe.html?id=components-uiformfield--${name}&viewMode=story`

test('labels focus controls and validation feedback follows the form state', async ({ page }) => {
  await page.goto(story('form'))
  const title = page.getByRole('textbox', { name: '업무 제목', exact: true })
  const team = page.getByRole('combobox', { name: '담당 팀', exact: true })
  const save = page.getByRole('button', { name: '저장' })
  await expect(title).toHaveJSProperty('required', true)
  await expect(team).toHaveJSProperty('required', true)
  await expect(title).toHaveAccessibleDescription('목록에 표시할 이름입니다.')
  await page.locator('label').filter({ hasText: '업무 제목' }).click()
  await expect(title).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(team).toBeFocused()

  await save.click()
  await expect(title).toHaveAttribute('aria-invalid', 'true')
  await expect(title).toHaveAccessibleDescription('업무 제목을 입력해 주세요. 목록에 표시할 이름입니다.')
  await expect(team).toHaveAttribute('aria-invalid', 'true')
  await expect(team).toHaveCSS('border-top-color', 'rgb(185, 28, 28)')
  await expect(team).toHaveAccessibleDescription('담당 팀을 선택해 주세요. 요청을 처리할 팀입니다.')
  await expect(page.getByRole('status')).toBeEmpty()

  await title.fill('운영 요청')
  await team.selectOption('operations')
  await expect(title).not.toHaveAttribute('aria-invalid')
  await expect(team).not.toHaveAttribute('aria-invalid')
  await expect(team).toHaveAccessibleDescription('요청을 처리할 팀입니다.')
  await save.click()
  await expect(page.getByRole('status')).toHaveText('업무를 저장했습니다.')
  const data = await page.locator('form').evaluate(el => Object.fromEntries(new FormData(el as HTMLFormElement)))
  expect(data).toEqual({ title: '운영 요청', team: 'operations' })
})
