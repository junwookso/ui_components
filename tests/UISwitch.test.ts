import { afterEach, describe, expect, it, vi } from 'vitest'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import UISwitch from '../src/components/switch/UISwitch.vue'

enableAutoUnmount(afterEach)

describe('UISwitch', () => {
  it('starts off, emits booleans, and reflects external model changes', async () => {
    const wrapper = mount(UISwitch)
    const input = wrapper.get('input')
    expect(input.element.checked).toBe(false)
    await input.setValue(true)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
    await input.setValue(false)
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([false])
    await wrapper.setProps({ modelValue: true })
    expect(input.element.checked).toBe(true)
  })

  it('forwards form attributes and change events to the native checkbox', async () => {
    const onChange = vi.fn()
    const wrapper = mount(UISwitch, { attrs: { id: 'alerts', name: 'alerts', value: 'enabled', 'aria-describedby': 'help', onChange } })
    expect(wrapper.attributes('id')).toBeUndefined()
    expect(wrapper.get('input').attributes()).toMatchObject({ type: 'checkbox', role: 'switch', id: 'alerts', name: 'alerts', value: 'enabled', 'aria-describedby': 'help' })
    await wrapper.get('input').setValue(true)
    expect(onChange).toHaveBeenCalledOnce()
  })

  it('does not change state or emit updates when disabled', () => {
    const wrapper = mount(UISwitch, { props: { modelValue: true, disabled: true }, attachTo: document.body })
    wrapper.get('input').element.click()
    expect(wrapper.get('input').element.checked).toBe(true)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})
