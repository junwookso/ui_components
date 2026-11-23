import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import UIButton from '../button/UIButton.vue'
import UIRadioGroup from './UIRadioGroup.vue'
import type { UIRadioGroupOption } from './types'

const options: UIRadioGroupOption[] = [
  { value: 'team', label: '담당 팀' },
  { value: 'company', label: '전사 (권한 필요)', disabled: true },
  { value: 'private', label: '나만 보기' },
]

const meta = {
  title: 'Components/UIRadioGroup',
  component: UIRadioGroup,
  args: { name: 'visibility', label: '공개 범위', options, required: false, disabled: false, invalid: false },
  render: args => ({
    components: { UIRadioGroup },
    setup: () => ({ args }),
    template: '<UIRadioGroup v-bind="args" />',
  }),
} satisfies Meta<typeof UIRadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const States: Story = {
  render: () => ({
    components: { UIRadioGroup },
    setup: () => ({
      options,
      longOptions: [
        { value: 'team', label: '담당 팀과 승인 권한이 있는 담당자에게만 검토 문서와 첨부 파일 공개' },
        { value: 'private', label: '나만 보기' },
      ],
    }),
    template: `
      <div class="grid w-full max-w-xs gap-4">
        <UIRadioGroup name="locked-visibility" label="관리자가 지정한 공개 범위" :options="options" model-value="team" disabled />
        <div class="grid gap-2">
          <UIRadioGroup name="draft-visibility" label="문서 공개 범위 (필수)" :options="longOptions" required invalid aria-describedby="visibility-error" />
          <p id="visibility-error" class="ui-body text-destructive">문서를 저장하려면 공개 범위를 선택해 주세요.</p>
        </div>
      </div>
    `,
  }),
}

export const Form: Story = {
  render: () => ({
    components: { UIRadioGroup, UIButton },
    setup: () => {
      const value = ref('')
      const result = ref('')
      function submit(event: SubmitEvent) {
        const data = new FormData(event.currentTarget as HTMLFormElement)
        result.value = options.find(option => option.value === data.get('visibility'))?.label ?? ''
      }
      function reset() {
        value.value = ''
        result.value = ''
      }
      return { options, value, result, submit, reset }
    },
    template: `
      <div class="grid w-full max-w-xs gap-4">
        <div class="grid gap-2">
          <UIRadioGroup v-model="value" name="visibility" label="공개 범위 (필수)" :options="options"
            required form="visibility-form" aria-describedby="visibility-help" />
          <p id="visibility-help" class="ui-body ui-text-muted">저장한 문서를 볼 수 있는 대상을 선택해 주세요.</p>
        </div>
        <form id="visibility-form" class="flex justify-end gap-2" @submit.prevent="submit" @reset.prevent="reset">
          <UIButton type="reset" variant="outline">초기화</UIButton>
          <UIButton type="submit">저장</UIButton>
        </form>
        <p role="status" class="ui-body">{{ result ? '저장한 공개 범위: ' + result : '' }}</p>
      </div>
    `,
  }),
}
