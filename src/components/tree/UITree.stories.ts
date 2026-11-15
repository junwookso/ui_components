import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import UITree from './UITree.vue'
import type { UITreeItem } from './types'

const items: UITreeItem[] = [
  { value: 'company', label: '회사', children: [
    { value: 'engineering', label: '개발본부', children: [
      { value: 'platform', label: '플랫폼팀' },
      { value: 'service', label: '서비스개발팀' },
    ] },
    { value: 'design', label: '디자인팀' },
    { value: 'restricted', label: '인사팀 (접근 권한 없음)', disabled: true },
  ] },
  { value: 'archive', label: '보관된 조직', children: [{ value: 'previous', label: '이전 프로젝트팀' }] },
]
const meta = {
  title: 'Components/UITree',
  component: UITree,
  args: { items, label: '조직 선택' },
  render: args => ({
    components: { UITree },
    setup: () => ({ args, selected: ref<string>(), expanded: ref(['company', 'engineering']) }),
    template: `<div style="max-width: 24rem"><p class="ui-body ui-text-muted">방향키로 이동하고 Enter 또는 Space로 선택하세요.</p><UITree v-bind="args" v-model="selected" v-model:expanded="expanded" /><p class="ui-body" role="status">선택: {{ selected ?? '없음' }}</p></div>`,
  }),
} satisfies Meta<typeof UITree>
export default meta
type Story = StoryObj<typeof meta>
export const Organization: Story = {}
export const WithIcons: Story = {
  render: args => ({
    components: { UITree },
    setup: () => ({ args, selected: ref('platform'), expanded: ref(['company', 'engineering']) }),
    template: `<div style="max-width: 24rem"><UITree v-bind="args" v-model="selected" v-model:expanded="expanded"><template #icon="{ item, expanded }"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" focusable="false"><path v-if="item.children?.length" :d="expanded ? 'M3 7h6l2 2h10l-3 11H3z' : 'M3 5h6l2 2h10v13H3z'" /><path v-else d="M6 3h9l3 3v15H6zM9 10h6M9 14h6" /></svg></template></UITree></div>`,
  }),
}
export const Empty: Story = { args: { items: [] } }
export const LongLabels: Story = {
  args: { items: [{ value: 'company', label: '전사 공통 업무 및 서비스 운영 조직', children: [{ value: 'long', label: '사내 업무 자동화와 서비스 품질 개선을 담당하는 플랫폼 운영 지원팀' }] }] },
}
export const Disabled: Story = { args: { items: [{ value: 'blocked', label: '관리자 전용 조직 (접근 권한 없음)', disabled: true, children: [{ value: 'child', label: '하위 조직' }] }] } }
