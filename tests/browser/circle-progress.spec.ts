import { readFile } from 'node:fs/promises'
import { expect, test } from '@playwright/test'
const story = (name: string) => `/iframe.html?id=components-uicircleprogress--${name}&viewMode=story`

test('circle progress names a loading task and scales to the documented sizes', async ({ page }) => {
  await page.goto(story('sizes'))
  const small = page.getByRole('status', { name: '작은 화면 로딩' })
  const regular = page.getByRole('status', { name: '업로드 중' })
  const large = page.getByRole('status', { name: '대량 내보내기 중' })
  await expect(small).toHaveText('로딩 중')
  await expect(small.locator('..').locator('svg')).toHaveCSS('width', '16px')
  await expect(regular.locator('..').locator('svg')).toHaveCSS('width', '32px')
  await expect(large.locator('..').locator('svg')).toHaveCSS('width', '48px')
  await expect(large).toHaveAttribute('aria-describedby', /.+/)
  await expect(small.locator('..').locator('svg')).toHaveAttribute('aria-hidden', 'true')
  await page.screenshot({ path: 'test-results/circle-progress-sizes.png', fullPage: true })
})

test('indeterminate animation respects reduced motion and can be used in a busy context', async ({ page }) => {
  await page.goto(story('playground') + '&globals=theme:ocean')
  const indicator = page.locator('.ui-circle-progress-indicator')
  await expect(indicator).toHaveCSS('animation-name', 'ui-circle-progress-rotate')
  await expect(indicator).toHaveCSS('stroke', 'rgb(3, 105, 161)')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(indicator).toHaveCSS('animation-name', 'none')
  await page.goto(story('in-context'))
  await expect(page.getByRole('status', { name: '보고서 생성' })).toBeVisible()
  await page.getByRole('button', { name: '완료 처리 예시' }).click()
  await expect(page.getByRole('status')).toHaveText('보고서 생성을 마쳤습니다.')
  await expect(page.getByRole('status', { name: '보고서 생성' })).toHaveCount(0)
})

test('circle progress styles survive without Preflight and in forced colors', async ({ page }) => {
  await page.goto(story('playground'))
  const markup = await page.locator('.ui-circle-progress').evaluate(el => el.outerHTML)
  await page.goto('about:blank')
  await page.setContent(markup)
  await page.addStyleTag({ content: await readFile('.test-consumer/no-reset.css', 'utf8') })
  await expect(page.locator('.ui-circle-progress')).toHaveCSS('width', '32px')
  await expect(page.locator('svg')).toHaveCSS('display', 'block')
  await expect(page.locator('.ui-circle-progress-indicator')).toHaveCSS('stroke-width', '4px')
  await page.emulateMedia({ forcedColors: 'active' })
  // System colors vary with the browser/OS palette; compare with a live reference.
  const colors = await page.evaluate(() => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.append(svg)
    const values = ['GrayText', 'Highlight'].map((color, index) => {
      const circle = document.createElementNS(svg.namespaceURI, 'circle') as SVGCircleElement
      circle.style.stroke = color
      if (index === 1) circle.style.forcedColorAdjust = 'none'
      svg.append(circle)
      return getComputedStyle(circle).stroke
    })
    svg.remove()
    return values
  })
  await expect(page.locator('.ui-circle-progress-track')).toHaveCSS('stroke', colors[0]!)
  await expect(page.locator('.ui-circle-progress-indicator')).toHaveCSS('stroke', colors[1]!)
  await page.goto('http://127.0.0.1:6008')
  await expect(page.getByRole('status', { name: '배포 불러오는 중' })).toBeVisible()
})
