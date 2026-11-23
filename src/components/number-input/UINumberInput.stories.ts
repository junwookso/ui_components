import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import UIButton from '../button/UIButton.vue'
import UIFormField from '../form-field/UIFormField.vue'
import UINumberInput from './UINumberInput.vue'

const meta = {
  title: 'Components/UINumberInput',
  component: UINumberInput,
  args: { min: 0, max: 100, step: 0.25 },
  render: args => ({
    components: { UIButton, UIFormField, UINumberInput },
    setup: () => ({ args, amount: ref<number | null>(args.modelValue ?? null), saved: ref('') }),
    template: `<form class="grid w-full max-w-xs gap-3" @submit.prevent="saved = String(amount)">
      <UIFormField v-slot="{ controlAttrs }" label="작업 시간" description="0~100시간을 0.25시간 단위로 입력하세요." required>
        <UINumberInput v-bind="{ ...controlAttrs, ...args }" v-model="amount" name="hours" />
      </UIFormField>
      <div class="flex justify-end"><UIButton type="submit">저장</UIButton></div>
      <p class="ui-body" role="status">{{ saved }}</p>
    </form>`,
  }),
} satisfies Meta<typeof UINumberInput>
export default meta
type Story = StoryObj<typeof meta>
export const Form: Story = {}
export const Readonly: Story = { args: { readonly: true, modelValue: 12.5 } }
