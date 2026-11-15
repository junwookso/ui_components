import { readFile } from 'node:fs/promises'
import { expect, test } from '@playwright/test'
const story = (name: string) => `/iframe.html?id=components-uilist--${name}&viewMode=story`

test('list keeps native semantics and supports named keyboard actions and links', async ({ page }) => {
  await page.goto(story('with-actions'))
  const list = page.getByRole('list', { name: '검토할 업무' })
  await expect(list.getByRole('listitem')).toHaveCount(3)
  const action = page.getByRole('button', { name: '접근 권한 검토 상세 보기' })
  await page.keyboard.press('Tab')
  await expect(action).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('status')).toHaveText('접근 권한 검토 선택됨')
  const row = (await page.locator('.ui-list-row').first().boundingBox())!
  const button = (await action.boundingBox())!
  expect(Math.abs(row.x + row.width - button.x - button.width - 16)).toBeLessThan(1)
  await page.screenshot({ path: 'test-results/list-desktop.png' })
  await page.goto(story('links') + '&globals=theme:ocean')
  const link = page.getByRole('link', { name: '접근 권한 검토' })
  await expect(link).toBeVisible()
  await page.keyboard.press('Tab')
  await expect(link).toBeFocused()
  await expect(link).toHaveCSS('color', 'rgb(3, 105, 161)')
  await expect(link).toHaveCSS('outline-style', 'solid')
  await page.goto(story('custom-empty'))
  await expect(page.getByRole('list')).toHaveCount(0)
  await page.getByRole('button', { name: '예제 업무 추가' }).click()
  await expect(page.getByRole('listitem')).toHaveCount(3)
})

test('list wraps content and moves actions below content in narrow containers', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 })
  await page.goto(story('with-actions'))
  const content = (await page.locator('.ui-list-content').first().boundingBox())!
  const trailing = (await page.locator('.ui-list-trailing').first().boundingBox())!
  expect(trailing.y).toBeGreaterThanOrEqual(content.y + content.height)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({ path: 'test-results/list-mobile.png', fullPage: true })
  await page.goto(story('long-content'))
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await expect(page.locator('.ui-list-description')).toHaveCSS('white-space', 'pre-wrap')
  await page.goto(story('compact'))
  await expect(page.locator('.ui-list-row').first()).toHaveCSS('padding-top', '12px')
  await page.goto(story('borderless'))
  await expect(page.locator('.ui-list-items')).toHaveCSS('border-top-width', '0px')
  await expect(page.locator('.ui-list-row').nth(1)).toHaveCSS('border-top-width', '1px')
})

test('list styles ship to consumer apps and work without Preflight in RTL', async ({ page }) => {
  await page.goto('http://127.0.0.1:6008')
  await expect(page.getByRole('list', { name: '배포 목록' })).toBeVisible()
  await expect(page.locator('.ui-list-items')).toHaveCSS('border-top-width', '1px')
  await page.goto(story('with-actions'))
  const markup = await page.locator('.ui-list').evaluate(el => el.outerHTML)
  await page.goto('about:blank')
  await page.setContent(`<div dir="rtl" style="width: 768px">${markup}</div>`)
  await page.addStyleTag({ content: await readFile('.test-consumer/no-reset.css', 'utf8') })
  await expect(page.locator('.ui-list-items')).toHaveCSS('margin-top', '0px')
  await expect(page.locator('.ui-list-items')).toHaveCSS('padding-right', '0px')
  await expect(page.locator('.ui-list-row').first()).toHaveCSS('display', 'flex')
  const leading = (await page.locator('.ui-list-leading').first().boundingBox())!
  const trailing = (await page.locator('.ui-list-trailing').first().boundingBox())!
  expect(leading.x).toBeGreaterThan(trailing.x)
})
