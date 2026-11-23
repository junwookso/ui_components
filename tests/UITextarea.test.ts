import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { UITextarea } from '../src'

describe('UITextarea', () => {
  it('starts empty with three rows and synchronizes multiline values', async () => {
    const wrapper = mount(UITextarea)
    const textarea = wrapper.get('textarea')
    expect(textarea.element.rows).toBe(3)
    expect(textarea.element.value).toBe('')

    await textarea.setValue('첫 줄\n둘째 줄')
    expect(wrapper.emitted('update:modelValue')).toEqual([['첫 줄\n둘째 줄']])

    await wrapper.setProps({ modelValue: '' })
    expect(textarea.element.value).toBe('')
  })

  it('emits the composed text only after composition ends', async () => {
    const wrapper = mount(UITextarea)
    const textarea = wrapper.get('textarea')
    await textarea.trigger('compositionstart')
    textarea.element.value = '검토'
    await textarea.trigger('input')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await textarea.trigger('compositionend')
    expect(wrapper.emitted('update:modelValue')).toEqual([['검토']])
  })
})
