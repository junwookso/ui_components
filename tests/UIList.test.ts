import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { UIList } from '../src'

const items = [{ key: 'one', title: '첫 업무', description: '설명' }, { key: 'two', title: '둘째 업무' }]
describe('UIList', () => {
  it('names a native list and section without interactive row semantics', () => {
    const wrapper = mount(UIList, { props: { label: '업무', items, headingLevel: 3 } })
    const id = wrapper.get('h3').attributes('id')
    expect(wrapper.attributes('aria-labelledby')).toBe(id)
    expect(wrapper.get('ul').attributes('aria-labelledby')).toBe(id)
    expect(wrapper.findAll('ul > li')).toHaveLength(2)
    expect(wrapper.findAll('[tabindex], button, [role="option"]')).toHaveLength(0)
    expect(wrapper.findAll('.ui-list-description')).toHaveLength(1)
    expect(wrapper.findAll('.ui-list-trailing')).toHaveLength(0)
  })
  it('passes scoped data and preserves keyed interactive elements when reordered', async () => {
    const wrapper = mount(UIList, { props: { label: '업무', items }, slots: {
      title: ({ item }) => h('a', { href: '#' + item.key }, item.title),
      actions: ({ item, index }) => h('button', { 'aria-label': item.title + ' 보기' }, String(index)),
      meta: ({ index }) => String(index + 1),
    } })
    const original = wrapper.get('button').element
    expect(wrapper.get('a').attributes('href')).toBe('#one')
    await wrapper.setProps({ items: [...items].reverse() })
    expect(wrapper.findAll('button')[1]!.element).toBe(original)
    expect(wrapper.findAll('button')[1]!.text()).toBe('1')
  })
  it('escapes text, provides empty content and switches to a populated list', async () => {
    const wrapper = mount(UIList, { props: { label: '업무', items: [], emptyText: '업무 없음' } })
    expect(wrapper.find('ul').exists()).toBe(false)
    expect(wrapper.get('.ui-list-empty').text()).toBe('업무 없음')
    await wrapper.setProps({ items: [{ key: 'x', title: '<b>제목</b>', description: '<img src=x>' }] })
    expect(wrapper.find('b, img').exists()).toBe(false)
    expect(wrapper.get('.ui-list-title').text()).toBe('<b>제목</b>')
    expect(wrapper.find('.ui-list-empty').exists()).toBe(false)
    const custom = mount(UIList, { props: { label: '업무', items: [] }, slots: { empty: () => h('button', '추가') } })
    expect(custom.get('.ui-list-empty button').text()).toBe('추가')
  })
})
