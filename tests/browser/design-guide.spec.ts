import { expect, test } from '@playwright/test'

const story = '/iframe.html?id=foundations-design-guide--workplace&viewMode=story'

for (const theme of ['neutral', 'ocean']) {
  test(`${theme}: surfaces and enabled content have appropriate contrast`, async ({ page }) => {
    await page.goto(`${story}&globals=theme:${theme}`)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('서비스 설정')
    await expect(page.locator('.ui-preview')).toHaveCSS('background-color', 'rgb(244, 244, 245)')
    await expect(page.locator('.ui-card').first()).toHaveCSS('background-color', 'rgb(255, 255, 255)')
    await expect(page.locator('.ui-card-header').first()).toHaveCSS('border-bottom-width', '0px')
    const input = page.locator('#guide-name')
    await expect(input).toHaveCSS('border-top-color', 'rgb(209, 217, 224)')
    await input.focus()
    await expect(input).toHaveCSS('border-top-width', '2px')
    await expect(input).toHaveCSS('border-top-color', 'rgb(30, 64, 175)')
    const ratios = await page.evaluate(() => {
      const ctx = document.createElement('canvas').getContext('2d')!
      function rgb(color: string) {
        ctx.clearRect(0, 0, 1, 1)
        ctx.fillStyle = color
        ctx.fillRect(0, 0, 1, 1)
        return Array.from(ctx.getImageData(0, 0, 1, 1).data).slice(0, 3)
      }
      function luminance(color: string) {
        return rgb(color).map(v => v / 255).map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
          .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i]!, 0)
      }
      function contrast(a: string, b: string) {
        const values = [luminance(a), luminance(b)].sort((a, b) => b - a)
        return (values[0]! + 0.05) / (values[1]! + 0.05)
      }
      const styles = (selector: string) => getComputedStyle(document.querySelector(selector)!)
      const input = styles('#guide-name')
      const preview = styles('.ui-preview')
      const muted = styles('.design-guide-heading p')
      const button = styles('button[type="submit"]')
      return {
        primary: contrast(button.color, button.backgroundColor),
        input: contrast(input.color, input.backgroundColor),
        focus: contrast(input.borderTopColor, input.backgroundColor),
        help: contrast(muted.color, preview.backgroundColor),
        statuses: ['success', 'warning', 'info'].map(name => {
          const style = styles(`.design-feedback-${name}`)
          return contrast(style.color, style.backgroundColor)
        }),
      }
    })
    expect(ratios.primary).toBeGreaterThanOrEqual(4.5)
    expect(ratios.input).toBeGreaterThanOrEqual(4.5)
    expect(ratios.help).toBeGreaterThanOrEqual(4.5)
    expect(ratios.focus).toBeGreaterThanOrEqual(3)
    ratios.statuses.forEach(value => expect(value).toBeGreaterThanOrEqual(4.5))
    await page.setViewportSize({ width: 375, height: 900 })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  })
}

test('nested primary, surface and border overrides apply across components', async ({ page }) => {
  await page.goto(story)
  await page.locator('.ui-preview').evaluate(el => {
    const element = el as HTMLElement
    element.style.setProperty('--ui-primary', '#0369a1')
    element.style.setProperty('--ui-surface', '#f0f9ff')
    element.style.setProperty('--ui-border', '#64748b')
  })
  const save = page.getByRole('button', { name: '저장하기', exact: true })
  await expect(save).toHaveCSS('background-color', 'rgb(3, 105, 161)')
  await save.hover()
  await expect(save).not.toHaveCSS('background-color', 'rgb(3, 105, 161)')
  await expect(page.locator('.ui-card').first()).toHaveCSS('background-color', 'rgb(240, 249, 255)')
  await expect(page.locator('.ui-card').first()).toHaveCSS('border-top-color', 'rgb(100, 116, 139)')
  await expect(page.locator('#guide-name')).toHaveCSS('background-color', 'rgb(240, 249, 255)')
  await expect(page.locator('#guide-name')).toHaveCSS('border-top-color', 'rgb(100, 116, 139)')
  const previewButton = page.getByRole('button', { name: '미리보기', exact: true })
  await expect(previewButton).toHaveCSS('background-color', 'rgb(240, 249, 255)')
  await expect(previewButton).toHaveCSS('border-top-color', 'rgb(100, 116, 139)')
})
