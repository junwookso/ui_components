import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import { UICombobox } from '../src'

const teams = [{ value: '001', label: '운영지원팀' }]

describe('UICombobox', () => {
  it('preserves a selected label when results change and synchronizes external values', async () => {
    const wrapper = mount(UICombobox, { props: { options: teams, modelValue: '001' } })
    const input = wrapper.get('input')
    expect(input.element.value).toBe('운영지원팀')
    await wrapper.setProps({ options: [] })
    expect(input.element.value).toBe('운영지원팀')
    await wrapper.setProps({
      modelValue: '002',
      selectedOption: { value: '002', label: '플랫폼팀' },
    })
    expect(input.element.value).toBe('플랫폼팀')
    await wrapper.setProps({ modelValue: '' })
    expect(input.element.value).toBe('')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('validates the selection and uses the field name and form only for the selected value', async () => {
    const wrapper = mount(UICombobox, {
      props: { options: teams, required: true, name: 'assignee', form: 'request' },
      attrs: { id: 'assignee-input', 'aria-describedby': 'help', 'aria-invalid': 'true' },
    })
    const input = wrapper.get<HTMLInputElement>('input[role="combobox"]')
    const submitted = wrapper.get<HTMLInputElement>('input[type="hidden"]')
    await nextTick()
    expect(input.attributes()).toMatchObject({
      id: 'assignee-input', form: 'request', 'aria-required': 'true', 'aria-describedby': 'help', 'aria-invalid': 'true',
    })
    expect(input.attributes('name')).toBeUndefined()
    expect(input.element.validity.customError).toBe(true)
    expect(submitted.element.value).toBe('')
    expect(submitted.attributes()).toMatchObject({ name: 'assignee', form: 'request' })

    await wrapper.setProps({ modelValue: '001' })
    expect(input.element.validity.valid).toBe(true)
    expect(submitted.element.value).toBe('001')
    await wrapper.setProps({ disabled: true })
    expect(input.element.disabled).toBe(true)
    expect(submitted.element.disabled).toBe(true)
  })
})
