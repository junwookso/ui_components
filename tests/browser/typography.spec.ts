import { readFile } from 'node:fs/promises'
import { expect, test } from '@playwright/test'

const scale = [
  ['h1', 24, 32, 600], ['h2', 20, 28, 600], ['h3', 18, 26, 600],
  ['h4', 16, 24, 600], ['h5', 14, 20, 600], ['h6', 14, 20, 500],
  ['title', 16, 24, 600], ['subtitle', 14, 20, 400], ['body', 14, 22, 400],
  ['body-lg', 16, 26, 400], ['caption', 12, 18, 400], ['label', 14, 20, 500],
] as const

for (const reset of [false, true]) {
  test(`type scale is explicit and scales with rem (reset=${reset})`, async ({ page }) => {
    await page.goto('about:blank')
    await page.setContent(`<main style="color:rgb(10, 20, 30)">${scale.map(([name]) => `<h2 class="ui-${name}" data-sample="${name}">프로젝트 Project 0123456789</h2>`).join('')}</main>`)
    if (reset) await page.addStyleTag({ content: await readFile('.test-consumer/reset.css', 'utf8') })
    await page.addStyleTag({ content: await readFile('.test-consumer/no-reset.css', 'utf8') })
    for (const [name, size, line, weight] of scale) {
      const el = page.locator(`[data-sample="${name}"]`)
      await expect(el).toHaveCSS('font-size', `${size}px`)
      await expect(el).toHaveCSS('line-height', `${line}px`)
      await expect(el).toHaveCSS('font-weight', `${weight}`)
      await expect(el).toHaveCSS('margin', '0px')
      await expect(el).toHaveCSS('color', 'rgb(10, 20, 30)')
    }
    await page.evaluate(() => { document.documentElement.style.fontSize = '20px' })
    for (const [name, size, line] of scale) {
      await expect(page.locator(`[data-sample="${name}"]`)).toHaveCSS('font-size', `${size * 1.25}px`)
      await expect(page.locator(`[data-sample="${name}"]`)).toHaveCSS('line-height', `${line * 1.25}px`)
    }
  })
}

for (const theme of ['neutral', 'ocean']) {
  test(`workplace hierarchy, theme and narrow wrapping (${theme})`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    await page.goto(`/iframe.html?id=foundations-typography--workplace&viewMode=story&globals=theme:${theme}`)
    const heading = page.getByRole('heading', { level: 1 })
    await expect(heading).toHaveCSS('color', 'rgb(24, 24, 27)')
    await expect(page.locator('.ui-subtitle').first()).toHaveCSS('color', 'rgb(82, 82, 91)')
    expect((await heading.boundingBox())!.height).toBeGreaterThan(32)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await expect(page.locator('.ui-card-title')).toHaveCSS('font-size', '16px')
    await expect(page.locator('.ui-card-body')).toHaveCSS('line-height', '22px')
    await expect(page.getByRole('textbox')).toHaveCSS('line-height', '20px')
    await page.screenshot({ path: `test-results/typography-${theme}.png`, fullPage: true })
  })
}
