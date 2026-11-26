import { expect, test } from '@playwright/test'

const story = (name: string) => `/iframe.html?id=components-uitabs--${name}&viewMode=story`

for (const [orientation, next, previous] of [['horizontal', 'ArrowRight', 'ArrowLeft'], ['vertical', 'ArrowDown', 'ArrowUp']] as const) {
  test(`${orientation}: roving focus, explicit activation, panel state and icon alignment`, async ({ page }) => {
    await page.goto(story(orientation))
    const tablist = page.getByRole('tablist')
    await expect(tablist).toHaveAttribute('aria-orientation', orientation)
    await expect(tablist).toHaveCSS('gap', '2px')
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
    await expect(notifications).toHaveCSS('color', 'rgb(31, 35, 40)')
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
  })
}
