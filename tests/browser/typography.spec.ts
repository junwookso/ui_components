import { readFile } from 'node:fs/promises'
import { expect, test } from '@playwright/test'

const scale = [
  ['h1', 24, 32, 600], ['h2', 20, 28, 600], ['h3', 18, 26, 600],
  ['h4', 16, 24, 600], ['h5', 14, 20, 600], ['h6', 14, 20, 500],
  ['title', 16, 24, 600], ['subtitle', 14, 20, 400], ['body', 14, 22, 400],
  ['body-lg', 16, 26, 400], ['caption', 12, 18, 400], ['label', 14, 20, 500],
] as const

test('type scale follows the root font size without Preflight', async ({ page }) => {
  await page.goto('about:blank')
  await page.setContent(`<main style="color:rgb(10, 20, 30)">${scale.map(([name]) => `<h2 class="ui-${name}" data-sample="${name}">프로젝트 Project 0123456789</h2>`).join('')}</main>`)
  await page.addStyleTag({ content: await readFile('.test-consumer/no-reset.css', 'utf8') })
  for (const [name, size, line, weight] of scale) {
    const el = page.locator(`[data-sample="${name}"]`)
    await expect(el).toHaveCSS('font-family', /^"Pretendard Variable",/)
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
