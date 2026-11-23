import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { fn } from 'storybook/test'
import UITimePicker from './UITimePicker.vue'
import UIButton from '../button/UIButton.vue'
const meta = {
  title: 'Components/UITimePicker', component: UITimePicker,
  args: { size: 'default', minuteStep: 1, disabled: false, readonly: false, invalid: false, 'onUpdate:modelValue': fn() },
  argTypes: { size: { control: 'select', options: ['sm', 'default', 'lg'] }, minuteStep: { control: { type: 'number', min: 1, max: 1440 } } },
  render: args => ({ components: { UITimePicker }, setup: () => ({ args }),
    template: '<div class="w-[min(280px,calc(100vw-6rem))] max-w-full"><label for="time-playground" class="ui-label block mb-2">시작 시간</label><UITimePicker id="time-playground" v-bind="args" /></div>',
  }),
} satisfies Meta<typeof UITimePicker>
export default meta
type Story = StoryObj<typeof meta>
export const Playground: Story = { args: { modelValue: '14:30' } }
export const Interactive: Story = {
  render: () => ({ components: { UITimePicker, UIButton }, setup: () => ({ time: ref('14:30') }),
    template: '<div class="grid w-[min(280px,calc(100vw-6rem))] max-w-full gap-4"><div><label for="time-interactive" class="ui-label block mb-2">시작 시간</label><UITimePicker id="time-interactive" v-model="time" /></div><p data-testid="time-value" class="ui-body">선택한 시간: {{ time || "없음" }}</p><div class="flex justify-end"><UIButton variant="outline" @click="time = \'\'">초기화</UIButton></div></div>',
  }),
}
export const Sizes: Story = {
  render: () => ({ components: { UITimePicker }, setup: () => ({ sizes: ['sm', 'default', 'lg'] as const }),
    template: '<div class="grid w-[min(280px,calc(100vw-6rem))] max-w-full gap-4"><div v-for="size in sizes" :key="size"><label :for="`time-${size}`" class="ui-label block mb-2">{{ size }}</label><UITimePicker :id="`time-${size}`" :size="size" model-value="14:30" /></div></div>',
  }),
}
export const States: Story = {
  render: () => ({ components: { UITimePicker },
    template: `<div class="grid w-[min(280px,calc(100vw-6rem))] max-w-full gap-4">
      <div><label for="time-empty" class="ui-label block mb-2">기본</label><UITimePicker id="time-empty" /></div>
      <div><label for="time-disabled" class="ui-label block mb-2">비활성</label><UITimePicker id="time-disabled" disabled model-value="14:30" /></div>
      <div><label for="time-readonly" class="ui-label block mb-2">읽기 전용</label><UITimePicker id="time-readonly" readonly model-value="14:30" /></div>
      <div><label for="time-invalid" class="ui-label block mb-2">마감 시간</label><UITimePicker id="time-invalid" invalid aria-describedby="time-error" /><p id="time-error" class="ui-body mt-2 text-destructive">마감 시간을 입력해 주세요.</p></div>
    </div>`,
  }),
}
export const Form: Story = {
  render: () => ({ components: { UITimePicker, UIButton }, setup: () => ({ time: ref(''), result: ref('') }),
    template: `<form class="grid w-[min(280px,calc(100vw-6rem))] max-w-full gap-4" @submit.prevent="result = time">
      <div><label for="form-time" class="ui-label block mb-2">예약 시간 (필수)</label><UITimePicker id="form-time" name="time" v-model="time" min="09:00" max="18:00" :minute-step="15" required aria-describedby="time-help" /><p id="time-help" class="ui-caption mt-2">09:00~18:00, 15분 간격으로 입력해 주세요.</p></div>
      <div class="flex justify-end"><UIButton type="submit">적용</UIButton></div><p role="status">{{ result }}</p>
    </form>`,
  }),
}
