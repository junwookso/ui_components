import { readFile } from 'node:fs/promises'
import { expect, test } from '@playwright/test'

const story = (name: string) => `/iframe.html?id=components-uibutton--${name}&viewMode=story`

test('keyboard skips disabled buttons, shows focus, and activates with Enter and Space', async ({ page }) => {
  await page.goto(story('keyboard-focus'))
  const first = page.getByRole('button', { name: '첫 번째' })
  await expect(first).toBeVisible()
  await first.evaluate((button) => {
    button.dataset.clicks = '0'
    button.addEventListener('click', () => { button.dataset.clicks = String(Number(button.dataset.clicks) + 1) })
  })
  await page.keyboard.press('Tab')
  await expect(first).toBeFocused()
  await expect(first).toHaveCSS('outline-style', 'solid')
  await expect(first).toHaveCSS('outline-width', '2px')
  await page.keyboard.press('Enter')
  await page.keyboard.press('Space')
  await expect(first).toHaveAttribute('data-clicks', '2')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: '두 번째' })).toBeFocused()
})

test('variants and sizes have generated styles and service colors update at runtime', async ({ page }) => {
  await page.goto(story('variants'))
  await expect(page.getByRole('button', { name: 'default', exact: true })).toHaveCSS('background-color', 'rgb(24, 24, 27)')
  await expect(page.getByRole('button', { name: 'outline', exact: true })).toHaveCSS('border-top-width', '1px')
  await page.goto(story('sizes'))
  await expect(page.getByRole('button', { name: 'Small', exact: true })).toHaveCSS('height', '32px')
  await expect(page.getByRole('button', { name: 'Default', exact: true })).toHaveCSS('height', '36px')
  await expect(page.getByRole('button', { name: 'Large', exact: true })).toHaveCSS('height', '48px')
  await page.goto(story('icon-button'))
  for (const [name, size] of [['검색', '32px'], ['추가', '36px'], ['다운로드', '48px']]) {
    const button = page.getByRole('button', { name, exact: true })
    await expect(button).toHaveCSS('width', size)
    await expect(button).toHaveCSS('height', size)
  }
  await page.goto(story('color-themes'))
  const buttons = page.getByRole('button', { name: '저장하기' })
  await expect(buttons.nth(0)).toHaveCSS('background-color', 'rgb(24, 24, 27)')
  await expect(buttons.nth(1)).toHaveCSS('background-color', 'rgb(3, 105, 161)')
})

test('built CSS works without reset and does not reset unrelated elements', async ({ page }) => {
  await page.goto(story('variants'))
  const markup = await page.getByRole('button', { name: 'outline', exact: true }).evaluate(el => el.outerHTML)
  const css = await readFile('.test-consumer/no-reset.css', 'utf8')
  await page.goto('about:blank')
  await page.setContent(`<h1>Unrelated heading</h1>${markup}`)
  await page.addStyleTag({ content: css })
  const button = page.getByRole('button')
  await expect(button).toHaveCSS('height', '36px')
  await expect(button).toHaveCSS('border-top-width', '1px')
  await expect(button).toHaveCSS('font-size', '14px')
  await expect(page.locator('h1')).toHaveCSS('font-size', '32px')
  await expect(page.locator('body')).toHaveCSS('margin', '8px')
})
