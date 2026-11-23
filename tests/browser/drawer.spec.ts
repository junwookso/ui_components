import { expect, test } from '@playwright/test'
const story = (name = 'playground') => `/iframe.html?id=layout-uidrawer--${name}&viewMode=story`

test('drawer opens, traps keyboard focus, applies input and restores focus on all dismissal paths', async ({ page }) => {
  await page.goto(story())
  const trigger = page.getByRole('button', { name: '필터 열기' })
  await trigger.click()
  const dialog = page.getByRole('dialog', { name: '업무 필터' })
  await expect(dialog.getByRole('button', { name: '업무 필터 닫기' })).toBeFocused()
  await expect(dialog).toHaveAccessibleDescription('조건을 입력하고 적용해 주세요.')
  await expect.poll(() => dialog.evaluate(el => el.getBoundingClientRect().right))
    .toBe(page.viewportSize()!.width)
  await expect(dialog).toHaveCSS('width', '400px')
  await dialog.getByRole('textbox', { name: '업무명' }).fill('권한')
  await dialog.getByRole('button', { name: '적용', exact: true }).click()
  await expect(dialog).toBeHidden()
  await expect(trigger).toBeFocused()
  await expect(page.getByRole('status')).toHaveText('권한 적용')
  await trigger.click()
  await expect(dialog.getByRole('textbox')).toHaveValue('권한')
  await dialog.getByRole('button', { name: '적용', exact: true }).focus()
  await page.keyboard.press('Tab'); await page.keyboard.press('Tab')
  expect(await dialog.evaluate(el => el.contains(document.activeElement))).toBe(true)
  await page.keyboard.press('Escape')
  await expect(trigger).toBeFocused()
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')
  await trigger.click()
  await page.mouse.click(2, 2)
  await expect(dialog).toBeHidden()
  await page.goto(story('backdrop-locked'))
  await page.getByRole('button', { name: '필터 열기' }).click()
  await page.mouse.click(2, 2)
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.getByRole('button', { name: '업무 필터 닫기' }).click()
  await expect(page.getByRole('dialog')).toBeHidden()
})

for (const side of ['left', 'right'] as const) {
  test(`drawer enters from the ${side} and restores focus when dismissed during entry`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.setViewportSize({ width: 960, height: 600 })
    await page.goto(story(side === 'left' ? 'left' : 'playground'))
    const trigger = page.getByRole('button', { name: '필터 열기' })
    await trigger.focus()
    const { start, middle, width } = await trigger.evaluate(async element => {
      const button = element as HTMLButtonElement
      button.click()
      await Promise.resolve()
      const drawer = document.querySelector<HTMLDialogElement>('.ui-drawer[open]')
      const entry = drawer?.getAnimations().find(animation =>
        animation instanceof CSSAnimation && animation.animationName === 'ui-drawer-enter',
      )
      if (!drawer || !entry) throw new Error('The drawer has no entry animation.')
      entry.pause()
      await entry.ready
      entry.currentTime = 0
      const { x: start, width } = drawer.getBoundingClientRect()
      entry.currentTime = Number(entry.effect?.getTiming().duration) / 2
      return { start, middle: drawer.getBoundingClientRect().x, width }
    })
    if (side === 'left') {
      expect(start).toBe(-width)
      expect(middle).toBeGreaterThan(start)
      expect(middle).toBeLessThan(0)
    } else {
      expect(start).toBe(960)
      expect(middle).toBeLessThan(start)
      expect(middle).toBeGreaterThan(960 - width)
    }

    const dialog = page.getByRole('dialog', { name: '업무 필터' })
    await expect(dialog.getByRole('button', { name: '업무 필터 닫기' })).toBeFocused()
    await expect(page.locator('body')).toHaveCSS('overflow', 'hidden')
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(trigger).toBeFocused()
    await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')
  })
}

test('drawer opens immediately with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto(story('left'))
  await page.getByRole('button', { name: '필터 열기' }).click()
  const dialog = page.getByRole('dialog', { name: '업무 필터' })
  await expect(dialog).toHaveCSS('animation-name', 'none')
  expect((await dialog.boundingBox())?.x).toBe(0)
})
