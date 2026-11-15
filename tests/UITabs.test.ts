import { afterEach, describe, expect, it } from 'vitest'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import UITabs from '../src/components/tabs/UITabs.vue'

const items = [
  { value: 'one', label: '기본' },
  { value: 'disabled', label: '권한', disabled: true },
  { value: 'two', label: '알림' },
]
enableAutoUnmount(afterEach)

describe('UITabs', () => {
  it('links tabs and panels and defaults to the first enabled tab', () => {
    const wrapper = mount(UITabs, { props: { items, label: '설정' }, slots: { panel: '<input value="유지" />' } })
    const tabs = wrapper.findAll('[role="tab"]')
    const panels = wrapper.findAll('[role="tabpanel"]')
    expect(tabs[0]!.attributes('aria-selected')).toBe('true')
    expect(tabs[0]!.attributes('aria-controls')).toBe(panels[0]!.attributes('id'))
    expect(panels[0]!.attributes('aria-labelledby')).toBe(tabs[0]!.attributes('id'))
    expect(panels[0]!.attributes('hidden')).toBeUndefined()
    expect(panels[2]!.attributes('hidden')).toBeDefined()
    expect(tabs[1]!.attributes('disabled')).toBeDefined()
  })

  it('emits selection changes and follows external model updates', async () => {
    const wrapper = mount(UITabs, { props: { items, label: '설정', modelValue: 'one' }, attrs: { 'onUpdate:modelValue': () => {} } })
    await wrapper.findAll('[role="tab"]')[2]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['two'])
    await wrapper.setProps({ modelValue: 'two' })
    expect(wrapper.findAll('[role="tab"]')[2]!.attributes('aria-selected')).toBe('true')
    await wrapper.setProps({ modelValue: 'one' })
    expect(wrapper.findAll('[role="tab"]')[0]!.attributes('aria-selected')).toBe('true')
  })

  it('moves focus past disabled tabs without selecting until activation', async () => {
    const wrapper = mount(UITabs, { props: { items, label: '설정' }, attachTo: document.body })
    const tabs = wrapper.findAll('[role="tab"]')
    const first = tabs[0]!.element as HTMLButtonElement
    first.focus()
    await tabs[0]!.trigger('keydown', { key: 'ArrowRight' })
    expect(document.activeElement).toBe(tabs[2]!.element)
    expect(tabs[0]!.attributes('aria-selected')).toBe('true')
    await tabs[2]!.trigger('keydown', { key: 'ArrowRight' })
    expect(document.activeElement).toBe(tabs[0]!.element)
    await tabs[0]!.trigger('keydown', { key: 'End' })
    expect(document.activeElement).toBe(tabs[2]!.element)
  })

  it('keeps hidden panel DOM and safely falls back when items change', async () => {
    const wrapper = mount(UITabs, { props: { items, label: '설정', modelValue: 'one' }, slots: { panel: '<input />' } })
    const input = wrapper.get('input')
    await input.setValue('변경 중인 내용')
    await wrapper.setProps({ modelValue: 'two' })
    await wrapper.setProps({ modelValue: 'one' })
    expect(wrapper.get('input').element.value).toBe('변경 중인 내용')
    await wrapper.setProps({ items: items.slice(1) })
    expect(wrapper.findAll('[role="tab"]')[1]!.attributes('aria-selected')).toBe('true')
    await wrapper.setProps({ items: [items[1]!] })
    expect(wrapper.find('[aria-selected="true"]').exists()).toBe(false)
    expect(wrapper.find('[role="tabpanel"]:not([hidden])').exists()).toBe(false)
    await wrapper.setProps({ items: [] })
    expect(wrapper.find('[role="tab"]').exists()).toBe(false)
  })
})
