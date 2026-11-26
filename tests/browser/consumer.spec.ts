import { expect, test } from '@playwright/test'
import { readFile } from 'node:fs/promises'

test('consumer builds package classes, service grid utilities and theme in one stylesheet', async ({ page }) => {
  await page.goto('http://127.0.0.1:6008')
  const grid = page.getByTestId('grid')
  await expect(page.locator('body')).toHaveCSS('font-family', /^"Pretendard Variable",/)
  const variableFontRegistered = await page.evaluate(() => Array.from(document.fonts).some(
    font => font.family.replaceAll('"', '') === 'Pretendard Variable' && font.weight === '45 920',
  ))
  expect(variableFontRegistered).toBe(true)
  await expect(grid).toHaveCSS('display', 'grid')
  await expect(grid).toHaveCSS('gap', '16px')
  const columns = grid.locator(':scope > div')
  await expect(columns.first()).toHaveCSS('grid-column', 'span 6 / span 6')
  await expect(page.getByRole('button', { name: '저장', exact: true })).toHaveCSS('background-color', 'rgb(3, 105, 161)')
  await expect(page.getByRole('button', { name: '미리보기' })).toHaveCSS('height', '32px')
  await expect(page.getByRole('button', { name: '미리보기' })).toHaveCSS('font-family', /^"Pretendard Variable",/)
  await expect(page.getByRole('textbox', { name: '이름', exact: true })).toHaveCSS('height', '36px')
  await expect(page.getByRole('heading', { level: 1 })).toHaveCSS('font-size', '24px')
  await expect(page.locator('body')).toHaveCSS('margin', '0px')
  await page.setViewportSize({ width: 375, height: 800 })
  await expect(columns.first()).toHaveCSS('grid-column', 'span 12 / span 12')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test('packaged text and border colors follow the document color mode without Preflight', async ({ page }) => {
  await page.setContent(`
    <section class="ui-card border border-border bg-surface text-foreground" aria-label="테마 확인">
      <p class="ui-text-muted">마지막 동기화 10:30</p>
      <input type="date" class="ui-input ui-date-picker" aria-label="날짜">
      <input type="time" class="ui-input ui-time-picker" aria-label="시간">
      <select class="ui-input ui-select" aria-label="상태"><option>완료</option></select>
    </section>
  `)
  await page.addStyleTag({ content: await readFile('.test-consumer/no-reset.css', 'utf8') })
  const card = page.getByRole('region', { name: '테마 확인' })
  const metadata = card.getByText('마지막 동기화 10:30')
  await expect(card).toHaveCSS('color', 'rgb(31, 35, 40)')
  await expect(card).toHaveCSS('border-top-color', 'rgb(209, 217, 224)')
  await expect(metadata).toHaveCSS('color', 'rgb(89, 99, 110)')
  await expect(page.getByLabel('상태')).toHaveCSS('border-top-color', 'rgb(209, 217, 224)')
  await page.locator('html').evaluate(element => element.setAttribute('data-ui-color-mode', 'dark'))

  await expect(card).toHaveCSS('background-color', 'rgb(24, 24, 27)')
  await expect(card).toHaveCSS('color', 'rgb(240, 246, 252)')
  await expect(card).toHaveCSS('border-top-color', 'rgb(61, 68, 77)')
  await expect(metadata).toHaveCSS('color', 'rgb(145, 152, 161)')
  await expect(page.getByLabel('상태')).toHaveCSS('border-top-color', 'rgb(61, 68, 77)')
  for (const label of ['날짜', '시간', '상태']) {
    await expect(page.getByLabel(label)).toHaveCSS('color-scheme', 'dark')
  }
})
