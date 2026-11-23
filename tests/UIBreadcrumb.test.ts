import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { UIBreadcrumb } from '../src'

describe('UIBreadcrumb', () => {
  it('identifies the last item as current and hides separators from assistive technology', () => {
    const wrapper = mount(UIBreadcrumb, {
      props: {
        label: '업무 위치',
        items: [
          { key: 'list', label: '업무 요청', href: '/requests', target: '_blank' },
          { key: 'group', label: '권한 검토' },
          { key: 'detail', label: '요청 상세', href: '/requests/1048' },
        ],
      },
    })
    expect(wrapper.get('nav').attributes('aria-label')).toBe('업무 위치')
    expect(wrapper.findAll('li')).toHaveLength(3)
    expect(wrapper.findAll('[aria-hidden="true"]')).toHaveLength(2)
    expect(wrapper.findAll('a')).toHaveLength(1)
    expect(wrapper.get('a').attributes()).toMatchObject({
      href: '/requests', target: '_blank', rel: 'noopener',
    })
    expect(wrapper.get('span[aria-current="page"]').text()).toBe('요청 상세')
  })

  it('passes the native event to callers and removes the landmark for an empty trail', async () => {
    const onNavigate = vi.fn((_item, event: MouseEvent) => event.preventDefault())
    const item = { key: 'list', label: '업무 요청', href: '/requests' }
    const wrapper = mount(UIBreadcrumb, {
      props: { items: [item, { key: 'detail', label: '요청 상세' }], onNavigate },
    })
    const click = new MouseEvent('click', { bubbles: true, cancelable: true, ctrlKey: true })
    wrapper.get('a').element.dispatchEvent(click)
    expect(onNavigate).toHaveBeenCalledWith(item, click)
    expect(click.defaultPrevented).toBe(true)

    await wrapper.setProps({ items: [{ key: 'detail', label: '요청 상세' }] })
    expect(wrapper.findAll('a, [aria-hidden="true"]')).toHaveLength(0)
    await wrapper.setProps({ items: [] })
    expect(wrapper.find('nav').exists()).toBe(false)
  })
})
