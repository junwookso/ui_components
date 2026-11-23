import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { UIAccordion, UIPagination } from '../src'

describe('UIAccordion', () => {
  const items = [
    { value: 'one', label: '첫 섹션' },
    { value: 'two', label: '둘째 섹션' },
  ]

  it('honors a controlled value and emits an empty array when closing a single section', async () => {
    const wrapper = mount(UIAccordion, { props: { items, modelValue: ['two'], headingLevel: 4 } })
    const [first, second] = wrapper.findAll('h4 button')
    expect(first!.attributes('aria-expanded')).toBe('false')
    expect(second!.attributes('aria-expanded')).toBe('true')
    await second!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[[]]])
    await wrapper.setProps({ modelValue: ['one'] })
    expect(first!.attributes('aria-expanded')).toBe('true')
    expect(second!.attributes('aria-expanded')).toBe('false')
    wrapper.unmount()
  })
})

describe('UIPagination', () => {
  it('bounds presentation without emitting when an external count shrinks', async () => {
    const wrapper = mount(UIPagination, { props: { pageCount: 20, page: 15 } })
    const current = () => wrapper.get('[aria-current="page"]')
    expect(current().text()).toBe('15')
    await wrapper.setProps({ pageCount: 5 })
    expect(current().text()).toBe('5')
    expect(wrapper.findAll('button').at(-1)?.attributes('disabled')).toBeDefined()
    expect(wrapper.emitted('update:page')).toBeUndefined()
    await wrapper.get('button[aria-label="3 페이지"]').trigger('click')
    expect(wrapper.emitted('update:page')).toEqual([[3]])
    await wrapper.setProps({ pageCount: 1 })
    expect(wrapper.find('nav').exists()).toBe(false)
    await wrapper.setProps({ pageCount: Infinity })
    expect(wrapper.find('nav').exists()).toBe(false)
  })

  it('keeps the number of controls fixed for a large page count', () => {
    const wrapper = mount(UIPagination, { props: { pageCount: 1_000_000, page: 500_000 } })
    expect(wrapper.findAll('[aria-label$="페이지"]').map(button => button.text())).toEqual([
      '1', '499999', '500000', '500001', '1000000',
    ])
    expect(wrapper.findAll('.ui-pagination-ellipsis')).toHaveLength(2)
  })
})
