import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import UIChip from '../src/components/chip/UIChip.vue'

describe('UIChip', () => {
  it('renders a non-interactive text label and a decorative icon slot', () => {
    const wrapper = mount(UIChip, { props: { label: '승인 완료' }, attrs: { id: 'status', 'data-testid': 'chip' }, slots: { icon: '<svg focusable="false" />' } })
    expect(wrapper.element.tagName).toBe('SPAN')
    expect(wrapper.text()).toBe('승인 완료')
    expect(wrapper.find('button').exists()).toBe(false)
    expect(wrapper.attributes('tabindex')).toBeUndefined()
    expect(wrapper.attributes('id')).toBe('status')
    expect(wrapper.get('.ui-chip-icon').attributes('aria-hidden')).toBe('true')
  })

  it('emits remove without hiding itself, submitting a form or bubbling the click', async () => {
    const parentClick = vi.fn()
    const wrapper = mount(UIChip, { props: { label: '플랫폼팀', removable: true }, attrs: { onClick: parentClick } })
    const button = wrapper.get('button')
    expect(button.attributes('type')).toBe('button')
    expect(button.attributes('aria-label')).toBe('플랫폼팀 제거')
    await button.trigger('click')
    expect(wrapper.emitted('remove')).toHaveLength(1)
    expect(wrapper.emitted('remove')![0]![0]).toBeInstanceOf(MouseEvent)
    expect(parentClick).not.toHaveBeenCalled()
    expect(wrapper.text()).toBe('플랫폼팀')
    await wrapper.get('.ui-chip-label').trigger('click')
    expect(wrapper.emitted('remove')).toHaveLength(1)
  })

  it('blocks removal while disabled and updates the accessible name with props', async () => {
    const wrapper = mount(UIChip, { props: { label: '고정 조건', removable: true, disabled: true } })
    expect(wrapper.get('button').attributes('disabled')).toBeDefined()
    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('remove')).toBeUndefined()
    await wrapper.setProps({ disabled: false, label: '변경된 조건' })
    expect(wrapper.get('button').attributes('aria-label')).toBe('변경된 조건 제거')
    await wrapper.setProps({ removeLabel: '부서 필터 해제' })
    expect(wrapper.get('button').attributes('aria-label')).toBe('부서 필터 해제')
    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('remove')).toHaveLength(1)
    await wrapper.setProps({ removable: false })
    expect(wrapper.find('button').exists()).toBe(false)
  })
})
