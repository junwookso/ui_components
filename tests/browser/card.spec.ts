import { readFile } from 'node:fs/promises'
import { expect, test } from '@playwright/test'

const story = (name: string) => `/iframe.html?id=components-uicard--${name}&viewMode=story`

test('card actions align right, retain hierarchy, and wrap without overflow', async ({ page }) => {
  await page.goto(story('action-hierarchy'))
  const card = page.getByRole('region', { name: '변경 사항 검토' })
  await expect(card).toBeVisible()
  const buttons = card.getByRole('button')
  await expect(buttons).toHaveText(['취소', '미리보기', '저장하기'])
  await expect(buttons.nth(0)).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')
  await expect(buttons.nth(1)).toHaveCSS('border-top-width', '1px')
  await expect(buttons.nth(2)).toHaveCSS('background-color', 'rgb(24, 24, 27)')
  const footerBox = (await card.locator('footer').boundingBox())!
  const lastBox = (await buttons.last().boundingBox())!
  expect(Math.abs(footerBox.x + footerBox.width - 16 - lastBox.x - lastBox.width)).toBeLessThan(1)
  await buttons.first().focus()
  await page.keyboard.press('Tab')
  await expect(buttons.nth(1)).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(buttons.nth(2)).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('status')).toHaveText('변경 사항을 저장했습니다.')
  await page.setViewportSize({ width: 320, height: 800 })
  const cardBox = (await card.boundingBox())!
  const firstBox = (await buttons.first().boundingBox())!
  const mobileLastBox = (await buttons.last().boundingBox())!
  expect(mobileLastBox.y).toBeGreaterThan(firstBox.y)
  for (const button of await buttons.all()) {
    const box = (await button.boundingBox())!
    expect(box.x).toBeGreaterThanOrEqual(cardBox.x)
    expect(box.x + box.width).toBeLessThanOrEqual(cardBox.x + cardBox.width)
  }
})

test('form card submits, validates, and cancels without accidental submission', async ({ page }) => {
  await page.goto(story('with-form'))
  const name = page.getByRole('textbox', { name: '프로젝트 이름' })
  await name.fill('업무 포털')
  await page.getByRole('button', { name: '저장하기' }).click()
  await expect(page.getByRole('status')).toHaveText('업무 포털의 정보를 저장했습니다.')
  await page.getByRole('button', { name: '취소', exact: true }).click()
  await expect(name).toHaveValue('사내 서비스 UI')
  await expect(page.getByRole('status')).toHaveText('변경을 취소했습니다.')
  await name.fill('')
  await page.getByRole('button', { name: '저장하기' }).click()
  expect(await name.evaluate(el => (el as HTMLInputElement).validity.valueMissing)).toBe(true)
  await expect(page.getByRole('status')).toBeEmpty()
})

test('card styles and semantic headings work without reset and follow service colors', async ({ page }) => {
  await page.goto(story('custom-title'))
  await expect(page.getByRole('heading', { level: 3 })).toHaveText('승인 요청 (2건)')
  const markup = await page.locator('.ui-card').evaluate(el => el.outerHTML)
  await page.goto('about:blank')
  await page.setContent(`<h1>Outside</h1>${markup}`)
  await page.addStyleTag({ content: await readFile('.test-consumer/no-reset.css', 'utf8') })
  await expect(page.locator('.ui-card')).toHaveCSS('border-top-width', '1px')
  await expect(page.locator('.ui-card-header')).toHaveCSS('border-bottom-width', '0px')
  await expect(page.locator('.ui-card-actions')).toHaveCSS('border-top-width', '0px')
  await expect(page.locator('.ui-card-title')).toHaveCSS('font-size', '16px')
  await expect(page.locator('.ui-card-title')).toHaveCSS('margin-top', '0px')
  await expect(page.locator('h1')).toHaveCSS('font-size', '32px')
  await page.addStyleTag({ content: ':root { --ui-background: #f0f9ff; --ui-border: #0369a1; }' })
  await expect(page.locator('.ui-card')).toHaveCSS('background-color', 'rgb(240, 249, 255)')
  await expect(page.locator('.ui-card')).toHaveCSS('border-top-color', 'rgb(3, 105, 161)')
  await page.goto(story('without-actions'))
  await expect(page.locator('.ui-card')).toBeVisible()
  await expect(page.locator('.ui-card-actions')).toHaveCount(0)
})
