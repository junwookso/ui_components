import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { UITimePicker } from '../src'

describe('UITimePicker', () => {
  it('binds local time, midnight and end-of-day values without converting and clears', async () => {
    const wrapper = mount(UITimePicker, { props: { modelValue: '14:30' } })
    expect(wrapper.element.type).toBe('time')
    expect(wrapper.element.value).toBe('14:30')
    await wrapper.setProps({ modelValue: '00:00' })
    expect(wrapper.element.value).toBe('00:00')
    await wrapper.setValue('23:59')
    await wrapper.setValue('')
    expect(wrapper.emitted('update:modelValue')).toEqual([['23:59'], ['']])
  })
  it('converts minute intervals into native seconds with a safe default', async () => {
    const wrapper = mount(UITimePicker)
    expect(wrapper.element.step).toBe('60')
    await wrapper.setProps({ minuteStep: 15 })
    expect(wrapper.element.step).toBe('900')
    for (const minuteStep of [0, -1, 1.5, NaN, Infinity, 1441]) {
      await wrapper.setProps({ minuteStep })
      expect(wrapper.element.step).toBe('60')
    }
  })
})
