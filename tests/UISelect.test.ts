import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { UISelect } from '../src'
const options = [{ value: '001', label: '검토 대기' }, { value: '0', label: '승인' }, { value: 'locked', label: '잠김', disabled: true }]

describe('UISelect', () => {
  it('starts empty without choosing the first option or updating the parent', async () => {
    const wrapper = mount(UISelect, { props: { options } })
    expect(wrapper.element.value).toBe('')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    await wrapper.get('select').setValue('001')
    await wrapper.get('select').setValue('0')
    await wrapper.get('select').setValue('')
    expect(wrapper.emitted('update:modelValue')).toEqual([['001'], ['0'], ['']])
    await wrapper.setProps({ modelValue: '001' })
    expect(wrapper.element.value).toBe('001')
  })
  it('preserves an unmatched model until options arrive and does not choose a replacement', async () => {
    const wrapper = mount(UISelect, { props: { options: [], modelValue: '001' } })
    expect(wrapper.element.selectedIndex).toBe(-1)
    await wrapper.setProps({ options })
    expect(wrapper.element.value).toBe('001')
    await wrapper.setProps({ options: options.slice(1) })
    expect(wrapper.element.selectedIndex).toBe(-1)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    await wrapper.setProps({ modelValue: '' })
    expect(wrapper.element.selectedIndex).toBe(0)
  })
})
