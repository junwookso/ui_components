import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import UICircleProgress from '../src/components/circle-progress/UICircleProgress.vue'

describe('UICircleProgress', () => {
  it('names an announced loading status with the task and optional description', async () => {
    const wrapper = mount(UICircleProgress, { props: { label: '보고서 생성', description: '파일 3개를 준비하고 있습니다.' } })
    const status = wrapper.get('[role="status"]')
    expect(status.attributes('aria-live')).toBe('polite')
    expect(status.attributes('aria-atomic')).toBe('true')
    expect(status.attributes('aria-labelledby')).toBe(wrapper.get('.ui-circle-progress-label').attributes('id'))
    expect(status.attributes('aria-describedby')).toBe(wrapper.get('.ui-circle-progress-description').attributes('id'))
    expect(status.text()).toBe('로딩 중')
    expect(wrapper.get('svg').attributes('aria-hidden')).toBe('true')
    expect(wrapper.get('svg').attributes('focusable')).toBe('false')
    await wrapper.setProps({ description: undefined })
    expect(status.attributes('aria-describedby')).toBeUndefined()
  })

  it('sets size without making the decorative indicator focusable', () => {
    const wrapper = mount(UICircleProgress, { props: { label: '업로드', size: 'lg' } })
    expect(wrapper.attributes('data-size')).toBe('lg')
    expect(wrapper.attributes('tabindex')).toBeUndefined()
    expect(wrapper.get('svg circle').attributes('r')).toBe('17')
    expect(wrapper.get('svg circle + circle').attributes('stroke-linecap')).toBeUndefined()
  })
})
