import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { UIDrawer } from '../src'
import { lockBodyScroll } from '../src/lib/scroll-lock'

enableAutoUnmount(afterEach)
beforeEach(() => {
  document.body.style.overflow = ''
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', { configurable: true, value: function (this: HTMLDialogElement) { this.open = true } })
  Object.defineProperty(HTMLDialogElement.prototype, 'close', { configurable: true, value: function (this: HTMLDialogElement) { this.open = false } })
})
afterEach(() => { vi.restoreAllMocks() })
afterAll(() => { Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal'); Reflect.deleteProperty(HTMLDialogElement.prototype, 'close'); document.body.innerHTML = ''; document.body.style.overflow = '' })
describe('UIDrawer', () => {
  it('opens initially, names the native modal and restores focus and scrolling when controlled closed', async () => {
    const trigger = document.createElement('button')
    document.body.append(trigger); trigger.focus()
    document.body.style.overflow = 'auto'
    const wrapper = mount(UIDrawer, { attachTo: document.body, props: { title: '필터', description: '조건 설정', open: true }, slots: { default: '<p>필터 내용</p>' } })
    expect(wrapper.element.open).toBe(true)
    expect(wrapper.attributes('aria-labelledby')).toBe(wrapper.get('h2').attributes('id'))
    expect(wrapper.attributes('aria-describedby')).toBe(wrapper.get('.ui-drawer-description').attributes('id'))
    expect(document.body.style.overflow).toBe('hidden')
    await wrapper.setProps({ open: false })
    expect(wrapper.element.open).toBe(false)
    expect(wrapper.find('.ui-drawer-body').exists()).toBe(false)
    expect(document.activeElement).toBe(trigger)
    expect(document.body.style.overflow).toBe('auto')
  })
  it('reports user dismissal and ignores stale native close events after reopening', async () => {
    const wrapper = mount(UIDrawer, { props: { title: '필터', open: true } })
    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
    expect(wrapper.emitted('dismiss')?.[0]).toEqual(['close-button'])
    await wrapper.setProps({ open: false }); await wrapper.setProps({ open: true })
    await wrapper.trigger('close')
    expect(wrapper.emitted('dismiss')).toHaveLength(1)
    await wrapper.trigger('cancel')
    expect(wrapper.emitted('dismiss')?.[1]).toEqual(['escape'])
  })
  it('exposes an action close slot and cleans up without unlocking another modal', async () => {
    const wrapper = mount(UIDrawer, { props: { title: '필터', open: true }, slots: { actions: ({ close }) => h('button', { onClick: close }, '완료') } })
    const releaseNested = lockBodyScroll(document)
    await wrapper.get('footer button').trigger('click')
    expect(wrapper.emitted('dismiss')?.[0]).toEqual(['action'])
    wrapper.unmount()
    expect(document.body.style.overflow).toBe('hidden')
    releaseNested(); releaseNested()
    await nextTick()
    expect(document.body.style.overflow).toBe('')
  })
})
