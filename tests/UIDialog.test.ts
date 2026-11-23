import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import UIDialogProvider from '../src/components/dialog/UIDialogProvider.vue'
import { useDialog, useDialogContext } from '../src/components/dialog/context'
import type { UIDialogContext, UIDialogService } from '../src/components/dialog/types'

enableAutoUnmount(afterEach)
let service: UIDialogService
let context: UIDialogContext<{ name: string }, { name: string }>
const Content = defineComponent({
  setup() {
    context = useDialogContext<{ name: string }, { name: string }>()
    return () => h('p', context.payload.name)
  },
})
const Opener = defineComponent({ setup() { service = useDialog(); return () => h('button', 'open') } })
function setup() { return mount(UIDialogProvider, { slots: { default: Opener } }) }
beforeEach(() => { vi.restoreAllMocks() })

describe('dialog lifecycle', () => {
  it('passes payload, rejects concurrent opens and delivers result only after unmount', async () => {
    const wrapper = setup()
    const onResult = vi.fn(() => expect(wrapper.find('p').exists()).toBe(false))
    const onCancel = vi.fn()
    expect(service.openDialog(Content, { payload: { name: '초기값' }, onResult, onCancel })).toBe(true)
    expect(service.openDialog(Content, { payload: {}, onResult })).toBe(false)
    await nextTick()
    expect(wrapper.text()).toContain('초기값')
    context.complete({ name: '완료' })
    context.complete({ name: '중복' })
    context.cancel()
    expect(service.openDialog(Content, { payload: {}, onResult })).toBe(false)
    await nextTick()
    expect(onResult).toHaveBeenCalledExactlyOnceWith({ name: '완료' })
    expect(onCancel).not.toHaveBeenCalled()
  })
  it('separates cancellation and creates a fresh context when reopened', async () => {
    setup()
    const onResult = vi.fn(), onCancel = vi.fn()
    service.openDialog(Content, { payload: { name: '첫번째' }, onResult, onCancel })
    await nextTick()
    const old = context
    expect(context.closeOnBackdrop).toBe(true)
    context.cancel('escape')
    await nextTick()
    expect(onCancel).toHaveBeenCalledExactlyOnceWith('escape')
    expect(onResult).not.toHaveBeenCalled()
    service.openDialog(Content, { payload: { name: '두번째' }, closeOnBackdrop: false, onResult })
    await nextTick()
    expect(context).not.toBe(old)
    expect(context.payload.name).toBe('두번째')
    expect(context.closeOnBackdrop).toBe(false)
    old.complete({ name: '늦은 결과' })
    expect(onResult).not.toHaveBeenCalled()
  })
  it('suppresses callbacks after provider teardown', async () => {
    const wrapper = setup()
    const onResult = vi.fn(), onCancel = vi.fn()
    service.openDialog(Content, { payload: { name: '초기값' }, onResult, onCancel })
    await nextTick()
    context.complete({ name: '결과' })
    wrapper.unmount()
    await nextTick()
    expect(onResult).not.toHaveBeenCalled()
    expect(onCancel).not.toHaveBeenCalled()
    expect(service.openDialog(Content, { payload: {}, onResult })).toBe(false)
  })
})
