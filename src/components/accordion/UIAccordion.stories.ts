import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import UIAccordion from './UIAccordion.vue'
import type { UIAccordionItem } from './types'

const items = [
  { value: 'access', label: '기본 권한', content: '사용자에게 적용되는 기본 열람 범위를 확인합니다.' },
  { value: 'policy', label: '관리자 정책', content: '관리자가 지정한 회사 정책입니다.', disabled: true },
  { value: 'notifications', label: '업무 알림을 받을 팀과 알림 종류', content: '팀과 업무 상태에 따라 받을 알림을 확인합니다.' },
  { value: 'archive', label: '기록 보존 설정', content: '보존 기간은 관리자 정책을 따릅니다.', disabled: true },
] satisfies UIAccordionItem[]

const meta = {
  title: 'Components/UIAccordion',
  component: UIAccordion,
  args: { items },
  render: args => ({
    components: { UIAccordion },
    setup: () => ({ args }),
    template: `<div class="w-[min(28rem,calc(100vw-6rem))]">
      <UIAccordion v-bind="args" />
    </div>`,
  }),
} satisfies Meta<typeof UIAccordion>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = { args: { defaultValue: ['access'] } }
export const Disabled: Story = { args: { disabled: true, defaultValue: ['access'] } }
export const Multiple: Story = {
  args: { multiple: true },
  render: args => ({
    components: { UIAccordion },
    setup: () => ({ args, opened: ref(['access', 'notifications']) }),
    template: `<div class="w-[min(28rem,calc(100vw-6rem))]">
      <UIAccordion v-bind="args" v-model="opened">
        <template #content="{ item }">
          <label v-if="item.value === 'notifications'" class="flex items-start gap-2">
            <input type="checkbox" class="ui-checkbox" /> 이메일 업무 알림 받기
          </label>
          <p v-else class="ui-body">{{ item.content }}</p>
        </template>
      </UIAccordion>
    </div>`,
  }),
}
