import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import { UIFormField } from '../src'
import type { UIFormFieldControlAttrs } from '../src'

function renderInput({ controlAttrs }: { controlAttrs: UIFormFieldControlAttrs }) {
  return h('input', { ...controlAttrs })
}

describe('UIFormField', () => {
  it('generates separate IDs and connects each label and description to its own control', () => {
    const wrapper = mount({
      render: () => h('div', [
        h(UIFormField, { label: '제목', description: '목록에 표시할 이름입니다.' }, { default: renderInput }),
        h(UIFormField, { label: '담당자', description: '요청을 처리할 담당자입니다.' }, { default: renderInput }),
      ]),
    })
    const inputs = wrapper.findAll('input')
    const labels = wrapper.findAll('label')
    const descriptions = wrapper.findAll('p')
    expect(inputs.map(input => input.element.id)).toEqual(labels.map(label => label.element.htmlFor))
    expect(new Set(inputs.map(input => input.element.id)).size).toBe(2)
    expect(inputs.map(input => input.attributes('aria-describedby'))).toEqual(descriptions.map(p => p.element.id))
    expect(new Set(descriptions.map(p => p.element.id)).size).toBe(2)
  })

  it('keeps references in sync when a form changes an error, required state, or ID', async () => {
    const wrapper = mount(UIFormField, {
      props: { id: 'title', label: '제목', required: true, description: '목록에 표시할 이름입니다.' },
      slots: { default: renderInput },
    })
    const input = wrapper.get('input')
    const descriptionId = input.attributes('aria-describedby')
    expect(input.element.required).toBe(true)
    expect(wrapper.get('label').text()).toContain('(필수)')
    expect(wrapper.get('label').element.htmlFor).toBe('title')

    await wrapper.setProps({ error: '제목을 입력해 주세요.' })
    const errorId = wrapper.get('.text-destructive').element.id
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(input.attributes('aria-describedby')).toBe(`${errorId} ${descriptionId}`)

    await wrapper.setProps({ id: 'request-title', required: false, error: '   ' })
    expect(input.attributes('aria-invalid')).toBeUndefined()
    expect(input.attributes('aria-describedby')).toBe(descriptionId)
    expect(input.element.required).toBe(false)
    expect(wrapper.get('label').element.htmlFor).toBe('request-title')
    expect(input.element.id).toBe('request-title')

    await wrapper.setProps({ description: '' })
    expect(input.attributes('aria-describedby')).toBeUndefined()
    expect(wrapper.find('p').exists()).toBe(false)
  })
})
