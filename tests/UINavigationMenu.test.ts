import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { UINavigationMenu, type UINavigationMenuItem } from '../src'
const items: UINavigationMenuItem[] = [{ key: 'root', label: '업무', children: [{ key: 'group', label: '프로젝트', children: [
  { key: 'list', label: '목록', routeName: 'list', href: '/list', children: [{ key: 'four', label: '4단계', routeName: 'four' }] },
  { key: 'detail', label: '상세', routeName: 'detail', href: '/detail' },
] }] }, { key: 'disabled', label: '비활성', routeName: 'disabled', href: '/disabled', disabled: true }]
describe('UINavigationMenu', () => {
  it('matches route names exactly, opens ancestors and limits depth to three', async () => {
    const wrapper = mount(UINavigationMenu, { props: { items, currentRouteName: 'list' } })
    expect(wrapper.get('nav').attributes('aria-label')).toBe('주요 메뉴')
    expect(wrapper.get('[aria-current="page"]').text()).toBe('목록')
    expect(wrapper.findAll('[aria-expanded="true"]')).toHaveLength(2)
    expect(wrapper.text()).not.toContain('4단계')
    await wrapper.setProps({ currentRouteName: 'list-detail' })
    expect(wrapper.find('[aria-current]').exists()).toBe(false)
    await wrapper.setProps({ currentRouteName: 'detail' })
    expect(wrapper.get('[aria-current="page"]').text()).toBe('상세')
  })
  it('allows collapsing active ancestors and reopens on route changes', async () => {
    const wrapper = mount(UINavigationMenu, { props: { items, currentRouteName: 'list' } })
    await wrapper.get('button').trigger('click')
    expect(wrapper.get('button').attributes('aria-expanded')).toBe('false')
    expect(wrapper.get('ul ul').attributes('style')).toContain('display: none')
    expect(wrapper.emitted('select')).toBeUndefined()
    await wrapper.setProps({ currentRouteName: 'detail' })
    expect(wrapper.get('ul ul').attributes('style') ?? '').not.toContain('display: none')
    await wrapper.get('a').trigger('click')
    expect(wrapper.emitted('select')?.[0]?.[0]).toEqual(items[0]?.children?.[0]?.children?.[0])
  })
  it('disables navigation including descendants and supports symbol names', async () => {
    const name = Symbol('route')
    const wrapper = mount(UINavigationMenu, { props: { currentRouteName: name, items: [
      { key: 'symbol', label: '심볼', routeName: name },
      { key: 'parent', label: '잠김', disabled: true, children: [{ key: 'child', label: '자식', routeName: 'child', href: '/child' }] },
    ] } })
    expect(wrapper.get('[aria-current="page"]').text()).toBe('심볼')
    expect(wrapper.find('a').exists()).toBe(false)
    await wrapper.get('[aria-disabled]').trigger('click')
    expect(wrapper.emitted('select')).toBeUndefined()
  })
  it('keeps parent navigation separate from expansion and supports empty data', async () => {
    const wrapper = mount(UINavigationMenu, { props: { items: [{ key: 'root', label: '업무', routeName: 'root', href: '/root', children: [{ key: 'child', label: '자식' }] }] } })
    await wrapper.get('a').trigger('click')
    expect(wrapper.emitted('select')).toHaveLength(1)
    expect(wrapper.get('button').attributes('aria-expanded')).toBe('false')
    await wrapper.get('button').trigger('click')
    expect(wrapper.get('button').attributes('aria-expanded')).toBe('true')
    await wrapper.setProps({ items: [] })
    expect(wrapper.find('li').exists()).toBe(false)
  })
})
