import { afterEach, describe, expect, it } from 'vitest'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import UITree from '../src/components/tree/UITree.vue'

const items = [
  { value: 'root', label: 'Root', children: [
    { value: 'alpha', label: 'Alpha' },
    { value: 'blocked', label: 'Blocked', disabled: true, children: [{ value: 'hidden', label: 'Hidden' }] },
    { value: 'beta', label: 'Beta', children: [{ value: 'child', label: 'Child' }] },
  ] },
  { value: 'end', label: 'End' },
]
enableAutoUnmount(afterEach)
const create = (props = {}) => mount(UITree, { props: { items, label: '조직', ...props }, attachTo: document.body })
const node = (wrapper: ReturnType<typeof create>, label: string) => wrapper.get(`[role="treeitem"][aria-label="${label}"]`)

describe('UITree', () => {

  it('keeps controlled state authoritative and separates disclosure from selection', async () => {
    const wrapper = mount(UITree, { props: { items, label: '조직', expanded: [], modelValue: 'end', 'onUpdate:expanded': () => {}, 'onUpdate:modelValue': () => {} } })
    await node(wrapper, 'Root').get('.ui-tree-toggle').trigger('click')
    expect(wrapper.emitted('update:expanded')?.[0]).toEqual([['root']])
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(node(wrapper, 'Root').attributes('aria-expanded')).toBe('false')
    await wrapper.setProps({ expanded: ['root'], modelValue: 'alpha' })
    expect(node(wrapper, 'Alpha').attributes('aria-selected')).toBe('true')
    await node(wrapper, 'Beta').get('.ui-tree-row').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['beta'])
    expect(node(wrapper, 'Alpha').attributes('aria-selected')).toBe('true')
  })

  it('blocks disabled subtrees and retains a single tab stop', async () => {
    const wrapper = create({ expanded: ['root', 'blocked'] })
    for (const label of ['Blocked', 'Hidden']) {
      expect(node(wrapper, label).attributes('aria-disabled')).toBe('true')
      await node(wrapper, label).get('.ui-tree-row').trigger('click')
      await node(wrapper, label).trigger('keydown', { key: 'Enter' })
    }
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.findAll('[role="treeitem"][tabindex="0"]')).toHaveLength(1)
  })

  it('repairs focus when ancestors collapse, items disappear or become disabled', async () => {
    const wrapper = create({ expanded: ['root', 'beta'] })
    ;(node(wrapper, 'Child').element as HTMLElement).focus()
    await nextTick()
    await wrapper.setProps({ expanded: ['root'] })
    await nextTick()
    expect(document.activeElement).toBe(node(wrapper, 'Beta').element)
    await wrapper.setProps({ items: [items[1]!] })
    await nextTick()
    expect(document.activeElement).toBe(node(wrapper, 'End').element)
    await wrapper.setProps({ items: [{ ...items[1]!, disabled: true }] })
    await nextTick()
    expect(document.activeElement).toBe(wrapper.get('[role="tree"]').element)
    await wrapper.setProps({ items: [] })
    expect(wrapper.get('[role="status"]').text()).toBe('표시할 항목이 없습니다.')
  })
})
