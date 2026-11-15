import { readFile } from 'node:fs/promises'
import { expect, test } from '@playwright/test'
const story = (name: string) => `/iframe.html?id=layout-uifooter--${name}&viewMode=story`

test('footer exposes landmarks and keyboard-operable links and actions', async ({ page }) => {
  await page.goto(story('with-actions') + '&globals=theme:ocean')
  const footer = page.getByRole('contentinfo', { name: '하단 정보' })
  await expect(footer).toBeVisible()
  const link = footer.getByRole('navigation', { name: '관련 링크' }).getByRole('link', { name: '이용 안내' })
  await page.keyboard.press('Tab')
  await expect(link).toBeFocused()
  await expect(link).toHaveCSS('outline-style', 'solid')
  await link.hover()
  await expect(link).toHaveCSS('color', 'rgb(3, 105, 161)')
  await page.keyboard.press('Tab')
  await expect(footer.getByRole('button', { name: '지원 요청' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('status')).toHaveText('지원 요청을 선택했습니다.')
  await page.goto(story('page-layout'))
  await expect(page.getByRole('main')).toBeVisible()
  const main = (await page.getByRole('main').boundingBox())!
  const bottom = (await page.getByRole('contentinfo').boundingBox())!
  expect(bottom.y).toBeGreaterThanOrEqual(main.y + main.height)
  await page.screenshot({ path: 'test-results/footer-layout.png' })
})

test('footer wraps on small screens and shipped styles preserve RTL without Preflight', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 700 })
  await page.goto(story('with-links'))
  await expect(page.getByRole('contentinfo')).toBeVisible()
  const content = (await page.locator('.ui-footer-content').boundingBox())!
  const nav = (await page.getByRole('navigation').boundingBox())!
  expect(nav.y).toBeGreaterThanOrEqual(content.y + content.height)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({ path: 'test-results/footer-mobile.png' })
  await page.goto(story('long-text'))
  await expect(page.locator('.ui-footer-content')).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('http://127.0.0.1:6008')
  await expect(page.getByRole('contentinfo')).toContainText('배포 서비스 정보')
  const markup = await page.getByRole('contentinfo').evaluate(el => el.outerHTML)
  await page.goto('about:blank')
  await page.setContent(`<div dir="rtl">${markup}</div>`)
  await page.addStyleTag({ content: await readFile('.test-consumer/no-reset.css', 'utf8') })
  await expect(page.getByRole('contentinfo')).toHaveCSS('border-top-width', '1px')
  await expect(page.locator('.ui-footer-inner')).toHaveCSS('min-height', '64px')
  const text = (await page.locator('.ui-footer-content').boundingBox())!
  const navigation = (await page.getByRole('navigation').boundingBox())!
  expect(text.x).toBeGreaterThan(navigation.x)
})
