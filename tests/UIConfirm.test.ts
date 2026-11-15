import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import { UIDialogProvider, useConfirm, useDialog, useDialogContext } from '../src'
import type { UIConfirmService, UIDialogService, UIDialogContext } from '../src'

enableAutoUnmount(afterEach)
beforeEach(() => {
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', { configurable: true, value: function (this: HTMLDialogElement) { this.open = true } })
  Object.defineProperty(HTMLDialogElement.prototype, 'close', { configurable: true, value: function (this: HTMLDialogElement) { this.open = false } })
})
afterEach(() => { vi.restoreAllMocks(); Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal'); Reflect.deleteProperty(HTMLDialogElement.prototype, 'close') })
function setup() {
  let confirm!: UIConfirmService['confirm']
  let dialog!: UIDialogService
  const Child = defineComponent({ setup() { confirm = useConfirm().confirm; dialog = useDialog(); return () => h('button', 'open') } })
  const wrapper = mount(UIDialogProvider, { slots: { default: () => h(Child) } })
  return { wrapper, confirm, dialog }
}
const options = { title: '저장 확인', message: '<b>팀에 반영됩니다.</b>' }
describe('confirm action', () => {
  it('uses UIDialog, escapes content and resolves after closing', async () => {
    const { wrapper, confirm } = setup()
    const result = confirm(options)
    await nextTick()
    const dialog = wrapper.get('dialog')
    expect(dialog.classes()).toContain('ui-dialog')
    expect(dialog.find('b').exists()).toBe(false)
    expect(dialog.attributes('aria-describedby')).toBe(dialog.get('p').attributes('id'))
    expect(dialog.findAll('button').map(b => b.text())).toEqual(['취소', '확인'])
    expect(dialog.findAll('button')[0]!.attributes('autofocus')).toBeDefined()
    await dialog.findAll('button')[1]!.trigger('click')
    expect(await result).toBe(true)
    expect(wrapper.find('dialog').exists()).toBe(false)
  })
  it('cancels via button, Escape and external close, and permits another request', async () => {
    const { wrapper, confirm } = setup()
    for (const event of ['button', 'cancel', 'close']) {
      const result = confirm(options)
      await nextTick()
      if (event === 'button') await wrapper.get('dialog button').trigger('click')
      else await wrapper.get('dialog').trigger(event)
      expect(await result).toBe(false)
    }
  })
  it('shares dialog concurrency without replacing an active dialog or pending confirmation', async () => {
    const { wrapper, confirm, dialog } = setup()
    let context!: UIDialogContext<null, boolean>
    const Content = defineComponent({ setup() { context = useDialogContext(); return () => h('p', '기존 창') } })
    dialog.openDialog(Content, { payload: null, onResult: vi.fn() })
    await expect(confirm(options)).resolves.toBe(false)
    await nextTick()
    context.cancel()
    await nextTick()
    const pending = confirm(options)
    await expect(confirm({ ...options, title: '중복' })).resolves.toBe(false)
    expect(dialog.openDialog(Content, { payload: null, onResult: vi.fn() })).toBe(false)
    await nextTick()
    await wrapper.get('dialog').trigger('cancel')
    expect(await pending).toBe(false)
  })
  it('settles unresolved and closing requests on provider teardown and rejects late calls', async () => {
    for (const closing of [false, true]) {
      const { wrapper, confirm } = setup()
      const result = confirm(options)
      await nextTick()
      if (closing) wrapper.get('dialog').element.dispatchEvent(new Event('cancel', { cancelable: true }))
      wrapper.unmount()
      expect(await result).toBe(false)
      expect(await confirm(options)).toBe(false)
    }
  })
  it('snapshots options and uses safe defaults for empty button labels', async () => {
    const { wrapper, confirm } = setup()
    const request = { ...options, confirmLabel: ' ', cancelLabel: '', destructive: true }
    const pending = confirm(request)
    request.message = '변경됨'
    await nextTick()
    expect(wrapper.get('.ui-confirm-message').text()).toBe(options.message)
    expect(wrapper.get('dialog').findAll('button').map(b => b.text())).toEqual(['취소', '확인'])
    await wrapper.get('dialog').trigger('cancel')
    await pending
  })
  it('requires a dialog provider', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(() => mount(defineComponent({ setup() { useConfirm(); return () => null } }))).toThrow('UIDialogProvider')
  })
})
