import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { UICheckbox } from '../src'

describe('UICheckbox', () => {
  it('toggles a boolean without using the native submission value as the model', async () => {
    const wrapper = mount(UICheckbox, { attrs: { value: 'yes' } })
    const input = wrapper.get('input')
    expect(input.element.checked).toBe(false)

    await input.setValue(true)
    await input.setValue(false)

    expect(wrapper.emitted('update:modelValue')).toEqual([[true], [false]])
    expect(input.element.value).toBe('yes')
  })

  it('restores controlled states if the parent rejects a native change', async () => {
    const update = vi.fn()
    const wrapper = mount(UICheckbox, {
      props: { modelValue: false, indeterminate: true, 'onUpdate:modelValue': update },
    })
    const input = wrapper.get('input').element
    expect(input.matches(':indeterminate')).toBe(true)

    input.indeterminate = false
    await wrapper.get('input').setValue(true)
    expect(update).toHaveBeenCalledWith(true)
    expect(input.checked).toBe(false)
    expect(input.indeterminate).toBe(true)

    await wrapper.setProps({ modelValue: true, indeterminate: false })
    expect(input.checked).toBe(true)
    expect(input.indeterminate).toBe(false)
  })
})
