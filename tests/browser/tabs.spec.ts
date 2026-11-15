import { readFile } from 'node:fs/promises'
import { expect, test } from '@playwright/test'

const story = (name: string) => `/iframe.html?id=components-uitabs--${name}&viewMode=story`

for (const [orientation, next, previous] of [['horizontal', 'ArrowRight', 'ArrowLeft'], ['vertical', 'ArrowDown', 'ArrowUp']] as const) {
  test(`${orientation}: roving focus, explicit activation, panel state and icon alignment`, async ({ page }) => {
    await page.goto(story(orientation))
    await expect(page.getByRole('tablist')).toHaveAttribute('aria-orientation', orientation)
    const general = page.getByRole('tab', { name: '기본 정보' })
    const notifications = page.getByRole('tab', { name: '알림 설정' })
    const history = page.getByRole('tab', { name: '변경 이력' })
    const name = page.getByRole('textbox', { name: '프로젝트 이름' })
    await name.fill('작성 중')
    await general.focus()
    await page.keyboard.press(next)
    await expect(notifications).toBeFocused()
    await expect(general).toHaveAttribute('aria-selected', 'true')
    await page.keyboard.press('Enter')
    await expect(notifications).toHaveAttribute('aria-selected', 'true')
    await expect(page.getByRole('tabpanel', { name: '알림 설정' })).toBeVisible()
    await page.keyboard.press(next)
    await expect(history).toBeFocused()
    await page.keyboard.press(next)
    await expect(general).toBeFocused()
    await page.keyboard.press('Space')
    await expect(name).toHaveValue('작성 중')
    await page.keyboard.press(previous)
    await expect(history).toBeFocused()
    await page.keyboard.press('Home')
    await expect(general).toBeFocused()
    await page.keyboard.press('End')
    await expect(history).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(page.getByRole('tabpanel', { name: '기본 정보' })).toBeFocused()
    await page.keyboard.press('Shift+Tab')
    await expect(general).toBeFocused()
    await expect(page.getByRole('tab', { name: '접근 권한' })).toBeDisabled()
    const iconBox = (await general.locator('svg').boundingBox())!
    const textBox = (await general.locator('span').last().boundingBox())!
    expect(iconBox.width).toBe(16)
    expect(iconBox.x + iconBox.width).toBeLessThanOrEqual(textBox.x)
    expect(Math.abs(iconBox.y + iconBox.height / 2 - textBox.y - textBox.height / 2)).toBeLessThan(1)
    await expect(general).toHaveCSS('outline-width', '2px')
    await expect(general).toHaveCSS('background-color', 'rgb(255, 255, 255)')
    await expect(notifications).toHaveCSS('background-color', 'rgb(244, 244, 245)')
    await expect(notifications).toBeEnabled()
    const tabBox = (await general.boundingBox())!
    const panelBox = (await page.getByRole('tabpanel', { name: '기본 정보' }).boundingBox())!
    if (orientation === 'horizontal') {
      expect(Math.abs(tabBox.y + tabBox.height - panelBox.y - 1)).toBeLessThan(1)
      await expect(general).toHaveCSS('border-bottom-color', 'rgb(255, 255, 255)')
    } else {
      expect(Math.abs(tabBox.x + tabBox.width - panelBox.x - 1)).toBeLessThan(1)
      await expect(general).toHaveCSS('border-right-color', 'rgb(255, 255, 255)')
    }
    await page.screenshot({ path: `test-results/tabs-folder-${orientation}.png`, fullPage: true })
  })
}

test('horizontal lists scroll on small screens and selection follows theme tokens', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 })
  await page.goto(story('overflow'))
  const list = page.getByRole('tablist')
  expect(await list.evaluate(el => el.scrollWidth > el.clientWidth)).toBe(true)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.getByRole('tab').first().focus()
  await page.keyboard.press('End')
  await expect(page.getByRole('tab', { name: '비용 및 사용량' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('tabpanel', { name: '비용 및 사용량' })).toBeVisible()
  await page.goto(story('vertical') + '&globals=theme:ocean')
  await expect(page.getByRole('tab', { name: '기본 정보' })).toHaveCSS('background-color', 'rgb(255, 255, 255)')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test('tabs keep layout, hidden panels and state indicators without reset', async ({ page }) => {
  await page.goto(story('horizontal'))
  await expect(page.getByRole('tablist')).toBeVisible()
  const markup = await page.locator('.ui-tabs').evaluate(el => el.outerHTML)
  await page.goto('about:blank')
  await page.setContent(markup)
  await page.addStyleTag({ content: await readFile('.test-consumer/no-reset.css', 'utf8') })
  const selected = page.getByRole('tab', { selected: true })
  await expect(selected).toHaveCSS('min-height', '40px')
  await expect(selected).toHaveCSS('font-size', '14px')
  await expect(page.getByRole('tabpanel')).toHaveCount(1)
  await expect(page.getByRole('tabpanel')).toHaveCSS('border-top-width', '1px')
  await expect(selected).toHaveCSS('border-bottom-color', 'rgb(255, 255, 255)')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(selected).toHaveCSS('transition-duration', '0s')
})
