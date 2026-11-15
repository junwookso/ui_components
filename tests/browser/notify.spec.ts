import { readFile } from 'node:fs/promises'
import { expect, test } from '@playwright/test'
const story = '/iframe.html?id=actions-notify--playground&viewMode=story'

test('notify preserves focus and supports keyboard dismissal and urgency', async ({ page }) => {
  await page.goto(story)
  const trigger = page.getByRole('button', { name: '오류 표시', exact: true })
  await trigger.focus()
  await page.keyboard.press('Enter')
  await expect(trigger).toBeFocused()
  await expect(page.getByRole('alert')).toContainText('저장하지 못했습니다')
  const close = page.getByRole('button', { name: /저장하지 못했습니다.*알림 닫기/ })
  await close.focus()
  await expect(close).toHaveCSS('outline-style', 'solid')
  await page.keyboard.press('Enter')
  await expect(trigger).toBeFocused()
  await expect(page.getByRole('region', { name: '알림', exact: true })).toBeHidden()
  await page.getByRole('button', { name: '대기열 5개' }).click()
  await expect(page.locator('.ui-notify-card')).toHaveCount(3)
  await expect(page.getByText('대기 중인 알림 2개')).toBeVisible()
  await page.locator('.ui-notify-close').first().click()
  await expect(page.locator('.ui-notify-message').last()).toHaveText('작업 4 완료')
  await expect(page.locator('.ui-notify-close').first()).toBeFocused()
})

test('notify fits narrow screens and respects inherited theme and packaged CSS without reset', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 })
  await page.goto(story + '&globals=theme:ocean')
  await page.getByRole('button', { name: '긴 메시지', exact: true }).click()
  const card = page.locator('.ui-notify-card')
  await expect(card).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  const bounds = (await card.boundingBox())!
  expect(bounds.x).toBeGreaterThanOrEqual(16)
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(304)
  await expect(page.locator('.ui-notify-message')).toHaveCSS('white-space', 'pre-wrap')
  await page.screenshot({ path: 'test-results/notify-mobile.png', fullPage: true })
  const markup = await page.locator('.ui-notify-region').evaluate(el => el.outerHTML)
  await page.goto('about:blank')
  await page.setContent(`<div dir="rtl">${markup}</div>`)
  await page.addStyleTag({ content: await readFile('.test-consumer/no-reset.css', 'utf8') })
  await expect(page.locator('.ui-notify-list')).toHaveCSS('display', 'grid')
  await expect(page.locator('.ui-notify-list')).toHaveCSS('margin-top', '0px')
  await expect(page.locator('.ui-notify-close')).toHaveCSS('border-top-width', '1px')
  await expect(page.locator('.ui-notify-card')).toHaveCSS('border-right-width', '4px')
  await page.emulateMedia({ forcedColors: 'active' })
  await expect(page.locator('.ui-notify-card')).toHaveCSS('border-right-style', 'solid')
})

test('consumer build generates notify styles and auto-close pauses on hover', async ({ page }) => {
  await page.goto('http://127.0.0.1:6008')
  await page.getByRole('button', { name: '알림 표시', exact: true }).click()
  await expect(page.locator('.ui-notify-card')).toBeVisible()
  await expect(page.locator('.ui-notify-list')).toHaveCSS('display', 'grid')
  await expect(page.locator('.ui-notify-region')).toHaveCSS('position', 'fixed')
  await page.goto(story)
  await page.clock.install()
  await page.getByRole('button', { name: '저장 완료', exact: true }).click()
  await page.locator('.ui-notify-card').hover()
  await page.clock.fastForward(6000)
  await expect(page.locator('.ui-notify-card')).toHaveCount(1)
  await page.mouse.move(0, 0)
  await page.clock.fastForward(5000)
  await expect(page.locator('.ui-notify-card')).toHaveCount(0)
})

test('all six notification positions align to viewport edges in LTR and RTL', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  for (const position of ['top', 'top-left', 'top-right', 'bottom', 'bottom-left', 'bottom-right']) {
    const name = position === 'top' ? 'playground' : position
    await page.goto(`/iframe.html?id=actions-notify--${name}&viewMode=story`)
    await page.getByRole('button', { name: '주의 표시', exact: true }).click()
    const region = page.locator('.ui-notify-region')
    for (const dir of ['ltr', 'rtl']) {
      await page.locator('html').evaluate((el, direction) => { el.setAttribute('dir', direction) }, dir)
      const box = (await region.boundingBox())!
      const expectedX = position.endsWith('-left') ? 16 : position.endsWith('-right') ? 1280 - 16 - box.width : (1280 - box.width) / 2
      expect(Math.abs(box.x - expectedX)).toBeLessThan(1)
      expect(Math.abs(position.startsWith('top') ? box.y - 16 : 800 - box.y - box.height - 16)).toBeLessThan(1)
    }
    await page.setViewportSize({ width: 320, height: 640 })
    const narrow = (await region.boundingBox())!
    expect(narrow.x).toBeGreaterThanOrEqual(16)
    expect(narrow.x + narrow.width).toBeLessThanOrEqual(304)
    await page.setViewportSize({ width: 1280, height: 800 })
    if (position === 'top') await page.screenshot({ path: 'test-results/notify-top.png' })
  }
})
