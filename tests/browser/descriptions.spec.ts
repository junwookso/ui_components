import { readFile } from 'node:fs/promises'
import { expect, test } from '@playwright/test'
const story = (name: string) => `/iframe.html?id=components-uidescriptions--${name}&viewMode=story`

test('details keep terms and values aligned and stack within narrow containers', async ({ page }) => {
  await page.goto(story('playground'))
  const section = page.getByRole('region', { name: '직원 기본 정보' })
  await expect(section.getByRole('heading', { level: 2 })).toBeVisible()
  const term = section.locator('dt').first()
  const detail = section.locator('dd').first()
  const t = (await term.boundingBox())!
  const d = (await detail.boundingBox())!
  expect(d.x).toBeGreaterThan(t.x)
  expect(d.y).toBe(t.y)
  await expect(section.locator('dl')).toHaveCSS('border-top-width', '1px')
  await expect(term).toHaveCSS('background-color', 'rgb(244, 244, 245)')
  await expect(section.locator('dd').nth(4)).toHaveText('0')
  await expect(section.locator('dd').nth(5)).toHaveText('아니요')
  await page.screenshot({ path: 'test-results/descriptions-desktop.png', fullPage: true })
  await page.goto(story('narrow-container'))
  const narrowTerm = (await page.locator('dt').first().boundingBox())!
  const narrowDetail = (await page.locator('dd').first().boundingBox())!
  expect(narrowDetail.x).toBe(narrowTerm.x)
  expect(narrowDetail.y).toBeGreaterThanOrEqual(narrowTerm.y + narrowTerm.height)
  await page.setViewportSize({ width: 320, height: 800 })
  await page.goto(story('long-values'))
  await expect(page.locator('dd').first()).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await expect(page.locator('dd').last()).toHaveCSS('white-space', 'pre-wrap')
  await page.screenshot({ path: 'test-results/descriptions-mobile.png', fullPage: true })
})

test('custom content, vertical and borderless variants retain readable semantics', async ({ page }) => {
  await page.goto(story('custom-values') + '&globals=theme:ocean')
  await expect(page.locator('dd .ui-chip')).toHaveText('재직')
  const link = page.getByRole('link', { name: 'minsu@company.example' })
  await link.focus()
  await expect(link).toBeFocused()
  await expect(link).toHaveAttribute('href', 'mailto:minsu@company.example')
  await expect(page.locator('dt').first()).toHaveCSS('background-color', 'rgb(224, 242, 254)')
  await page.goto(story('vertical'))
  const t = (await page.locator('dt').first().boundingBox())!
  const d = (await page.locator('dd').first().boundingBox())!
  expect(d.y).toBeGreaterThan(t.y)
  await page.goto(story('borderless'))
  await expect(page.locator('dl')).toHaveCSS('border-top-width', '0px')
  await expect(page.locator('dt').first()).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')
  await page.goto(story('empty'))
  await expect(page.getByText('표시할 정보가 없습니다.')).toBeVisible()
  await expect(page.locator('dl')).toHaveCount(0)
})

test('packaged styles work without Preflight and retain RTL order', async ({ page }) => {
  await page.goto(story('playground'))
  await expect(page.locator('dl')).toBeVisible()
  const markup = await page.locator('.ui-descriptions').evaluate(el => el.outerHTML)
  await page.goto('about:blank')
  await page.setContent(`<div dir="rtl">${markup}</div>`)
  await page.addStyleTag({ content: await readFile('.test-consumer/no-reset.css', 'utf8') })
  await expect(page.locator('dl')).toHaveCSS('margin-top', '0px')
  await expect(page.locator('dd').first()).toHaveCSS('margin-inline-start', '0px')
  await expect(page.locator('dt').first()).toHaveCSS('font-size', '14px')
  const t = (await page.locator('dt').first().boundingBox())!
  const d = (await page.locator('dd').first().boundingBox())!
  expect(t.x).toBeGreaterThan(d.x)
  await page.emulateMedia({ forcedColors: 'active' })
  await expect(page.locator('dl')).toHaveCSS('border-top-style', 'solid')
  await page.goto('http://127.0.0.1:6008')
  await expect(page.getByRole('region', { name: '배포 상세 정보' }).locator('dd')).toHaveText('개발팀')
  await expect(page.locator('.ui-descriptions-row')).toHaveCSS('display', 'grid')
})
