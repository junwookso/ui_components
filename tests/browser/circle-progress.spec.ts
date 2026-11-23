import { expect, test } from '@playwright/test'
const story = (name: string) => `/iframe.html?id=components-uicircleprogress--${name}&viewMode=story`

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
