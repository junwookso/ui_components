import type { Meta, StoryObj } from '@storybook/vue3-vite'
import UIDescriptions from './UIDescriptions.vue'
import UIChip from '../chip/UIChip.vue'
import type { UIDescriptionItem } from './types'

const items: UIDescriptionItem[] = [
  { key: 'name', label: '이름', value: '김민수' },
  { key: 'department', label: '소속 부서', value: '플랫폼개발팀' },
  { key: 'status', label: '재직 상태', value: '재직' },
  { key: 'email', label: '이메일', value: 'minsu@company.example' },
  { key: 'projects', label: '담당 프로젝트 수', value: 0 },
  { key: 'admin', label: '관리자 권한', value: false },
  { key: 'phone', label: '내선 번호', value: null },
]
const meta = {
  title: 'Components/UIDescriptions', component: UIDescriptions,
  args: { label: '직원 기본 정보', items, bordered: true, layout: 'horizontal' },
  argTypes: { layout: { control: 'select', options: ['horizontal', 'vertical'] }, headingLevel: { control: 'select', options: [2, 3, 4, 5, 6] } },
  render: args => ({ components: { UIDescriptions }, setup: () => ({ args }), template: '<div style="width: min(42rem, calc(100vw - 6rem))"><UIDescriptions v-bind="args" /></div>' }),
} satisfies Meta<typeof UIDescriptions>
export default meta
type Story = StoryObj<typeof meta>
export const Playground: Story = {}
export const Borderless: Story = { args: { bordered: false } }
export const Vertical: Story = { args: { layout: 'vertical' } }
export const CustomValues: Story = {
  render: args => ({ components: { UIDescriptions, UIChip }, setup: () => ({ args }), template: `<div style="width: min(42rem, calc(100vw - 6rem))"><UIDescriptions v-bind="args"><template #value-status="{ value }"><UIChip :label="String(value)" variant="success" size="sm" /></template><template #value-email="{ value }"><a :href="'mailto:' + value" class="text-primary underline underline-offset-4">{{ value }}</a></template></UIDescriptions></div>` }),
}
export const LongValues: Story = { args: { items: [
  { key: 'team', label: '업무 자동화 및 품질 개선 담당 조직', value: '사내 업무 자동화와 서비스 품질 개선을 담당하는 플랫폼 운영 지원팀' },
  { key: 'identifier', label: '외부 식별자', value: 'project_abcdefghijklmnopqrstuvwxyz_0123456789_abcdefghijklmnopqrstuvwxyz_0123456789' },
  { key: 'note', label: '비고', value: '월별 운영 현황을 정리합니다.\n검토 후 담당자에게 전달해 주세요.' },
] } }
export const NarrowContainer: Story = {
  render: args => ({ components: { UIDescriptions }, setup: () => ({ args }), template: '<div style="width: min(20rem, calc(100vw - 6rem))"><UIDescriptions v-bind="args" /></div>' }),
}
export const Empty: Story = { args: { items: [] } }
