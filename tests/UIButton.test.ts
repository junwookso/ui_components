import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount, enableAutoUnmount } from '@vue/test-utils'
import UIButton from '../src/components/button/UIButton.vue'

enableAutoUnmount(afterEach)

describe('UIButton', () => {
  it('renders slot content and forwards native attributes and click events', async () => {
    const onClick = vi.fn()
    const wrapper = mount(UIButton, {
      attrs: { 'aria-label': '저장', id: 'save', onClick },
      slots: { default: '저장하기' },
    })
    expect(wrapper.text()).toBe('저장하기')
    expect(wrapper.attributes('aria-label')).toBe('저장')
    expect(wrapper.attributes('id')).toBe('save')
    await wrapper.trigger('click')
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('blocks repeated clicks while loading and exposes a busy state', async () => {
    const onClick = vi.fn()
    const wrapper = mount(UIButton, { props: { loading: true }, attrs: { onClick }, slots: { default: '저장 중' }, attachTo: document.body })
    wrapper.element.click()
    expect(onClick).not.toHaveBeenCalled()
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.element.disabled).toBe(true)
    expect(wrapper.text()).toBe('저장 중')
    await wrapper.setProps({ loading: false })
    expect(wrapper.attributes('aria-busy')).toBeUndefined()
    wrapper.element.click()
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('does not activate when disabled', () => {
    const onClick = vi.fn()
    const wrapper = mount(UIButton, { props: { disabled: true }, attrs: { onClick }, attachTo: document.body })
    wrapper.element.click()
    expect(onClick).not.toHaveBeenCalled()
    expect(wrapper.element.disabled).toBe(true)
  })

  it('does not submit by default, but allows explicit submit and reset', async () => {
    const form = document.createElement('form')
    document.body.append(form)
    const onSubmit = vi.fn((event: Event) => event.preventDefault())
    const onReset = vi.fn()
    form.addEventListener('submit', onSubmit)
    form.addEventListener('reset', onReset)
    const wrapper = mount(UIButton, { attachTo: form })
    try {
      wrapper.element.click()
      expect(onSubmit).not.toHaveBeenCalled()
      await wrapper.setProps({ type: 'submit' })
      wrapper.element.click()
      expect(onSubmit).toHaveBeenCalledOnce()
      await wrapper.setProps({ type: 'reset' })
      wrapper.element.click()
      expect(onReset).toHaveBeenCalledOnce()
    } finally {
      wrapper.unmount()
      form.remove()
    }
  })
})
