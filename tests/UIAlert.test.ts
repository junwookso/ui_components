import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { UIAlert } from '../src'

describe('UIAlert', () => {

  it('keeps the live region mounted while adding and clearing its message', async () => {
    const wrapper = mount(UIAlert, { props: { type: 'error', announce: 'assertive' } })
    const region = wrapper.get('[aria-live="assertive"]').element
    expect(region.getAttribute('aria-atomic')).toBe('true')
    expect(region.textContent).toBe('')
    expect(wrapper.attributes('data-visible')).toBe('false')

    await wrapper.setProps({ message: '저장 실패' })
    expect(wrapper.get('[aria-live="assertive"]').element).toBe(region)
    expect(region.textContent).toContain('저장 실패')
    expect(wrapper.attributes('data-visible')).toBe('true')

    await wrapper.setProps({ message: '' })
    expect(wrapper.get('[aria-live="assertive"]').element).toBe(region)
    expect(region.textContent).toBe('')
  })

  it('renders the formatted message and keeps action controls outside the live region', () => {
    const wrapper = mount(UIAlert, {
      props: { announce: 'polite', message: '기본 본문' },
      slots: {
        default: () => h('strong', '첨부 문서 필요'),
        icon: () => h('svg'),
        actions: () => h('button', '첨부 안내 보기'),
      },
    })
    const region = wrapper.get('[aria-live="polite"]')
    expect(region.get('strong').text()).toBe('첨부 문서 필요')
    expect(region.text()).not.toContain('기본 본문')
    expect(region.find('[aria-hidden="true"] svg').exists()).toBe(true)
    expect(region.find('button').exists()).toBe(false)
    expect(wrapper.get('button').text()).toBe('첨부 안내 보기')
  })
})
