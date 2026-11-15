import { afterEach, describe, expect, it, vi } from 'vitest'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import UIInput from '../src/components/input/UIInput.vue'

enableAutoUnmount(afterEach)

describe('UIInput', () => {
  it('supports parent updates, user input, and clearing without converting strings', async () => {
    const wrapper = mount(UIInput, { props: { modelValue: '처음' } })
    expect(wrapper.get('input').element.value).toBe('처음')
    await wrapper.setProps({ modelValue: '변경' })
    expect(wrapper.get('input').element.value).toBe('변경')
    await wrapper.get('input').setValue('00123')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['00123'])
    await wrapper.get('input').setValue('')
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([''])
  })

  it('does not emit partial Korean IME input before composition ends', async () => {
    const wrapper = mount(UIInput)
    await wrapper.get('input').trigger('compositionstart')
    wrapper.get('input').element.value = 'ㅎ'
    await wrapper.get('input').trigger('input')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.get('input').element.value = '한'
    await wrapper.get('input').trigger('compositionend')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['한'])
  })

  it('forwards form and accessibility attributes and native focus events', async () => {
    const onFocus = vi.fn()
    const wrapper = mount(UIInput, {
      props: { type: 'email', invalid: true },
      attrs: { id: 'email', name: 'email', required: true, autocomplete: 'email', 'aria-describedby': 'help', onFocus },
    })
    expect(wrapper.get('input').attributes()).toMatchObject({ id: 'email', name: 'email', type: 'email', 'aria-invalid': 'true', 'aria-describedby': 'help', autocomplete: 'email' })
    expect(wrapper.get('input').element.required).toBe(true)
    await wrapper.get('input').trigger('focus')
    expect(onFocus).toHaveBeenCalledOnce()
    await wrapper.setProps({ invalid: false })
    expect(wrapper.get('input').attributes('aria-invalid')).toBeUndefined()
  })

  it('renders icon slots while keeping labels, attributes, and events on the input', async () => {
    const onInput = vi.fn()
    const wrapper = mount(UIInput, {
      attrs: { id: 'with-icons', name: 'query', 'aria-label': '검색', onInput },
      slots: {
        prefix: '<svg data-icon="search" />',
        suffix: '<svg data-icon="status" />',
      },
    })
    expect(wrapper.attributes('id')).toBeUndefined()
    expect(wrapper.get('input').attributes('id')).toBe('with-icons')
    expect(wrapper.get('.ui-input-prefix').attributes('aria-hidden')).toBe('true')
    expect(wrapper.get('.ui-input-suffix').attributes('aria-hidden')).toBe('true')
    await wrapper.get('input').setValue('아이콘 검색')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['아이콘 검색'])
    expect(onInput).toHaveBeenCalledOnce()
  })

  it('keeps disabled and readonly as distinct native states', () => {
    const disabled = mount(UIInput, { props: { disabled: true } })
    const readonly = mount(UIInput, { props: { readonly: true, modelValue: '복사 가능' } })
    expect(disabled.get('input').element.disabled).toBe(true)
    expect(readonly.get('input').element.readOnly).toBe(true)
    expect(readonly.get('input').element.disabled).toBe(false)
    expect(readonly.get('input').element.value).toBe('복사 가능')
  })
})
