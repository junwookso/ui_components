import { expect, test } from '@playwright/test'
const story = (name = 'project-form') => `/iframe.html?id=components-uidialog--${name}&viewMode=story`

test('payload, validation, result callback, fresh state and focus restoration', async ({ page }) => {
  await page.goto(story())
  const trigger = page.getByRole('button', { name: '프로젝트 편집 열기' })
  await trigger.click()
  const dialog = page.getByRole('dialog', { name: '프로젝트 편집' })
  const name = dialog.getByRole('textbox', { name: '프로젝트 이름' })
  await expect(name).toBeFocused()
  await expect(name).toHaveValue('사내 업무 포털')
  await name.fill(' ')
  await dialog.getByRole('button', { name: '완료', exact: true }).click()
  await expect(dialog.getByRole('alert')).toBeVisible()
  await name.fill('새 이름')
  await name.press('Enter')
  await expect(dialog).toHaveCount(0)
  await expect(page.getByRole('status')).toHaveText('완료: 새 이름')
  await expect(trigger).toBeFocused()
  await trigger.click()
  await expect(name).toHaveValue('새 이름')
  await name.fill('취소할 값')
  await page.getByRole('button', { name: '취소', exact: true }).click()
  await expect(page.getByRole('status')).toHaveText('취소: cancel')
  await trigger.click()
  await expect(name).toHaveValue('새 이름')
  await page.keyboard.press('Escape')
  await expect(page.getByRole('status')).toHaveText('취소: escape')
  await expect(trigger).toBeFocused()
})

test('backdrop defaults to dismiss and can be disabled; focus stays modal', async ({ page }) => {
  for (const locked of [false, true]) {
    await page.goto(story(locked ? 'backdrop-locked' : 'project-form'))
    await page.getByRole('button', { name: '프로젝트 편집 열기' }).click()
    await page.mouse.click(2, 2)
    if (!locked) {
      await expect(page.getByRole('dialog')).toHaveCount(0)
      await expect(page.getByRole('status')).toHaveText('취소: backdrop')
    } else {
      const dialog = page.getByRole('dialog')
      await expect(dialog).toBeVisible()
      await page.getByRole('button', { name: '완료', exact: true }).focus()
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      expect(await dialog.evaluate(el => el.contains(document.activeElement))).toBe(true)
      await page.keyboard.press('Escape')
      await expect(dialog).toHaveCount(0)
    }
  }
})
