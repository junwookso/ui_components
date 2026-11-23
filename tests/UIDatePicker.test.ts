import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { UIDatePicker } from '../src'

describe('UIDatePicker', () => {
  it.each([
    ['day', 'date', '2026-11-16', '2028-02-29'],
    ['month', 'month', '2026-11', '2027-01'],
  ] as const)('binds %s values without timezone conversion and supports clearing', async (level, type, initial, next) => {
    const wrapper = mount(UIDatePicker, { props: { level, modelValue: initial } })
    expect(wrapper.get('input').element.type).toBe(type)
    expect(wrapper.get('input').element.value).toBe(initial)
    await wrapper.setProps({ modelValue: next })
    expect(wrapper.get('input').element.value).toBe(next)
    await wrapper.get('input').setValue(initial)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([initial])
    await wrapper.get('input').setValue('')
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([''])
  })
  it('does not silently convert or overwrite values when changing precision', async () => {
    const wrapper = mount(UIDatePicker, { props: { modelValue: '2026-11-16' } })
    await wrapper.setProps({ level: 'month' })
    expect(wrapper.get('input').element.value).toBe('')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    await wrapper.setProps({ modelValue: '2026-11' })
    expect(wrapper.get('input').element.value).toBe('2026-11')
  })
})
