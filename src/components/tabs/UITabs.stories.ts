import { ref, useId } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import UITabs from './UITabs.vue'
import UIInput from '../input/UIInput.vue'
import UISwitch from '../switch/UISwitch.vue'
import type { UITabItem } from './types'

const items: UITabItem[] = [
  { value: 'general', label: '기본 정보' },
  { value: 'notifications', label: '알림 설정' },
  { value: 'permissions', label: '접근 권한', disabled: true },
  { value: 'history', label: '변경 이력' },
]
const icons = {
  general: '<rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" />',
  notifications: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />',
  permissions: '<rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" />',
  history: '<circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />',
}
const iconTemplate = `<template #icon="{ item }"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
  <template v-if="item.value === 'general'">${icons.general}</template>
  <template v-else-if="item.value === 'notifications'">${icons.notifications}</template>
  <template v-else-if="item.value === 'permissions'">${icons.permissions}</template>
  <template v-else>${icons.history}</template>
</svg></template>`
const panels = `<template #panel="{ item }">
  <div v-if="item.value === 'general'"><label class="field-label ui-label" :for="id + '-name'">프로젝트 이름</label><UIInput :id="id + '-name'" v-model="name" /><p class="field-help ui-body ui-text-muted">탭을 이동해도 입력한 내용은 유지됩니다.</p></div>
  <div v-else-if="item.value === 'notifications'" class="switch-demo-row"><UISwitch :id="id + '-email'" v-model="email" /><label :for="id + '-email'">이메일 알림</label></div>
  <p v-else-if="item.value === 'history'">최근 변경 이력이 없습니다.</p>
  <p v-else>관리자 권한이 필요합니다.</p>
</template>`
const meta = {
  title: 'Components/UITabs',
  component: UITabs,
  args: { items, label: '프로젝트 설정', orientation: 'horizontal' },
  argTypes: { orientation: { control: 'select', options: ['horizontal', 'vertical'] } },
  render: (args) => ({
    components: { UITabs, UIInput, UISwitch },
    setup: () => ({ args, id: useId(), selected: ref('general'), name: ref('사내 업무 포털'), email: ref(true) }),
    template: `<div class="tabs-demo"><UITabs v-bind="args" v-model="selected">${iconTemplate}${panels}</UITabs></div>`,
  }),
} satisfies Meta<typeof UITabs>
export default meta
type Story = StoryObj<typeof meta>
export const Horizontal: Story = {}
export const Vertical: Story = { args: { orientation: 'vertical' } }
export const TextOnly: Story = {
  render: (args) => ({
    components: { UITabs, UIInput, UISwitch },
    setup: () => ({ args, id: useId(), selected: ref('general'), name: ref('사내 업무 포털'), email: ref(true) }),
    template: `<div class="tabs-demo"><UITabs v-bind="args" v-model="selected">${panels}</UITabs></div>`,
  }),
}
export const Overflow: Story = {
  args: { items: [...items, { value: 'members', label: '프로젝트 구성원' }, { value: 'integration', label: '외부 서비스 연동' }, { value: 'billing', label: '비용 및 사용량' }] },
  render: (args) => ({
    components: { UITabs },
    setup: () => ({ args }),
    template: '<div class="tabs-demo"><UITabs v-bind="args"><template #panel="{ item }">{{ item.label }} 내용</template></UITabs></div>',
  }),
}
