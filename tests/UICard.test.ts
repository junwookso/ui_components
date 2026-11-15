import { afterEach, describe, expect, it } from 'vitest'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import UICard from '../src/components/card/UICard.vue'

enableAutoUnmount(afterEach)

describe('UICard', () => {
  it('labels each card with its own heading and supports heading hierarchy', () => {
    const wrapper = mount({
      components: { UICard },
      template: '<div><UICard title="첫 카드" :heading-level="3" /><UICard title="두 번째" /></div>',
    })
    const [first, second] = wrapper.findAllComponents(UICard)
    expect(first!.attributes('aria-labelledby')).toBe(first!.get('h3').attributes('id'))
    expect(second!.get('h2').text()).toBe('두 번째')
    expect(first!.attributes('aria-labelledby')).not.toBe(second!.attributes('aria-labelledby'))
  })

  it('uses named title and action slots without changing button semantics', () => {
    const wrapper = mount(UICard, {
      props: { title: 'fallback' },
      slots: { title: '사용자 지정 제목', default: '<input name="project" />', actions: '<button type="submit">저장</button>' },
    })
    expect(wrapper.get('h2').text()).toBe('사용자 지정 제목')
    expect(wrapper.get('.ui-card-body input').attributes('name')).toBe('project')
    expect(wrapper.get('.ui-card-actions button').attributes('type')).toBe('submit')
  })

  it('omits unused header and action regions and forwards native attributes', () => {
    const wrapper = mount(UICard, { attrs: { 'aria-label': '업무 정보', id: 'info' }, slots: { default: '내용' } })
    expect(wrapper.find('header').exists()).toBe(false)
    expect(wrapper.find('footer').exists()).toBe(false)
    expect(wrapper.attributes('aria-labelledby')).toBeUndefined()
    expect(wrapper.attributes('aria-label')).toBe('업무 정보')
    expect(wrapper.attributes('id')).toBe('info')
  })
})
