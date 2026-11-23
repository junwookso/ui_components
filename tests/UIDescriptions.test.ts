import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import UIDescriptions from '../src/components/descriptions/UIDescriptions.vue'

const items = [
  { key: 'name', label: '이름', value: '김민수' },
  { key: 'zero', label: '수량', value: 0 },
  { key: 'false', label: '권한', value: false },
  { key: 'true', label: '활성', value: true },
  { key: 'missing', label: '내선', value: null },
  { key: 'blank', label: '비고', value: '   ' },
]
describe('UIDescriptions', () => {
  it('groups native terms and values, preserves zero and false, and names the section', () => {
    const wrapper = mount(UIDescriptions, { props: { label: '직원 정보', items, headingLevel: 3 } })
    expect(wrapper.attributes('aria-labelledby')).toBe(wrapper.get('h3').attributes('id'))
    expect(wrapper.findAll('dl > div > dt').map(node => node.text())).toEqual(items.map(item => item.label))
    expect(wrapper.findAll('dl > div > dd').map(node => node.text())).toEqual(['김민수', '0', '아니요', '예', '미등록', '미등록'])
    expect(wrapper.find('table').exists()).toBe(false)
  })
  it('renders specific value slots before the common slot and updates keyed data', async () => {
    const wrapper = mount(UIDescriptions, {
      props: { label: '직원 정보', items: items.slice(0, 2) },
      slots: { value: '<template #default="{ value }"><em>{{ value }}</em></template>', 'value-name': '<template #default="{ item }"><a href="#employee">{{ item.value }} 상세</a></template>' },
    })
    expect(wrapper.get('dd a').text()).toBe('김민수 상세')
    expect(wrapper.get('dd em').text()).toBe('0')
    await wrapper.setProps({ items: [{ key: 'name', label: '담당자', value: '이서연' }] })
    expect(wrapper.get('dt').text()).toBe('담당자')
    expect(wrapper.get('dd a').text()).toBe('이서연 상세')
  })
})
