import { expect, test } from '@playwright/test'

const story = (id: string) => `/iframe.html?id=components-${id}&viewMode=story`

test('row menu skips disabled actions and returns focus on Escape and selection', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 600 })
  await page.goto(story('uidropdownmenu--playground'))
  const trigger = page.getByRole('button', { name: '요청 더보기' })
  await trigger.press('ArrowDown')
  await expect(page.getByRole('menuitem', { name: '수정' })).toBeFocused()
  await expect(page.getByRole('menuitem', { name: '복제' })).toBeDisabled()
  await page.keyboard.press('ArrowDown')
  await expect(page.getByRole('menuitem', { name: '삭제' })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('menu')).toHaveCount(0)
  await expect(trigger).toBeFocused()
  await trigger.press('ArrowDown')
  await page.keyboard.press('Enter')
  await expect(page.getByRole('status')).toHaveText('수정')
  await expect(trigger).toBeFocused()
  await page.goto(story('uidropdownmenu--disabled'))
  await expect(page.getByRole('button', { name: '요청 더보기' })).toBeDisabled()
})

test('numeric fields distinguish zero from empty and use native range and step validation', async ({ page }) => {
  await page.goto(story('uinumberinput--form'))
  const input = page.getByRole('spinbutton', { name: '작업 시간' })
  const save = page.getByRole('button', { name: '저장' })
  await save.click()
  await expect(input).toBeFocused()
  await input.fill('0.1')
  expect(await input.evaluate(el => (el as HTMLInputElement).validity.stepMismatch)).toBe(true)
  await input.fill('100.25')
  expect(await input.evaluate(el => (el as HTMLInputElement).validity.rangeOverflow)).toBe(true)
  for (const value of ['0', '2.25']) {
    await input.fill(value)
    await save.click()
    await expect(page.getByRole('status')).toHaveText(value)
  }
  await input.fill('')
  expect(await input.evaluate(el => (el as HTMLInputElement).validity.valueMissing)).toBe(true)
  await page.goto(story('uinumberinput--readonly'))
  await expect(input).not.toBeEditable()
  await expect(input).toHaveValue('12.5')
})

test('file picker validates size and type, removes files, and delegates retries', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 650 })
  await page.goto(story('uifileupload--playground'))
  const input = page.getByLabel('첨부 문서')
  await expect(input).toHaveAccessibleDescription('허용 형식 .pdf,image/* · 파일당 최대 1,024바이트')
  const chooser = page.waitForEvent('filechooser')
  await input.click()
  await (await chooser).setFiles([
    { name: 'small.pdf', mimeType: 'application/pdf', buffer: Buffer.from('demo') },
    { name: 'photo.png', mimeType: 'image/png', buffer: Buffer.from('demo') },
    { name: 'big.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(1025) },
    { name: 'bad.txt', mimeType: 'text/plain', buffer: Buffer.from('demo') },
  ])
  await expect(page.getByRole('list', { name: '선택한 파일' }).getByRole('listitem')).toHaveCount(2)
  await expect(page.getByText('2개 선택')).toBeVisible()
  await expect(page.getByRole('status')).toContainText('big.pdf: 파일 크기 제한을 초과했습니다.')
  await expect(page.getByRole('status')).toContainText('bad.txt: 허용되지 않는 파일 형식입니다.')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.getByRole('button', { name: 'small.pdf 제거' }).click()
  await expect(input).toBeFocused()
  await expect(page.getByRole('listitem')).toHaveCount(1)

  await page.goto(story('uifileupload--retry'))
  await expect(page.getByText('문서를 첨부하지 못했습니다.')).toBeVisible()
  await page.getByRole('button', { name: '검토서.pdf 다시 시도' }).click()
  await expect(page.getByText('검토서.pdf 첨부를 완료했습니다.')).toBeVisible()
  await expect(page.getByText('문서를 첨부하지 못했습니다.')).toHaveCount(0)
})
