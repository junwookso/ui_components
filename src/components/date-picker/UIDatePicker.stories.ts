import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { fn } from 'storybook/test'
import UIDatePicker from './UIDatePicker.vue'
import UIButton from '../button/UIButton.vue'
const meta = {
  title: 'Components/UIDatePicker', component: UIDatePicker,
  args: { level: 'day', size: 'default', disabled: false, readonly: false, invalid: false, 'onUpdate:modelValue': fn() },
  argTypes: { level: { control: 'select', options: ['day', 'month'] }, size: { control: 'select', options: ['sm', 'default', 'lg'] } },
  render: args => ({ components: { UIDatePicker }, setup: () => ({ args }),
    template: '<div class="w-[min(280px,calc(100vw-6rem))] max-w-full"><label for="date-playground" class="ui-label block mb-2">{{ args.level === "month" ? "조회 월" : "기준일" }}</label><UIDatePicker id="date-playground" v-bind="args" /></div>',
  }),
} satisfies Meta<typeof UIDatePicker>
export default meta
type Story = StoryObj<typeof meta>
export const Playground: Story = { args: { modelValue: '2026-11-16' } }
export const Month: Story = { args: { level: 'month', modelValue: '2026-11' } }
export const Levels: Story = {
  render: () => ({ components: { UIDatePicker, UIButton }, setup: () => ({ day: ref('2026-11-16'), month: ref('2026-11') }),
    template: `<div class="grid w-[min(280px,calc(100vw-6rem))] max-w-full gap-4">
      <div><label for="level-day" class="ui-label block mb-2">기준일</label><UIDatePicker id="level-day" v-model="day" /><p class="ui-caption mt-2" data-testid="day-value">선택한 날짜: {{ day || '없음' }}</p></div>
      <div><label for="level-month" class="ui-label block mb-2">조회 월</label><UIDatePicker id="level-month" v-model="month" level="month" /><p class="ui-caption mt-2" data-testid="month-value">선택한 월: {{ month || '없음' }}</p></div>
      <div class="flex justify-end"><UIButton variant="outline" @click="day = ''; month = ''">초기화</UIButton></div>
    </div>`,
  }),
}
export const Sizes: Story = {
  render: () => ({ components: { UIDatePicker }, setup: () => ({ sizes: ['sm', 'default', 'lg'] as const }),
    template: '<div class="grid w-[min(280px,calc(100vw-6rem))] max-w-full gap-4"><div v-for="size in sizes" :key="size"><label :for="`date-${size}`" class="ui-label block mb-2">{{ size }}</label><UIDatePicker :id="`date-${size}`" :size="size" model-value="2026-11-16" /></div></div>',
  }),
}
export const States: Story = {
  render: () => ({ components: { UIDatePicker },
    template: `<div class="grid w-[min(280px,calc(100vw-6rem))] max-w-full gap-4">
      <div><label for="date-empty" class="ui-label block mb-2">기본</label><UIDatePicker id="date-empty" /></div>
      <div><label for="date-disabled" class="ui-label block mb-2">비활성</label><UIDatePicker id="date-disabled" disabled model-value="2026-11-16" /></div>
      <div><label for="date-readonly" class="ui-label block mb-2">읽기 전용</label><UIDatePicker id="date-readonly" readonly model-value="2026-11-16" /></div>
      <div><label for="date-invalid" class="ui-label block mb-2">마감일</label><UIDatePicker id="date-invalid" invalid aria-describedby="date-error" /><p id="date-error" class="ui-body mt-2 text-destructive">마감일을 입력해 주세요.</p></div>
    </div>`,
  }),
}
export const Form: Story = {
  render: () => ({ components: { UIDatePicker, UIButton }, setup: () => ({ day: ref(''), month: ref(''), result: ref('') }),
    template: `<form class="grid w-[min(280px,calc(100vw-6rem))] max-w-full gap-4" @submit.prevent="result = day + ' / ' + month">
      <div><label for="form-day" class="ui-label block mb-2">신청일 (필수)</label><UIDatePicker id="form-day" name="day" v-model="day" min="2020-01-01" max="2035-12-31" required aria-describedby="day-help" /><p id="day-help" class="ui-caption mt-2">2020년 1월 1일~2035년 12월 31일 중 선택해 주세요.</p></div>
      <div><label for="form-month" class="ui-label block mb-2">정산 월 (필수)</label><UIDatePicker id="form-month" name="month" v-model="month" level="month" min="2020-01" max="2035-12" required aria-describedby="month-help" /><p id="month-help" class="ui-caption mt-2">2020년 1월~2035년 12월 중 선택해 주세요.</p></div>
      <div class="flex justify-end"><UIButton type="submit">적용</UIButton></div><p role="status">{{ result }}</p>
    </form>`,
  }),
}
