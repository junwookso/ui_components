import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import UIList from './UIList.vue'
import UIButton from '../button/UIButton.vue'
import UIChip from '../chip/UIChip.vue'

const items = [
  { key: 'access', title: '접근 권한 검토', description: '플랫폼개발팀 · 담당자 김민수\n신규 입사자의 프로젝트 접근 권한을 확인합니다.' },
  { key: 'report', title: '월간 운영 보고서', description: '서비스운영팀 · 담당자 이서연' },
  { key: 'release', title: '배포 일정 확인', description: '품질관리팀 · 담당자 박지훈' },
]
const meta = {
  title: 'Components/UIList', component: UIList,
  args: { label: '검토할 업무', items, bordered: true, size: 'default' },
  argTypes: { size: { control: 'select', options: ['default', 'sm'] }, headingLevel: { control: 'select', options: [2, 3, 4, 5, 6] } },
  render: args => ({ components: { UIList }, setup: () => ({ args }), template: '<div style="width: min(48rem, calc(100vw - 6rem))"><UIList v-bind="args" /></div>' }),
} satisfies Meta<typeof UIList>
export default meta
type Story = StoryObj<typeof meta>
export const Playground: Story = {}
export const Compact: Story = { args: { size: 'sm' } }
export const Borderless: Story = { args: { bordered: false } }
export const WithActions: Story = {
  render: args => ({ components: { UIList, UIButton, UIChip }, setup: () => ({ args, result: ref('') }), template: `<div style="width: min(48rem, calc(100vw - 6rem))"><UIList v-bind="args">
    <template #leading><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true" focusable="false"><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h4" /></svg></template>
    <template #meta="{ index }"><UIChip :label="index === 0 ? '검토 필요' : '진행 중'" :variant="index === 0 ? 'warning' : 'info'" size="sm" /></template>
    <template #actions="{ item }"><UIButton variant="outline" size="sm" :aria-label="item.title + ' 상세 보기'" @click="result = item.title + ' 선택됨'">상세 보기</UIButton></template>
  </UIList><p role="status">{{ result }}</p></div>` }),
}
export const Links: Story = {
  render: args => ({ components: { UIList }, setup: () => ({ args }), template: `<div style="width: min(48rem, calc(100vw - 6rem))"><UIList v-bind="args"><template #title="{ item }"><a :href="'#' + item.key" class="text-primary underline underline-offset-4">{{ item.title }}</a></template></UIList></div>` }),
}
export const LongContent: Story = { args: { items: [{ key: 'long', title: '업무 자동화 및 서비스 품질 개선을 위한 검토 요청', description: 'project_'.repeat(30) + '\n검토 의견은 담당자에게 전달해 주세요.' }] } }
export const Empty: Story = { args: { items: [] } }
export const CustomEmpty: Story = {
  args: { items: [] },
  render: args => ({ components: { UIList, UIButton }, setup: () => ({ args, added: ref(false), items }), template: `<div style="width: min(48rem, calc(100vw - 6rem))"><UIList v-bind="args" :items="added ? items : []"><template #empty><div class="flex flex-wrap items-center justify-between gap-3"><span>등록된 업무가 없습니다.</span><UIButton size="sm" @click="added = true">예제 업무 추가</UIButton></div></template></UIList></div>` }),
}
