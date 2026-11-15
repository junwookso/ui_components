import { nextTick, ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import UIChip from './UIChip.vue'
import UIButton from '../button/UIButton.vue'

const meta = {
  title: 'Components/UIChip', component: UIChip,
  args: { label: '플랫폼팀', variant: 'default', size: 'default', removable: false, disabled: false },
  argTypes: {
    variant: { control: 'select', options: ['default', 'outline', 'primary', 'success', 'warning', 'info', 'destructive'] },
    size: { control: 'select', options: ['sm', 'default'] },
  },
} satisfies Meta<typeof UIChip>
export default meta
type Story = StoryObj<typeof meta>
export const Playground: Story = {
  parameters: { docs: { description: { story: '기본 Chip은 filled 배경과 1px 테두리를 함께 표시합니다.' } } },
}
export const Variants: Story = {
  render: () => ({
    components: { UIChip },
    template: `<div class="flex flex-wrap items-center gap-2"><UIChip label="일반" /><UIChip label="외부 협력" variant="outline" /><UIChip label="주요 프로젝트" variant="primary" /><UIChip label="승인 완료" variant="success" /><UIChip label="검토 필요" variant="warning" /><UIChip label="진행 중" variant="info" /><UIChip label="처리 실패" variant="destructive" /></div>`,
  }),
}
export const SizesAndIcons: Story = {
  render: () => ({
    components: { UIChip },
    template: `<div class="flex flex-wrap items-center gap-2"><UIChip size="sm" label="작은 Chip" removable /><UIChip label="기본 Chip" removable /><UIChip label="승인 완료" variant="success"><template #icon><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" focusable="false"><path d="m5 12 4 4L19 6" /></svg></template></UIChip><UIChip label="고정된 조건" disabled removable /></div>`,
  }),
}
export const Removable: Story = {
  render: () => ({
    components: { UIChip, UIButton },
    setup() {
      const initial = ['플랫폼팀', '진행 중', '이번 달']
      const labels = ref([...initial])
      const container = ref<HTMLElement>()
      const message = ref('')
      async function remove(label: string, event: MouseEvent) {
        const index = labels.value.indexOf(label)
        const restoreFocus = event.currentTarget === document.activeElement
        labels.value = labels.value.filter(item => item !== label)
        message.value = `${label} 조건을 제거했습니다.`
        await nextTick()
        if (restoreFocus) {
          const buttons = container.value?.querySelectorAll<HTMLButtonElement>('.ui-chip-remove')
          const target = buttons?.[Math.min(index, (buttons?.length ?? 0) - 1)] ?? container.value?.querySelector<HTMLButtonElement>('[data-reset]')
          target?.focus()
        }
      }
      function reset() { labels.value = [...initial]; message.value = '검색 조건을 초기화했습니다.' }
      return { labels, container, message, remove, reset }
    },
    template: `<div ref="container" style="width: min(32rem, calc(100vw - 6rem))"><h2 class="ui-title">적용된 검색 조건</h2><div role="group" aria-label="적용된 검색 조건" class="flex flex-wrap items-center gap-2" style="margin-top: 1rem"><UIChip v-for="label in labels" :key="label" :label="label" removable @remove="remove(label, $event)" /><span v-if="!labels.length" class="ui-body ui-text-muted">적용된 조건이 없습니다.</span></div><UIButton data-reset size="sm" variant="outline" style="margin-top: 1rem" @click="reset">조건 초기화</UIButton><p role="status" class="ui-body" style="margin-top: 0.5rem">{{ message }}</p></div>`,
  }),
}
export const LongLabel: Story = {
  args: { label: '사내 업무 자동화와 서비스 품질 개선을 담당하는 플랫폼 운영 지원팀', removable: true },
  render: args => ({ components: { UIChip }, setup: () => ({ args }), template: '<div style="width: min(18rem, calc(100vw - 6rem))"><UIChip v-bind="args" /></div>' }),
}
