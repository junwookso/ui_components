import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { UITopbar } from '../src'

describe('UITopbar', () => {
  it('renders a named header and escaped brand without empty landmarks', () => {
    const wrapper = mount(UITopbar, { props: { title: '<b>포털</b>' }, attrs: { id: 'app-header' } })
    expect(wrapper.element.tagName).toBe('HEADER')
    expect(wrapper.attributes('id')).toBe('app-header')
    expect(wrapper.attributes('aria-label')).toBe('상단 바')
    expect(wrapper.get('.ui-topbar-brand').text()).toBe('<b>포털</b>')
    expect(wrapper.find('b, nav, h1, button').exists()).toBe(false)
    expect(wrapper.attributes('data-sticky')).toBe('false')
    expect(wrapper.attributes('data-variant')).toBe('default')
  })
  it('preserves semantic slot controls in DOM order and navigation labels', async () => {
    const wrapper = mount(UITopbar, { props: { title: '포털', navigationLabel: '업무 메뉴' }, slots: {
      leading: () => h('button', '메뉴'), brand: () => h('a', { href: '/home' }, '홈'),
      navigation: () => h('a', { href: '/tasks', 'aria-current': 'page' }, '업무'),
      search: () => h('input', { 'aria-label': '검색' }), actions: () => h('button', '계정'),
    } })
    expect(wrapper.get('nav').attributes('aria-label')).toBe('업무 메뉴')
    expect(wrapper.findAll('button, a, input').map(el => el.text() || el.attributes('aria-label'))).toEqual(['메뉴', '홈', '업무', '검색', '계정'])
    expect(wrapper.get('nav a').attributes('aria-current')).toBe('page')
    await wrapper.setProps({ sticky: true, label: '서비스 헤더', variant: 'primary' })
    expect(wrapper.attributes('data-sticky')).toBe('true')
    expect(wrapper.attributes('data-variant')).toBe('primary')
    expect(wrapper.attributes('aria-label')).toBe('서비스 헤더')
  })
})
