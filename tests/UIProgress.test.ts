import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import UIProgress from '../src/components/progress/UIProgress.vue'

describe('UIProgress', () => {

  it('distinguishes zero from unknown and removes the native value for indeterminate progress', async () => {
    const wrapper = mount(UIProgress, { props: { label: '보고서 생성' } })
    const progress = wrapper.get('progress')
    expect(progress.attributes('value')).toBeUndefined()
    expect(progress.attributes('aria-valuetext')).toBe('진행 중')
    await wrapper.setProps({ value: 0 })
    expect(progress.attributes('value')).toBe('0')
    expect(progress.attributes('aria-valuetext')).toBe('0%')
    await wrapper.setProps({ value: null })
    expect(progress.attributes('value')).toBeUndefined()
    expect(wrapper.get('.ui-progress-fill').attributes('style') ?? '').not.toContain('width:')
  })

  it('normalizes invalid ranges without reporting early completion', async () => {
    const wrapper = mount(UIProgress, { props: { label: '처리', value: -10, max: 0 } })
    expect(wrapper.get('progress').attributes('max')).toBe('100')
    expect(wrapper.get('progress').attributes('value')).toBe('0')
    await wrapper.setProps({ value: 120, max: 10 })
    expect(wrapper.get('progress').attributes('value')).toBe('10')
    await wrapper.setProps({ value: 99.9, max: Infinity })
    expect(wrapper.get('progress').attributes('max')).toBe('100')
    expect(wrapper.get('progress').attributes('aria-valuetext')).toBe('99%')
    for (const value of [NaN, Infinity, -Infinity]) {
      await wrapper.setProps({ value })
      expect(wrapper.get('progress').attributes('value')).toBeUndefined()
    }
  })

  it('keeps custom value text accessible when hidden visually', () => {
    const one = mount(UIProgress, { props: { label: '작업', value: 3, max: 10, valueText: '3 / 10건', showValue: false } })
    expect(one.find('.ui-progress-value').exists()).toBe(false)
    expect(one.get('progress').attributes('aria-valuetext')).toBe('3 / 10건')
    expect(one.get('.ui-progress-track').attributes('aria-hidden')).toBe('true')
    one.unmount()
  })
})
