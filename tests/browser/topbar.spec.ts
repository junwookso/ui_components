import { readFile } from 'node:fs/promises'
import { expect, test } from '@playwright/test'
const story = (name: string) => `/iframe.html?id=layout-uitopbar--${name}&viewMode=story`

test('topbar supports named landmarks, keyboard navigation and search actions', async ({ page }) => {
  await page.goto(story('workspace') + '&globals=theme:ocean')
  const bar = page.getByRole('banner', { name: '상단 바' })
  await expect(bar).toBeVisible()
  const menu = bar.getByRole('button', { name: '메뉴', exact: true })
  await page.keyboard.press('Tab')
  await expect(menu).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(menu).toHaveAttribute('aria-expanded', 'true')
  await expect(page.getByRole('navigation', { name: '추가 메뉴' })).toBeVisible()
  await page.keyboard.press('Tab')
  await expect(bar.getByRole('link', { name: '업무 포털' })).toBeFocused()
  const nav = bar.getByRole('navigation', { name: '주요 메뉴' })
  await page.keyboard.press('Tab')
  await expect(nav.getByRole('link', { name: '내 업무' })).toBeFocused()
  await expect(nav.getByRole('link', { name: '내 업무' })).toHaveCSS('color', 'rgb(3, 105, 161)')
  await nav.getByRole('link', { name: '프로젝트' }).click()
  await expect(nav.getByRole('link', { name: '프로젝트' })).toHaveAttribute('aria-current', 'page')
  const search = bar.getByRole('searchbox', { name: '업무 검색어' })
  await search.fill('권한')
  await search.press('Enter')
  await expect(page.getByRole('status')).toHaveText('권한 검색 요청')
  await page.screenshot({ path: 'test-results/topbar-desktop.png' })
})

test('topbar wraps without hiding controls and sticky follows its scrolling container', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 })
  await page.goto(story('workspace'))
  await expect(page.getByRole('searchbox')).toBeVisible()
  await expect(page.getByRole('button', { name: '김민수' })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  const start = (await page.locator('.ui-topbar-start').boundingBox())!
  const nav = (await page.locator('.ui-topbar-navigation').boundingBox())!
  expect(nav.y).toBeGreaterThanOrEqual(start.y + start.height)
  await page.screenshot({ path: 'test-results/topbar-mobile.png', fullPage: true })
  await page.goto(story('long-title'))
  await expect(page.locator('.ui-topbar-brand')).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.goto(story('sticky'))
  const container = page.getByTestId('scroll-container')
  await expect(page.getByRole('banner')).toBeVisible()
  const before = (await page.getByRole('banner').boundingBox())!
  await container.evaluate(el => { el.scrollTop = 250 })
  const after = (await page.getByRole('banner').boundingBox())!
  expect(Math.abs(after.y - before.y)).toBeLessThan(1)
  expect(await container.evaluate(el => el.scrollTop)).toBe(250)
})

test('packaged topbar styling works without reset and in RTL', async ({ page }) => {
  await page.goto('http://127.0.0.1:6008')
  await expect(page.getByRole('banner')).toContainText('배포 포털')
  await expect(page.getByRole('banner')).toHaveCSS('border-bottom-width', '1px')
  await page.goto(story('workspace'))
  const markup = await page.getByRole('banner').evaluate(el => el.outerHTML)
  await page.goto('about:blank')
  await page.setContent(`<div dir="rtl">${markup}</div>`)
  await page.addStyleTag({ content: await readFile('.test-consumer/no-reset.css', 'utf8') })
  await expect(page.locator('.ui-topbar-inner')).toHaveCSS('min-height', '64px')
  await expect(page.locator('.ui-topbar-inner')).toHaveCSS('display', 'flex')
  const start = (await page.locator('.ui-topbar-start').boundingBox())!
  const actions = (await page.locator('.ui-topbar-actions').boundingBox())!
  expect(start.x).toBeGreaterThan(actions.x)
})
