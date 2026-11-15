import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { UIFooter } from '../src'

describe('UIFooter', () => {
  it('provides a named native footer, escapes text and omits empty areas', () => {
    const wrapper = mount(UIFooter, { props: { text: '<b>운영팀</b>' }, attrs: { id: 'page-footer' } })
    expect(wrapper.element.tagName).toBe('FOOTER')
    expect(wrapper.attributes('aria-label')).toBe('하단 정보')
    expect(wrapper.attributes('id')).toBe('page-footer')
    expect(wrapper.get('.ui-footer-content').text()).toBe('<b>운영팀</b>')
    expect(wrapper.find('b, nav, button').exists()).toBe(false)
  })
  it('allows custom content and preserves link/action semantics in reading order', () => {
    const wrapper = mount(UIFooter, { props: { text: '대체됨', label: '서비스 정보', navigationLabel: '지원 링크' }, slots: {
      default: () => h('span', '운영시간'), navigation: () => h('a', { href: '/help' }, '도움말'), actions: () => h('button', '문의'),
    } })
    expect(wrapper.text()).not.toContain('대체됨')
    expect(wrapper.get('nav').attributes('aria-label')).toBe('지원 링크')
    expect(wrapper.attributes('aria-label')).toBe('서비스 정보')
    expect(wrapper.findAll('a, button').map(el => el.text())).toEqual(['도움말', '문의'])
    expect(wrapper.get('a').attributes('href')).toBe('/help')
  })
})
