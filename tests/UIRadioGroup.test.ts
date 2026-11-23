import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { UIRadioGroup } from '../src'

const options = [
  { value: '001', label: '담당 팀' },
  { value: '0', label: '나만 보기' },
]
const props = { options, name: 'visibility', label: '공개 범위' }

describe('UIRadioGroup', () => {

  it('shows a retained model when its option becomes available', async () => {
    const wrapper = mount(UIRadioGroup, { props: { ...props, options: [], modelValue: '001' } })
    await wrapper.setProps({ options: [{ ...options[0], disabled: true }, options[1]] })
    const radio = wrapper.get<HTMLInputElement>('input[value="001"]')
    expect(radio.element.disabled).toBe(true)
    expect(radio.element.checked).toBe(false)

    await wrapper.setProps({ options })
    expect(radio.element.checked).toBe(true)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('restores the checked radio when the parent rejects a change', async () => {
    const update = vi.fn()
    const wrapper = mount(UIRadioGroup, {
      props: { ...props, modelValue: '001', 'onUpdate:modelValue': update },
    })
    const radios = wrapper.findAll('input')

    await radios[1].setValue(true)
    expect(update).toHaveBeenCalledWith('0')
    expect(radios.map(radio => radio.element.checked)).toEqual([true, false])
  })
})
