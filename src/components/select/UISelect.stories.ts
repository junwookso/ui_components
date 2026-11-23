import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { fn } from 'storybook/test'
import UISelect from './UISelect.vue'
import UIButton from '../button/UIButton.vue'
import type { UISelectOption } from './types'
const options: UISelectOption[] = [
  { value: 'pending', label: '검토 대기' },
  { value: 'reviewing', label: '검토 중' },
  { value: 'closed', label: '종료 (선택 불가)', disabled: true },
  { value: 'approved', label: '승인 완료' },
]
const meta = {
  title: 'Components/UISelect', component: UISelect,
  args: { options, placeholder: '선택해 주세요', size: 'default', disabled: false, required: false, invalid: false, 'onUpdate:modelValue': fn() },
  argTypes: { size: { control: 'select', options: ['sm', 'default', 'lg'] } },
  render: args => ({ components: { UISelect }, setup: () => ({ args }),
    template: '<div class="w-[min(280px,calc(100vw-6rem))] max-w-full"><label for="select-playground" class="ui-label block mb-2">업무 상태</label><UISelect id="select-playground" v-bind="args" /></div>',
  }),
} satisfies Meta<typeof UISelect>
export default meta
type Story = StoryObj<typeof meta>
export const Playground: Story = {}
export const Interactive: Story = {
  render: () => ({ components: { UISelect, UIButton }, setup: () => ({ options, value: ref('pending') }),
    template: `<div class="grid w-[min(280px,calc(100vw-6rem))] max-w-full gap-4"><div><label for="select-interactive" class="ui-label block mb-2">업무 상태</label><UISelect id="select-interactive" v-model="value" :options="options" placeholder="전체 상태" /></div><p data-testid="selection" class="ui-body">선택값: {{ value || '없음' }}</p><div class="flex justify-end"><UIButton variant="outline" @click="value = ''">초기화</UIButton></div></div>`,
  }),
}
export const Sizes: Story = {
  render: () => ({ components: { UISelect }, setup: () => ({ options, sizes: ['sm', 'default', 'lg'] as const }),
    template: '<div class="grid w-[min(280px,calc(100vw-6rem))] max-w-full gap-4"><div v-for="size in sizes" :key="size"><label :for="`select-${size}`" class="ui-label block mb-2">{{ size }}</label><UISelect :id="`select-${size}`" :size="size" :options="options" model-value="pending" /></div></div>',
  }),
}
export const States: Story = {
  render: () => ({ components: { UISelect }, setup: () => ({ options }),
    template: `<div class="grid w-[min(280px,calc(100vw-6rem))] max-w-full gap-4">
      <div><label for="select-enabled" class="ui-label block mb-2">기본</label><UISelect id="select-enabled" :options="options" /></div>
      <div><label for="select-disabled" class="ui-label block mb-2">비활성</label><UISelect id="select-disabled" :options="options" disabled model-value="pending" /></div>
      <div><label for="select-error" class="ui-label block mb-2">담당 상태</label><UISelect id="select-error" :options="options" invalid aria-describedby="select-error-message" /><p id="select-error-message" class="ui-body mt-2 text-destructive">업무 상태를 선택해 주세요.</p></div>
    </div>`,
  }),
}
export const Empty: Story = { args: { options: [], placeholder: '선택 가능한 항목이 없습니다.' } }
export const LongLabels: Story = { args: { options: [{ value: 'long', label: '여러 부서의 검토와 담당자 확인을 기다리는 프로젝트 승인 요청' }], modelValue: 'long' } }
export const Form: Story = {
  render: () => ({ components: { UISelect, UIButton }, setup: () => ({ options, value: ref(''), result: ref('') }),
    template: `<form class="grid w-[min(280px,calc(100vw-6rem))] max-w-full gap-4" @submit.prevent="result = value">
      <div><label for="form-status" class="ui-label block mb-2">업무 상태 (필수)</label><UISelect id="form-status" name="status" v-model="value" :options="options" required aria-describedby="status-help" /><p id="status-help" class="ui-caption mt-2">처리할 업무 상태를 선택해 주세요.</p></div>
      <div class="flex justify-end"><UIButton type="submit">적용</UIButton></div><p role="status">{{ result }}</p>
    </form>`,
  }),
}
