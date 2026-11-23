import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import UIButton from '../button/UIButton.vue'
import UICheckbox from './UICheckbox.vue'

const meta = {
  title: 'Components/UICheckbox',
  component: UICheckbox,
  args: { modelValue: false, indeterminate: false, disabled: false, required: false, invalid: false },
  render: args => ({
    components: { UICheckbox },
    setup: () => ({ args }),
    template: `
      <label class="ui-label inline-flex items-start gap-2">
        <UICheckbox v-bind="args" class="mt-0.5 shrink-0" />
        <span class="min-w-0">완료된 업무도 조회 결과에 포함</span>
      </label>
    `,
  }),
} satisfies Meta<typeof UICheckbox>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const States: Story = {
  render: () => ({
    components: { UICheckbox },
    template: `
      <div class="grid gap-3 w-full max-w-xs">
        <label class="ui-label inline-flex items-start gap-2">
          <UICheckbox class="mt-0.5 shrink-0" />
          <span>승인 대기 중인 요청과 이전 담당자가 처리한 요청을 모두 조회 결과에 포함합니다.</span>
        </label>
        <label class="ui-label inline-flex items-center gap-2 ui-text-muted">
          <UICheckbox disabled :model-value="true" /> 필수 알림 (설정 변경 불가)
        </label>
        <div class="grid gap-2">
          <label class="ui-label inline-flex items-center gap-2">
            <UICheckbox invalid aria-describedby="checkbox-error" /> 검토 완료 확인
          </label>
          <p id="checkbox-error" class="ui-body text-destructive">검토를 마친 뒤 확인란을 선택해 주세요.</p>
        </div>
      </div>
    `,
  }),
}

export const PartialSelection: Story = {
  render: () => ({
    components: { UICheckbox },
    setup: () => {
      const summary = ref(true)
      const minutes = ref(false)
      function selectAll(checked: boolean) {
        summary.value = checked
        minutes.value = checked
      }
      return { summary, minutes, selectAll }
    },
    template: `
      <fieldset class="grid gap-3">
        <legend class="ui-label mb-2">내보낼 문서</legend>
        <label class="ui-label inline-flex items-center gap-2">
          <UICheckbox :model-value="summary && minutes" :indeterminate="summary !== minutes" @update:model-value="selectAll" />
          전체 선택
        </label>
        <label class="ui-label ms-6 inline-flex items-center gap-2">
          <UICheckbox v-model="summary" /> 업무 요약
        </label>
        <label class="ui-label ms-6 inline-flex items-center gap-2">
          <UICheckbox v-model="minutes" /> 회의 기록
        </label>
      </fieldset>
    `,
  }),
}

export const Form: Story = {
  render: () => ({
    components: { UICheckbox, UIButton },
    setup: () => {
      const checked = ref(false)
      const result = ref('')
      function submit(event: SubmitEvent) {
        const data = new FormData(event.currentTarget as HTMLFormElement)
        result.value = String(data.get('reviewed') ?? '')
      }
      function reset() {
        checked.value = false
        result.value = ''
      }
      return { checked, result, submit, reset }
    },
    template: `
      <form class="grid gap-4 w-full max-w-xs" @submit.prevent="submit" @reset.prevent="reset">
        <div class="grid gap-2">
          <label for="checkbox-review" class="ui-label inline-flex items-center gap-2">
            <UICheckbox id="checkbox-review" v-model="checked" name="reviewed" value="yes" required aria-describedby="checkbox-review-help" />
            검토 완료 확인 (필수)
          </label>
          <p id="checkbox-review-help" class="ui-body ui-text-muted">제출 전에 문서 내용을 확인해 주세요.</p>
        </div>
        <div class="flex justify-end gap-2">
          <UIButton type="reset" variant="outline">초기화</UIButton>
          <UIButton type="submit">제출</UIButton>
        </div>
        <p role="status" class="ui-body">{{ result ? '검토 완료로 제출했습니다.' : '' }}</p>
      </form>
    `,
  }),
}
